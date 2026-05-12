export interface StatItem {
	title: string
	value: string | number
	icon: string
	color: string
	trend: number
}

export interface ChartData {
	month: string
	value: number
}

export interface PieItem {
	name: string
	value: number
	color: string
}

export interface OrderItem {
	orderNo: string
	product: string
	amount: number
	status: "pending" | "processing" | "completed" | "cancelled"
	createTime: string
}

export interface DashboardData {
	stats: StatItem[]
	monthlySales: ChartData[]
	salesTrend: ChartData[]
	pieData: PieItem[]
	orderList: OrderItem[]
}

export interface OrderListResult {
	list: OrderItem[]
	total: number
	page: number
	pageSize: number
}
