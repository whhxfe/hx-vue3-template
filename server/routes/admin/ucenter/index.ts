/**
 * 用户中心（ucenter）路由实现
 * 账号管理、角色管理、权限分配 CRUD
 * 
 * 层级路由: /wzsys/admin/ucenter/...
 * prefix 由 registerAdmin 传入，Fastify 自动添加到所有路由
 */
import type { FastifyInstance, FastifyPluginAsync, FastifyRequest } from "fastify"
import { getDb, saveDatabase } from "@db/db"
import { success, fail, pagedList } from "@utils/response"
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

// ==================== sql.js Helper ====================

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

function lastInsertId(): number {
	const db = getDb()
	const result = db.exec("SELECT last_insert_rowid() as id")
	return result[0]?.values[0]?.[0] as number ?? 0
}

// ==================== Routes ====================

export const ucenterRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// Fastify register 会自动添加 prefix (/wzsys/admin)
	// 所以路由路径只需要定义当前层级: /ucenter/...

	// ---------- 角色 CRUD ----------

	app.get("/admin/ucenter/roles", getRolesSchema, async (request: FastifyRequest) => {
		const q = request.query as any
		const page = Number(q["params[page]"] || q.page || 1)
		const pageSize = Number(q["params[pageSize]"] || q.pageSize || 100)
		const keyword = q.keyword || q["params[keyword]"]
		const offset = (page - 1) * pageSize
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

	app.get("/admin/ucenter/roles/:id", getRoleDetailSchema, async (request: FastifyRequest) => {
		const { id } = request.params as { id: number }
		const role = queryOne("SELECT * FROM roles WHERE id = ?", [id])
		if (!role) return fail("角色不存在")
		return success(role)
	})

	app.post("/admin/ucenter/roles", createRoleSchema, async (request: FastifyRequest) => {
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

	app.put("/admin/ucenter/roles/:id", updateRoleSchema, async (request: FastifyRequest) => {
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

	app.delete("/admin/ucenter/roles/:id", deleteRoleSchema, async (request: FastifyRequest) => {
		const { id } = request.params as { id: number }
		// 检查是否有账号关联
		const count = queryScalar("SELECT COUNT(*) FROM accounts WHERE role_id = ?", [id]) as number
		if (count > 0) return fail(`该角色下还有 ${count} 个账号，无法删除`)
		runAndSave("DELETE FROM role_menus WHERE role_id = ?", [id])
		runAndSave("DELETE FROM roles WHERE id = ?", [id])
		return success(null, "删除成功")
	})

	// ---------- 权限分配 (角色-模块关联) ----------

	app.get("/admin/ucenter/roles/:id/menus", getRoleMenusSchema, async (request: FastifyRequest) => {
		const { id } = request.params as { id: number }
		const list = queryAll("SELECT * FROM role_menus WHERE role_id = ?", [id])
		return success(list.map(m => m.module_key))
	})

	app.put("/admin/ucenter/roles/:id/menus", assignRoleMenusSchema, async (request: FastifyRequest) => {
		const { id } = request.params as { id: number }
		const { module_keys } = request.body as { module_keys: string[] }
		// 先清除旧权限，再插入新权限
		runAndSave("DELETE FROM role_menus WHERE role_id = ?", [id])
		for (const key of module_keys) {
			runAndSave("INSERT INTO role_menus (role_id, module_key) VALUES (?, ?)", [id, key])
		}
		return success(null, "权限分配成功")
	})

	// ---------- 可用模块列表 ----------

	app.get("/admin/ucenter/modules", getModulesSchema, async () => {
		// 从 src/modules 目录注册的模块在此硬编码，前端可选
		// 后续可以改为从数据库或配置文件读取
		const availableModules = [
			{ key: "_templates", name: "模板示例", description: "功能模板示例" },
			{ key: "zddxgk", name: "站点管理", description: "站点信息管理" }
		]
		return success(availableModules)
	})

	// ---------- 账号 CRUD ----------

	app.get("/admin/ucenter/accounts", getAccountsSchema, async (request: FastifyRequest) => {
		const q = request.query as any
		// 兼容前端 params[page]&params[pageSize] 的传参格式
		// Fastify 默认 querystring parser 将 params[page] 解析为字面量键名 "params[page]"，而非嵌套对象
		const page = Number(q["params[page]"] || q.page || 1)
		const pageSize = Number(q["params[pageSize]"] || q.pageSize || 10)
		const keyword = q.keyword || q["params[keyword]"]
		const status = q.status ?? q["params[status]"]
		const role_id = q.role_id ?? q["params[role_id]"]
		const offset = (page - 1) * pageSize
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

	app.get("/admin/ucenter/accounts/:id", getAccountDetailSchema, async (request: FastifyRequest) => {
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

	app.post("/admin/ucenter/accounts", createAccountSchema, async (request: FastifyRequest) => {
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

	app.put("/admin/ucenter/accounts/:id", updateAccountSchema, async (request: FastifyRequest) => {
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

	app.delete("/admin/ucenter/accounts/:id", deleteAccountSchema, async (request: FastifyRequest) => {
		const { id } = request.params as { id: number }
		runAndSave("DELETE FROM accounts WHERE id = ?", [id])
		return success(null, "删除成功")
	})
}
