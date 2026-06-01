/**
 * ryyj 模块数据库操作层
 */
import { getDb, saveDatabase } from "@db/manager"
import type { ListItem, ListQuery, DictItem, RyyjRow } from "./types"

// ========== 查询工具函数 ==========

function queryAll(sql: string, params: any[] = []): Record<string, any>[] {
	const db = getDb()
	const stmt = db.prepare(sql)
	stmt.bind(params)
	const rows: Record<string, any>[] = []
	while (stmt.step()) {
		rows.push(stmt.getAsObject())
	}
	stmt.free()
	return rows
}

function queryScalar(sql: string, params: any[] = []): any {
	const db = getDb()
	const stmt = db.prepare(sql)
	stmt.bind(params)
	let result: any = undefined
	if (stmt.step()) {
		const row = stmt.getAsObject()
		result = Object.values(row)[0]
	}
	stmt.free()
	return result
}

function runAndSave(sql: string, params: any[] = []) {
	const db = getDb()
	db.run(sql, params)
	saveDatabase()
}

// ========== 行数据转 ListItem ==========

function rowToListItem(row: RyyjRow): ListItem {
	return {
		id: row.id,
		avatar: row.avatar || undefined,
		name: row.name,
		gender: (row.gender || "男") as "男" | "女",
		age: row.age || 0,
		idCard: row.id_card || "",
		phone: row.phone || undefined,
		education: row.education || undefined,
		personScore: row.person_score,
		personCategory: row.person_category || undefined,
		personCategoryName: row.person_category || undefined,
		manageCategory: row.manage_category || undefined,
		manageCategoryName: row.manage_category || undefined,
		entryTime: row.entry_time || undefined,
		dataSource: row.data_source || undefined,
		dataSourceName: row.data_source || undefined,
		occupationType: row.occupation_type || undefined,
		residenceAddress: row.residence_address || undefined,
		relationInfo: row.relation_info || undefined,
		warningType: row.warning_type || undefined,
		warningTypeName: getWarningTypeName(row.warning_type),
		businessCategory: row.business_category || undefined,
		businessCategoryName: row.business_category || undefined,
		householdAddress: row.household_address || undefined,
		householdAddressName: row.household_address || undefined,
		manageDept: row.manage_dept || undefined,
		manageDeptName: row.manage_dept || undefined
	}
}

function getWarningTypeName(type?: string | null): string {
	const map: Record<string, string> = {
		"1": "红色预警",
		"2": "橙色预警",
		"3": "黄色预警",
		"4": "蓝色预警"
	}
	return map[type || ""] || ""
}

// ========== 字典下拉 ==========

export async function getBusinessCategoryOptions(): Promise<DictItem[]> {
	const rows = queryAll("SELECT value, label FROM dict_items WHERE type = 'business_category' AND status = 1 ORDER BY sort_order ASC")
	if (rows.length > 0) {
		return rows.map((r) => ({ label: r.label, value: r.value }))
	}
	return [
		{ label: "刑满释放", value: "1" },
		{ label: "社区矫正", value: "2" },
		{ label: "吸毒人员", value: "3" },
		{ label: "精神障碍", value: "4" },
		{ label: "重点青少年", value: "5" }
	]
}

export async function getPersonScoreOptions(): Promise<DictItem[]> {
	return [
		{ label: "高风险(≥80)", value: "high" },
		{ label: "中风险(60-79)", value: "medium" },
		{ label: "低风险(<60)", value: "low" }
	]
}

export async function getWarningTypeOptions(): Promise<DictItem[]> {
	const rows = queryAll("SELECT value, label FROM dict_items WHERE type = 'warning_type' AND status = 1 ORDER BY sort_order ASC")
	if (rows.length > 0) {
		return rows.map((r) => ({ label: r.label, value: r.value }))
	}
	return [
		{ label: "红色预警", value: "1" },
		{ label: "橙色预警", value: "2" },
		{ label: "黄色预警", value: "3" },
		{ label: "蓝色预警", value: "4" }
	]
}

