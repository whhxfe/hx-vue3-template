/**
 * tum/um 单元上图模块路由
 *
 * 层级路由: /wzsys/ktc/tum/um/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { pagedList } from "@utils/response"
import { getUnits } from "./service"
import type { ListQuery } from "./types"

export const umRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// 获取列表数据
	app.post<{ Body: ListQuery }>("/list", async (request) => {
		const query = request.body || {}
		const result = await getUnits(query)
		return pagedList(result.list, result.total, query.page || 1, query.pageSize || 10)
	})
}