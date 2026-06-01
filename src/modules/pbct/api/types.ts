/**
 * pbct 模块类型定义
 */

/** 数据导入列表项 */
export interface ListItem {
	id: number
	// 基础信息
	handleTime: string
	name: string
	idCard: string
	phone: string
	gender: string
	ethnicity: string
	// 账号信息
	virtualAccount: string
	// 处理信息
	handleReason: string
	handleResult: string
	// 地址信息
	householdAddress: string
	residenceAddress: string
	// 所属区县
	district: string
	// 时间戳
	entryTime: string
	updatedAt: string
}

/** 列表查询参数 */
export interface ListQuery {
	page?: number
	pageSize?: number
	name?: string
	idCard?: string
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

/** 新增表单数据 */
export interface AddForm {
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
