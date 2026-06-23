/**
 * tum/uc 单元管控模块路由入口
 *
 * 层级路由: /wzsys/ktc/tum/uc/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { uaRoutes } from "./ua"

export const ucRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	await app.register(uaRoutes, { prefix: "/ua" })
}
