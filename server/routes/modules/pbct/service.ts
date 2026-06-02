/**
 * pbct 模块服务层
 */
import type { ListQuery, RecordItem, ImportData, AddData } from "./types"
import { getDb, saveDatabase } from "@db/manager"

/** 记录来源类型 */
type RecordSource = "import" | "manual"

interface ImportResult {
	successCount: number
	failCount: number
	skipCount: number
	duplicateIdCards: string[]
}

export const pbctService = {
	/**
	 * 获取列表数据（从记录表查询）
	 */
	async getList(query: ListQuery): Promise<{ list: RecordItem[]; total: number }> {
		const db = getDb()

		const page = query.page || 1
		const pageSize = query.pageSize || 10
		const offset = (page - 1) * pageSize

		const conditions: string[] = []
		const params: any[] = []

		if (query.name) {
			conditions.push("r.name LIKE ?")
			params.push(`%${query.name}%`)
		}
		if (query.idCard) {
			conditions.push("r.id_card LIKE ?")
			params.push(`%${query.idCard}%`)
		}
		if (query.phone) {
			conditions.push("r.phone LIKE ?")
			params.push(`%${query.phone}%`)
		}
		if (query.district) {
			conditions.push("r.district LIKE ?")
			params.push(`%${query.district}%`)
		}
		if (query.gender) {
			conditions.push("r.gender = ?")
			params.push(query.gender)
		}
		if (query.ethnicity) {
			conditions.push("r.ethnicity LIKE ?")
			params.push(`%${query.ethnicity}%`)
		}
		if (query.source) {
			conditions.push("r.source = ?")
			params.push(query.source)
		}

		const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

		let orderClause = "ORDER BY r.import_time DESC"
		if (query.sortOrder === "asc") {
			orderClause = "ORDER BY r.handle_time ASC"
		} else if (query.sortOrder === "desc") {
			orderClause = "ORDER BY r.handle_time DESC"
		}

		const countResult = db.exec(`SELECT COUNT(*) as total FROM pbct_records r ${whereClause}`, params)
		const total = countResult.length > 0 && countResult[0].values.length > 0 ? Number(countResult[0].values[0][0]) : 0

		const sql = `
			SELECT r.id, r.person_id, r.handle_time, r.name, r.id_card, r.phone, r.gender, r.ethnicity,
			       r.virtual_account, r.handle_reason, r.handle_result,
			       r.household_address, r.residence_address, r.district,
			       r.source, r.import_time, r.created_at
			FROM pbct_records r
			${whereClause}
			${orderClause}
			LIMIT ? OFFSET ?
		`
		const listParams = [...params, pageSize, offset]
		const result = db.exec(sql, listParams)

		const list: RecordItem[] = []
		if (result.length > 0) {
			const columns = result[0].columns
			for (const row of result[0].values) {
				const item: any = {}
				columns.forEach((col, idx) => {
					const camelCol = col.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
					item[camelCol] = row[idx]
				})
				list.push(item as RecordItem)
			}
		}

		return { list, total }
	},

	/**
	 * Upsert 人员信息（根据身份证号，存在则更新，不存在则插入）
	 */
	async upsertPerson(data: {
		name: string
		idCard: string
		phone: string
		gender: string
		ethnicity: string
		virtualAccount: string
		householdAddress: string
		residenceAddress: string
		district: string
	}): Promise<number> {
		const db = getDb()
		const { name, idCard, phone, gender, ethnicity, virtualAccount, householdAddress, residenceAddress, district } = data

		const existingResult = db.exec("SELECT id FROM pbct_persons WHERE id_card = ?", [idCard])

		if (existingResult.length > 0 && existingResult[0].values.length > 0) {
			const personId = Number(existingResult[0].values[0][0])
			db.run(
				`UPDATE pbct_persons SET
					name = ?, phone = ?, gender = ?, ethnicity = ?,
					virtual_account = ?, household_address = ?, residence_address = ?, district = ?,
					updated_at = datetime('now')
				WHERE id_card = ?`,
				[name, phone || "", gender || "男", ethnicity || "", virtualAccount || "", householdAddress || "", residenceAddress || "", district || "", idCard]
			)
			return personId
		} else {
			db.run(
				`INSERT INTO pbct_persons (id_card, name, phone, gender, ethnicity, virtual_account, household_address, residence_address, district)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[idCard, name, phone || "", gender || "男", ethnicity || "", virtualAccount || "", householdAddress || "", residenceAddress || "", district || ""]
			)
			const lastIdResult = db.exec("SELECT last_insert_rowid()")
			return Number(lastIdResult[0].values[0][0])
		}
	},

	/**
	 * 检查记录是否已存在（整行 12 个字段完全相同）
	 */
	async checkRecordExists(data: ImportData): Promise<boolean> {
		const db = getDb()
		const result = db.exec(
			`SELECT id FROM pbct_records
			WHERE handle_time = ? AND name = ? AND id_card = ?
			  AND phone = ? AND gender = ? AND ethnicity = ?
			  AND virtual_account = ? AND handle_reason = ? AND handle_result = ?
			  AND household_address = ? AND residence_address = ? AND district = ?`,
			[data.handleTime, data.name, data.idCard, data.phone, data.gender, data.ethnicity, data.virtualAccount, data.handleReason, data.handleResult, data.householdAddress, data.residenceAddress, data.district]
		)
		return result.length > 0 && result[0].values.length > 0
	},

	/**
	 * 插入记录
	 */
	async insertRecord(personId: number, data: ImportData, source: RecordSource): Promise<void> {
		const db = getDb()
		db.run(
			`INSERT INTO pbct_records (
				person_id, handle_time, name, id_card, phone, gender, ethnicity,
				virtual_account, handle_reason, handle_result,
				household_address, residence_address, district, source
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[personId, data.handleTime, data.name, data.idCard, data.phone, data.gender, data.ethnicity, data.virtualAccount, data.handleReason, data.handleResult, data.householdAddress, data.residenceAddress, data.district, source]
		)
	},

	/**
	 * 导入数据（批量）
	 */
	async importData(dataList: ImportData[], source: RecordSource = "import"): Promise<ImportResult> {
		let successCount = 0
		let failCount = 0
		let skipCount = 0
		const duplicateIdCards: string[] = []

		for (const item of dataList) {
			try {
				const idCard = item.idCard || ""
				if (!idCard) {
					failCount++
					continue
				}

				// 1. Upsert 人员信息
				const personId = await this.upsertPerson({
					name: item.name,
					idCard: idCard,
					phone: item.phone,
					gender: item.gender,
					ethnicity: item.ethnicity,
					virtualAccount: item.virtualAccount,
					householdAddress: item.householdAddress,
					residenceAddress: item.residenceAddress,
					district: item.district
				})

				// 2. 检查记录是否已存在（整行去重）
				const exists = await this.checkRecordExists(item)
				if (exists) {
					skipCount++
					continue
				}

				// 3. 插入记录
				await this.insertRecord(personId, item, source)
				successCount++
			} catch (error) {
				console.error("导入数据失败:", error)
				failCount++
			}
		}

		saveDatabase()
		return { successCount, failCount, skipCount, duplicateIdCards }
	},

	/**
	 * 新增数据（与导入逻辑相同）
	 */
	async add(data: AddData): Promise<{ successCount: number; failCount: number; skipCount: number }> {
		const result = await this.importData([data], "manual")
		return { successCount: result.successCount, failCount: result.failCount, skipCount: result.skipCount }
	},

	/**
	 * 删除记录
	 */
	async delete(id: number): Promise<void> {
		const db = getDb()
		db.run("DELETE FROM pbct_records WHERE id = ?", [id])
		saveDatabase()
	}
}
