/**
 * pm 人员上图模块路由
 *
 * 统一管理所有人员视图相关接口
 *
 * 层级路由: /wzsys/ktc/tpm/pm/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success, pagedList } from "@utils/response"
import type { ListQuery } from "./types"
import * as service from "./service"

export const pmRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// ========== 字典下拉 ==========

	// 数据来源下拉选项
	app.get("/dict/source", async () => {
		const options = await service.getSourceOptions()
		return success(options)
	})

	// 类别下拉选项
	app.get("/dict/category", async () => {
		const options = await service.getCategoryOptions()
		return success(options)
	})

	// ========== 列表查询 ==========

	// 获取列表数据
	app.post<{ Body: ListQuery }>("/list", async (request) => {
		const { page = 1, pageSize = 10, ...rest } = request.body || {}
		const result = await service.getPersons({ page, pageSize, ...rest })
		return pagedList(result.list, result.total, page, pageSize)
	})
}
