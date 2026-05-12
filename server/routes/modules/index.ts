/**
 * 服务模块（modules）统一注册入口
 * 所有 modules 下的路由模块在此集中注册
 * 采用层级路由：module → submodule → route
 */
import type { FastifyInstance } from "fastify"
import { zddxgkRoutes } from "./zddxgk"
import { templatesRoutes } from "./_templates"

export async function registerModules(app: FastifyInstance, prefix: string) {
	// 第一层：注册各模块（module）
	// prefix: /wzsys
	// 子路由路径: /zddxgk/..., /templates/...
	await app.register(zddxgkRoutes, { prefix })    // /wzsys + /zddxgk/...
	await app.register(templatesRoutes, { prefix })  // /wzsys + /templates/...
}