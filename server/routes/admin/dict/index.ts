/**
 * 数据字典管理路由实现
 * 路径前缀由 registerAdmin 自动添加: /wzsys/admin/dict/...
 */
import type { FastifyInstance, FastifyPluginAsync, FastifyRequest } from "fastify"
import { getDb, saveDatabase } from "@db/db"
import { success, fail, pagedList } from "@utils/response"
import {
	getDictTypesSchema,
	getDictTypesAllSchema,
	createDictTypeSchema,
	updateDictTypeSchema,
	deleteDictTypeSchema,
	getDictItemsSchema,
	getDictItemsByTypeSchema,
	createDictItemSchema,
	updateDictItemSchema,
	deleteDictItemSchema
} from "./types"

interface TypeQuery {
	page?: number
	pageSize?: number
	type?: string
	name?: string
}

interface ItemQuery {
	page?: number
	pageSize?: number
	type?: string
	label?: string
	status?: number
}

interface DictItemBody {
	type: string
	label: string
	value: string
	sort_order?: number
	status?: number
	remark?: string
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

export const dictRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// ==================== 字典类型管理 ====================

	/** 获取字典类型列表 */
	app.get("/admin/dict/types", getDictTypesSchema, async (request: FastifyRequest<{ Querystring: TypeQuery }>) => {
		const q = request.query as any
		const page = Number(q["params[page]"] || q.page || 1)
		const pageSize = Number(q["params[pageSize]"] || q.pageSize || 20)
		const keyword = q.keyword || q["params[keyword]"]
		const offset = (page - 1) * pageSize

		let where = "WHERE 1=1"
		const params: any[] = []
		if (keyword) {
			where += " AND (type LIKE ? OR name LIKE ?)"
			params.push(`%${keyword}%`, `%${keyword}%`)
		}

		const total = queryScalar(`SELECT COUNT(*) FROM dict_types ${where}`, params) as number
		const list = queryAll(
			`SELECT * FROM dict_types ${where} ORDER BY sort_order ASC, id ASC LIMIT ? OFFSET ?`,
			[...params, pageSize, offset]
		)

		return pagedList(list, total, page, pageSize)
	})

	/** 获取所有字典类型（下拉选择用） */
	app.get("/admin/dict/types/all", getDictTypesAllSchema, async () => {
		const list = queryAll("SELECT type, name FROM dict_types WHERE status = 1 ORDER BY sort_order ASC")
		return success(list)
	})

	/** 创建字典类型 */
	app.post("/admin/dict/types", createDictTypeSchema, async (request: FastifyRequest<{ Body: { type: string; name: string; description?: string; sort_order?: number } }>) => {
		const { type, name, description, sort_order = 0 } = request.body

		if (!type || !name) {
			return fail("类型和名称不能为空")
		}

		const exists = queryOne("SELECT id FROM dict_types WHERE type = ?", [type])
		if (exists) return fail("字典类型已存在")

		runAndSave("INSERT INTO dict_types (type, name, description, sort_order) VALUES (?, ?, ?, ?)",
			[type, name, description || null, sort_order])
		return success({ type, name }, "创建成功")
	})

	/** 更新字典类型 */
	app.put("/admin/dict/types/:id", updateDictTypeSchema, async (request: FastifyRequest<{ Params: { id: number }; Body: { name?: string; description?: string; sort_order?: number; status?: number } }>) => {
		const { id } = request.params
		const body = request.body
		const fields: string[] = []
		const values: any[] = []

		if (body.name !== undefined) {
			fields.push("name = ?")
			values.push(body.name)
		}
		if (body.description !== undefined) {
			fields.push("description = ?")
			values.push(body.description)
		}
		if (body.sort_order !== undefined) {
			fields.push("sort_order = ?")
			values.push(body.sort_order)
		}
		if (body.status !== undefined) {
			fields.push("status = ?")
			values.push(body.status)
		}

		if (fields.length === 0) return fail("没有要更新的字段")

		fields.push("updated_at = datetime('now')")
		values.push(id)
		runAndSave(`UPDATE dict_types SET ${fields.join(", ")} WHERE id = ?`, values)
		return success(null, "更新成功")
	})

