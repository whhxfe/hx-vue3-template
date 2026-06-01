/**
 * 操作日志审计路由
 * 属于 common 分类
 *
 * 管理接口（/admin/syslog/...）：
 *   GET /admin/syslog/logs         - 获取日志列表
 *   GET /admin/syslog/logs/:id     - 获取日志详情
 *   GET /admin/syslog/logs/stats/summary - 获取日志统计
 */
import type { FastifyInstance, FastifyPluginAsync, FastifyRequest } from "fastify"
import { success, pagedList } from "@utils/response"
import { queryAll, queryOne, queryScalar, parsePagination } from "@utils/db-helper"
import { getLogsSchema, getLogDetailSchema, getLogStatsSchema } from "./types"

interface LogQuery {
	page?: number
	pageSize?: number
	username?: string
	action?: string
	path?: string
	start_date?: string
	end_date?: string
}

interface LogParams {
	id: number
}

// ==================== 路由处理函数 ====================

async function getLogs(request: FastifyRequest<{ Querystring: LogQuery }>) {
	const q = request.query as any
	const { page, pageSize, offset, keyword } = parsePagination(q)

	let where = "WHERE 1=1"
	const params: any[] = []
	if (keyword) {
		where += " AND (username LIKE ? OR action LIKE ? OR path LIKE ?)"
		params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
	}

	const total = queryScalar(`SELECT COUNT(*) FROM operation_logs ${where}`, params) as number
	const list = queryAll(
		`SELECT * FROM operation_logs ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
		[...params, pageSize, offset]
	)

	return pagedList(list, total, page, pageSize)
}

async function getLogDetail(request: FastifyRequest<{ Params: LogParams }>) {
	const { id } = request.params
	const log = queryOne("SELECT * FROM operation_logs WHERE id = ?", [id])
	if (!log) return success(null, "日志不存在")
	return success(log)
}

async function getLogStats() {
	const total = queryScalar("SELECT COUNT(*) FROM operation_logs") as number || 0
	const todayTotal = queryScalar("SELECT COUNT(*) FROM operation_logs WHERE DATE(created_at) = DATE('now')") as number || 0

	const weekList = queryAll(`
		SELECT DATE(created_at) as date, COUNT(*) as count
		FROM operation_logs
		WHERE created_at >= DATE('now', '-7 days')
		GROUP BY DATE(created_at)
		ORDER BY date ASC
	`)

	const hotList = queryAll(`
		SELECT action, COUNT(*) as count
		FROM operation_logs
		GROUP BY action
		ORDER BY count DESC
		LIMIT 10
	`)

	return success({
		total,
		todayTotal,
		weekStats: weekList,
		hotActions: hotList
	})
}

// ==================== Routes ====================

export const syslogRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	app.get("/logs", getLogsSchema, getLogs)
	app.get("/logs/:id", getLogDetailSchema, getLogDetail)
	app.get("/logs/stats/summary", getLogStatsSchema, getLogStats)
}

export default syslogRoutes
