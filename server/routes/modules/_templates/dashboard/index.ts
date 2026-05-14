import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success } from "@utils/response"
import type { StatItem, ChartData, PieItem, OrderItem } from "./types"

/**
 * Dashboard 仪表盘路由
 * 
 * 层级路由: /wzsys/templates/dashboard/...
 */
export const dashboardRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// 获取统计数据
	app.get("/stats", async (request, reply) => {
		const stats: StatItem[] = [
			{
				title: "总销售额",
				value: "¥128,560",
				icon: "Money",
				color: "#409eff",
				trend: 12.5
			},
			{
				title: "订单总数",
				value: "3,842",
				icon: "ShoppingCart",
				color: "#67c23a",
				trend: 8.2
			},
			{
				title: "商品总量",
				value: "12,847",
				icon: "Goods",
				color: "#e6a23c",
				trend: -3.1
			},
			{
				title: "活跃用户",
				value: "8,426",
				icon: "User",
				color: "#f56c6c",
				trend: 15.8
			}
		]
		return success(stats)
	})

	// 获取月度销售数据
	app.get<{ Querystring: { period?: string } }>("/monthly-sales", async (request, reply) => {
		const { period = "month" } = request.query

		const monthlySales: ChartData[] = [
			{ month: "1月", value: 23000 },
			{ month: "2月", value: 28000 },
			{ month: "3月", value: 32000 },
			{ month: "4月", value: 18000 },
			{ month: "5月", value: 42000 },
			{ month: "6月", value: 55000 },
			{ month: "7月", value: 48000 },
			{ month: "8月", value: 52000 },
			{ month: "9月", value: 61000 },
			{ month: "10月", value: 45000 },
			{ month: "11月", value: 38000 },
			{ month: "12月", value: 65000 }
		]

		return success(monthlySales)
	})

	// 获取饼图数据
	app.get<{ Querystring: { type?: string } }>("/pie-data", async (request, reply) => {
		const { type = "all" } = request.query

		const pieData: PieItem[] = [
			{ name: "电子产品", value: 45000, color: "#409eff" },
			{ name: "办公用品", value: 28000, color: "#67c23a" },
			{ name: "生活用品", value: 22000, color: "#e6a23c" },
			{ name: "其他", value: 15000, color: "#909399" }
		]

		return success(pieData)
	})

	// 获取年度趋势数据
	app.get<{ Querystring: { year?: string } }>("/sales-trend", async (request, reply) => {
		const { year = new Date().getFullYear().toString() } = request.query

		const salesTrend: ChartData[] = [
			{ month: "1月", value: 23000 },
			{ month: "2月", value: 28000 },
			{ month: "3月", value: 32000 },
			{ month: "4月", value: 18000 },
			{ month: "5月", value: 42000 },
			{ month: "6月", value: 55000 },
			{ month: "7月", value: 48000 },
			{ month: "8月", value: 52000 },
			{ month: "9月", value: 61000 },
			{ month: "10月", value: 45000 },
			{ month: "11月", value: 38000 },
			{ month: "12月", value: 65000 }
		]

		return success(salesTrend)
	})

	// 获取订单列表
	app.get<{ Querystring: { page?: number; pageSize?: number } }>("/orders", async (request, reply) => {
		const { page = 1, pageSize = 10 } = request.query

		const orderList: OrderItem[] = [
			{
				orderNo: "ORD20240512001",
				product: "MacBook Pro 14寸 M3 Pro 芯片",
				amount: 19999.0,
				status: "pending",
				createTime: "2024-05-12 10:30:25"
			},
			{
				orderNo: "ORD20240512002",
				product: "iPhone 15 Pro Max 256GB",
				amount: 9999.0,
				status: "processing",
				createTime: "2024-05-12 09:15:42"
			},
			{
				orderNo: "ORD20240511003",
				product: "Sony WH-1000XM5 降噪耳机",
				amount: 2699.0,
				status: "completed",
				createTime: "2024-05-11 16:42:18"
			},
			{
				orderNo: "ORD20240511004",
				product: "机械键盘 Keychron K8 Pro",
				amount: 698.0,
				status: "completed",
				createTime: "2024-05-11 14:28:33"
			},
			{
				orderNo: "ORD20240510005",
				product: "Dell UltraSharp 27寸 4K 显示器",
				amount: 4599.0,
				status: "cancelled",
				createTime: "2024-05-10 11:05:09"
			}
		]

		const startIndex = (page - 1) * pageSize
		const paginatedData = orderList.slice(startIndex, startIndex + pageSize)

		return success({
			list: paginatedData,
			total: orderList.length,
			page,
			pageSize
		})
	})
}
