/**
 * ryyj 模块 API 类型定义
 */

export interface ListItem {
	id: number
	avatar?: string
	name: string
	gender: "男" | "女"
	age: number
	idCard: string
	phone?: string
	education?: string
	personScore?: number | string
	personCategory?: string
	personCategoryName?: string
	manageCategory?: string
	manageCategoryName?: string
	entryTime?: string
	dataSource?: string
	dataSourceName?: string
	occupationType?: string
	residenceAddress?: string
	relationInfo?: string
	warningType?: string
	warningTypeName?: string
	businessCategory?: string
	businessCategoryName?: string
	householdAddress?: string
	manageDept?: string
	manageDeptName?: string
}

export interface ListQuery {
	page?: number
	pageSize?: number
	sortField?: "personScore" | "entryTime"
	sortOrder?: "asc" | "desc"
	businessCategory?: string
	personScore?: string
	warningType?: string
	dataSource?: string
	manageCategory?: string
	householdAddress?: string
	manageDept?: string
	entryTimeStart?: string
	entryTimeEnd?: string
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

export interface DictItem {
	label: string
	value: string | number
	disabled?: boolean
}
