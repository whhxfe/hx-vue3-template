/**
 * tgm/gc/gm 群组管理模块路由
 *
 * 层级路由: /wzsys/ktc/tgm/gc/gm/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success, pagedList } from "@utils/response"
import { queryAll, queryScalar, runAndSave } from "@utils/db-helper"

interface GmListQuery {
	page?: number
	pageSize?: number
	groupId?: number
	keyword?: string
	type?: string
	entryTimeStart?: string
	entryTimeEnd?: string
}

export const gmRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// 获取列表数据
	app.post<{ Body: GmListQuery }>("/list", async (request) => {
		const { page = 1, pageSize = 10, groupId, keyword, type, entryTimeStart, entryTimeEnd } = request.body || {}
		const offset = (page - 1) * pageSize

		let where = "WHERE 1=1"
		const params: any[] = []

		if (groupId) {
			where += " AND group_id = ?"
			params.push(Number(groupId))
		}
		if (keyword) {
			where += " AND (name LIKE ? OR number LIKE ?)"
			const pattern = `%${keyword}%`
			params.push(pattern, pattern)
		}
		if (type) {
			where += " AND type = ?"
			params.push(type)
		}
		if (entryTimeStart) {
			where += " AND entry_time >= ?"
			params.push(entryTimeStart)
		}
		if (entryTimeEnd) {
			where += " AND entry_time <= ?"
			params.push(entryTimeEnd + " 23:59:59")
		}

		const total = queryScalar(`SELECT COUNT(*) FROM ktc_gm_groups ${where}`, params) as number
		const rows = queryAll(
			`SELECT * FROM ktc_gm_groups ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
			[...params, pageSize, offset]
		)

		const list = rows.map((row) => ({
			id: row.id,
			groupId: row.group_id,
			name: row.name,
			number: row.number || "",
			type: row.type || "",
			memberCount: row.member_count || 0,
			activeCount: row.active_count || 0,
			description: row.description || "",
			entryTime: row.entry_time
		}))

		return pagedList(list, total, page, pageSize)
	})

	// 新增
	app.post("/create", async (request) => {
		const body = request.body as any
		const db = (await import("@db/manager")).getDb()
		const saveDb = (await import("@db/manager")).saveDatabase

		db.run(
			`INSERT INTO ktc_gm_groups (group_id, name, number, type, member_count, active_count, description)
			VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[body.groupId, body.name, body.number, body.type, body.memberCount || 0, body.activeCount || 0, body.description || ""]
		)
		saveDb()
		const id = db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] as number
		return success({ id }, "录入成功")
	})

	// 更新
	app.put<{ Params: { id: string } }>("/update/:id", async (request) => {
		const { id } = request.params
		const body = request.body as any
		runAndSave(
			`UPDATE ktc_gm_groups SET name=?, number=?, type=?, member_count=?, active_count=?, description=?, updated_at=datetime('now') WHERE id=?`,
			[body.name, body.number, body.type, body.memberCount, body.activeCount, body.description, Number(id)]
		)
		return success({ id: Number(id) }, "更新成功")
	})

	// 删除
	app.delete<{ Params: { id: string } }>("/:id", async (request) => {
		const { id } = request.params
		runAndSave("DELETE FROM ktc_gm_groups WHERE id = ?", [Number(id)])
		return success({ id: Number(id) }, "删除成功")
	})
}
