/**
 * pw 人员预警模块路由
 *
 * 统一管理所有人员预警相关接口
 *
 * 层级路由: /wzsys/ktc/tpm/pw/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success, fail, pagedList } from "@utils/response"
import type { ListQuery } from "./types"
import * as service from "./service"

export const pwRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// ========== 字典下拉 ==========

	// 业务类别下拉选项
	app.get("/dict/business-category", async () => {
		const options = await service.getBusinessCategoryOptions()
		return success(options)
	})

	// 人员分值下拉选项
	app.get("/dict/person-score", async () => {
		const options = await service.getPersonScoreOptions()
		return success(options)
	})

	// 预警类型下拉选项
	app.get("/dict/warning-type", async () => {
		const options = await service.getWarningTypeOptions()
		return success(options)
	})

	// 数据来源下拉选项
	app.get("/dict/data-source", async () => {
		const options = await service.getDataSourceOptions()
		return success(options)
	})

	// 管理类别下拉选项
	app.get("/dict/manage-category", async () => {
		const options = await service.getManageCategoryOptions()
		return success(options)
	})

	// 户籍地址下拉选项
	app.get("/dict/household-address", async () => {
		const options = await service.getHouseholdAddressOptions()
		return success(options)
	})

	// 管理部门下拉选项
	app.get("/dict/manage-dept", async () => {
		const options = await service.getManageDeptOptions()
		return success(options)
	})

	// ========== 列表查询 ==========

	// 获取列表数据
	app.post<{ Body: ListQuery }>("/list", async (request) => {
		const { page = 1, pageSize = 10, ...rest } = request.body || {}
		const result = await service.getPersons({ page, pageSize, ...rest })
		return pagedList(result.list, result.total, page, pageSize)
	})

	// ========== 新增 ==========

	// 新增人员预警
	app.post("/create", async (request) => {
		const body = request.body as {
			name: string
			gender: "男" | "女"
			age: number
			idCard: string
			phone?: string
			personScore?: number
			warningType?: string
			businessCategory?: string
			dataSource?: string
			manageCategory?: string
			education?: string
			occupationType?: string
			residenceAddress?: string
		}

		if (!body.name || !body.gender || !body.age || !body.idCard) {
			return fail("请填写完整信息")
		}

		const id = await service.createPerson({
			name: body.name,
			gender: body.gender,
			age: body.age,
			idCard: body.idCard,
			phone: body.phone,
			personScore: body.personScore,
			warningType: body.warningType,
			businessCategory: body.businessCategory,
			dataSource: body.dataSource,
			manageCategory: body.manageCategory,
			education: body.education,
			occupationType: body.occupationType,
			residenceAddress: body.residenceAddress
		})

		return success(
			{
				id,
				...body,
				entryTime: new Date().toISOString().replace("T", " ").substring(0, 19)
			},
			"新增成功"
		)
	})

	// ========== 更新 ==========

	// 更新人员预警信息
	app.put<{ Params: { id: string } }>("/update/:id", async (request) => {
		const { id } = request.params
		const body = request.body as {
			name: string
			gender: "男" | "女"
			age: number
			idCard: string
			phone?: string
			personScore?: number
			warningType?: string
			businessCategory?: string
			dataSource?: string
			manageCategory?: string
			education?: string
			occupationType?: string
			residenceAddress?: string
		}

		if (!id || !body.name || !body.gender || !body.age || !body.idCard) {
			return fail("请填写完整信息")
		}

		await service.updatePerson(Number(id), {
			name: body.name,
			gender: body.gender,
			age: body.age,
			idCard: body.idCard,
			phone: body.phone,
			personScore: body.personScore,
			warningType: body.warningType,
			businessCategory: body.businessCategory,
			dataSource: body.dataSource,
			manageCategory: body.manageCategory,
			education: body.education,
			occupationType: body.occupationType,
			residenceAddress: body.residenceAddress
		})

		return success({ id: Number(id), ...body }, "更新成功")
	})

	// ========== 删除 ==========

	// 删除单条数据
	app.delete<{ Params: { id: string } }>("/:id", async (request) => {
		const { id } = request.params
		if (!id) return fail("请指定要删除的数据")

		await service.deletePerson(Number(id))
		return success({ id: Number(id) }, "删除成功")
	})

	// ========== 导入导出 ==========

	// 导出数据
	app.post("/export", async (request, reply) => {
		try {
			const body = request.body as {
				exportType?: "page" | "all" | "count" | "selected"
				type?: "page" | "all" | "count" | "selected"
				ids?: number[]
				page?: number
				pageSize?: number
			}

			const type = body.exportType || body.type || "page"
			const { ids, page = 1, pageSize = 10 } = body

			let result: { list: any[]; total: number }

			switch (type) {
				case "page":
				case "count": {
					const data = await service.getPersons({ page, pageSize })
					result = { list: data.list, total: data.total }
					break
				}
				case "selected": {
					if (!ids || ids.length === 0) {
						return fail("请选择要导出的数据")
					}
					const data = await service.getPersonsByIds(ids)
					result = { list: data, total: data.length }
					break
				}
				case "all": {
					const data = await service.getPersons({ page: 1, pageSize: 10000 })
					result = { list: data.list, total: data.total }
					break
				}
				default:
					return fail("无效的导出类型")
			}

			if (result.list.length === 0) {
				return fail("没有可导出的数据")
			}

			const XLSX = await import("xlsx")

			// 表头
			const headers = [
				"姓名", "性别", "年龄", "身份证号", "手机号",
				"人员分值", "预警类型", "业务类别", "管理类别",
				"数据来源", "学历", "职业类型", "居住地址", "录入时间"
			]

			// 数据行
			const rows = result.list.map((item) => [
				item.name,
				item.gender,
				item.age,
				item.idCard,
				item.phone || "",
				item.personScore || "",
				item.warningTypeName || "",
				item.businessCategoryName || "",
				item.manageCategoryName || "",
				item.dataSourceName || "",
				item.education || "",
				item.occupationType || "",
				item.residenceAddress || "",
				item.entryTime || ""
			])

			// 创建工作簿
			const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
			const workbook = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(workbook, worksheet, "人员预警信息")

			// 设置列宽
			worksheet["!cols"] = [
				{ wch: 10 }, { wch: 6 }, { wch: 6 }, { wch: 20 }, { wch: 15 },
				{ wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
				{ wch: 10 }, { wch: 8 }, { wch: 10 }, { wch: 20 }, { wch: 20 }
			]

			// 生成 Excel buffer
			const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

			// 设置响应头
			reply.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
			reply.header("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent("人员预警导出.xlsx")}`)

			return reply.send(buffer)
		} catch (error) {
			console.error("导出失败:", error)
			return fail("导出失败：" + String(error))
		}
	})
}
