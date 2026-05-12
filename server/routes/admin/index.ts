/**
 * 管理后台（admin）统一注册入口
 * 所有 admin 下的路由模块在此集中注册
 * 层级路由：admin → submodule → route
 */
import type { FastifyInstance } from "fastify"
import { ucenterRoutes } from "./ucenter"
import { sysconfigRoutes } from "./sysconfig"
import { syslogRoutes } from "./syslog"
import { dictRoutes } from "./dict"
import { noticeRoutes } from "./notice"

export async function registerAdmin(app: FastifyInstance, prefix: string) {
	// 第一层：注册各子模块（submodule）
	// prefix: /wzsys
	// 子路由路径: /admin/ucenter/...
	await app.register(ucenterRoutes, { prefix }) // /wzsys + /admin/ucenter/...
	await app.register(sysconfigRoutes, { prefix }) // /wzsys + /admin/sysconfig/...
	await app.register(syslogRoutes, { prefix }) // /wzsys + /admin/syslog/...
	await app.register(dictRoutes, { prefix }) // /wzsys + /admin/dict/...
	await app.register(noticeRoutes, { prefix }) // /wzsys + /admin/notice/...
}
