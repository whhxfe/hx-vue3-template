/**
 * tgm/gc/ga 群体档案模块路由
 *
 * 层级路由: /wzsys/ktc/tgm/gc/ga/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success } from "@utils/response"

export const gaRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// 获取列表数据
	app.get("/list", async () => {
		return success([])
	})
}
