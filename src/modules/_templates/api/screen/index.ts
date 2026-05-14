import request from '@/api/request'
import type {
	OverviewData,
	TrendItem,
	CategoryItem,
	RegionItem,
	RankItem,
	TrendResponse,
	CategoryResponse,
	RankResponse
} from './types'

export type { OverviewData, TrendItem, CategoryItem, RegionItem, RankItem }

/**
 * Screen 数据大屏 API
 * 单一职责接口设计
 */
export const screen = {
	// 获取 KPI 概览数据
	getOverview() {
		return request.get<{ state: number; message: string; data: OverviewData }>('/templates/screen/overview')
	},

	// 获取趋势数据
	getTrend(type: 'month' | 'year' = 'month') {
		return request.get<{ state: number; message: string; data: TrendResponse }>('/templates/screen/trend', {
			params: { type }
		})
	},

	// 获取分类数据
	getCategory(type: string = 'all') {
		return request.get<{ state: number; message: string; data: CategoryResponse }>('/templates/screen/category', {
			params: { type }
		})
	},

	// 获取区域分布数据
	getRegion() {
		return request.get<{ state: number; message: string; data: RegionItem[] }>('/templates/screen/region')
	},

	// 获取排名数据
	getRank(type: 'top' | 'bottom' = 'top') {
		return request.get<{ state: number; message: string; data: RankResponse }>('/templates/screen/rank', {
			params: { type }
		})
	}
}
