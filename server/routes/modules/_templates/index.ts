/**
 * _templates 模块路由入口
 * 统一导出所有子模块路由
 * 
 * 层级路由: /wzsys/templates/...
 * prefix 由 registerModules 传入，Fastify 自动添加到所有路由
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { dashboardRoutes } from "./dashboard"

export const templatesRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// Fastify register 会自动添加 prefix (/wzsys)
	// templates 子模块需要额外添加 /templates 前缀
	// 使用 app.register 嵌套注册，实现: /wzsys/templates/...
	await app.register(async (subApp) => {
		await dashboardRoutes(subApp, "/templates")
	})
}
