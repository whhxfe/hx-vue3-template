import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { rygkRoutes } from "./rygk"

/**
 * 站点信息管理（zddxgk）路由入口
 * 
 * 层级路由: /wzsys/zddxgk/...
 * prefix 已在 modules/index.ts 中指定为 /zddxgk
 * 此时 app.prefix 已经是 /wzsys/zddxgk
 */
export const zddxgkRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// 注册 rygk 子路由
	await app.register(rygkRoutes, { prefix: "/rygk" })
}
