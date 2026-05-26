/**
 * ryst 模块 API 类型定义
 */

/**
 * 关注状态
 */
export type FollowStatus = "0" | "1" | "2"

/**
 * 关注状态选项（用于下拉选择）
 */
export const FOLLOW_STATUS_OPTIONS = [
	{ label: "普通", value: "0", type: "info" },
	{ label: "重点关注", value: "1", type: "success" },
	{ label: "一般关注", value: "2", type: "warning" }
] as const

export interface ListItem {
	id?: number
	avatar?: string
	name: string
	gender: "男" | "女"
	age: number
	phone: string
	idCard: string
	residenceAddress?: string
	residenceAddressName?: string
	tags?: string[]
	tagsName?: string[]
	category?: string
	categoryName?: string
	dataSource?: string
	dataSourceName?: string
	followStatus: FollowStatus
	followStatusName?: string
	entryTime?: string
	longitude?: number
	latitude?: number
}

export interface ListQuery {
	page?: number
	pageSize?: number
	dataSource?: string
	category?: string
	followStatus?: string
	entryTimeStart?: string
	entryTimeEnd?: string
	keyword?: string
}

export interface DictItem {
	label: string
	value: string | number
	disabled?: boolean
}

export interface ApiResponse<T = unknown> {
	state: number
	message: string
	data: T
}

export interface ListResult {
	list: ListItem[]
	total: number
	page: number
	pageSize: number
}
