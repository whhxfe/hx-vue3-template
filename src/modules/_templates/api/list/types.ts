/** 列表数据项 */
export interface ListItem {
	id: number
	name: string
	phone: string
	email: string
	gender: string
	status: string
	createTime: string
	description: string
}

/** 列表查询参数 */
export interface ListQuery {
	page?: number
	pageSize?: number
	name?: string
	phone?: string
	gender?: string
	status?: string
}

/** 列表响应结果 */
export interface ListResult {
	list: ListItem[]
	total: number
	page: number
	pageSize: number
}

/** 新增/编辑表单数据 */
export interface ListForm {
	id?: number
	name: string
	phone: string
	email: string
	gender: string
	status: string
	description: string
}
