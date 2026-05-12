/**
 * 操作日志 API
 */
import request from '@/api/request'

/** 操作日志项 */
export interface OperationLog {
	id: number
	user_id: number | null
	username: string
	action: string
	method: string
	path: string
	ip: string
	user_agent: string
	request_body: string | null
	response_body: string | null
	status_code: number
	duration: number
	error_message: string | null
	created_at: string
}

/** 日志查询参数 */
export interface LogQuery {
	page?: number
	pageSize?: number
	username?: string
	action?: string
	path?: string
	start_date?: string
	end_date?: string
}

/** 日志列表响应 */
export interface LogListData {
	list: OperationLog[]
	total: number
	page: number
	pageSize: number
}

/** 日志统计响应 */
export interface LogStats {
	total: number
	todayTotal: number
	weekStats: Array<{ date: string; count: number }>
	hotActions: Array<{ action: string; count: number }>
}

/** 获取日志列表 */
export function getLogList(params: LogQuery) {
	return request.get<{ state: number; message: string; data: LogListData }>('/admin/syslog/logs', { params })
}

/** 获取日志详情 */
export function getLogDetail(id: number) {
	return request.get<{ state: number; message: string; data: OperationLog | null }>(`/admin/syslog/logs/${id}`)
}

/** 获取日志统计 */
export function getLogStats() {
	return request.get<{ state: number; message: string; data: LogStats }>('/admin/syslog/logs/stats/summary')
}
