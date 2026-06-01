/**
 * pbct 模块类型定义
 */

/** 数据导入列表项 */
export interface ListItem {
	id: number
	name: string
	gender: string
	age: number
	phone: string
	idCard: string
	occupation: string
	residenceAddress: string
	entryTime: string
	updateTime: string
}

/** 列表查询参数 */
export interface ListQuery {
	page?: number
	pageSize?: number
	idCard?: string
	name?: string
	phone?: string
	district?: string
	gender?: string
	ethnicity?: string
	sortOrder?: string
}

/** 列表响应结果 */
export interface ListResult {
	list: ListItem[]
	total: number
}

/** 导入数据项 */
export interface ImportData {
	handleTime: string
	name: string
	idCard: string
	phone: string
	gender: string
	ethnicity: string
	virtualAccount: string
	handleReason: string
	handleResult: string
	householdAddress: string
	residenceAddress: string
	district: string
}

/** 新增数据项 */
export interface AddData {
	handleTime: string
	name: string
	idCard: string
	phone: string
	gender: string
	ethnicity: string
	virtualAccount: string
	handleReason: string
	handleResult: string
	householdAddress: string
	residenceAddress: string
	district: string
}
