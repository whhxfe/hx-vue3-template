/**
 * 服务模块（modules）统一注册入口
 * 所有 modules 下的路由模块在此集中注册
 * 采用层级路由：module → submodule → route
 */
import type { FastifyInstance } from "fastify"
import { zddxgkRoutes } from "./zddxgk"
import { templatesRoutes } from "./_templates"
import { pbctRoutes } from "./pbct"

export async function registerModules(app: FastifyInstance, prefix: string) {
	// 第一层：注册各模块（module）
	// prefix 来自 app.ts 传入的 "/wzsys"
	// 最终路径: prefix + "/模块名"
	await app.register(zddxgkRoutes, { prefix: prefix + "/zddxgk" })       // /wzsys/zddxgk/...
	await app.register(templatesRoutes, { prefix: prefix + "/templates" })  // /wzsys/templates/...
	await app.register(pbctRoutes, { prefix: prefix + "/pbct" })           // /wzsys/pbct/...
}