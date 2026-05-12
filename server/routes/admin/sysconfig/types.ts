/**
 * 系统配置管理 Schema 定义
 */
import type { RouteShorthandOptions } from "fastify"

export const getConfigsSchema: RouteShorthandOptions = {
	schema: {
		summary: "获取配置列表",
		tags: ["系统配置"],
		querystring: {
			type: "object",
			properties: {
				page: { type: "integer", default: 1 },
				pageSize: { type: "integer", default: 20 },
				key: { type: "string" }
			}
		}
	}
}

export const getConfigDetailSchema: RouteShorthandOptions = {
	schema: {
		summary: "获取单个配置",
		tags: ["系统配置"],
		params: {
			type: "object",
			properties: { key: { type: "string" } }
		}
	}
}

export const updateConfigSchema: RouteShorthandOptions = {
	schema: {
		summary: "更新单个配置",
		tags: ["系统配置"],
		params: {
			type: "object",
			properties: { key: { type: "string" } }
		},
		body: {
			type: "object",
			required: ["value"],
			properties: {
				value: { type: "string" }
			}
		}
	}
}

export const batchUpdateConfigsSchema: RouteShorthandOptions = {
	schema: {
		summary: "批量更新配置",
		tags: ["系统配置"],
		body: {
			type: "array",
			items: {
				type: "object",
				required: ["key", "value"],
				properties: {
					key: { type: "string" },
					value: { type: "string" }
				}
			}
		}
	}
}

export const getEnabledConfigsSchema: RouteShorthandOptions = {
	schema: {
		summary: "获取所有启用的配置",
		tags: ["系统配置"]
	}
}
