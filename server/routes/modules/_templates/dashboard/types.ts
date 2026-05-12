interface StatItem {
	title: string
	value: string | number
	icon: string
	color: string
	trend: number
}

interface ChartData {
	month: string
	value: number
}

interface PieItem {
	name: string
	value: number
	color: string
}

interface OrderItem {
	orderNo: string
	product: string
	amount: number
	status: "pending" | "processing" | "completed" | "cancelled"
	createTime: string
}

interface OrderListResult {
	list: OrderItem[]
	total: number
	page: number
	pageSize: number
}

export type { StatItem, ChartData, PieItem, OrderItem, OrderListResult }
