/**
 * rygk 模块数据库操作层
 */
import { getDb, saveDatabase } from "@db/db"
import type { ListItem, ListQuery, TreeNode, DictItem, PersonRow } from "./types"

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

function rowToListItem(row: PersonRow): ListItem {
	return {
		id: row.id,
		avatar: row.avatar || undefined,
		name: row.name,
		gender: row.gender as "男" | "女",
		age: row.age || 0,
		phone: row.phone || "",
		idCard: row.id_card || "",
		residenceAddress: row.residence_address || "",
		tags: row.tags ? JSON.parse(row.tags) : [],
		category: row.category || "",
		dataSource: row.data_source || "",
		followStatus: row.follow_status as "0" | "1",
		entryTime: row.entry_time,
		longitude: row.longitude,
		latitude: row.latitude
	}
}

// ========== 树结构 ==========

export async function getTreeData(type: "yhgl" | "gxjg"): Promise<TreeNode[]> {
	const rows = queryAll(
		"SELECT * FROM rygk_trees WHERE type = ? AND status = 1 ORDER BY sort_order ASC",
		[type]
	)

	// 构建树形结构
	const rootNodes = rows.filter((r) => r.parent_id === 0 || r.parent_id === null)
	const childNodes = rows.filter((r) => r.parent_id !== 0 && r.parent_id !== null)

	// 计算每个节点的 count
	const countMap: Record<number, number> = {}
	const allPersons = queryAll("SELECT tree_id, tree_type FROM rygk_persons")
	for (const p of allPersons) {
		if (p.tree_id && p.tree_type === type) {
			countMap[p.tree_id] = (countMap[p.tree_id] || 0) + 1
		}
	}

	function buildNode(dbNode: any): TreeNode {
		const children = childNodes
			.filter((c) => c.parent_id === dbNode.id)
			.map(buildNode)

		return {
			id: dbNode.id,
			label: dbNode.name,
			icon: dbNode.icon || undefined,
			count: countMap[dbNode.id] || 0,
			children: children.length > 0 ? children : undefined
		}
	}

	return rootNodes.map(buildNode)
}

// ========== 字典下拉 ==========

export async function getSourceOptions(): Promise<DictItem[]> {
	// 从 dict_items 中获取数据来源选项
	const rows = queryAll("SELECT value, label FROM dict_items WHERE type = 'data_source' AND status = 1 ORDER BY sort_order ASC")
	if (rows.length > 0) {
		return rows.map((r) => ({ label: r.label, value: r.value }))
	}
	// 默认值
	return [
		{ label: "社区采集", value: "community" },
		{ label: "医院录入", value: "hospital" },
		{ label: "公安推送", value: "police" },
		{ label: "网格员上报", value: "grid" },
		{ label: "自主申报", value: "self" }
	]
}

export async function getCategoryOptions(): Promise<DictItem[]> {
	const rows = queryAll(
		"SELECT code as value, name as label FROM rygk_categories WHERE status = 1 ORDER BY sort_order ASC"
	)
	if (rows.length > 0) {
		return rows
	}
	// 默认值
	return [
		{ label: "重点关注", value: "important" },
		{ label: "一般人员", value: "normal" },
		{ label: "困难群体", value: "difficult" },
		{ label: "特殊人群", value: "special" }
	]
}

export async function getAddressOptions(): Promise<DictItem[]> {
	// 从 dict_items 中获取地址选项
	const rows = queryAll("SELECT value, label FROM dict_items WHERE type = 'hubei_city' AND status = 1 ORDER BY sort_order ASC")
	if (rows.length > 0) {
		return rows.map((r) => ({ label: r.label, value: r.value }))
	}
	// 默认值
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
		{ label: "恩施土家族苗族自治州", value: "422800" },
		{ label: "仙桃市", value: "429004" },
		{ label: "潜江市", value: "429005" },
		{ label: "天门市", value: "429006" },
		{ label: "神农架林区", value: "429021" }
	]
}

// ========== 人员 CRUD ==========

