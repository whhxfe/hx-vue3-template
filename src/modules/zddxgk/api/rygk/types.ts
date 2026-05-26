/**
 * rygk 模块 API 类型定义
 */

/**
 * 关注级别
 * - 0: 未关注
 * - 1: 重点关注
 */
export type FollowLevel = "0" | "1"

/**
 * 关注级别选项（用于下拉选择）
 */
export const FOLLOW_LEVEL_OPTIONS = [
	{ label: "未关注", value: "0", type: "info" },
	{ label: "重点关注", value: "1", type: "danger" }
] as const

export interface TreeNode {
	id: string | number
	label: string
	count?: number
	icon?: string
	children?: TreeNode[]
}

export interface DictItem {
	label: string
	value: string | number
	disabled?: boolean
}

export interface ListItem {
	id?: number
	avatar?: string
	name: string
	gender: "男" | "女"
	age: number
	phone: string
	idCard: string
	residenceAddress: string
	residenceAddressName?: string
	tags: string[]
	tagsName?: string[]
	category: string
	categoryName?: string
	dataSource: string
	dataSourceName?: string
	followStatus: FollowLevel
	followStatusName?: string
	entryTime: string
	longitude?: number
	latitude?: number
}

export interface ListQuery {
	page?: number
	pageSize?: number
	dataSource?: string
	category?: string
	residenceAddress?: string
	followStatus?: string
	entryTimeStart?: string
	entryTimeEnd?: string
	treeId?: number | string
	treeType?: string
	keyword?: string
}

export interface ListResult {
	list: ListItem[]
	total: number
	page: number
	pageSize: number
}

export interface ApiResponse<T = unknown> {
	state: number
	message: string
	data: T
}
