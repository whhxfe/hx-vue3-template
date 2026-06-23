/**
 * tum/uc/ua 单元档案模块路由
 *
 * 层级路由: /wzsys/ktc/tum/uc/ua/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success } from "@utils/response"

export const uaRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// 获取列表数据
	app.get("/list", async () => {
		return success([])
	})
}
