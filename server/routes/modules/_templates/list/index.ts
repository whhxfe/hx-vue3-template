import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success } from "@utils/response"
import type { ListItem, ListResult } from "./types"

/**
 * List 列表管理路由
 *
 * 层级路由: /wzsys/templates/list/...
 */

// 模拟数据存储
const mockData: ListItem[] = Array.from({ length: 58 }, (_, i) => ({
	id: i + 1,
	name: `用户${String(i + 1).padStart(3, "0")}`,
	phone: `138${String(Math.floor(Math.random() * 1e9)).padStart(8, "0")}`,
	email: `user${String(i + 1).padStart(3, "0")}@example.com`,
	gender: i % 2 === 0 ? "男" : "女",
	status: i % 3 === 0 ? "1" : "0",
	createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleString("zh-CN"),
	description: "这是一条示例描述信息，用于展示表格内容溢出时的 tooltip 效果"
}))

export const listRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// 获取列表数据
	app.get<{ Querystring: { page?: number; pageSize?: number; name?: string; phone?: string; gender?: string; status?: string } }>(
		"/",
		async (request, reply) => {
			const { page = 1, pageSize = 10, name, phone, gender, status } = request.query

			let filteredData = [...mockData]

			if (name) {
				filteredData = filteredData.filter(item => item.name.includes(name))
			}
			if (phone) {
				filteredData = filteredData.filter(item => item.phone.includes(phone))
			}
			if (gender) {
				filteredData = filteredData.filter(item => item.gender === gender)
			}
			if (status) {
				filteredData = filteredData.filter(item => item.status === status)
			}

			const total = filteredData.length
			const startIndex = (page - 1) * pageSize
			const paginatedData = filteredData.slice(startIndex, startIndex + pageSize)

			const result: ListResult = {
				list: paginatedData,
				total,
				page,
				pageSize
			}

			return success(result)
		}
	)

	// 新增数据
	app.post<{ Body: Omit<ListItem, "id" | "createTime"> }>("/add", async (request, reply) => {
		const newItem: ListItem = {
			...request.body,
			id: mockData.length + 1,
			createTime: new Date().toLocaleString("zh-CN")
		}
		mockData.unshift(newItem)
		return success({ message: "新增成功" })
	})

	// 更新数据
	app.post<{ Body: ListItem }>("/update", async (request, reply) => {
		const index = mockData.findIndex(item => item.id === request.body.id)
		if (index !== -1) {
			mockData[index] = { ...mockData[index], ...request.body }
			return success({ message: "更新成功" })
		}
		return success({ state: 4000, message: "数据不存在" })
	})

	// 删除数据
	app.post<{ Body: { id: number } }>("/delete", async (request, reply) => {
		const { id } = request.body
		const index = mockData.findIndex(item => item.id === id)
		if (index !== -1) {
			mockData.splice(index, 1)
			return success({ message: "删除成功" })
		}
		return success({ state: 4000, message: "数据不存在" })
	})
}
