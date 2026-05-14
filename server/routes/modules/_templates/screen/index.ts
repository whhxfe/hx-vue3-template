import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success } from "@utils/response"
import type { OverviewData, TrendItem, CategoryItem, RegionItem, RankItem } from "./types"

/**
 * Screen 数据大屏路由
 * 单一职责接口设计
 * 
 * 层级路由: /wzsys/templates/screen/...
 */
export const screenRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	
	// 获取 KPI 概览数据
	app.get("/overview", async (request, reply) => {
		const overviewData: OverviewData = {
			totalAmount: 1234567,
			totalOrders: 856,
			avgPrice: 1442.5,
			growth: 12.5,
			completionRate: 87.3
		}
		return success(overviewData)
	})

	// 获取趋势数据
	app.get<{ Querystring: { type?: string } }>("/trend", async (request, reply) => {
		const { type = "month" } = request.query

		const trendData: TrendItem[] = type === "year"
			? [
				{ month: "2022", value: 980000, orderCount: 620 },
				{ month: "2023", value: 1050000, orderCount: 710 },
				{ month: "2024", value: 1180000, orderCount: 780 },
				{ month: "2025", value: 1234567, orderCount: 856 }
			]
			: [
				{ month: "1月", value: 86000, orderCount: 62 },
				{ month: "2月", value: 92000, orderCount: 68 },
				{ month: "3月", value: 105000, orderCount: 75 },
				{ month: "4月", value: 98000, orderCount: 71 },
				{ month: "5月", value: 112000, orderCount: 82 },
				{ month: "6月", value: 128000, orderCount: 95 },
				{ month: "7月", value: 115000, orderCount: 88 },
				{ month: "8月", value: 122000, orderCount: 91 },
				{ month: "9月", value: 135000, orderCount: 98 },
				{ month: "10月", value: 118000, orderCount: 85 },
				{ month: "11月", value: 142000, orderCount: 105 },
				{ month: "12月", value: 156567, orderCount: 116 }
			]

		return success({
			type,
			data: trendData
		})
	})

	// 获取分类数据
	app.get<{ Querystring: { type?: string } }>("/category", async (request, reply) => {
		const { type = "all" } = request.query

		const categoryData: CategoryItem[] = [
			{ name: "电子产品", value: 420000, percentage: 34.0 },
			{ name: "办公用品", value: 280000, percentage: 22.7 },
			{ name: "生活用品", value: 220000, percentage: 17.8 },
			{ name: "服装鞋帽", value: 180000, percentage: 14.6 },
			{ name: "食品饮料", value: 95000, percentage: 7.7 },
			{ name: "其他", value: 34567, percentage: 2.8 }
		]

		return success({
			type,
			data: categoryData
		})
	})

	// 获取区域分布数据
	app.get("/region", async (request, reply) => {
		const regionData: RegionItem[] = [
			{ region: "华东地区", value: 385000, percentage: 31.2, trend: 15.2 },
			{ region: "华南地区", value: 298000, percentage: 24.1, trend: 12.8 },
			{ region: "华北地区", value: 245000, percentage: 19.8, trend: 8.5 },
			{ region: "西南地区", value: 156000, percentage: 12.6, trend: 18.3 },
			{ region: "华中地区", value: 98000, percentage: 7.9, trend: 6.2 },
			{ region: "西北地区", value: 35000, percentage: 2.8, trend: -2.1 },
			{ region: "东北地区", value: 18567, percentage: 1.5, trend: -5.3 }
		]

		return success(regionData)
	})

	// 获取排名数据
	app.get<{ Querystring: { type?: string } }>("/rank", async (request, reply) => {
		const { type = "top" } = request.query

		const rankData: RankItem[] = type === "bottom"
			? [
				{ rank: 1, name: "东北地区", value: 18567, trend: -5.3 },
				{ rank: 2, name: "西北地区", value: 35000, trend: -2.1 },
				{ rank: 3, name: "华中地区", value: 98000, trend: 6.2 },
				{ rank: 4, name: "西南地区", value: 156000, trend: 18.3 },
				{ rank: 5, name: "华北地区", value: 245000, trend: 8.5 }
			]
			: [
				{ rank: 1, name: "华东地区", value: 385000, trend: 15.2 },
				{ rank: 2, name: "华南地区", value: 298000, trend: 12.8 },
				{ rank: 3, name: "华北地区", value: 245000, trend: 8.5 },
				{ rank: 4, name: "西南地区", value: 156000, trend: 18.3 },
				{ rank: 5, name: "华中地区", value: 98000, trend: 6.2 }
			]

		return success({
			type,
			data: rankData
		})
	})
}
