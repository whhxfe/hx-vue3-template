/**
 * tgm/gc 模块类型定义
 */

export interface TreeNode {
	id: number
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
	id: number
	name: string
	categoryType: string
	categoryTypeName?: string
	isJudged?: boolean
	memberCount: number
	territory: string
	policeName: string
	unitName: string
	reason: string
	activeCount: number
	recommendCount: number
	groupCount: number
	subGroupCount: number
	warningTypes: string[]
	warningTypeNames?: string[]
	tags: string[]
	tagsName?: string[]
	entryTime: string
	sortField?: string
	sortOrder?: string
}

export interface ListQuery {
	page?: number
	pageSize?: number
	keyword?: string
	categoryType?: string
	entryTimeStart?: string
	entryTimeEnd?: string
	treeId?: number | string
	sortField?: string
	sortOrder?: string
}

export interface GroupRow {
	id: number
	name: string
	category_type: string | null
	is_judged: number
	member_count: number
	territory: string | null
	police_name: string | null
	unit_name: string | null
	reason: string | null
	active_count: number
	recommend_count: number
	group_count: number
	sub_group_count: number
	warning_types: string | null
	tags: string | null
	entry_time: string
	created_at: string
	updated_at: string
}
