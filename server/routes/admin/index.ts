/**
 * 管理后台（admin）统一注册入口
 * 所有 admin 下的路由模块在此集中注册
 * 层级路由：admin → submodule → route
 * 注：notice（通知公告）和 syslog（操作日志）已迁移至 common 目录
 */
import type { FastifyInstance } from "fastify"
import { ucenterRoutes } from "./ucenter"
import { sysconfigRoutes } from "./sysconfig"

export async function registerAdmin(app: FastifyInstance, prefix: string) {
	// 第一层：注册各子模块（submodule），传入完整子路径 prefix
	// 子路由内部只使用相对路径
	await app.register(ucenterRoutes, { prefix: prefix + "/admin/ucenter" }) // /wzsys/admin/ucenter/...
	await app.register(sysconfigRoutes, { prefix: prefix + "/admin/sysconfig" }) // /wzsys/admin/sysconfig/...
}
