/**
 * 服务模块（modules）统一注册入口
 * 所有 modules 下的路由模块在此集中注册
 */
import type { FastifyInstance } from "fastify"
import { ucenterRoutes } from "./ucenter"

/**
 * 注册所有 modules 路由
 * @param app Fastify 实例
 * @param prefix 路由前缀
 */
export async function registerModules(app: FastifyInstance, prefix: string = "/wzsys") {
	await app.register(ucenterRoutes, { prefix })
	// 后续新增 module 在此注册，如：
	// await app.register(zddxgkRoutes, { prefix })
}