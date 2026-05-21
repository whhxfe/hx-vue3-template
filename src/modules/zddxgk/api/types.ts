/**
 * zddxgk 模块公共 API 类型定义
 */

/**
 * 字典项
 */
export interface DictItem {
	label: string
	value: string | number
	disabled?: boolean
}

/**
 * API 响应格式
 */
export interface ApiResponse<T = unknown> {
	state: number
	message: string
	data: T
}

/**
 * 列表分页结果
 */
export interface ListResult<T> {
	list: T[]
	total: number
	page: number
	pageSize: number
}
