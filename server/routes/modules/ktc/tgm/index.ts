/**
 * tgm 目标群体监测模块路由入口
 *
 * 层级路由: /wzsys/ktc/tgm/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { gcRoutes } from "./gc"
import { gwRoutes } from "./gw"

export const tgmRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	await app.register(gcRoutes, { prefix: "/gc" })
	await app.register(gwRoutes, { prefix: "/gw" })
}
