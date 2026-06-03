/**
 * pbct 模块类型定义
 */

/** 记录列表项（从 pbct_records 查询，含人员关联信息） */
export interface RecordItem {
	id: number
	personId: number
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
	source: string
	importTime: string
	createdAt: string
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
	source?: string
}

/** 列表响应结果 */
export interface ListResult {
	list: RecordItem[]
	total: number
}

/** 批量查询响应结果 */
export interface BatchQueryResult {
	list: RecordItem[]
	total: number
	unmatchedIdCards: string[]
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
