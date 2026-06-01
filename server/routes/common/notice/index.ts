/**
 * 通知公告路由
 * 属于 common 分类：公共接口 + 管理接口
 *
 * 公共接口（无需认证）：
 *   GET /public/notices - 获取已发布的公告列表
 *
 * 管理接口（/admin/notice/...）：
 *   GET    /admin/notice/notices         - 获取公告列表
 *   GET    /admin/notice/notices/:id     - 获取公告详情
 *   POST   /admin/notice/notices         - 创建公告
 *   PUT    /admin/notice/notices/:id     - 更新公告
 *   DELETE /admin/notice/notices/:id     - 删除公告
 *   POST   /admin/notice/notices/:id/publish   - 发布公告
 *   POST   /admin/notice/notices/:id/unpublish - 撤回公告
 */
import type { FastifyInstance, FastifyPluginAsync, FastifyRequest } from "fastify"
import { success, fail, pagedList } from "@utils/response"
import { queryAll, queryOne, queryScalar, runAndSave, parsePagination } from "@utils/db-helper"
import {
	getNoticesSchema,
	getNoticeDetailSchema,
	createNoticeSchema,
	updateNoticeSchema,
	deleteNoticeSchema,
	publishNoticeSchema,
	unpublishNoticeSchema
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

// ==================== 公共接口 ====================

/** 获取已发布的公告列表（前端用户可见） */
async function publicNotices(request: FastifyRequest) {
	const query = request.query as { page?: number; pageSize?: number }
	const page = Number(query.page || 1)
	const pageSize = Number(query.pageSize || 10)
	const offset = (page - 1) * pageSize

	const list = queryAll(
		`SELECT id, title, type, priority, is_top, publish_at, author, views, created_at
		 FROM notices WHERE status = 1
		 ORDER BY is_top DESC, publish_at DESC
		 LIMIT ? OFFSET ?`,
		[pageSize, offset]
	)

	return success(list)
}

// ==================== 管理接口 ====================

async function getNotices(request: FastifyRequest<{ Querystring: NoticeQuery }>) {
	const q = request.query as any
	const { page, pageSize, offset, keyword } = parsePagination(q)
	const type = q.type || q["params[type]"]
	const status = q.status ?? q["params[status]"]

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
}

async function getNoticeDetail(request: FastifyRequest<{ Params: { id: number } }>) {
	const { id } = request.params
	const notice = queryOne("SELECT * FROM notices WHERE id = ?", [id])
	if (!notice) return success(null, "公告不存在")

	runAndSave("UPDATE notices SET views = views + 1 WHERE id = ?", [id])
	notice.views = (notice.views as number || 0) + 1

	return success(notice)
}

async function createNotice(request: FastifyRequest<{ Body: NoticeBody }>) {
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
}

async function updateNotice(request: FastifyRequest<{ Params: { id: number }; Body: Partial<NoticeBody> }>) {
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
}

async function deleteNotice(request: FastifyRequest<{ Params: { id: number } }>) {
	const { id } = request.params
	runAndSave("DELETE FROM notices WHERE id = ?", [id])
	return success(null, "删除成功")
}

async function publishNotice(request: FastifyRequest<{ Params: { id: number } }>) {
	const { id } = request.params
	runAndSave("UPDATE notices SET status = 1, publish_at = datetime('now'), updated_at = datetime('now') WHERE id = ?", [id])
	return success(null, "发布成功")
}

async function unpublishNotice(request: FastifyRequest<{ Params: { id: number } }>) {
	const { id } = request.params
	runAndSave("UPDATE notices SET status = 0, unpublish_at = datetime('now'), updated_at = datetime('now') WHERE id = ?", [id])
	return success(null, "撤回成功")
}

// ==================== 公共接口路由 ====================

export const noticePublicRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	app.get("/notices", publicNotices)
}

// ==================== 管理接口路由 ====================

export const noticeAdminRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	app.get("/notice/notices", getNoticesSchema, getNotices)
	app.get("/notice/notices/:id", getNoticeDetailSchema, getNoticeDetail)
	app.post("/notice/notices", createNoticeSchema, createNotice)
	app.put("/notice/notices/:id", updateNoticeSchema, updateNotice)
	app.delete("/notice/notices/:id", deleteNoticeSchema, deleteNotice)
	app.post("/notice/notices/:id/publish", publishNoticeSchema, publishNotice)
	app.post("/notice/notices/:id/unpublish", unpublishNoticeSchema, unpublishNotice)
}

export default noticeAdminRoutes
