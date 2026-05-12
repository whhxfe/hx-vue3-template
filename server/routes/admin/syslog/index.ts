/**
 * 操作日志审计路由实现
 * 路径前缀由 registerAdmin 自动添加: /wzsys/admin/syslog/...
 */
import type { FastifyInstance, FastifyPluginAsync, FastifyRequest } from "fastify"
import { getDb } from "@db/db"
import { success, pagedList } from "@utils/response"
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

function queryAll(sql: string, params: any[] = []): Record<string, any>[] {
	const db = getDb()
	const stmt = db.prepare(sql)
	stmt.bind(params)
	const rows: Record<string, any>[] = []
	while (stmt.step()) {
		rows.push(stmt.getAsObject())
	}
	stmt.free()
	return rows
}

function queryOne(sql: string, params: any[] = []): Record<string, any> | undefined {
	return queryAll(sql, params)[0]
}

function queryScalar(sql: string, params: any[] = []): any {
	const db = getDb()
	const stmt = db.prepare(sql)
	stmt.bind(params)
	let result: any = undefined
	if (stmt.step()) {
		const row = stmt.getAsObject()
		result = Object.values(row)[0]
	}
	stmt.free()
	return result
}

// ==================== Routes ====================

export const syslogRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	/** 获取日志列表 */
	app.get("/admin/syslog/logs", getLogsSchema, async (request: FastifyRequest<{ Querystring: LogQuery }>) => {
		const q = request.query as any
		const page = Number(q["params[page]"] || q.page || 1)
		const pageSize = Number(q["params[pageSize]"] || q.pageSize || 20)
		const keyword = q.keyword || q["params[keyword]"]
		const offset = (page - 1) * pageSize

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
	})

	/** 获取日志详情 */
	app.get("/admin/syslog/logs/:id", getLogDetailSchema, async (request: FastifyRequest<{ Params: LogParams }>) => {
		const { id } = request.params
		const log = queryOne("SELECT * FROM operation_logs WHERE id = ?", [id])
		if (!log) return success(null, "日志不存在")
		return success(log)
	})

	/** 获取日志统计 */
	app.get("/admin/syslog/logs/stats/summary", getLogStatsSchema, async () => {
		// 总日志数
		const total = queryScalar("SELECT COUNT(*) FROM operation_logs") as number || 0

		// 今日日志数
		const todayTotal = queryScalar("SELECT COUNT(*) FROM operation_logs WHERE DATE(created_at) = DATE('now')") as number || 0

		// 近7天每日统计
		const weekList = queryAll(`
			SELECT DATE(created_at) as date, COUNT(*) as count
			FROM operation_logs
			WHERE created_at >= DATE('now', '-7 days')
			GROUP BY DATE(created_at)
			ORDER BY date ASC
		`)

		// 热门操作
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
	})
}

export default syslogRoutes
