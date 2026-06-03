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
	LmcForm
} from './types'

export type {
	LspItem,
	LspQuery,
	LspResult,
	LspForm,
	LmcItem,
	LmcQuery,
	LmcResult,
	LmcForm
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
	/** 板块1：日志总量统计 - 横向柱状图 */
	getLogTotalStats() {
		return request.get<{ state: number; message: string; data: Array<{ name: string; value: number }> }>('/amc/lvs/log-total-stats')
	},

	/** 板块2：应用日志总量排行 - 横向柱状图 */
	getAppLogRanking() {
		return request.get<{ state: number; message: string; data: Array<{ name: string; value: number }> }>('/amc/lvs/app-log-ranking')
	},

	/** 板块3：日志总量统计饼图 - 环形饼图 */
	getLogSharePie() {
		return request.get<{ state: number; message: string; data: Array<{ name: string; value: number; itemStyle?: { color: string } }> }>('/amc/lvs/log-share-pie')
	},

	/** 板块4：用户统计 - 柱状图 */
	getUserStatsBar() {
		return request.get<{ state: number; message: string; data: Array<{ label: string; val: number }> }>('/amc/lvs/user-stats-bar')
	},

	/** 板块5：应用统计 - 折线图 */
	getAppStatsLine() {
		return request.get<{ state: number; message: string; data: { xAxis: string[]; series: number[] } }>('/amc/lvs/app-stats-line')
	},

	/** 板块6：终端统计 - 列表数据 */
	getTerminalStatsList() {
		return request.get<{ state: number; message: string; data: Array<{ ip: string; num: number }> }>('/amc/lvs/terminal-stats-list')
	},

	/** 板块7：日志数量趋势统计 - 多折线图 */
	getTrendStatsLine() {
		return request.get<{ state: number; message: string; data: { x: string[]; data1: number[]; data2: number[]; data3: number[] } }>('/amc/lvs/trend-stats-line')
	},

	/** 板块8：用户访问数量统计 - 面积折线图 */
	getUserVisitStats() {
		return request.get<{ state: number; message: string; data: Array<{ name: string; val: number }> }>('/amc/lvs/user-visit-stats')
	}
}
