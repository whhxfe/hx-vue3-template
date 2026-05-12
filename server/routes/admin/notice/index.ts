/**
 * 通知公告管理路由实现
 * 路径前缀由 registerAdmin 自动添加: /wzsys/admin/notice/...
 */
import type { FastifyInstance, FastifyPluginAsync, FastifyRequest } from "fastify"
import { getDb, saveDatabase } from "@db/db"
import { success, fail, pagedList } from "@utils/response"
import {
	getNoticesSchema,
	getNoticeDetailSchema,
	createNoticeSchema,
	updateNoticeSchema,
	deleteNoticeSchema,
	publishNoticeSchema,
	unpublishNoticeSchema,
	getPublicNoticesSchema
} from "./types"

interface NoticeQuery {
	page?: number
	pageSize?: number
	title?: string
	type?: string
	status?: number
	start_date?: string
	end_date?: string
}

interface NoticeBody {
	title: string
	content: string
	type?: string
	priority?: string
	status?: number
	publish_at?: string
	unpublish_at?: string
	author?: string
	is_top?: number
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

function runAndSave(sql: string, params: any[] = []) {
	const db = getDb()
	db.run(sql, params)
	saveDatabase()
}

// ==================== Routes ====================

export const noticeRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	/** 获取公告列表 */
	app.get("/admin/notice/notices", getNoticesSchema, async (request: FastifyRequest<{ Querystring: NoticeQuery }>) => {
		const q = request.query as any
		const page = Number(q["params[page]"] || q.page || 1)
		const pageSize = Number(q["params[pageSize]"] || q.pageSize || 20)
		const keyword = q.keyword || q["params[keyword]"]
		const type = q.type || q["params[type]"]
		const status = q.status ?? q["params[status]"]
		const offset = (page - 1) * pageSize

		let where = "WHERE 1=1"
		const params: any[] = []
		if (keyword) {
			where += " AND title LIKE ?"
			params.push(`%${keyword}%`)
		}
		if (type) {
			where += " AND type = ?"
			params.push(type)
		}
		if (status !== undefined && status !== "") {
			where += " AND status = ?"
			params.push(status)
		}

		const total = queryScalar(`SELECT COUNT(*) FROM notices ${where}`, params) as number
		const list = queryAll(
			`SELECT * FROM notices ${where} ORDER BY is_top DESC, created_at DESC LIMIT ? OFFSET ?`,
			[...params, pageSize, offset]
		)

		return pagedList(list, total, page, pageSize)
	})

	/** 获取公告详情 */
	app.get("/admin/notice/notices/:id", getNoticeDetailSchema, async (request: FastifyRequest<{ Params: { id: number } }>) => {
		const { id } = request.params
		const notice = queryOne("SELECT * FROM notices WHERE id = ?", [id])
		if (!notice) return success(null, "公告不存在")

		// 增加浏览次数
		runAndSave("UPDATE notices SET views = views + 1 WHERE id = ?", [id])
		notice.views = (notice.views as number || 0) + 1

		return success(notice)
	})

	/** 创建公告 */
	app.post("/admin/notice/notices", createNoticeSchema, async (request: FastifyRequest<{ Body: NoticeBody }>) => {
		const { title, content, type = 'info', priority = 'normal', status = 0, publish_at, unpublish_at, author = '管理员' } = request.body

		if (!title || !content) {
			return fail("标题和内容不能为空")
		}

		runAndSave(
			`INSERT INTO notices (title, content, type, priority, status, publish_at, unpublish_at, author)
			 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			[title, content, type, priority, status, publish_at || null, unpublish_at || null, author]
		)
		return success({ title }, "创建成功")
	})

	/** 更新公告 */
	app.put("/admin/notice/notices/:id", updateNoticeSchema, async (request: FastifyRequest<{ Params: { id: number }; Body: Partial<NoticeBody> }>) => {
		const { id } = request.params
		const body = request.body
		const fields: string[] = []
		const values: any[] = []

		if (body.title !== undefined) {
			fields.push("title = ?")
			values.push(body.title)
		}
		if (body.content !== undefined) {
			fields.push("content = ?")
			values.push(body.content)
		}
		if (body.type !== undefined) {
			fields.push("type = ?")
			values.push(body.type)
		}
		if (body.priority !== undefined) {
			fields.push("priority = ?")
			values.push(body.priority)
		}
		if (body.status !== undefined) {
			fields.push("status = ?")
			values.push(body.status)
		}
		if (body.publish_at !== undefined) {
			fields.push("publish_at = ?")
			values.push(body.publish_at)
		}
		if (body.unpublish_at !== undefined) {
			fields.push("unpublish_at = ?")
			values.push(body.unpublish_at)
		}
		if (body.author !== undefined) {
			fields.push("author = ?")
			values.push(body.author)
		}
		if (body.is_top !== undefined) {
			fields.push("is_top = ?")
			values.push(body.is_top)
		}

		if (fields.length === 0) return fail("没有要更新的字段")

		fields.push("updated_at = datetime('now')")
		values.push(id)
		runAndSave(`UPDATE notices SET ${fields.join(", ")} WHERE id = ?`, values)
		return success(null, "更新成功")
	})

	/** 删除公告 */
	app.delete("/admin/notice/notices/:id", deleteNoticeSchema, async (request: FastifyRequest<{ Params: { id: number } }>) => {
		const { id } = request.params
		runAndSave("DELETE FROM notices WHERE id = ?", [id])
		return success(null, "删除成功")
	})

	/** 发布公告 */
	app.post("/admin/notice/notices/:id/publish", publishNoticeSchema, async (request: FastifyRequest<{ Params: { id: number } }>) => {
		const { id } = request.params
		runAndSave("UPDATE notices SET status = 1, publish_at = datetime('now'), updated_at = datetime('now') WHERE id = ?", [id])
		return success(null, "发布成功")
	})

	/** 撤回公告 */
	app.post("/admin/notice/notices/:id/unpublish", unpublishNoticeSchema, async (request: FastifyRequest<{ Params: { id: number } }>) => {
		const { id } = request.params
		runAndSave("UPDATE notices SET status = 0, unpublish_at = datetime('now'), updated_at = datetime('now') WHERE id = ?", [id])
		return success(null, "撤回成功")
	})

	/** 获取已发布的公告列表（前端用户可见） */
	app.get("/public/notices", getPublicNoticesSchema, async (request: FastifyRequest<{ Querystring: { page?: number; pageSize?: number } }>) => {
		const q = request.query as any
		const page = Number(q.page || 1)
		const pageSize = Number(q.pageSize || 10)
		const offset = (page - 1) * pageSize

		const list = queryAll(
			`SELECT id, title, type, priority, is_top, publish_at, author, views, created_at
			 FROM notices WHERE status = 1
			 ORDER BY is_top DESC, publish_at DESC
			 LIMIT ? OFFSET ?`,
			[pageSize, offset]
		)

		return success(list)
	})
}

export default noticeRoutes
