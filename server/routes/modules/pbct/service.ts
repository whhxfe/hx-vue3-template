/**
 * pbct 模块服务层
 */
import type { FastifyInstance } from "fastify"
import type { ListQuery, ListItem, ImportData, AddData } from "./types"
import { getDb, saveDatabase } from "@db/manager"

export const pbctService = {
	/**
	 * 获取字典项
	 */
	async getDictItems(type: string): Promise<Array<{ value: string; label: string }>> {
		const db = getDb()
		const stmt = db.prepare("SELECT value, label FROM dict_items WHERE type = ? AND status = 1 ORDER BY sort_order ASC")
		stmt.bind([type])
		const items: Array<{ value: string; label: string }> = []
		while (stmt.step()) {
			const row = stmt.getAsObject()
			items.push({
				value: row.value as string,
				label: row.label as string
			})
		}
		stmt.free()
		return items
	},

	/**
	 * 获取列表数据
	 */
	async getList(query: ListQuery): Promise<{ list: ListItem[]; total: number }> {
		const db = getDb()

		const page = query.page || 1
		const pageSize = query.pageSize || 10
		const offset = (page - 1) * pageSize

		// 构建 WHERE 条件
		const conditions: string[] = []
		const params: any[] = []

		if (query.name) {
			conditions.push("name LIKE ?")
			params.push(`%${query.name}%`)
		}
		if (query.idCard) {
			conditions.push("id_card LIKE ?")
			params.push(`%${query.idCard}%`)
		}
		if (query.phone) {
			conditions.push("phone LIKE ?")
			params.push(`%${query.phone}%`)
		}
		if (query.district) {
			conditions.push("district LIKE ?")
			params.push(`%${query.district}%`)
		}
		if (query.gender) {
			conditions.push("gender = ?")
			params.push(query.gender)
		}
		if (query.ethnicity) {
			conditions.push("ethnicity LIKE ?")
			params.push(`%${query.ethnicity}%`)
		}

		const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

		// 构建排序
		let orderClause = "ORDER BY id DESC"
		if (query.sortOrder === "asc") {
			orderClause = "ORDER BY handle_time ASC"
		} else if (query.sortOrder === "desc") {
			orderClause = "ORDER BY handle_time DESC"
		}

		// 查询总数
		const countResult = db.exec(`SELECT COUNT(*) as total FROM pbct_persons ${whereClause}`, params)
		const total = countResult.length > 0 && countResult[0].values.length > 0 ? Number(countResult[0].values[0][0]) : 0

		// 查询列表
		const sql = `
			SELECT id, handle_time, name, id_card, phone, gender, ethnicity,
			       virtual_account, handle_reason, handle_result,
			       household_address, residence_address, district,
			       entry_time, updated_at
			FROM pbct_persons
			${whereClause}
			${orderClause}
			LIMIT ? OFFSET ?
		`
		const listParams = [...params, pageSize, offset]
		const result = db.exec(sql, listParams)

		const list: ListItem[] = []
		if (result.length > 0) {
			const columns = result[0].columns
			for (const row of result[0].values) {
				const item: any = {}
				columns.forEach((col, idx) => {
					// 转换蛇形命名到驼峰命名
					const camelCol = col.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
					item[camelCol] = row[idx]
				})
				list.push(item as ListItem)
			}
		}

		return { list, total }
	},

	/**
	 * 导入数据
	 */
	async importData(
		dataList: ImportData[]
	): Promise<{ successCount: number; failCount: number; duplicateIdCards: string[] }> {
		const db = getDb()

		let successCount = 0
		let failCount = 0
		const duplicateIdCards: string[] = []

		// 提取所有需要检查的身份证号
		const idCards = dataList.filter((item) => item.idCard).map((item) => item.idCard)

		if (idCards.length > 0) {
			// 查询数据库中已存在的身份证号
			const placeholders = idCards.map(() => "?").join(",")
			const existingResult = db.exec(
				`SELECT id_card FROM pbct_persons WHERE id_card IN (${placeholders})`,
				idCards
			)

			if (existingResult.length > 0 && existingResult[0].values.length > 0) {
				existingResult[0].values.forEach((row) => {
					duplicateIdCards.push(row[0] as string)
				})
			}
		}

		// 过滤掉已存在的记录
		const newDataList = dataList.filter((item) => !item.idCard || !duplicateIdCards.includes(item.idCard))

		for (const item of newDataList) {
			try {
				db.run(
					`INSERT INTO pbct_persons (
						handle_time, name, id_card, phone, gender, ethnicity,
						virtual_account, handle_reason, handle_result,
						household_address, residence_address, district
					) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
					[
						item.handleTime,
						item.name,
						item.idCard || "",
						item.phone || "",
						item.gender || "男",
						item.ethnicity || "",
						item.virtualAccount || "",
						item.handleReason || "",
						item.handleResult || "",
						item.householdAddress || "",
						item.residenceAddress || "",
						item.district || ""
					]
				)
				successCount++
			} catch (error) {
				console.error("导入数据失败:", error)
				failCount++
			}
		}

		// 持久化数据到文件
		saveDatabase()

		return { successCount, failCount, duplicateIdCards }
	},

	/**
	 * 新增数据
	 */
	async add(data: AddData): Promise<void> {
		const db = getDb()
		db.run(
			`INSERT INTO pbct_persons (
				handle_time, name, id_card, phone, gender, ethnicity,
				virtual_account, handle_reason, handle_result,
				household_address, residence_address, district
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				data.handleTime,
				data.name,
				data.idCard || "",
				data.phone || "",
				data.gender || "男",
				data.ethnicity || "",
				data.virtualAccount || "",
				data.handleReason || "",
				data.handleResult || "",
				data.householdAddress || "",
				data.residenceAddress || "",
				data.district || ""
			]
		)
		saveDatabase()
	},

	/**
	 * 删除数据
	 */
	async delete(id: number): Promise<void> {
		const db = getDb()
		db.run("DELETE FROM pbct_persons WHERE id = ?", [id])
		saveDatabase()
	}
}
