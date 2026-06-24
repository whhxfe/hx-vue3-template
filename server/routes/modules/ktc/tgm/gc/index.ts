/**
 * tgm/gc 群体管控模块路由入口
 *
 * 层级路由: /wzsys/ktc/tgm/gc/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success, fail, pagedList } from "@utils/response"
import type { ListQuery } from "./types"
import * as service from "./service"
import { pmgRoutes } from "./pmg"
import { gmRoutes } from "./gm"
import { sgmRoutes } from "./sgm"
import { gaRoutes } from "./ga"

export const gcRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// ========== 树形结构 ==========

	app.get("/tree", async () => {
		const data = await service.getTreeData()
		return success(data)
	})

	// ========== 字典下拉 ==========

	app.get("/dict/category", async () => {
		const options = await service.getCategoryOptions()
		return success(options)
	})

	app.get("/dict/warning-type", async () => {
		const options = await service.getWarningTypeOptions()
		return success(options)
	})

	// ========== 列表查询 ==========

	app.post<{ Body: ListQuery }>("/list", async (request) => {
		const { page = 1, pageSize = 10, ...rest } = request.body || {}
		const result = await service.getGroups({ page, pageSize, ...rest })
		return pagedList(result.list, result.total, page, pageSize)
	})

	// ========== 新增 ==========

	app.post("/create", async (request) => {
		const body = request.body as {
			name: string
			categoryType: string
			territory: string
			policeName: string
			unitName: string
			reason: string
			tags?: string[]
		}

		if (!body.name || !body.categoryType) {
			return fail("请填写群体名称和管控类别")
		}

		const id = await service.createGroup({
			name: body.name,
			categoryType: body.categoryType,
			territory: body.territory || "",
			policeName: body.policeName || "",
			unitName: body.unitName || "",
			reason: body.reason || "",
			tags: body.tags
		})

		return success({ id, ...body }, "录入成功")
	})

	// ========== 更新 ==========

	app.put<{ Params: { id: string } }>("/update/:id", async (request) => {
		const { id } = request.params
		const body = request.body as {
			name: string
			categoryType: string
			territory: string
			policeName: string
			unitName: string
			reason: string
			tags?: string[]
		}

		if (!id || !body.name || !body.categoryType) {
			return fail("请填写群体名称和管控类别")
		}

		await service.updateGroup(Number(id), {
			name: body.name,
			categoryType: body.categoryType,
			territory: body.territory,
			policeName: body.policeName,
			unitName: body.unitName,
			reason: body.reason,
			tags: body.tags
		})

		return success({ id: Number(id), ...body }, "更新成功")
	})

	// ========== 删除 ==========

	app.delete<{ Params: { id: string } }>("/:id", async (request) => {
		const { id } = request.params
		if (!id) return fail("请指定要删除的数据")

		await service.deleteGroup(Number(id))
		return success({ id: Number(id) }, "删除成功")
	})

	// ========== 办结 ==========

	app.put<{ Params: { id: string } }>("/close/:id", async (request) => {
		const { id } = request.params
		if (!id) return fail("请指定要办结的数据")

		await service.closeGroup(Number(id))
		return success({ id: Number(id) }, "办结成功")
	})

	// ========== 子模块路由 ==========

	await app.register(pmgRoutes, { prefix: "/pmg" })
	await app.register(gmRoutes, { prefix: "/gm" })
	await app.register(sgmRoutes, { prefix: "/sgm" })
	await app.register(gaRoutes, { prefix: "/ga" })
}
