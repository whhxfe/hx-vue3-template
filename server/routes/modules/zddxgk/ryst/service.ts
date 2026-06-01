/**
 * ryst 模块数据库操作层
 */
import type { ListItem, ListQuery, DictItem, RystRow } from "./types"
import { queryAll, queryScalar } from "@utils/db-helper"

// ========== 行数据转 ListItem ==========

function rowToListItem(row: RystRow): ListItem {
	const tagsStr = row.tags || ""
	const tags = tagsStr ? tagsStr.split(",").map((t) => t.trim()).filter(Boolean) : []

	return {
		id: row.id,
		avatar: row.avatar || undefined,
		name: row.name,
		gender: (row.gender || "男") as "男" | "女",
		age: row.age || 0,
		phone: row.phone || "",
		idCard: row.id_card || "",
		residenceAddress: row.residence_address || undefined,
		residenceAddressName: row.residence_address || undefined,
		tags: tags.length > 0 ? tags : undefined,
		tagsName: tags.length > 0 ? tags : undefined,
		category: row.category || undefined,
		categoryName: row.category_name || row.category || undefined,
		dataSource: row.data_source || undefined,
		dataSourceName: row.data_source_name || row.data_source || undefined,
		followStatus: (row.follow_status || "0") as "0" | "1" | "2",
		followStatusName: getFollowStatusName(row.follow_status),
		entryTime: row.entry_time || undefined,
		longitude: row.longitude,
		latitude: row.latitude
	}
}

function getFollowStatusName(status?: string | null): string {
	const map: Record<string, string> = {
		"0": "普通",
		"1": "重点关注",
		"2": "一般关注"
	}
	return map[status || "0"] || "普通"
}

// ========== 字典下拉 ==========

export async function getSourceOptions(): Promise<DictItem[]> {
	const rows = queryAll("SELECT value, label FROM dict_items WHERE type = 'ryst_source' AND status = 1 ORDER BY sort_order ASC")
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

export async function getCategoryOptions(): Promise<DictItem[]> {
	const rows = queryAll("SELECT value, label FROM dict_items WHERE type = 'ryst_category' AND status = 1 ORDER BY sort_order ASC")
	if (rows.length > 0) {
		return rows.map((r) => ({ label: r.label, value: r.value }))
	}
	return [
		{ label: "重点关注人员", value: "1" },
		{ label: "困难群体", value: "2" },
		{ label: "普通人员", value: "3" }
	]
}

// ========== 列表查询 ==========

export async function getPersons(query: ListQuery): Promise<{ list: ListItem[]; total: number }> {
	const page = query.page || 1
	const pageSize = query.pageSize || 10
	const offset = (page - 1) * pageSize

	let where = "WHERE 1=1"
	const params: any[] = []

	if (query.keyword) {
		where += " AND (name LIKE ? OR phone LIKE ?)"
		params.push(`%${query.keyword}%`, `%${query.keyword}%`)
	}
	if (query.dataSource) {
		where += " AND data_source = ?"
		params.push(query.dataSource)
	}
	if (query.category) {
		where += " AND category = ?"
		params.push(query.category)
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

	const total = queryScalar(`SELECT COUNT(*) FROM ryst_persons ${where}`, params) as number
	const rows = queryAll(
		`SELECT * FROM ryst_persons ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
		[...params, pageSize, offset]
	)

	const list = rows.map((row) => rowToListItem(row as RystRow))

	return { list, total }
}
