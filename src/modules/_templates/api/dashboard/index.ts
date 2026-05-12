import request from '@/api/request'
import type { DashboardData, StatItem, ChartData, PieItem, OrderListResult } from './types'

export type { StatItem, ChartData, PieItem }
export type { OrderItem } from './types'

export const dashboard = {
	// 获取完整仪表盘数据
	getDashboardData() {
		return request.get<{ state: number; message: string; data: DashboardData }>('/templates/dashboard/data')
	},

	// 获取统计数据
	getStats() {
		return request.get<{ state: number; message: string; data: StatItem[] }>('/templates/stats')
	},

	// 获取月度销售数据
	getMonthlySales(period: 'week' | 'month' | 'year' = 'month') {
		return request.get<{ state: number; message: string; data: ChartData[] }>('/templates/monthly-sales', {
			params: { period }
		})
	},

	// 获取饼图数据
	getPieData(type: string = 'all') {
		return request.get<{ state: number; message: string; data: PieItem[] }>('/templates/pie-data', {
			params: { type }
		})
	},

	// 获取年度趋势数据
	getSalesTrend(year: string) {
		return request.get<{ state: number; message: string; data: ChartData[] }>('/templates/sales-trend', {
			params: { year }
		})
	},

	// 获取订单列表
	getOrders(page: number = 1, pageSize: number = 10) {
		return request.get<{ state: number; message: string; data: OrderListResult }>('/templates/orders', {
			params: { page, pageSize }
		})
	}
}
