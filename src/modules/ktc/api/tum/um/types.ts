/**
 * tum/um 单元上图模块 API 类型定义
 */

/**
 * 管控类别
 */
export type ControlCategory = "focus" | "level1" | "level2" | "level3" | "other"

/**
 * 管控类别选项（用于标签展示）
 */
export const CONTROL_CATEGORY_OPTIONS = [
	{ label: "重点关注", value: "focus", type: "danger" },
	{ label: "一级", value: "level1", type: "warning" },
	{ label: "二级", value: "level2", type: "" },
	{ label: "三级", value: "level3", type: "info" },
	{ label: "其他", value: "other", type: "info" }
] as const

export interface ListItem {
	id: number
	ip: string
	adsl: string
	unitType: string
	unitTypeName: string
	controlCategory: string
	controlCategoryName: string
	unitTag: string
	portCount: number
	terminalCount: number
	ipLocation: string
	focusPerson: string
	focusUnit: string
	warningType: string
	warningTypeName: string
	isJudged: boolean
	isControlled: boolean
	entryTime: string
	longitude?: number
	latitude?: number
}

export interface ListQuery {
	page?: number
	pageSize?: number
	keyword?: string
	unitType?: string
	controlCategory?: string
	entryTimeStart?: string
	entryTimeEnd?: string
}
