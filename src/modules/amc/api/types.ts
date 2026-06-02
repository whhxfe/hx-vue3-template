/**
 * AMC 模块类型定义
 */

/** 日志标准化处理 - 列表项 */
export interface LspItem {
	id: number
	/** 日志来源系统 */
	sourceSystem: string
	/** 原始日志格式 */
	originalFormat: string
	/** 标准格式版本 */
	formatVersion: string
	/** 转换状态 */
	transformStatus: 'pending' | 'processing' | 'completed' | 'failed'
	/** 处理耗时(ms) */
	processDuration: number
	/** 处理人 */
	processor: string
	/** 创建时间 */
	createTime: string
	/** 更新时间 */
	updateTime: string
}

/** 日志标准化处理 - 查询参数 */
export interface LspQuery {
	page?: number
	pageSize?: number
	sourceSystem?: string
	transformStatus?: string
	processor?: string
	startTime?: string
	endTime?: string
}

/** 日志标准化处理 - 响应结果 */
export interface LspResult {
	list: LspItem[]
	total: number
}

/** 日志标准化处理 - 新增表单 */
export interface LspForm {
	sourceSystem: string
	originalFormat: string
	formatVersion: string
	transformStatus: string
	processor: string
}

/** 日志管理 - 列表项 */
export interface LmcItem {
	id: number
	/** 日志编号 */
	logCode: string
	/** 日志类型 */
	logType: string
	/** 日志级别 */
	logLevel: 'debug' | 'info' | 'warn' | 'error'
	/** 产生系统 */
	sourceSystem: string
	/** 操作人 */
	operator: string
	/** 操作IP */
	operatorIp: string
	/** 请求方法 */
	requestMethod: string
	/** 请求路径 */
	requestPath: string
	/** 响应状态码 */
	responseStatus: number
	/** 执行时长(ms) */
	executionDuration: number
	/** 错误信息 */
	errorMessage: string
	/** 创建时间 */
	createTime: string
}

/** 日志管理 - 查询参数 */
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

/** 日志管理 - 响应结果 */
export interface LmcResult {
	list: LmcItem[]
	total: number
}

/** 日志管理 - 新增表单 */
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

/** 日志统计大屏 - 概览数据 */
export interface LvsOverview {
	totalAccess: number
	todayAccess: number
	onlineDevices: number
	onlineUsers: number
	systemWarnings: number
	faultAlerts: number
	avgResponse: number
	avgThroughput: number
}

/** 日志统计大屏 - 月度访问趋势 */
export interface LvsMonthTrend {
	month: string
	access: number
	accessGrowth: number
}

/** 日志统计大屏 - 月度访问占比 */
export interface LvsMonthShare {
	name: string
	value: number
	percentage: number
}

/** 日志统计大屏 - 系统健康状态 */
export interface LvsHealthStatus {
	time: string
	cpu: number
	memory: number
	disk: number
	network: number
}

/** 日志统计大屏 - 告警记录 */
export interface LvsAlertItem {
	id: number
	time: string
	level: "info" | "warn" | "error"
	source: string
	message: string
	status: "pending" | "processing" | "resolved"
}