export async function getDataSourceOptions(): Promise<DictItem[]> {
	const rows = queryAll("SELECT value, label FROM dict_items WHERE type = 'data_source' AND status = 1 ORDER BY sort_order ASC")
	if (rows.length > 0) {
		return rows.map((r) => ({ label: r.label, value: r.value }))
	}
	return [
		{ label: "社区采集", value: "community" },
		{ label: "医院录入", value: "hospital" },
		{ label: "公安推送", value: "police" },
		{ label: "网格员上报", value: "grid" },
		{ label: "自主申报", value: "self" }
	]
}

export async function getManageCategoryOptions(): Promise<DictItem[]> {
	const rows = queryAll("SELECT value, label FROM dict_items WHERE type = 'manage_category' AND status = 1 ORDER BY sort_order ASC")
	if (rows.length > 0) {
		return rows.map((r) => ({ label: r.label, value: r.value }))
	}
	return [
		{ label: "重点关注", value: "important" },
		{ label: "一般管控", value: "normal" },
		{ label: "关注对象", value: "concern" },
		{ label: "帮扶对象", value: "assist" }
	]
}

export async function getHouseholdAddressOptions(): Promise<DictItem[]> {
	const rows = queryAll("SELECT value, label FROM dict_items WHERE type = 'hubei_city' AND status = 1 ORDER BY sort_order ASC")
	if (rows.length > 0) {
		return rows.map((r) => ({ label: r.label, value: r.value }))
	}
	return [
		{ label: "武汉市", value: "420100" },
		{ label: "黄石市", value: "420200" },
		{ label: "十堰市", value: "420300" },
		{ label: "宜昌市", value: "420500" },
		{ label: "襄阳市", value: "420600" },
		{ label: "鄂州市", value: "420700" },
		{ label: "荆州市", value: "421000" },
		{ label: "黄冈市", value: "421100" },
		{ label: "咸宁市", value: "421200" },
		{ label: "随州市", value: "421300" },
		{ label: "恩施州", value: "422800" },
		{ label: "仙桃市", value: "429004" },
		{ label: "潜江市", value: "429005" },
		{ label: "天门市", value: "429006" },
		{ label: "神农架", value: "429021" }
	]
}

export async function getManageDeptOptions(): Promise<DictItem[]> {
	const rows = queryAll("SELECT value, label FROM dict_items WHERE type = 'manage_dept' AND status = 1 ORDER BY sort_order ASC")
	if (rows.length > 0) {
		return rows.map((r) => ({ label: r.label, value: r.value }))
	}
	return [
		{ label: "街道办事处", value: "dept_1" },
		{ label: "社区居委会", value: "dept_2" },
		{ label: "派出所", value: "dept_3" },
		{ label: "卫生服务中心", value: "dept_4" }
	]
}

// ========== 列表查询 ==========

export async function getPersons(query: ListQuery): Promise<{ list: ListItem[]; total: number }> {
	const page = query.page || 1
	const pageSize = query.pageSize || 10
	const offset = (page - 1) * pageSize

	let where = "WHERE 1=1"
	const params: any[] = []

	if (query.businessCategory) {
		where += " AND business_category = ?"
		params.push(query.businessCategory)
	}
	if (query.personScore) {
		const scoreRanges: Record<string, string> = {
			high: "person_score >= 80",
			medium: "person_score >= 60 AND person_score < 80",
			low: "person_score < 60"
		}
		if (scoreRanges[query.personScore]) {
			where += ` AND ${scoreRanges[query.personScore]}`
		}
	}
	if (query.warningType) {
		where += " AND warning_type = ?"
		params.push(query.warningType)
	}
	if (query.dataSource) {
		where += " AND data_source = ?"
		params.push(query.dataSource)
	}
	if (query.manageCategory) {
		where += " AND manage_category = ?"
		params.push(query.manageCategory)
	}
	if (query.householdAddress) {
		where += " AND household_address = ?"
		params.push(query.householdAddress)
	}
	if (query.manageDept) {
		where += " AND manage_dept = ?"
		params.push(query.manageDept)
	}
	if (query.entryTimeStart) {
		where += " AND entry_time >= ?"
		params.push(query.entryTimeStart)
	}
	if (query.entryTimeEnd) {
		where += " AND entry_time <= ?"
		params.push(query.entryTimeEnd)
	}

	// 排序
	const sortField = query.sortField || "id"
	const sortOrder = query.sortOrder || "desc"
	const sortFieldMap: Record<string, string> = {
		personScore: "person_score",
		entryTime: "entry_time",
		id: "id"
	}
	const orderBy = `ORDER BY ${sortFieldMap[sortField] || "id"} ${sortOrder.toUpperCase()}`

	const total = queryScalar(`SELECT COUNT(*) FROM ryyj_persons ${where}`, params) as number
	const rows = queryAll(
		`SELECT * FROM ryyj_persons ${where} ${orderBy} LIMIT ? OFFSET ?`,
		[...params, pageSize, offset]
	)

	// 填充名称字段
	const list = rows.map((row) => rowToListItem(row as RyyjRow))

	return { list, total }
}

