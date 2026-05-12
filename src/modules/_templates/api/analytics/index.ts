import request from '@/api/request'
import type { AnalyticsData } from './types'

export type { StatCard, LineChartData, BarChartData, PieChartData } from './types'

export const analytics = {
	// 获取分析数据
	getData(dateRange?: [string, string]) {
		return request.get<{ state: number; message: string; data: AnalyticsData }>(
			'/templates/analytics/data',
			{ params: { startDate: dateRange?.[0], endDate: dateRange?.[1] } }
		)
	},

	// 获取统计卡片数据
	getStatCards() {
		return request.get<{ state: number; message: string; data: AnalyticsData['statCards'] }>(
			'/templates/analytics/stat-cards'
		)
	},

	// 获取趋势数据
	getTrendData(period: 'week' | 'month' | 'year' = 'month') {
		return request.get<{ state: number; message: string; data: AnalyticsData['trendData'] }>(
			'/templates/analytics/trend',
			{ params: { period } }
		)
	}
}
