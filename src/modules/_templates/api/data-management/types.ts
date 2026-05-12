/**
 * 数据管理类型定义
 */
export interface DataItem {
	id: number
	name: string
	code: string
	category: string
	status: 'active' | 'inactive'
	createTime: string
	updateTime: string
	description?: string
}

export interface DataFormData {
	name: string
	code: string
	category: string
	status: 'active' | 'inactive'
	description?: string
}

export interface DataListResult {
	list: DataItem[]
	total: number
	page: number
	pageSize: number
}
