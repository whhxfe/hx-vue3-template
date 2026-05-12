/**
 * 数据字典管理 Schema 定义
 */
import type { RouteShorthandOptions } from "fastify"

// ==================== 字典类型 ====================

export const getDictTypesSchema: RouteShorthandOptions = {
	schema: {
		summary: "获取字典类型列表",
		tags: ["数据字典"],
		querystring: {
			type: "object",
			properties: {
				page: { type: "integer", default: 1 },
				pageSize: { type: "integer", default: 20 },
				type: { type: "string" },
				name: { type: "string" }
			}
		}
	}
}

export const getDictTypesAllSchema: RouteShorthandOptions = {
	schema: {
		summary: "获取所有字典类型（下拉选择用）",
		tags: ["数据字典"]
	}
}

export const createDictTypeSchema: RouteShorthandOptions = {
	schema: {
		summary: "创建字典类型",
		tags: ["数据字典"],
		body: {
			type: "object",
			required: ["type", "name"],
			properties: {
				type: { type: "string" },
				name: { type: "string" },
				description: { type: "string" },
				sort_order: { type: "integer" }
			}
		}
	}
}

export const updateDictTypeSchema: RouteShorthandOptions = {
	schema: {
		summary: "更新字典类型",
		tags: ["数据字典"],
		params: {
			type: "object",
			properties: { id: { type: "integer" } }
		},
		body: {
			type: "object",
			properties: {
				name: { type: "string" },
				description: { type: "string" },
				sort_order: { type: "integer" },
				status: { type: "integer" }
			}
		}
	}
}

export const deleteDictTypeSchema: RouteShorthandOptions = {
	schema: {
		summary: "删除字典类型",
		tags: ["数据字典"],
		params: {
			type: "object",
			properties: { id: { type: "integer" } }
		}
	}
}

// ==================== 字典项 ====================

export const getDictItemsSchema: RouteShorthandOptions = {
	schema: {
		summary: "获取字典项列表",
		tags: ["数据字典"],
		querystring: {
			type: "object",
			properties: {
				page: { type: "integer", default: 1 },
				pageSize: { type: "integer", default: 50 },
				type: { type: "string" },
				label: { type: "string" },
				status: { type: "integer" }
			}
		}
	}
}

export const getDictItemsByTypeSchema: RouteShorthandOptions = {
	schema: {
		summary: "获取指定类型的字典项（下拉选择用）",
		tags: ["数据字典"],
		params: {
			type: "object",
			properties: { type: { type: "string" } }
		}
	}
}

export const createDictItemSchema: RouteShorthandOptions = {
	schema: {
		summary: "创建字典项",
		tags: ["数据字典"],
		body: {
			type: "object",
			required: ["type", "label", "value"],
			properties: {
				type: { type: "string" },
				label: { type: "string" },
				value: { type: "string" },
				sort_order: { type: "integer" },
				status: { type: "integer" },
				remark: { type: "string" }
			}
		}
	}
}

export const updateDictItemSchema: RouteShorthandOptions = {
	schema: {
		summary: "更新字典项",
		tags: ["数据字典"],
		params: {
			type: "object",
			properties: { id: { type: "integer" } }
		},
		body: {
			type: "object",
			properties: {
				label: { type: "string" },
				value: { type: "string" },
				sort_order: { type: "integer" },
				status: { type: "integer" },
				remark: { type: "string" }
			}
		}
	}
}

export const deleteDictItemSchema: RouteShorthandOptions = {
	schema: {
		summary: "删除字典项",
		tags: ["数据字典"],
		params: {
			type: "object",
			properties: { id: { type: "integer" } }
		}
	}
}
