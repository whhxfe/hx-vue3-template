/**
 * AMC 模块 API 接口
 */
import request from '@/api/request'
import type {
	LspItem,
	LspQuery,
	LspResult,
	LspForm,
	LmcItem,
	LmcQuery,
	LmcResult,
	LmcForm,
	LvsOverview,
	LvsMonthTrend,
	LvsMonthShare,
	LvsHealthStatus,
	LvsAlertItem
} from './types'

export type {
	LspItem,
	LspQuery,
	LspResult,
	LspForm,
	LmcItem,
	LmcQuery,
	LmcResult,
	LmcForm,
	LvsOverview,
	LvsMonthTrend,
	LvsMonthShare,
	LvsHealthStatus,
	LvsAlertItem
}

/** 日志标准化处理 API */
export const lsp = {
	getList(params: LspQuery) {
		return request.get<{ state: number; message: string; data: LspResult }>('/amc/lsp/list', {
			params: {
				page: params.page || 1,
				pageSize: params.pageSize || 10,
				sourceSystem: params.sourceSystem || undefined,
				transformStatus: params.transformStatus || undefined,
				processor: params.processor || undefined,
				startTime: params.startTime || undefined,
				endTime: params.endTime || undefined
			}
		})
	},

	add(data: LspForm) {
		return request.post<{ state: number; message: string }>('/amc/lsp/add', data)
	},

	update(data: LspForm & { id: number }) {
		return request.post<{ state: number; message: string }>('/amc/lsp/update', data)
	},

	delete(id: number) {
		return request.post<{ state: number; message: string }>('/amc/lsp/delete', { id })
	},

	getSourceSystemOptions() {
		return request.get<{ state: number; message: string; data: Array<{ value: string; label: string }> }>('/public/dict/source-systems')
	}
}

/** 日志管理 API */
export const lmc = {
	getList(params: LmcQuery) {
		return request.get<{ state: number; message: string; data: LmcResult }>('/amc/lmc/list', {
			params: {
				page: params.page || 1,
				pageSize: params.pageSize || 10,
				logCode: params.logCode || undefined,
				logType: params.logType || undefined,
				logLevel: params.logLevel || undefined,
				sourceSystem: params.sourceSystem || undefined,
				operator: params.operator || undefined,
				startTime: params.startTime || undefined,
				endTime: params.endTime || undefined
			}
		})
	},

	add(data: LmcForm) {
		return request.post<{ state: number; message: string }>('/amc/lmc/add', data)
	},

	update(data: LmcForm & { id: number }) {
		return request.post<{ state: number; message: string }>('/amc/lmc/update', data)
	},

	delete(id: number) {
		return request.post<{ state: number; message: string }>('/amc/lmc/delete', { id })
	}
}

/** 日志统计大屏 API */
export const lvs = {
	getOverview() {
		return request.get<{ state: number; message: string; data: LvsOverview }>('/amc/lvs/overview')
	},

	getMonthTrend() {
		return request.get<{ state: number; message: string; data: LvsMonthTrend[] }>('/amc/lvs/month-trend')
	},

	getMonthShare() {
		return request.get<{ state: number; message: string; data: LvsMonthShare[] }>('/amc/lvs/month-share')
	},

	getHealthStatus() {
		return request.get<{ state: number; message: string; data: LvsHealthStatus[] }>('/amc/lvs/health-status')
	},

	getAlerts() {
		return request.get<{ state: number; message: string; data: LvsAlertItem[] }>('/amc/lvs/alerts')
	}
}
