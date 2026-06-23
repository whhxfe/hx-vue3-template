/**
 * tgm/gc 群体管控模块路由入口
 *
 * 层级路由: /wzsys/ktc/tgm/gc/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { pmgRoutes } from "./pmg"
import { gmRoutes } from "./gm"
import { sgmRoutes } from "./sgm"
import { gaRoutes } from "./ga"

export const gcRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	await app.register(pmgRoutes, { prefix: "/pmg" })
	await app.register(gmRoutes, { prefix: "/gm" })
	await app.register(sgmRoutes, { prefix: "/sgm" })
	await app.register(gaRoutes, { prefix: "/ga" })
}
