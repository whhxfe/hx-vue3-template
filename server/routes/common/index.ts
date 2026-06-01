/**
 * 公共功能（common）统一注册入口
 * 所有 public 和 admin 下的公共功能模块在此集中注册
 * 采用模块化风格：上层拼接完整 prefix，下层使用相对路径
 * 分类说明：
 *   - dict: 公共字典接口
 *   - notice: 通知公告（公共接口 + 管理接口）
 *   - syslog: 操作日志审计（管理接口）
 */
import type { FastifyInstance } from "fastify"
import { dictRoutes } from "./dict"
import { noticePublicRoutes, noticeAdminRoutes } from "./notice"
import { syslogRoutes } from "./syslog"

export async function registerCommon(app: FastifyInstance, prefix: string) {
	// 字典管理（公共接口）
	// prefix: /wzsys/public/dict → 子路由使用 /types, /items
	await app.register(dictRoutes, { prefix: prefix + "/public/dict" }) // /wzsys/public/dict/types/...

	// 通知公告 - 公共接口
	// prefix: /wzsys/public → 内部 app.get("/notices", ...) → /wzsys/public/notices
	await app.register(noticePublicRoutes, { prefix: prefix + "/public" })

	// 通知公告 - 管理接口
	// prefix: /wzsys/admin → 内部 app.get("/notice/notices", ...) → /wzsys/admin/notice/notices
	await app.register(noticeAdminRoutes, { prefix: prefix + "/admin" })

	// 操作日志审计（管理接口）
	// prefix: /wzsys/admin/syslog → 内部 app.get("/logs", ...) → /wzsys/admin/syslog/logs
	await app.register(syslogRoutes, { prefix: prefix + "/admin/syslog" })
}
