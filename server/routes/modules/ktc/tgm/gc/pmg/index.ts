/**
 * tgm/gc/pmg 人员管理模块路由
 *
 * 层级路由: /wzsys/ktc/tgm/gc/pmg/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success, fail, pagedList } from "@utils/response"
import { queryAll, queryScalar, runAndSave } from "@utils/db-helper"

interface PmgListQuery {
	page?: number
	pageSize?: number
	groupId?: number
	keyword?: string
	address?: string
	followStatus?: string
	sortField?: string
	sortOrder?: string
}

export const pmgRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// 获取列表数据
	app.post<{ Body: PmgListQuery }>("/list", async (request) => {
		const { page = 1, pageSize = 10, groupId, keyword, address, followStatus, sortField, sortOrder } = request.body || {}
		const offset = (page - 1) * pageSize

		let where = "WHERE 1=1"
		const params: any[] = []

		if (groupId) {
			where += " AND group_id = ?"
			params.push(Number(groupId))
		}
		if (keyword) {
			where += " AND (name LIKE ? OR id_card LIKE ?)"
			const pattern = `%${keyword}%`
			params.push(pattern, pattern)
		}
		if (address) {
			const addresses = address.split(",")
			const placeholders = addresses.map(() => "?").join(",")
			where += ` AND address IN (${placeholders})`
			params.push(...addresses)
		}
		if (followStatus) {
			where += " AND follow_status = ?"
			params.push(followStatus)
		}

		const total = queryScalar(`SELECT COUNT(*) FROM ktc_pmg_persons ${where}`, params) as number

		let orderBy = "ORDER BY id DESC"
		if (sortField === "entryTime") {
			const dir = sortOrder === "asc" ? "ASC" : "DESC"
			orderBy = `ORDER BY entry_time ${dir}`
		}

		const rows = queryAll(
			`SELECT * FROM ktc_pmg_persons ${where} ${orderBy} LIMIT ? OFFSET ?`,
			[...params, pageSize, offset]
		)

		const addressNameMap: Record<string, string> = {
			"林芝市墨脱县": "墨脱县", "林芝市巴宜区": "巴宜区", "林芝市米林县": "米林市",
			"林芝市工布江达县": "工布江达县", "林芝市朗县": "朗县", "林芝市察隅县": "察隅县", "林芝市波密县": "波密县"
		}

		const list = rows.map((row) => ({
			id: row.id,
			groupId: row.group_id,
			name: row.name,
			gender: row.gender,
			age: row.age || 0,
			idCard: row.id_card || "",
			phone: row.phone || "",
			nation: row.nation || "汉",
			address: row.address || "",
			addressName: addressNameMap[row.address] || row.address || "",
			warningTypes: row.warning_types ? JSON.parse(row.warning_types) : [],
			warningTypeNames: row.warning_types ? JSON.parse(row.warning_types) : [],
			followStatus: row.follow_status,
			followStatusName: row.follow_status === "1" ? "已关注" : "未关注",
			avatar: row.avatar || undefined,
			entryTime: row.entry_time
		}))

		return pagedList(list, total, page, pageSize)
	})

	// 户籍地址统计
	app.get("/address-counts", async (request) => {
		const groupId = Number((request.query as any).groupId)
		if (!groupId) return success([])

		const where = "WHERE group_id = ?"
		const total = queryScalar(`SELECT COUNT(*) FROM ktc_pmg_persons ${where}`, [groupId]) as number

		const rows = queryAll(
			`SELECT address, COUNT(*) as cnt FROM ktc_pmg_persons ${where} GROUP BY address ORDER BY cnt DESC`,
			[groupId]
		)

		const addressNameMap: Record<string, string> = {
			"林芝市墨脱县": "墨脱县", "林芝市巴宜区": "巴宜区", "林芝市米林县": "米林市",
			"林芝市工布江达县": "工布江达县", "林芝市朗县": "朗县", "林芝市察隅县": "察隅县", "林芝市波密县": "波密县"
		}

		const result = [{ label: "全部", value: "", count: total }]
		for (const row of rows) {
			result.push({
				label: addressNameMap[row.address] || row.address,
				value: row.address,
				count: row.cnt as number
			})
		}

		return success(result)
	})

	// 新增
	app.post("/create", async (request) => {
		const body = request.body as any
		const db = (await import("@db/manager")).getDb()
		const saveDb = (await import("@db/manager")).saveDatabase

		db.run(
			`INSERT INTO ktc_pmg_persons (group_id, name, gender, age, phone, id_card, nation, address, warning_types)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[body.groupId, body.name, body.gender, body.age, body.phone, body.idCard, body.nation, body.address, JSON.stringify(body.warningTypes || [])]
		)
		saveDb()
		const id = db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] as number
		return success({ id }, "录入成功")
	})

	// 更新
	app.put<{ Params: { id: string } }>("/update/:id", async (request) => {
		const { id } = request.params
		const body = request.body as any
		runAndSave(
			`UPDATE ktc_pmg_persons SET name=?, gender=?, age=?, phone=?, id_card=?, nation=?, address=?, warning_types=?, updated_at=datetime('now') WHERE id=?`,
			[body.name, body.gender, body.age, body.phone, body.idCard, body.nation, body.address, JSON.stringify(body.warningTypes || []), Number(id)]
		)
		return success({ id: Number(id) }, "更新成功")
	})

	// 删除
	app.delete<{ Params: { id: string } }>("/:id", async (request) => {
		const { id } = request.params
		runAndSave("DELETE FROM ktc_pmg_persons WHERE id = ?", [Number(id)])
		return success({ id: Number(id) }, "删除成功")
	})

	// 下载导入模板
	app.get("/template", async (_req, reply) => {
		try {
			const XLSX = await import("xlsx")
			const headers = ["姓名", "性别", "年龄", "手机号", "身份证号", "民族", "户籍地址"]
			const sampleData = [
				["张三", "男", 28, "13800138000", "420100199001011234", "汉", "林芝市巴宜区"],
				["李四", "女", 32, "13900139000", "420200199002021234", "藏", "林芝市墨脱县"]
			]
			const data = [headers, ...sampleData]
			const worksheet = XLSX.utils.aoa_to_sheet(data)
			const workbook = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(workbook, worksheet, "群体人员")
			worksheet["!cols"] = [{ wch: 10 }, { wch: 6 }, { wch: 6 }, { wch: 15 }, { wch: 20 }, { wch: 8 }, { wch: 15 }]
			const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
			reply.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
			reply.header("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent("群体人员导入模板.xlsx")}`)
			return reply.send(buffer)
		} catch (error) {
			return reply.send(fail("下载导入模板失败"))
		}
	})

	// 导入数据
	app.post<{ Reply: any }>("/import", async (request, reply) => {
		try {
			const data = await (request as any).file()
			if (!data) return fail("请上传文件")

			const buffer = await data.toBuffer()
			const XLSX = await import("xlsx")
			const workbook = XLSX.read(buffer, { type: "buffer" })
			const sheetName = workbook.SheetNames[0]
			const worksheet = workbook.Sheets[sheetName]
			const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

			if (jsonData.length < 2) return fail("导入文件数据为空")

			const headers = jsonData[0].map((h: any) => String(h).trim())
			const headerMap: Record<string, string> = {
				"姓名": "name", "性别": "gender", "年龄": "age", "手机号": "phone",
				"身份证号": "idCard", "民族": "nation", "户籍地址": "address"
			}

			const db = (await import("@db/manager")).getDb()
			const saveDb = (await import("@db/manager")).saveDatabase

			const groupId = Number((request.body as any)?.groupId) || 0
			let successCount = 0

			for (let i = 1; i < jsonData.length; i++) {
				const row = jsonData[i]
				const rowData: Record<string, any> = {}
				headers.forEach((header: string, index: number) => {
					const field = headerMap[header]
					if (field) rowData[field] = row[index] !== undefined ? String(row[index]).trim() : ""
				})

				if (!rowData.name) continue

				db.run(
					`INSERT INTO ktc_pmg_persons (group_id, name, gender, age, phone, id_card, nation, address)
					VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
					[groupId, rowData.name, rowData.gender || "男", Number(rowData.age) || 0, rowData.phone, rowData.idCard, rowData.nation || "汉", rowData.address]
				)
				successCount++
			}
			saveDb()
			return success({ total: jsonData.length - 1, successCount }, `导入完成，成功 ${successCount} 条`)
		} catch (error) {
			return fail("导入失败：" + String(error))
		}
	})

	// 导出数据
	app.post("/export", async (request, reply) => {
		try {
			const body = request.body as any
			const groupId = body.groupId || 0

			const rows = queryAll(
				`SELECT * FROM ktc_pmg_persons WHERE group_id = ? ORDER BY id DESC`,
				[groupId]
			)

			if (rows.length === 0) return fail("没有可导出的数据")

			const XLSX = await import("xlsx")
			const headers = ["姓名", "性别", "年龄", "手机号", "身份证号", "民族", "户籍地址", "录入时间"]
			const rowsData = rows.map((r) => [r.name, r.gender, r.age, r.phone, r.id_card, r.nation, r.address, r.entry_time])
			const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rowsData])
			const workbook = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(workbook, worksheet, "群体人员")
			worksheet["!cols"] = [{ wch: 10 }, { wch: 6 }, { wch: 6 }, { wch: 15 }, { wch: 20 }, { wch: 8 }, { wch: 15 }, { wch: 20 }]
			const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
			reply.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
			reply.header("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent("群体人员导出.xlsx")}`)
			return reply.send(buffer)
		} catch (error) {
			return fail("导出失败：" + String(error))
		}
	})
}