	/** 删除字典类型 */
	app.delete("/admin/dict/types/:id", deleteDictTypeSchema, async (request: FastifyRequest<{ Params: { id: number } }>) => {
		const { id } = request.params

		const dictType = queryOne("SELECT type FROM dict_types WHERE id = ?", [id])
		if (!dictType) return fail("字典类型不存在")

		runAndSave("DELETE FROM dict_items WHERE type = ?", [dictType.type])
		runAndSave("DELETE FROM dict_types WHERE id = ?", [id])
		return success(null, "删除成功")
	})

	// ==================== 字典项管理 ====================

	/** 获取字典项列表 */
	app.get("/admin/dict/items", getDictItemsSchema, async (request: FastifyRequest<{ Querystring: ItemQuery }>) => {
		const q = request.query as any
		const page = Number(q["params[page]"] || q.page || 1)
		const pageSize = Number(q["params[pageSize]"] || q.pageSize || 50)
		const keyword = q.keyword || q["params[keyword]"]
		const offset = (page - 1) * pageSize

		let where = "WHERE 1=1"
		const params: any[] = []
		if (keyword) {
			where += " AND (label LIKE ? OR value LIKE ?)"
			params.push(`%${keyword}%`, `%${keyword}%`)
		}

		const total = queryScalar(`SELECT COUNT(*) FROM dict_items ${where}`, params) as number
		const list = queryAll(
			`SELECT * FROM dict_items ${where} ORDER BY type ASC, sort_order ASC, id ASC LIMIT ? OFFSET ?`,
			[...params, pageSize, offset]
		)

		return pagedList(list, total, page, pageSize)
	})

	/** 获取指定类型的字典项（下拉选择用） */
	app.get("/admin/dict/items/:type", getDictItemsByTypeSchema, async (request: FastifyRequest<{ Params: { type: string } }>) => {
		const { type } = request.params
		const list = queryAll("SELECT value, label FROM dict_items WHERE type = ? AND status = 1 ORDER BY sort_order ASC", [type])
		return success(list)
	})

	/** 创建字典项 */
	app.post("/admin/dict/items", createDictItemSchema, async (request: FastifyRequest<{ Body: DictItemBody }>) => {
		const { type, label, value, sort_order = 0, status = 1, remark } = request.body

		if (!type || !label || !value) {
			return fail("类型、标签、值不能为空")
		}

		const typeExists = queryOne("SELECT id FROM dict_types WHERE type = ?", [type])
		if (!typeExists) return fail("字典类型不存在")

		runAndSave(
			"INSERT INTO dict_items (type, label, value, sort_order, status, remark) VALUES (?, ?, ?, ?, ?, ?)",
			[type, label, value, sort_order, status, remark || null]
		)
		return success({ type, label, value }, "创建成功")
	})

	/** 更新字典项 */
	app.put("/admin/dict/items/:id", updateDictItemSchema, async (request: FastifyRequest<{ Params: { id: number }; Body: Partial<DictItemBody> }>) => {
		const { id } = request.params
		const body = request.body
		const fields: string[] = []
		const values: any[] = []

		if (body.label !== undefined) {
			fields.push("label = ?")
			values.push(body.label)
		}
		if (body.value !== undefined) {
			fields.push("value = ?")
			values.push(body.value)
		}
		if (body.sort_order !== undefined) {
			fields.push("sort_order = ?")
			values.push(body.sort_order)
		}
		if (body.status !== undefined) {
			fields.push("status = ?")
			values.push(body.status)
		}
		if (body.remark !== undefined) {
			fields.push("remark = ?")
			values.push(body.remark)
		}

		if (fields.length === 0) return fail("没有要更新的字段")

		values.push(id)
		runAndSave(`UPDATE dict_items SET ${fields.join(", ")} WHERE id = ?`, values)
		return success(null, "更新成功")
	})

	/** 删除字典项 */
	app.delete("/admin/dict/items/:id", deleteDictItemSchema, async (request: FastifyRequest<{ Params: { id: number } }>) => {
		const { id } = request.params
		runAndSave("DELETE FROM dict_items WHERE id = ?", [id])
		return success(null, "删除成功")
	})
}

export default dictRoutes
