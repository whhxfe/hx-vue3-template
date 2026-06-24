/**
 * 群体管控（tgm/gc）模块 API 类型定义
 */

/**
 * 左侧树节点
 */
export interface TreeNode {
	id: string | number
	label: string
	count?: number
	icon?: string
	children?: TreeNode[]
}

/**
 * 字典项
 */
export interface DictItem {
	label: string
	value: string | number
	disabled?: boolean
}

/**
 * 群体列表项
 */
export interface ListItem {
	id?: number
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
	status?: number
	sortField?: string
	sortOrder?: string
}

/**
 * 列表查询参数
 */
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

/**
 * 列表分页结果
 */
export interface ListResult {
	list: ListItem[]
	total: number
	page: number
	pageSize: number
}

/**
 * API 响应格式
 */
export interface ApiResponse<T = unknown> {
	state: number
	message: string
	data: T
}
