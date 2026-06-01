/**
 * 操作日志审计 Schema 定义
 */
import type { RouteShorthandOptions } from "fastify"

export const getLogsSchema: RouteShorthandOptions = {
	schema: {
		summary: "获取日志列表",
		tags: ["操作日志"],
		querystring: {
			type: "object",
			properties: {
				page: { type: "integer", default: 1 },
				pageSize: { type: "integer", default: 20 },
				username: { type: "string" },
				action: { type: "string" },
				path: { type: "string" },
				start_date: { type: "string" },
				end_date: { type: "string" }
			}
		}
	}
}

export const getLogDetailSchema: RouteShorthandOptions = {
	schema: {
		summary: "获取日志详情",
		tags: ["操作日志"],
		params: {
			type: "object",
			properties: { id: { type: "integer" } }
		}
	}
}

export const getLogStatsSchema: RouteShorthandOptions = {
	schema: {
		summary: "获取日志统计",
		tags: ["操作日志"]
	}
}
