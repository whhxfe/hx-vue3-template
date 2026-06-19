import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { lspRoutes } from "./lsp"
import { lmcRoutes } from "./lmc"
import { lvsRoutes } from "./lvs"

/**
 * AMC 审计管理中心路由入口
 *
 * prefix 已在 modules/index.ts 中指定为 /amc
 * 此时 app.prefix 已经是 /wzsys/amc
 */
const amcRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	await app.register(lspRoutes, { prefix: "/lsp" })
	await app.register(lmcRoutes, { prefix: "/lmc" })
	// await app.register(lvsRoutes, { prefix: "/lvs" })
	await app.register(lvsRoutes, { prefix: "/lvs" })
}

export default amcRoutes
