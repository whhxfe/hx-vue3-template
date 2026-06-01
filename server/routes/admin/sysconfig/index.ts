/**
 * 系统配置管理路由实现
 * 路径前缀由 registerAdmin 自动添加: /wzsys/admin/sysconfig/...
 * 路由路径只使用相对路径（例如 /configs），完整 prefix 由 admin/index.ts 传入
 */
import type { FastifyInstance, FastifyPluginAsync, FastifyRequest } from "fastify"
import { success, fail, pagedList } from "@utils/response"
import { queryAll, queryOne, queryScalar, runAndSave, parsePagination } from "@utils/db-helper"
import {
	getConfigsSchema,
	getConfigDetailSchema,
	updateConfigSchema,
	batchUpdateConfigsSchema,
	getEnabledConfigsSchema
} from "./types"

interface ConfigQuery {
	page?: number
	pageSize?: number
	key?: string
}

interface ConfigParams {
	key: string
}

interface ConfigBody {
	value: string
}

// ==================== Routes ====================

export const sysconfigRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	/** 获取配置列表 */
	app.get("/configs", getConfigsSchema, async (request: FastifyRequest<{ Querystring: ConfigQuery }>) => {
		const q = request.query as any
		const { page, pageSize, offset, keyword } = parsePagination(q)

		let where = "WHERE 1=1"
		const params: any[] = []
		if (keyword) {
			where += " AND (`key` LIKE ? OR description LIKE ?)"
			params.push(`%${keyword}%`, `%${keyword}%`)
		}

		const total = queryScalar(`SELECT COUNT(*) FROM sys_configs ${where}`, params) as number
		const list = queryAll(
			`SELECT * FROM sys_configs ${where} ORDER BY sort_order ASC, id ASC LIMIT ? OFFSET ?`,
			[...params, pageSize, offset]
		)

		return pagedList(list, total, page, pageSize)
	})

	/** 获取单个配置 */
	app.get("/configs/:key", getConfigDetailSchema, async (request: FastifyRequest<{ Params: ConfigParams }>) => {
		const { key } = request.params
		const config = queryOne("SELECT * FROM sys_configs WHERE `key` = ?", [key])
		if (!config) return fail("配置不存在")
		return success(config)
	})

	/** 更新配置 */
	app.put("/configs/:key", updateConfigSchema, async (request: FastifyRequest<{ Params: ConfigParams; Body: ConfigBody }>) => {
		const { key } = request.params
		const { value } = request.body

		if (value === undefined || value === null) {
			return fail("配置值不能为空")
		}

		runAndSave("UPDATE sys_configs SET value = ?, updated_at = datetime('now') WHERE `key` = ?", [value, key])
		return success({ key, value }, "更新成功")
	})

	/** 批量更新配置 */
	app.put("/configs", batchUpdateConfigsSchema, async (request: FastifyRequest<{ Body: Array<{ key: string; value: string }> }>) => {
		const configs = request.body
		for (const item of configs) {
			runAndSave("UPDATE sys_configs SET value = ?, updated_at = datetime('now') WHERE `key` = ?", [item.value, item.key])
		}
		return success({ updated: configs.length }, "批量更新成功")
	})

	/** 获取所有启用的配置（用于前端初始化） */
	app.get("/configs/enabled/all", getEnabledConfigsSchema, async () => {
		const list = queryAll("SELECT `key`, value, type FROM sys_configs WHERE status = 1")
		const configs: Record<string, string> = {}
		for (const row of list) {
			configs[row.key as string] = row.value as string
		}
		return success(configs)
	})
}

export default sysconfigRoutes
