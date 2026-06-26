/**
 * tum/um 单元上图模块服务层
 */
import type { ListItem, ListQuery, DictItem, UnitRow } from "./types"
import { queryAll, queryScalar } from "@utils/db-helper"

// ========== 行数据转 ListItem ==========

function rowToListItem(row: UnitRow): ListItem {
	return {
		id: row.id,
		ip: row.ip || "",
		adsl: row.adsl || "",
		unitType: row.unit_type || "",
		unitTypeName: row.unit_type_name || getUnitTypeName(row.unit_type),
		controlCategory: row.control_category || "",
		controlCategoryName: row.control_category_name || getControlCategoryName(row.control_category),
		unitTag: row.unit_tag || "",
		portCount: row.port_count || 0,
		terminalCount: row.terminal_count || 0,
		ipLocation: row.ip_location || "",
		focusPerson: row.focus_person || "",
		focusUnit: row.focus_unit || "",
		warningType: row.warning_type || "",
		warningTypeName: row.warning_type_name || getWarningTypeName(row.warning_type),
		isJudged: row.is_judged === 1,
		isControlled: row.is_controlled === 1,
		entryTime: row.entry_time || "",
		longitude: row.longitude,
		latitude: row.latitude
	}
}

function getUnitTypeName(type?: string | null): string {
	const map: Record<string, string> = {
		fixed_ip: "固定IP",
		adsl: "ADSL"
	}
	return map[type || ""] || type || ""
}

function getControlCategoryName(category?: string | null): string {
	const map: Record<string, string> = {
		focus: "重点关注",
		level1: "一级",
		level2: "二级",
		level3: "三级",
		other: "其他"
	}
	return map[category || ""] || category || ""
}

function getWarningTypeName(type?: string | null): string {
	const map: Record<string, string> = {
		red: "红色预警",
		orange: "橙色预警",
		yellow: "黄色预警",
		blue: "蓝色预警"
	}
	return map[type || ""] || ""
}

// ========== 字典下拉 ==========

export async function getUnitTypeOptions(): Promise<DictItem[]> {
	return [
		{ label: "固定IP", value: "fixed_ip" },
		{ label: "ADSL", value: "adsl" }
	]
}

export async function getControlCategoryOptions(): Promise<DictItem[]> {
	return [
		{ label: "重点关注", value: "focus" },
		{ label: "一级", value: "level1" },
		{ label: "二级", value: "level2" },
		{ label: "三级", value: "level3" },
		{ label: "其他", value: "other" }
	]
}

// ========== 列表查询 ==========

export async function getUnits(query: ListQuery): Promise<{ list: ListItem[]; total: number }> {
	const page = query.page || 1
	const pageSize = query.pageSize || 10
	const offset = (page - 1) * pageSize

	let where = "WHERE 1=1"
	const params: any[] = []

	if (query.keyword) {
		where += " AND (ip LIKE ? OR adsl LIKE ?)"
		params.push(`%${query.keyword}%`, `%${query.keyword}%`)
	}
	if (query.unitType) {
		where += " AND unit_type = ?"
		params.push(query.unitType)
	}
	if (query.controlCategory) {
		where += " AND control_category = ?"
		params.push(query.controlCategory)
	}
	if (query.entryTimeStart) {
		where += " AND entry_time >= ?"
		params.push(query.entryTimeStart)
	}
	if (query.entryTimeEnd) {
		where += " AND entry_time <= ?"
		params.push(query.entryTimeEnd)
	}

	const total = queryScalar(`SELECT COUNT(*) FROM ktc_um_units ${where}`, params) as number
	const rows = queryAll(
		`SELECT * FROM ktc_um_units ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
		[...params, pageSize, offset]
	)

	const list = rows.map((row) => rowToListItem(row as UnitRow))

	return { list, total }
}
