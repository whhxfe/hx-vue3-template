/**
 * 通知公告管理 Schema 定义
 */
import type { RouteShorthandOptions } from "fastify"

export const getNoticesSchema: RouteShorthandOptions = {
	schema: {
		summary: "获取公告列表",
		tags: ["通知公告"],
		querystring: {
			type: "object",
			properties: {
				page: { type: "integer", default: 1 },
				pageSize: { type: "integer", default: 20 },
				title: { type: "string" },
				type: { type: "string" },
				status: { type: "integer" },
				start_date: { type: "string" },
				end_date: { type: "string" }
			}
		}
	}
}

export const getNoticeDetailSchema: RouteShorthandOptions = {
	schema: {
		summary: "获取公告详情",
		tags: ["通知公告"],
		params: {
			type: "object",
			properties: { id: { type: "integer" } }
		}
	}
}

export const createNoticeSchema: RouteShorthandOptions = {
	schema: {
		summary: "创建公告",
		tags: ["通知公告"],
		body: {
			type: "object",
			required: ["title", "content"],
			properties: {
				title: { type: "string" },
				content: { type: "string" },
				type: { type: "string" },
				priority: { type: "string" },
				status: { type: "integer" },
				publish_at: { type: "string" },
				unpublish_at: { type: "string" },
				author: { type: "string" }
			}
		}
	}
}

export const updateNoticeSchema: RouteShorthandOptions = {
	schema: {
		summary: "更新公告",
		tags: ["通知公告"],
		params: {
			type: "object",
			properties: { id: { type: "integer" } }
		},
		body: {
			type: "object",
			properties: {
				title: { type: "string" },
				content: { type: "string" },
				type: { type: "string" },
				priority: { type: "string" },
				status: { type: "integer" },
				publish_at: { type: "string" },
				unpublish_at: { type: "string" },
				author: { type: "string" },
				is_top: { type: "integer" }
			}
		}
	}
}

export const deleteNoticeSchema: RouteShorthandOptions = {
	schema: {
		summary: "删除公告",
		tags: ["通知公告"],
		params: {
			type: "object",
			properties: { id: { type: "integer" } }
		}
	}
}

export const publishNoticeSchema: RouteShorthandOptions = {
	schema: {
		summary: "发布公告",
		tags: ["通知公告"],
		params: {
			type: "object",
			properties: { id: { type: "integer" } }
		}
	}
}

export const unpublishNoticeSchema: RouteShorthandOptions = {
	schema: {
		summary: "撤回公告",
		tags: ["通知公告"],
		params: {
			type: "object",
			properties: { id: { type: "integer" } }
		}
	}
}

