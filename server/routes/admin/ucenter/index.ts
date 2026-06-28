/**
 * 用户中心（ucenter）路由实现
 * 账号管理、角色管理、权限分配 CRUD
 * 
 * 层级路由: /wzsys/admin/ucenter/...
 * prefix 由 registerAdmin 传入，Fastify 自动添加到所有路由
 */
import type { FastifyInstance, FastifyPluginAsync, FastifyRequest } from "fastify"
import { success, fail, pagedList } from "@utils/response"
import { queryAll, queryOne, queryScalar, runAndSave, runBatch, lastInsertId, parsePagination } from "@utils/db-helper"
import {
	getRolesSchema,
	getRoleDetailSchema,
	createRoleSchema,
	updateRoleSchema,
	deleteRoleSchema,
	getRoleMenusSchema,
	assignRoleMenusSchema,
	getModulesSchema,
	getAccountsSchema,
	getAccountDetailSchema,
	createAccountSchema,
	updateAccountSchema,
	deleteAccountSchema
} from "./types"

// ==================== Routes ====================

export const ucenterRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// Fastify register 会自动添加 prefix (/wzsys/admin/ucenter)
	// 所以路由路径只需要定义当前层级: /...

	// ---------- 角色 CRUD ----------

	app.get("/roles", getRolesSchema, async (request: FastifyRequest) => {
		const q = request.query as any
		const { page, pageSize, offset, keyword } = parsePagination(q)
		let where = "WHERE 1=1"
		const params: any[] = []
		if (keyword) {
			where += " AND (name LIKE ? OR code LIKE ?)"
			params.push(`%${keyword}%`, `%${keyword}%`)
		}
		const total = queryScalar(`SELECT COUNT(*) FROM roles ${where}`, params) as number
		const list = queryAll(`SELECT * FROM roles ${where} ORDER BY sort_order ASC, id ASC LIMIT ? OFFSET ?`, [...params, pageSize, offset])
		// 补充每个角色的账号数量
		for (const role of list) {
			role.account_count = queryScalar("SELECT COUNT(*) FROM accounts WHERE role_id = ?", [role.id])
		}
		return pagedList(list, total, page, pageSize)
	})

	app.get("/roles/:id", getRoleDetailSchema, async (request: FastifyRequest) => {
		const { id } = request.params as { id: number }
		const role = queryOne("SELECT * FROM roles WHERE id = ?", [id])
		if (!role) return fail("角色不存在")
		return success(role)
	})

	app.post("/roles", createRoleSchema, async (request: FastifyRequest) => {
		const { name, code, description, sort_order } = request.body as any
		try {
			runAndSave(
				"INSERT INTO roles (name, code, description, sort_order) VALUES (?, ?, ?, ?)",
				[name, code, description || "", sort_order ?? 0]
			)
			return success({ id: lastInsertId() }, "创建成功")
		} catch (err: any) {
			if (String(err).includes("UNIQUE")) return fail("角色名称或编码已存在")
			return fail("创建失败")
		}
	})

	app.put("/roles/:id", updateRoleSchema, async (request: FastifyRequest) => {
		const { id } = request.params as { id: number }
		const body = request.body as any
		const fields: string[] = []
		const values: any[] = []
		for (const [key, val] of Object.entries(body)) {
			if (["name", "code", "description", "sort_order", "status"].includes(key)) {
				fields.push(`${key} = ?`)
				values.push(val)
			}
		}
		if (fields.length === 0) return fail("无更新字段")
		values.push(id)
		try {
			runAndSave(`UPDATE roles SET ${fields.join(", ")} WHERE id = ?`, values)
			return success(null, "更新成功")
		} catch (err: any) {
			if (String(err).includes("UNIQUE")) return fail("角色名称或编码已存在")
			return fail("更新失败")
		}
	})

	app.delete("/roles/:id", deleteRoleSchema, async (request: FastifyRequest) => {
		const { id } = request.params as { id: number }
		// 检查是否有账号关联
		const count = queryScalar("SELECT COUNT(*) FROM accounts WHERE role_id = ?", [id]) as number
		if (count > 0) return fail(`该角色下还有 ${count} 个账号，无法删除`)
		runBatch([
			{ sql: "DELETE FROM role_menus WHERE role_id = ?", params: [id] },
			{ sql: "DELETE FROM roles WHERE id = ?", params: [id] }
		])
		return success(null, "删除成功")
	})

	// ---------- 权限分配 (角色-模块关联) ----------

	app.get("/roles/:id/menus", getRoleMenusSchema, async (request: FastifyRequest) => {
		const { id } = request.params as { id: number }
		const list = queryAll("SELECT * FROM role_menus WHERE role_id = ?", [id])
		return success(list.map(m => m.module_key))
	})

	app.put("/roles/:id/menus", assignRoleMenusSchema, async (request: FastifyRequest) => {
		const { id } = request.params as { id: number }
		const { moduleKeys } = request.body as { moduleKeys: string[] }
		runBatch([
			{ sql: "DELETE FROM role_menus WHERE role_id = ?", params: [id] },
			...moduleKeys.map(key => ({
				sql: "INSERT INTO role_menus (role_id, module_key) VALUES (?, ?)",
				params: [id, key]
			}))
		])
		return success(null, "权限分配成功")
	})

	// ---------- 可用模块列表 ----------

	app.get("/modules", getModulesSchema, async () => {
		// 从 src/modules 目录注册的模块在此硬编码，前端可选
		// 后续可以改为从数据库或配置文件读取
		const availableModules = [
			{ key: "_templates", name: "模板示例", description: "功能模板示例" },
			{ key: "pbct", name: "数据导入管理", description: "数据导入管理" },
			{ key: "amc", name: "审计中心", description: "审计日志管理" },
			{ key: "ktc", name: "重点对象管控", description: "重点对象管控" }
		]
		return success(availableModules)
	})

	// ---------- 账号 CRUD ----------

	app.get("/accounts", getAccountsSchema, async (request: FastifyRequest) => {
		const q = request.query as any
		const { page, pageSize, offset, keyword } = parsePagination(q)
		const status = q.status ?? q["params[status]"]
		const role_id = q.role_id ?? q["params[role_id]"]
		let where = "WHERE 1=1"
		const params: any[] = []
		if (keyword) {
			where += " AND (a.username LIKE ? OR a.display_name LIKE ? OR a.email LIKE ?)"
			params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
		}
		if (status !== undefined && status !== "") {
			where += " AND a.status = ?"
			params.push(status)
		}
		if (role_id) {
			where += " AND a.role_id = ?"
			params.push(role_id)
		}
		const countParams = [...params]
		const total = queryScalar(`SELECT COUNT(*) FROM accounts a ${where}`, countParams) as number
		const list = queryAll(`
			SELECT a.*, r.name as role_name, r.code as role_code
			FROM accounts a
			LEFT JOIN roles r ON a.role_id = r.id
			${where}
			ORDER BY a.id DESC LIMIT ? OFFSET ?
		`, [...params, pageSize, offset])
		return pagedList(list, total, page, pageSize)
	})

	app.get("/accounts/:id", getAccountDetailSchema, async (request: FastifyRequest) => {
		const { id } = request.params as { id: number }
		const account = queryOne(`
			SELECT a.*, r.name as role_name, r.code as role_code
			FROM accounts a
			LEFT JOIN roles r ON a.role_id = r.id
			WHERE a.id = ?
		`, [id])
		if (!account) return fail("账号不存在")
		// 不返回密码
		const { password, ...info } = account
		return success(info)
	})

	app.post("/accounts", createAccountSchema, async (request: FastifyRequest) => {
		const { username, password, display_name, email, phone, status, role_id } = request.body as any
		try {
			runAndSave(
				"INSERT INTO accounts (username, password, display_name, email, phone, status, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
				[username, password, display_name || "", email || "", phone || "", status ?? 1, role_id || null]
			)
			return success({ id: lastInsertId() }, "创建成功")
		} catch (err: any) {
			if (String(err).includes("UNIQUE")) return fail("用户名已存在")
			return fail("创建失败")
		}
	})

	app.put("/accounts/:id", updateAccountSchema, async (request: FastifyRequest) => {
		const { id } = request.params as { id: number }
		const body = request.body as any
		const fields: string[] = []
		const values: any[] = []
		for (const [key, val] of Object.entries(body)) {
			if (["display_name", "email", "phone", "password", "status", "role_id"].includes(key) && val !== undefined) {
				fields.push(`${key} = ?`)
				values.push(val)
			}
		}
		if (fields.length === 0) return fail("无更新字段")
		values.push(id)
		try {
			runAndSave(`UPDATE accounts SET ${fields.join(", ")} WHERE id = ?`, values)
			return success(null, "更新成功")
		} catch (err: any) {
			return fail("更新失败")
		}
	})

	app.delete("/accounts/:id", deleteAccountSchema, async (request: FastifyRequest) => {
		const { id } = request.params as { id: number }
		runAndSave("DELETE FROM accounts WHERE id = ?", [id])
		return success(null, "删除成功")
	})
}