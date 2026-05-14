export interface OverviewData {
	totalAmount: number
	totalOrders: number
	avgPrice: number
	growth: number
	completionRate: number
}

export interface TrendItem {
	month: string
	value: number
	orderCount: number
}

export interface CategoryItem {
	name: string
	value: number
	percentage: number
}

export interface RegionItem {
	region: string
	value: number
	percentage: number
	trend: number
}

export interface RankItem {
	rank: number
	name: string
	value: number
	trend: number
}

export interface TrendResponse {
	type: string
	data: TrendItem[]
}

export interface CategoryResponse {
	type: string
	data: CategoryItem[]
}

export interface RankResponse {
	type: string
	data: RankItem[]
}
