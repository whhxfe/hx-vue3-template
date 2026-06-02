/** LSP: 日志标准化处理 - 列表项 */
export interface LspItem {
	id: number
	sourceSystem: string
	originalFormat: string
	formatVersion: string
	transformStatus: "pending" | "processing" | "completed" | "failed"
	processDuration: number
	processor: string
	createTime: string
	updateTime: string
}

/** LSP: 日志标准化处理 - 列表查询 */
export interface LspQuery {
	page?: number
	pageSize?: number
	sourceSystem?: string
	transformStatus?: string
	processor?: string
	startTime?: string
	endTime?: string
}

/** LSP: 日志标准化处理 - 列表响应 */
export interface LspResult {
	list: LspItem[]
	total: number
}

/** LSP: 日志标准化处理 - 新增表单 */
export interface LspForm {
	sourceSystem: string
	originalFormat: string
	formatVersion: string
	transformStatus: string
	processor: string
}
