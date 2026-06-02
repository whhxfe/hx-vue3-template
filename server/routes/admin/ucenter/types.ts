/**
 * 用户中心（ucenter）路由 Schema 定义
 * 与路由实现分离，便于类型复用和维护
 */
import type { RouteShorthandOptions } from "fastify"

// ==================== 角色 CRUD ====================

export const getRolesSchema: RouteShorthandOptions = {
	schema: {
		summary: "获取角色列表",
		tags: ["用户中心"],
		querystring: {
			type: "object",
			properties: {
				page: { type: "integer", default: 1 },
				pageSize: { type: "integer", default: 100 },
				keyword: { type: "string" }
			}
		}
	}
}

export const getRoleDetailSchema: RouteShorthandOptions = {
	schema: {
		summary: "获取角色详情",
		tags: ["用户中心"],
		params: {
			type: "object",
			properties: { id: { type: "integer" } }
		}
	}
}

export const createRoleSchema: RouteShorthandOptions = {
	schema: {
		summary: "创建角色",
		tags: ["用户中心"],
		body: {
			type: "object",
			required: ["name", "code"],
			properties: {
				name: { type: "string" },
				code: { type: "string" },
				description: { type: "string" },
				sort_order: { type: "integer" }
			}
		}
	}
}

export const updateRoleSchema: RouteShorthandOptions = {
	schema: {
		summary: "更新角色",
		tags: ["用户中心"],
		params: {
			type: "object",
			properties: { id: { type: "integer" } }
		},
		body: {
			type: "object",
			properties: {
				name: { type: "string" },
				code: { type: "string" },
				description: { type: "string" },
				sort_order: { type: "integer" },
				status: { type: "integer" }
			}
		}
	}
}

export const deleteRoleSchema: RouteShorthandOptions = {
	schema: {
		summary: "删除角色",
		tags: ["用户中心"],
		params: {
			type: "object",
			properties: { id: { type: "integer" } }
		}
	}
}

// ==================== 权限分配 (角色-模块关联) ====================

export const getRoleMenusSchema: RouteShorthandOptions = {
	schema: {
		summary: "获取角色已分配的模块权限",
		tags: ["用户中心"],
		params: {
			type: "object",
			properties: { id: { type: "integer" } }
		}
	}
}

export const assignRoleMenusSchema: RouteShorthandOptions = {
	schema: {
		summary: "给角色分配模块权限（全量覆盖）",
		tags: ["用户中心"],
		params: {
			type: "object",
			properties: { id: { type: "integer" } }
		},
		body: {
			type: "object",
			required: ["moduleKeys"],
			properties: {
				moduleKeys: {
					type: "array",
					items: { type: "string" },
					description: "模块 key 列表"
				}
			}
		}
	}
}

// ==================== 可用模块列表 ====================

export const getModulesSchema: RouteShorthandOptions = {
	schema: {
		summary: "获取系统所有可用模块列表",
		tags: ["用户中心"]
	}
}

// ==================== 账号 CRUD ====================

export const getAccountsSchema: RouteShorthandOptions = {
	schema: {
		summary: "获取账号列表",
		tags: ["用户中心"],
		querystring: {
			type: "object",
			properties: {
				page: { type: "integer", default: 1 },
				pageSize: { type: "integer", default: 10 },
				keyword: { type: "string" },
				status: { type: "integer" },
				role_id: { type: "integer" }
			}
		}
	}
}

export const getAccountDetailSchema: RouteShorthandOptions = {
	schema: {
		summary: "获取账号详情",
		tags: ["用户中心"],
		params: {
			type: "object",
			properties: { id: { type: "integer" } }
		}
	}
}

export const createAccountSchema: RouteShorthandOptions = {
	schema: {
		summary: "创建账号",
		tags: ["用户中心"],
		body: {
			type: "object",
			required: ["username", "password"],
			properties: {
				username: { type: "string" },
				password: { type: "string" },
				display_name: { type: "string" },
				email: { type: "string" },
				phone: { type: "string" },
				status: { type: "integer", default: 1 },
				role_id: { type: "integer" }
			}
		}
	}
}

export const updateAccountSchema: RouteShorthandOptions = {
	schema: {
		summary: "更新账号",
		tags: ["用户中心"],
		params: {
			type: "object",
			properties: { id: { type: "integer" } }
		},
		body: {
			type: "object",
			properties: {
				display_name: { type: "string" },
				email: { type: "string" },
				phone: { type: "string" },
				password: { type: "string" },
				status: { type: "integer" },
				role_id: { type: "integer" }
			}
		}
	}
}

export const deleteAccountSchema: RouteShorthandOptions = {
	schema: {
		summary: "删除账号",
		tags: ["用户中心"],
		params: {
			type: "object",
			properties: { id: { type: "integer" } }
		}
	}
}
