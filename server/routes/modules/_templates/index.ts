/**
 * _templates 模块路由入口
 * 统一导出所有子模块路由
 * 
 * prefix 已在 modules/index.ts 中指定为 /templates
 * 此时 app.prefix 已经是 /wzsys/templates
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { dashboardRoutes } from "./dashboard"
import { screenRoutes } from "./screen"

export const templatesRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// 在此处添加 /dashboard 和 /screen prefix
	await app.register(dashboardRoutes, { prefix: "/dashboard" })
	await app.register(screenRoutes, { prefix: "/screen" })
}
