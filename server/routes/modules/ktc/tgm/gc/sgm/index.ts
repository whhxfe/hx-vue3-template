/**
 * tgm/gc/sgm 子群体管理模块路由
 *
 * 层级路由: /wzsys/ktc/tgm/gc/sgm/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success, fail, pagedList } from "@utils/response"
import { queryAll, queryScalar, runAndSave } from "@utils/db-helper"

interface SgmListQuery {
	page?: number
	pageSize?: number
	parentGroupId?: number
	keyword?: string
	categoryType?: string
	entryTimeStart?: string
	entryTimeEnd?: string
	sortField?: string
	sortOrder?: string
}

export const sgmRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	app.post<{ Body: SgmListQuery }>("/list", async (request) => {
		const { page = 1, pageSize = 10, parentGroupId, keyword, categoryType, entryTimeStart, entryTimeEnd, sortField, sortOrder } = request.body || {}
		const offset = (page - 1) * pageSize

		let where = "WHERE 1=1"
		const params: any[] = []

		if (parentGroupId) { where += " AND parent_group_id = ?"; params.push(Number(parentGroupId)) }
		if (keyword) { where += " AND name LIKE ?"; params.push(`%${keyword}%`) }
		if (categoryType) { where += " AND category_type = ?"; params.push(categoryType) }
		if (entryTimeStart) { where += " AND entry_time >= ?"; params.push(entryTimeStart) }
		if (entryTimeEnd) { where += " AND entry_time <= ?"; params.push(entryTimeEnd + " 23:59:59") }

		const total = queryScalar(`SELECT COUNT(*) FROM ktc_sgm_groups ${where}`, params) as number

		let orderBy = "ORDER BY id DESC"
		if (sortField) {
			const sortMap: Record<string, string> = { entryTime: "entry_time", memberCount: "member_count", activeCount: "active_count" }
			const dbField = sortMap[sortField] || "id"
			const dir = sortOrder === "asc" ? "ASC" : "DESC"
			orderBy = `ORDER BY ${dbField} ${dir}`
		}

		const rows = queryAll(`SELECT * FROM ktc_sgm_groups ${where} ${orderBy} LIMIT ? OFFSET ?`, [...params, pageSize, offset])

		const categoryMap: Record<string, string> = { "上访群体": "上访群体", "涉稳群体": "涉稳群体", "维权群体": "维权群体", "利益诉求": "利益诉求", "重点关注": "重点关注" }

		const list = rows.map((row) => ({
			id: row.id,
			parentGroupId: row.parent_group_id,
			name: row.name,
			categoryType: row.category_type || "",
			categoryTypeName: categoryMap[row.category_type] || row.category_type || "",
			memberCount: row.member_count || 0,
			territory: row.territory || "",
			policeName: row.police_name || "",
			unitName: row.unit_name || "",
			reason: row.reason || "",
			activeCount: row.active_count || 0,
			recommendCount: row.recommend_count || 0,
			groupCount: row.group_count || 0,
			warningTypes: row.warning_types ? JSON.parse(row.warning_types) : [],
			warningTypeNames: row.warning_types ? JSON.parse(row.warning_types) : [],
			tags: row.tags ? JSON.parse(row.tags) : [],
			tagsName: row.tags ? JSON.parse(row.tags) : [],
			entryTime: row.entry_time,
			status: (row as any).status || 0
		}))

		return pagedList(list, total, page, pageSize)
	})

	app.post("/create", async (request) => {
		const body = request.body as any
		const db = (await import("@db/manager")).getDb()
		const saveDb = (await import("@db/manager")).saveDatabase

		db.run(
			`INSERT INTO ktc_sgm_groups (parent_group_id, name, category_type, territory, police_name, unit_name, reason, tags)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			[body.parentGroupId, body.name, body.categoryType, body.territory, body.policeName, body.unitName, body.reason, JSON.stringify(body.tags || [])]
		)
		saveDb()
		const id = db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] as number
		return success({ id }, "录入成功")
	})

	app.put<{ Params: { id: string } }>("/update/:id", async (request) => {
		const { id } = request.params
		const body = request.body as any
		runAndSave(
			`UPDATE ktc_sgm_groups SET name=?, category_type=?, territory=?, police_name=?, unit_name=?, reason=?, tags=?, updated_at=datetime('now') WHERE id=?`,
			[body.name, body.categoryType, body.territory, body.policeName, body.unitName, body.reason, JSON.stringify(body.tags || []), Number(id)]
		)
		return success({ id: Number(id) }, "更新成功")
	})

	app.delete<{ Params: { id: string } }>("/:id", async (request) => {
		const { id } = request.params
		runAndSave("DELETE FROM ktc_sgm_groups WHERE id = ?", [Number(id)])
		return success({ id: Number(id) }, "删除成功")
	})

	// 办结
	app.put<{ Params: { id: string } }>("/close/:id", async (request) => {
		const { id } = request.params
		runAndSave("UPDATE ktc_sgm_groups SET status = 1, updated_at = datetime('now') WHERE id = ?", [Number(id)])
		return success({ id: Number(id) }, "办结成功")
	})

	// 下载导入模板
	app.get("/template", async (_req, reply) => {
		try {
			const XLSX = await import("xlsx")
			const headers = ["群体名称", "群体类型", "群体属地", "关注民警", "关注单位", "关注原因"]
			const sampleData = [
				["常某维权子群体", "维权群体", "林芝市巴宜区", "张林芝", "林芝市公安局网安支队", "该子群体成员间联系紧密"]
			]
			const worksheet = XLSX.utils.aoa_to_sheet([headers, ...sampleData])
			const workbook = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(workbook, worksheet, "子群体")
			worksheet["!cols"] = [{ wch: 20 }, { wch: 12 }, { wch: 15 }, { wch: 10 }, { wch: 20 }, { wch: 30 }]
			const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
			reply.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
			reply.header("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent("子群体导入模板.xlsx")}`)
			return reply.send(buffer)
		} catch {
			return reply.send(fail("下载导入模板失败"))
		}
	})

	// 导入数据
	app.post("/import", async (request, reply) => {
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
				"群体名称": "name", "群体类型": "categoryType", "群体属地": "territory",
				"关注民警": "policeName", "关注单位": "unitName", "关注原因": "reason"
			}

			const db = (await import("@db/manager")).getDb()
			const saveDb = (await import("@db/manager")).saveDatabase
			const parentGroupId = Number((request.body as any)?.parentGroupId) || 0

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
					`INSERT INTO ktc_sgm_groups (parent_group_id, name, category_type, territory, police_name, unit_name, reason)
					VALUES (?, ?, ?, ?, ?, ?, ?)`,
					[parentGroupId, rowData.name, rowData.categoryType || "", rowData.territory || "", rowData.policeName || "", rowData.unitName || "", rowData.reason || ""]
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
			const parentGroupId = body.parentGroupId || 0

			const rows = queryAll(`SELECT * FROM ktc_sgm_groups WHERE parent_group_id = ? ORDER BY id DESC`, [parentGroupId])
			if (rows.length === 0) return fail("没有可导出的数据")

			const XLSX = await import("xlsx")
			const headers = ["群体名称", "群体类型", "群体属地", "关注民警", "关注单位", "关注原因", "群体人员", "录入时间"]
			const rowsData = rows.map((r) => [r.name, r.category_type, r.territory, r.police_name, r.unit_name, r.reason, r.member_count, r.entry_time])
			const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rowsData])
			const workbook = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(workbook, worksheet, "子群体")
			worksheet["!cols"] = [{ wch: 20 }, { wch: 12 }, { wch: 15 }, { wch: 10 }, { wch: 20 }, { wch: 30 }, { wch: 10 }, { wch: 20 }]
			const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })
			reply.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
			reply.header("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent("子群体导出.xlsx")}`)
			return reply.send(buffer)
		} catch (error) {
			return fail("导出失败：" + String(error))
		}
	})
}