// ========== 新增 ==========

export async function createPerson(data: {
	name: string
	gender: "男" | "女"
	age: number
	idCard: string
	phone?: string
	personScore?: number
	warningType?: string
	businessCategory?: string
	dataSource?: string
	manageCategory?: string
	education?: string
	occupationType?: string
	residenceAddress?: string
}): Promise<number> {
	const db = getDb()
	db.run(
		`INSERT INTO ryyj_persons 
		(name, gender, age, id_card, phone, person_score, warning_type, business_category, data_source, manage_category, education, occupation_type, residence_address, entry_time)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
		[
			data.name,
			data.gender,
			data.age,
			data.idCard,
			data.phone || null,
			data.personScore || null,
			data.warningType || null,
			data.businessCategory || null,
			data.dataSource || null,
			data.manageCategory || null,
			data.education || null,
			data.occupationType || null,
			data.residenceAddress || null
		]
	)
	saveDatabase()
	return db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] as number
}

// ========== 更新 ==========

export async function updatePerson(
	id: number,
	data: Partial<{
		name: string
		gender: string
		age: number
		idCard: string
		phone: string
		personScore: number
		warningType: string
		businessCategory: string
		dataSource: string
		manageCategory: string
		education: string
		occupationType: string
		residenceAddress: string
	}>
): Promise<void> {
	const fields: string[] = []
	const values: any[] = []

	if (data.name !== undefined) {
		fields.push("name = ?")
		values.push(data.name)
	}
	if (data.gender !== undefined) {
		fields.push("gender = ?")
		values.push(data.gender)
	}
	if (data.age !== undefined) {
		fields.push("age = ?")
		values.push(data.age)
	}
	if (data.idCard !== undefined) {
		fields.push("id_card = ?")
		values.push(data.idCard)
	}
	if (data.phone !== undefined) {
		fields.push("phone = ?")
		values.push(data.phone)
	}
	if (data.personScore !== undefined) {
		fields.push("person_score = ?")
		values.push(data.personScore)
	}
	if (data.warningType !== undefined) {
		fields.push("warning_type = ?")
		values.push(data.warningType)
	}
	if (data.businessCategory !== undefined) {
		fields.push("business_category = ?")
		values.push(data.businessCategory)
	}
	if (data.dataSource !== undefined) {
		fields.push("data_source = ?")
		values.push(data.dataSource)
	}
	if (data.manageCategory !== undefined) {
		fields.push("manage_category = ?")
		values.push(data.manageCategory)
	}
	if (data.education !== undefined) {
		fields.push("education = ?")
		values.push(data.education)
	}
	if (data.occupationType !== undefined) {
		fields.push("occupation_type = ?")
		values.push(data.occupationType)
	}
	if (data.residenceAddress !== undefined) {
		fields.push("residence_address = ?")
		values.push(data.residenceAddress)
	}

	if (fields.length === 0) return

	fields.push("updated_at = datetime('now')")
	values.push(id)

	const db = getDb()
	db.run(`UPDATE ryyj_persons SET ${fields.join(", ")} WHERE id = ?`, values)
	saveDatabase()
}

// ========== 删除 ==========

export async function deletePerson(id: number): Promise<void> {
	runAndSave("DELETE FROM ryyj_persons WHERE id = ?", [id])
}

// ========== 导出辅助 ==========

export async function getPersonsByIds(ids: number[]): Promise<ListItem[]> {
	if (ids.length === 0) return []

	const placeholders = ids.map(() => "?").join(",")
	const rows = queryAll(`SELECT * FROM ryyj_persons WHERE id IN (${placeholders})`, ids)

	return rows.map((row) => rowToListItem(row as RyyjRow))
}
