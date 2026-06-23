/**
 * tgm/gc/pmg 人员管理模块路由
 *
 * 层级路由: /wzsys/ktc/tgm/gc/pmg/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success } from "@utils/response"

export const pmgRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// 获取列表数据
	app.get("/list", async () => {
		return success([])
	})
}
