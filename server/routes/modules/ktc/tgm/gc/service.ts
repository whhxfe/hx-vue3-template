/**
 * tgm/gc 模块数据库操作层（群体管控）
 */
import { getDb, saveDatabase } from "@db/manager"
import type { ListItem, ListQuery, TreeNode, DictItem, GroupRow } from "./types"
import { queryAll, queryScalar, runAndSave } from "@utils/db-helper"

// ========== 行数据转 ListItem ==========

function rowToListItem(row: GroupRow): ListItem {
	return {
		id: row.id,
		name: row.name,
		categoryType: row.category_type || "",
		isJudged: row.is_judged === 1,
		memberCount: row.member_count || 0,
		territory: row.territory || "",
		policeName: row.police_name || "",
		unitName: row.unit_name || "",
		reason: row.reason || "",
		activeCount: row.active_count || 0,
		recommendCount: row.recommend_count || 0,
		groupCount: row.group_count || 0,
		subGroupCount: row.sub_group_count || 0,
		warningTypes: row.warning_types ? JSON.parse(row.warning_types) : [],
		tags: row.tags ? JSON.parse(row.tags) : [],
		entryTime: row.entry_time
	}
}

// ========== 树结构 ==========

export async function getTreeData(): Promise<TreeNode[]> {
	const categoryTypes = ["上访群体", "涉稳群体", "维权群体", "利益诉求", "重点关注"]
	const result: TreeNode[] = []

	for (let i = 0; i < categoryTypes.length; i++) {
		const count = queryScalar(
			"SELECT COUNT(*) FROM ktc_gc_groups WHERE category_type = ?",
			[categoryTypes[i]]
		) as number
		result.push({
			id: i + 1,
			label: categoryTypes[i],
			count: count || 0
		})
	}

	return result
}

// ========== 字典下拉 ==========

export async function getCategoryOptions(): Promise<DictItem[]> {
	return [
		{ label: "上访群体", value: "上访群体" },
		{ label: "涉稳群体", value: "涉稳群体" },
		{ label: "维权群体", value: "维权群体" },
		{ label: "利益诉求", value: "利益诉求" },
		{ label: "重点关注", value: "重点关注" }
	]
}

export async function getWarningTypeOptions(): Promise<DictItem[]> {
	return [
		{ label: "轨迹异常", value: "轨迹异常" },
		{ label: "昼伏夜出", value: "昼伏夜出" },
		{ label: "失活", value: "失活" },
		{ label: "聚集预警", value: "聚集预警" },
		{ label: "高频出行", value: "高频出行" },
		{ label: "跨域流动", value: "跨域流动" }
	]
}

// ========== 群体 CRUD ==========

export async function getGroups(query: ListQuery): Promise<{ list: ListItem[]; total: number }> {
	const page = query.page || 1
	const pageSize = query.pageSize || 10
	const offset = (page - 1) * pageSize

	let where = "WHERE 1=1"
	const params: any[] = []

	if (query.keyword) {
		where += " AND name LIKE ?"
		params.push(`%${query.keyword}%`)
	}
	if (query.categoryType) {
		where += " AND category_type = ?"
		params.push(query.categoryType)
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
		const categoryTypes = ["上访群体", "涉稳群体", "维权群体", "利益诉求", "重点关注"]
		const treeId = Number(query.treeId)
		if (treeId >= 1 && treeId <= categoryTypes.length) {
			where += " AND category_type = ?"
			params.push(categoryTypes[treeId - 1])
		}
	}

	const total = queryScalar(`SELECT COUNT(*) FROM ktc_gc_groups ${where}`, params) as number

	let orderBy = "ORDER BY id DESC"
	if (query.sortField) {
		const sortMap: Record<string, string> = {
			entryTime: "entry_time",
			memberCount: "member_count",
			activeCount: "active_count"
		}
		const dbField = sortMap[query.sortField] || "id"
		const direction = query.sortOrder === "asc" ? "ASC" : "DESC"
		orderBy = `ORDER BY ${dbField} ${direction}`
	}

	const rows = queryAll(
		`SELECT * FROM ktc_gc_groups ${where} ${orderBy} LIMIT ? OFFSET ?`,
		[...params, pageSize, offset]
	)

	const categoryMap: Record<string, string> = {
		"上访群体": "上访群体",
		"涉稳群体": "涉稳群体",
		"维权群体": "维权群体",
		"利益诉求": "利益诉求",
		"重点关注": "重点关注"
	}

	const list = rows.map((row) => {
		const item = rowToListItem(row as GroupRow)
		item.categoryTypeName = categoryMap[item.categoryType] || item.categoryType
		item.tagsName = item.tags
		item.warningTypeNames = item.warningTypes
		return item
	})

	return { list, total }
}

export async function createGroup(data: {
	name: string
	categoryType: string
	territory: string
	policeName: string
	unitName: string
	reason: string
	tags?: string[]
}): Promise<number> {
	const db = getDb()
	db.run(
		`INSERT INTO ktc_gc_groups
		(name, category_type, territory, police_name, unit_name, reason, tags)
		VALUES (?, ?, ?, ?, ?, ?, ?)`,
		[
			data.name,
			data.categoryType,
			data.territory,
			data.policeName,
			data.unitName,
			data.reason,
			data.tags ? JSON.stringify(data.tags) : null
		]
	)
	saveDatabase()
	return db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] as number
}

export async function updateGroup(
	id: number,
	data: Partial<{
		name: string
		categoryType: string
		territory: string
		policeName: string
		unitName: string
		reason: string
		tags: string[]
	}>
): Promise<void> {
	const fields: string[] = []
	const values: any[] = []

	if (data.name !== undefined) {
		fields.push("name = ?")
		values.push(data.name)
	}
	if (data.categoryType !== undefined) {
		fields.push("category_type = ?")
		values.push(data.categoryType)
	}
	if (data.territory !== undefined) {
		fields.push("territory = ?")
		values.push(data.territory)
	}
	if (data.policeName !== undefined) {
		fields.push("police_name = ?")
		values.push(data.policeName)
	}
	if (data.unitName !== undefined) {
		fields.push("unit_name = ?")
		values.push(data.unitName)
	}
	if (data.reason !== undefined) {
		fields.push("reason = ?")
		values.push(data.reason)
	}
	if (data.tags !== undefined) {
		fields.push("tags = ?")
		values.push(JSON.stringify(data.tags))
	}

	if (fields.length === 0) return

	fields.push("updated_at = datetime('now')")
	values.push(id)

	const db = getDb()
	db.run(`UPDATE ktc_gc_groups SET ${fields.join(", ")} WHERE id = ?`, values)
	saveDatabase()
}

export async function deleteGroup(id: number): Promise<void> {
	runAndSave("DELETE FROM ktc_gc_groups WHERE id = ?", [id])
}
