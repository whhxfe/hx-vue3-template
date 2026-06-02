/** LMC: 日志管理 - 列表项 */
export interface LmcItem {
	id: number
	logCode: string
	logType: string
	logLevel: "debug" | "info" | "warn" | "error"
	sourceSystem: string
	operator: string
	operatorIp: string
	requestMethod: string
	requestPath: string
	responseStatus: number
	executionDuration: number
	errorMessage: string
	createTime: string
}

/** LMC: 日志管理 - 查询参数 */
export interface LmcQuery {
	page?: number
	pageSize?: number
	logCode?: string
	logType?: string
	logLevel?: string
	sourceSystem?: string
	operator?: string
	startTime?: string
	endTime?: string
}

/** LMC: 日志管理 - 响应 */
export interface LmcResult {
	list: LmcItem[]
	total: number
}

/** LMC: 日志管理 - 新增表单 */
export interface LmcForm {
	logType: string
	logLevel: string
	sourceSystem: string
	operator: string
	operatorIp: string
	requestMethod: string
	requestPath: string
	responseStatus: number
	errorMessage: string
}
