/**
 * 数据分析类型定义
 */
export interface StatCard {
	title: string
	value: number | string
	suffix?: string
	trend: number
	trendText: string
}

export interface LineChartData {
	date: string
	value: number
}

export interface BarChartData {
	category: string
	value: number
}

export interface PieChartData {
	name: string
	value: number
	color: string
}

export interface AnalyticsData {
	statCards: StatCard[]
	trendData: LineChartData[]
	barData: BarChartData[]
	pieData: PieChartData[]
}
