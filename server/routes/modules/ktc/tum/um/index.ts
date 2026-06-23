/**
 * tum/um 单元上图模块路由
 *
 * 层级路由: /wzsys/ktc/tum/um/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success } from "@utils/response"

export const umRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// 获取列表数据
	app.get("/list", async () => {
		return success([])
	})
}
