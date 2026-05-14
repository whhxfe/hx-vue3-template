interface OverviewData {
	totalAmount: number
	totalOrders: number
	avgPrice: number
	growth: number
	completionRate: number
}

interface TrendItem {
	month: string
	value: number
	orderCount: number
}

interface CategoryItem {
	name: string
	value: number
	percentage: number
}

interface RegionItem {
	region: string
	value: number
	percentage: number
	trend: number
}

interface RankItem {
	rank: number
	name: string
	value: number
	trend: number
}

export type { OverviewData, TrendItem, CategoryItem, RegionItem, RankItem }
