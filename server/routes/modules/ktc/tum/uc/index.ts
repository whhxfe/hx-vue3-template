/**
 * tum/uc 单元管控模块路由入口
 *
 * 层级路由: /wzsys/ktc/tum/uc/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success, fail, pagedList } from "@utils/response"
import type { ListQuery, CreateParams, UpdateParams, JudgeParams, ControlParams } from "./types"
import * as service from "./service"
import { uaRoutes } from "./ua"

export const ucRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// 注册 ua 子路由
	await app.register(uaRoutes, { prefix: "/ua" })

	// ========== 字典下拉 ==========

	// 单元类型下拉选项
	app.get("/dict/unit-type", async () => {
		const options = [
			{ label: "固定IP", value: "fixed_ip" },
			{ label: "ADSL", value: "adsl" }
		]
		return success(options)
	})

	// 管控类别下拉选项
	app.get("/dict/control-category", async () => {
		const options = [
			{ label: "重点关注", value: "focus" },
			{ label: "一级", value: "level1" },
			{ label: "二级", value: "level2" },
			{ label: "三级", value: "level3" },
			{ label: "其他", value: "other" }
		]
		return success(options)
	})

	// 布控资源下拉选项
	app.get("/dict/control-resource", async () => {
		const options = [
			{ label: "视频监控", value: "video" },
			{ label: "网络监测", value: "network" },
			{ label: "人员巡查", value: "patrol" },
			{ label: "技术侦查", value: "tech" }
		]
		return success(options)
	})

	// 预警类型下拉选项
	app.get("/dict/warning-type", async () => {
		const options = [
			{ label: "红色预警", value: "red" },
			{ label: "橙色预警", value: "orange" },
			{ label: "黄色预警", value: "yellow" },
			{ label: "蓝色预警", value: "blue" }
		]
		return success(options)
	})

	// ========== 列表查询 ==========

	// 获取列表数据
	app.post<{ Body: ListQuery }>("/list", async (request) => {
		const { page = 1, pageSize = 10, ...rest } = request.body || {}
		const result = service.getUnits({ page, pageSize, ...rest })
		return pagedList(result.list, result.total, page, pageSize)
	})

	// ========== 新增 ==========

	// 录入单元信息
	app.post("/create", async (request) => {
		const body = request.body as CreateParams

		if (!body.ip || !body.unitType || !body.controlCategory) {
			return fail("请填写完整信息")
		}

		const unit = service.createUnit(body)
		return success(unit, "录入成功")
	})

	// ========== 更新 ==========

	// 更新单元信息
	app.put<{ Params: { id: string } }>("/update/:id", async (request) => {
		const { id } = request.params
		const body = request.body as UpdateParams

		if (!id || !body.ip || !body.unitType || !body.controlCategory) {
			return fail("请填写完整信息")
		}

		const unit = service.updateUnit(Number(id), body)
		if (!unit) {
			return fail("数据不存在")
		}

		return success(unit, "更新成功")
	})

	// ========== 删除 ==========

	// 删除单条数据
	app.delete<{ Params: { id: string } }>("/:id", async (request) => {
		const { id } = request.params
		if (!id) return fail("请指定要删除的数据")

		const success = service.deleteUnit(Number(id))
		if (!success) {
			return fail("数据不存在")
		}

		return success({ id: Number(id) }, "删除成功")
	})

	// ========== 研判 ==========

	// 提交研判
	app.post("/judge", async (request) => {
		const body = request.body as JudgeParams

		if (!body.id || !body.controlCategory || !body.judgeReason) {
			return fail("请填写完整信息")
		}

		const unit = service.judgeUnit(body)
		if (!unit) {
			return fail("数据不存在")
		}

		return success(unit, "研判成功")
	})

	// ========== 布控 ==========

	// 提交布控
	app.post("/control", async (request) => {
		const body = request.body as ControlParams

		if (!body.id || !body.controlResource || !body.monitorTime) {
			return fail("请填写完整信息")
		}

		const unit = service.controlUnit(body)
		if (!unit) {
			return fail("数据不存在")
		}

		return success(unit, "布控成功")
	})

	// ========== 模板下载 ==========

	// 下载导入模板
	app.get("/template", async (_req, reply) => {
		try {
			const XLSX = await import("xlsx")

			const headers = [
				"IP地址", "ADSL号", "单元类型", "管控类别", "端口数量",
				"终端数量", "IP属地", "关注人员", "关注单位", "关注原因", "预警类型"
			]

			const sampleData = [
				["192.168.1.1", "", "固定IP", "重点关注", 24, 10, "武汉市", "张三", "XX单位", "异常访问", "红色预警"],
				["", "ADSL001", "ADSL", "一级", 8, 5, "黄石市", "李四", "YY单位", "可疑行为", "橙色预警"]
			]

			const data = [headers, ...sampleData]
			const worksheet = XLSX.utils.aoa_to_sheet(data)
			const workbook = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(workbook, worksheet, "单元管控")

			worksheet["!cols"] = [
				{ wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
				{ wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 20 }, { wch: 10 }
			]

			const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

			reply.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
			reply.header("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent("单元管控导入模板.xlsx")}`)

			return reply.send(buffer)
		} catch (error) {
			console.error("下载导入模板失败:", error)
			return reply.send(fail("下载导入模板失败"))
		}
	})

	// ========== 导入 ==========

	// 导入数据
	app.post("/import", async (request, reply) => {
		try {
			const data = await (request as any).file()

			if (!data) {
				return fail("请上传文件")
			}

			const buffer = await data.toBuffer()
			const XLSX = await import("xlsx")

			const workbook = XLSX.read(buffer, { type: "buffer" })
			const sheetName = workbook.SheetNames[0]
			const worksheet = workbook.Sheets[sheetName]
			const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

			if (jsonData.length < 2) {
				return fail("导入文件数据为空")
			}

			const headers = jsonData[0].map((h) => String(h).trim())

			const headerMap: Record<string, string> = {
				"IP地址": "ip",
				"ADSL号": "adsl",
				"单元类型": "unitType",
				"管控类别": "controlCategory",
				"端口数量": "portCount",
				"终端数量": "terminalCount",
				"IP属地": "ipLocation",
				"关注人员": "focusPerson",
				"关注单位": "focusUnit",
				"关注原因": "focusReason",
				"预警类型": "warningType"
			}

			const unitTypeMap: Record<string, string> = {
				"固定IP": "fixed_ip",
				"ADSL": "adsl"
			}

			const controlCategoryMap: Record<string, string> = {
				"重点关注": "focus",
				"一级": "level1",
				"二级": "level2",
				"三级": "level3",
				"其他": "other"
			}

			const warningTypeMap: Record<string, string> = {
				"红色预警": "red",
				"橙色预警": "orange",
				"黄色预警": "yellow",
				"蓝色预警": "blue"
			}

			let successCount = 0
			const failList: { row: number; error: string }[] = []

			for (let i = 1; i < jsonData.length; i++) {
				const row = jsonData[i]
				const rowNum = i + 1

				try {
					const rowData: Record<string, any> = {}
					headers.forEach((header, index) => {
						const field = headerMap[header]
						if (field) {
							rowData[field] = row[index] !== undefined ? String(row[index]).trim() : ""
						}
					})

					if (!rowData.ip && !rowData.adsl) {
						failList.push({ row: rowNum, error: "IP地址或ADSL号不能为空" })
						continue
					}

					// 转换单元类型
					if (rowData.unitType && unitTypeMap[rowData.unitType]) {
						rowData.unitType = unitTypeMap[rowData.unitType]
					}

					// 转换管控类别
					if (rowData.controlCategory && controlCategoryMap[rowData.controlCategory]) {
						rowData.controlCategory = controlCategoryMap[rowData.controlCategory]
					}

					// 转换预警类型
					if (rowData.warningType && warningTypeMap[rowData.warningType]) {
						rowData.warningType = warningTypeMap[rowData.warningType]
					}

					// 转换数字字段
					if (rowData.portCount) {
						rowData.portCount = parseInt(rowData.portCount, 10) || 0
					}
					if (rowData.terminalCount) {
						rowData.terminalCount = parseInt(rowData.terminalCount, 10) || 0
					}

					service.createUnit(rowData as CreateParams)
					successCount++
				} catch (err) {
					failList.push({ row: rowNum, error: String(err) })
				}
			}

			return success({
				total: jsonData.length - 1,
				successCount,
				failCount: failList.length,
				failList: failList.slice(0, 10)
			}, `导入完成，成功 ${successCount} 条，失败 ${failList.length} 条`)
		} catch (error) {
			console.error("导入失败:", error)
			return fail("导入失败：" + String(error))
		}
	})

	// ========== 导出 ==========

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
					const data = service.getUnits({ page, pageSize })
					result = { list: data.list, total: data.total }
					break
				}
				case "selected": {
					if (!ids || ids.length === 0) {
						return fail("请选择要导出的数据")
					}
					const data = service.getUnitsByIds(ids)
					result = { list: data, total: data.length }
					break
				}
				case "all": {
					const data = service.getUnits({ page: 1, pageSize: 10000 })
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

			const headers = [
				"IP地址", "ADSL号", "单元类型", "管控类别", "端口数量",
				"终端数量", "IP属地", "关注人员", "关注单位", "关注原因", "预警类型", "录入时间"
			]

			const rows = result.list.map((item) => [
				item.ip,
				item.adsl || "",
				item.unitTypeName,
				item.controlCategoryName,
				item.portCount,
				item.terminalCount,
				item.ipLocation,
				item.focusPerson,
				item.focusUnit,
				item.focusReason,
				item.warningTypeName,
				item.entryTime
			])

			const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
			const workbook = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(workbook, worksheet, "单元管控")

			worksheet["!cols"] = [
				{ wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
				{ wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 15 }, { wch: 20 }, { wch: 10 }, { wch: 20 }
			]

			const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

			reply.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
			reply.header("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent("单元管控导出.xlsx")}`)

			return reply.send(buffer)
		} catch (error) {
			console.error("导出失败:", error)
			return fail("导出失败：" + String(error))
		}
	})
}