export async function getPersons(query: ListQuery): Promise<{ list: ListItem[]; total: number }> {
	const page = query.page || 1
	const pageSize = query.pageSize || 10
	const offset = (page - 1) * pageSize

	let where = "WHERE 1=1"
	const params: any[] = []

	if (query.dataSource) {
		where += " AND data_source = ?"
		params.push(query.dataSource)
	}
	if (query.category) {
		where += " AND category = ?"
		params.push(query.category)
	}
	if (query.residenceAddress) {
		where += " AND residence_address = ?"
		params.push(query.residenceAddress)
	}
	if (query.followStatus) {
		where += " AND follow_status = ?"
		params.push(query.followStatus)
	}
	if (query.entryTimeStart) {
		where += " AND entry_time >= ?"
		params.push(query.entryTimeStart)
	}
	if (query.entryTimeEnd) {
		where += " AND entry_time <= ?"
		params.push(query.entryTimeEnd)
	}
	if (query.treeId) {
		where += " AND tree_id = ?"
		params.push(Number(query.treeId))
	}
	if (query.treeType) {
		where += " AND tree_type = ?"
		params.push(query.treeType)
	}

	// 关键词搜索
	if (query.keyword) {
		where += " AND (name LIKE ? OR phone LIKE ?)"
		const keywordPattern = `%${query.keyword}%`
		params.push(keywordPattern, keywordPattern)
	}

	const total = queryScalar(`SELECT COUNT(*) FROM rygk_persons ${where}`, params) as number
	const rows = queryAll(
		`SELECT * FROM rygk_persons ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
		[...params, pageSize, offset]
	)

	// 填充名称字段
	const sourceOptions = await getSourceOptions()
	const categoryOptions = await getCategoryOptions()
	const addressOptions = await getAddressOptions()

	const sourceMap = Object.fromEntries(sourceOptions.map((s) => [s.value, s.label]))
	const categoryMap = Object.fromEntries(categoryOptions.map((c) => [c.value, c.label]))
	const addressMap = Object.fromEntries(addressOptions.map((a) => [a.value, a.label]))

	const list = rows.map((row) => {
		const item = rowToListItem(row as PersonRow)
		item.residenceAddressName = addressMap[row.residence_address] || row.residence_address || undefined
		item.categoryName = categoryMap[row.category] || row.category || undefined
		item.dataSourceName = sourceMap[row.data_source] || row.data_source || undefined
		item.followStatusName = row.follow_status === "1" ? "已关注" : "未关注"
		return item
	})

	return { list, total }
}

export async function createPerson(data: {
	name: string
	gender: "男" | "女"
	age: number
	phone: string
	idCard: string
	residenceAddress: string
	category: string
	dataSource: string
	tags?: string[]
	treeId?: number
	treeType?: string
}): Promise<number> {
	const db = getDb()
	db.run(
		`INSERT INTO rygk_persons 
		(name, gender, age, phone, id_card, residence_address, category, data_source, tags, tree_id, tree_type) 
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			data.name,
			data.gender,
			data.age,
			data.phone,
			data.idCard,
			data.residenceAddress,
			data.category,
			data.dataSource,
			data.tags ? JSON.stringify(data.tags) : null,
			data.treeId || null,
			data.treeType || null
		]
	)
	saveDatabase()
	return db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] as number
}

export async function updatePerson(
	id: number,
	data: Partial<{
		name: string
		gender: string
		age: number
		phone: string
		idCard: string
		residenceAddress: string
		category: string
		dataSource: string
		tags: string[]
		followStatus: string
		treeId: number
		treeType: string
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
	if (data.phone !== undefined) {
		fields.push("phone = ?")
		values.push(data.phone)
	}
	if (data.idCard !== undefined) {
		fields.push("id_card = ?")
		values.push(data.idCard)
	}
	if (data.residenceAddress !== undefined) {
		fields.push("residence_address = ?")
		values.push(data.residenceAddress)
	}
	if (data.category !== undefined) {
		fields.push("category = ?")
		values.push(data.category)
	}
	if (data.dataSource !== undefined) {
		fields.push("data_source = ?")
		values.push(data.dataSource)
	}
	if (data.tags !== undefined) {
		fields.push("tags = ?")
		values.push(JSON.stringify(data.tags))
	}
	if (data.followStatus !== undefined) {
		fields.push("follow_status = ?")
		values.push(data.followStatus)
	}
	if (data.treeId !== undefined) {
		fields.push("tree_id = ?")
		values.push(data.treeId)
	}
	if (data.treeType !== undefined) {
		fields.push("tree_type = ?")
		values.push(data.treeType)
	}

	if (fields.length === 0) return

	fields.push("updated_at = datetime('now')")
	values.push(id)

	const db = getDb()
	db.run(`UPDATE rygk_persons SET ${fields.join(", ")} WHERE id = ?`, values)
	saveDatabase()
}

export async function deletePerson(id: number): Promise<void> {
	runAndSave("DELETE FROM rygk_persons WHERE id = ?", [id])
}

export async function batchUpdateStatus(ids: number[], status: "0" | "1"): Promise<number> {
	if (ids.length === 0) return 0
	const placeholders = ids.map(() => "?").join(",")
	runAndSave(`UPDATE rygk_persons SET follow_status = ?, updated_at = datetime('now') WHERE id IN (${placeholders})`, [
		status,
		...ids
	])
	return ids.length
}

// ========== 类别管理 ==========

export async function assignCategory(personIds: number[], categoryCode: string): Promise<number> {
	if (personIds.length === 0) return 0
	const placeholders = personIds.map(() => "?").join(",")
	runAndSave(
		`UPDATE rygk_persons SET category = ?, updated_at = datetime('now') WHERE id IN (${placeholders})`,
		[categoryCode, ...personIds]
	)
	return personIds.length
}

// ========== 导出辅助 ==========

export async function getPersonsByIds(ids: number[]): Promise<any[]> {
	if (ids.length === 0) return []

	const placeholders = ids.map(() => "?").join(",")
	const rows = queryAll(`SELECT * FROM rygk_persons WHERE id IN (${placeholders})`, ids)

	// 填充名称字段
	const sourceOptions = await getSourceOptions()
	const categoryOptions = await getCategoryOptions()
	const addressOptions = await getAddressOptions()

	const sourceMap = Object.fromEntries(sourceOptions.map((s) => [s.value, s.label]))
	const categoryMap = Object.fromEntries(categoryOptions.map((c) => [c.value, c.label]))
	const addressMap = Object.fromEntries(addressOptions.map((a) => [a.value, a.label]))

	return rows.map((row) => {
		const item = rowToListItem(row as PersonRow)
		item.residenceAddressName = addressMap[row.residence_address] || row.residence_address || undefined
		item.categoryName = categoryMap[row.category] || row.category || undefined
		item.dataSourceName = sourceMap[row.data_source] || row.data_source || undefined
		item.followStatusName = row.follow_status === "1" ? "已关注" : "未关注"
		return item
	})
}
