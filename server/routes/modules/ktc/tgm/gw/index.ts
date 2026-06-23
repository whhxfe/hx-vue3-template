/**
 * tgm/gw 群体预警模块路由
 *
 * 层级路由: /wzsys/ktc/tgm/gw/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success } from "@utils/response"

export const gwRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// 获取列表数据
	app.get("/list", async () => {
		return success([])
	})
}
