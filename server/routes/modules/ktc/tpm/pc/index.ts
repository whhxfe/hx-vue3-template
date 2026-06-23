/**
 * pc 人员管控模块路由
 *
 * 统一管理所有人员相关接口
 *
 * 层级路由: /wzsys/ktc/tpm/pc/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success, fail, pagedList } from "@utils/response"
import type { ListQuery } from "./types"
import * as service from "./service"

export const pcRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {

	// ========== 树形结构 ==========

	// 业务管理树
	app.get("/yhgl/tree", async () => {
		const data = await service.getTreeData("yhgl")
		return success(data)
	})

	// 关系机构树
	app.get("/gxjg/tree", async () => {
		const data = await service.getTreeData("gxjg")
		return success(data)
	})

	// ========== 字典下拉 ==========

	// 数据来源下拉选项
	app.get("/dict/source", async () => {
		const options = await service.getSourceOptions()
		return success(options)
	})

	// 类别下拉选项
	app.get("/dict/category", async () => {
		const options = await service.getCategoryOptions()
		return success(options)
	})

	// 湖北省县市下拉选项
	app.get("/dict/address", async () => {
		const options = await service.getAddressOptions()
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

	// 新增人员
	app.post("/create", async (request) => {
		const body = request.body as {
			name: string
			gender: "男" | "女"
			age: number
			phone: string
			idCard: string
			residenceAddress: string
			category: string
			dataSource: string
			tags?: string[]
		}

		if (!body.name || !body.gender || !body.age || !body.phone) {
			return fail("请填写完整信息")
		}

		const id = await service.createPerson({
			name: body.name,
			gender: body.gender,
			age: body.age,
			phone: body.phone,
			idCard: body.idCard || "",
			residenceAddress: body.residenceAddress || "",
			category: body.category || "",
			dataSource: body.dataSource || "",
			tags: body.tags
		})

		return success(
			{
				id,
				...body,
				followStatus: "0",
				entryTime: new Date().toISOString().replace("T", " ").substring(0, 19)
			},
			"新增成功"
		)
	})

	// ========== 更新 ==========

	// 更新人员信息
	app.put<{ Params: { id: string } }>("/update/:id", async (request) => {
		const { id } = request.params
		const body = request.body as {
			name: string
			gender: "男" | "女"
			age: number
			phone: string
			idCard: string
			residenceAddress: string
			category: string
			dataSource: string
			tags?: string[]
			followStatus?: "0" | "1"
		}

		if (!id || !body.name || !body.gender || !body.age || !body.phone) {
			return fail("请填写完整信息")
		}

		await service.updatePerson(Number(id), {
			name: body.name,
			gender: body.gender,
			age: body.age,
			phone: body.phone,
			idCard: body.idCard,
			residenceAddress: body.residenceAddress,
			category: body.category,
			dataSource: body.dataSource,
			tags: body.tags,
			followStatus: body.followStatus
		})

		return success({ id: Number(id), ...body }, "更新成功")
	})

	// 批量更新关注状态
	app.put("/update/status", async (request) => {
		const body = request.body as {
			ids: number[]
			followStatus: "0" | "1"
		}

		if (!body.ids || body.ids.length === 0) {
			return fail("请选择要更新的数据")
		}

		const count = await service.batchUpdateStatus(body.ids, body.followStatus)
		return success({ updatedCount: count }, `成功更新 ${count} 条数据的状态`)
	})

	// ========== 删除 ==========

	// 删除单条数据
	app.delete<{ Params: { id: string } }>("/:id", async (request) => {
		const { id } = request.params
		if (!id) return fail("请指定要删除的数据")

		await service.deletePerson(Number(id))
		return success({ id: Number(id) }, "删除成功")
	})

	// ========== 类别管理 ==========

	// 批量设置人员类别
	app.post("/category/assign", async (request) => {
		const body = request.body as {
			personIds: number[]
			categoryCode: string
		}

		if (!body.personIds || body.personIds.length === 0) {
			return fail("请选择要设置类别的人员")
		}
		if (!body.categoryCode) {
			return fail("请选择类别")
		}

		const count = await service.assignCategory(body.personIds, body.categoryCode)
		return success({ assignedCount: count, categoryCode: body.categoryCode }, `成功为 ${count} 名人员设置类别`)
	})

	// ========== 模板下载 ==========

	// 下载导入模板（返回 Excel 文件）
	app.get("/template", async (_req, reply) => {
		try {
			const XLSX = await import("xlsx")

			// 人员信息表头配置
			const headers = [
				"姓名",
				"性别",
				"年龄",
				"手机号",
				"身份证号",
				"居住地址",
				"类别",
				"数据来源",
				"标签"
			]

			// 示例数据
			const sampleData = [
				["张三", "男", 28, "13800138000", "420100199001011234", "武汉市", "重点关注", "社区采集", "党员,志愿者"],
				["李四", "女", 32, "13900139000", "420200199002021234", "黄石市", "一般人员", "医院录入", "独居老人"],
				["王五", "男", 45, "13700137000", "420300198001031234", "十堰市", "困难群体", "公安推送", "低保户,残疾人"]
			]

			// 合并表头和示例数据
			const data = [headers, ...sampleData]

			// 创建工作簿和工作表
			const worksheet = XLSX.utils.aoa_to_sheet(data)
			const workbook = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(workbook, worksheet, "人员信息")

			// 设置列宽
			worksheet["!cols"] = [
				{ wch: 10 }, // 姓名
				{ wch: 6 },  // 性别
				{ wch: 6 },  // 年龄
				{ wch: 15 }, // 手机号
				{ wch: 20 }, // 身份证号
				{ wch: 15 }, // 居住地址
				{ wch: 12 }, // 类别
				{ wch: 12 }, // 数据来源
				{ wch: 20 }  // 标签
			]

			// 生成 Excel buffer
			const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

			// 设置响应头
			reply.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
			reply.header("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent("人员信息导入模板.xlsx")}`)

			return reply.send(buffer)
		} catch (error) {
			console.error("下载导入模板失败:", error)
			return reply.send(fail("下载导入模板失败"))
		}
	})

	// ========== 导入导出 ==========

	// 导入数据（接收 Excel 文件）
	app.post<{ Reply: any }>("/import", async (request, reply) => {
		try {
			// 获取上传的文件
			const data = await (request as any).file()

			if (!data) {
				return fail("请上传文件")
			}

			// 读取文件内容
			const buffer = await data.toBuffer()
			const XLSX = await import("xlsx")

			// 解析 Excel
			const workbook = XLSX.read(buffer, { type: "buffer" })
			const sheetName = workbook.SheetNames[0]
			const worksheet = workbook.Sheets[sheetName]
			const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

			if (jsonData.length < 2) {
				return fail("导入文件数据为空")
			}

			// 获取表头（第一行）
			const headers = jsonData[0].map((h) => String(h).trim())

			// 表头映射
			const headerMap: Record<string, string> = {
				"姓名": "name",
				"性别": "gender",
				"年龄": "age",
				"手机号": "phone",
				"身份证号": "idCard",
				"居住地址": "residenceAddress",
				"类别": "category",
				"数据来源": "dataSource",
				"标签": "tags"
			}

			// 解析数据行
			let successCount = 0
			const failList: { row: number; error: string }[] = []

			for (let i = 1; i < jsonData.length; i++) {
				const row = jsonData[i]
				const rowNum = i + 1

				try {
					// 将行数据转换为对象
					const rowData: Record<string, any> = {}
					headers.forEach((header, index) => {
						const field = headerMap[header]
						if (field) {
							rowData[field] = row[index] !== undefined ? String(row[index]).trim() : ""
						}
					})

					// 验证必填字段
					if (!rowData.name || !rowData.gender || !rowData.phone) {
						failList.push({ row: rowNum, error: "姓名、性别、手机号不能为空" })
						continue
					}

					// 验证性别
					if (rowData.gender !== "男" && rowData.gender !== "女") {
						rowData.gender = "男"
					}

					// 转换年龄为数字
					if (rowData.age) {
						rowData.age = parseInt(String(rowData.age), 10) || 0
					}

					// 处理标签（逗号分隔的字符串转为数组）
					if (rowData.tags && typeof rowData.tags === "string") {
						rowData.tags = rowData.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
					}

					// 插入数据库
					await service.createPerson({
						name: rowData.name,
						gender: rowData.gender as "男" | "女",
						age: rowData.age || 0,
						phone: rowData.phone,
						idCard: rowData.idCard || "",
						residenceAddress: rowData.residenceAddress || "",
						category: rowData.category || "",
						dataSource: rowData.dataSource || "",
						tags: rowData.tags
					})

					successCount++
				} catch (err) {
					failList.push({ row: rowNum, error: String(err) })
				}
			}

			return success({
				total: jsonData.length - 1,
				successCount,
				failCount: failList.length,
				failList: failList.slice(0, 10) // 最多返回10条失败记录
			}, `导入完成，成功 ${successCount} 条，失败 ${failList.length} 条`)
		} catch (error) {
			console.error("导入失败:", error)
			return fail("导入失败：" + String(error))
		}
	})

	// 导出数据
	app.post("/export", async (request, reply) => {
		try {
			const body = request.body as {
				exportType?: "page" | "all" | "count" | "selected"  // HxExporter 组件参数名
				type?: "page" | "all" | "count" | "selected"         // 标准参数名
				ids?: number[]
				page?: number
				pageSize?: number
			}

			// 兼容 HxExporter 组件的参数名 exportType
			const type = body.exportType || body.type || "page"
			const { ids, page = 1, pageSize = 10 } = body

			// 根据类型获取数据
			let result: { list: any[]; total: number }

			switch (type) {
				case "page":
				case "count": {
					const query: ListQuery = { page, pageSize }
					const data = await service.getPersons(query)
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

			// 生成 Excel
			const XLSX = await import("xlsx")

			// 表头
			const headers = [
				"姓名", "性别", "年龄", "手机号", "身份证号",
				"居住地址", "类别", "数据来源", "关注状态", "录入时间"
			]

			// 数据行
			const rows = result.list.map((item) => [
				item.name,
				item.gender,
				item.age,
				item.phone,
				item.idCard,
				item.residenceAddressName || item.residenceAddress,
				item.categoryName || item.category,
				item.dataSourceName || item.dataSource,
				item.followStatusName || (item.followStatus === "1" ? "已关注" : "未关注"),
				item.entryTime
			])

			// 创建工作簿
			const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows])
			const workbook = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(workbook, worksheet, "人员信息")

			// 设置列宽
			worksheet["!cols"] = [
				{ wch: 10 }, { wch: 6 }, { wch: 6 }, { wch: 15 },
				{ wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 20 }
			]

			// 生成 Excel buffer
			const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

			// 设置响应头
			reply.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
			reply.header("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent("人员信息导出.xlsx")}`)

			return reply.send(buffer)
		} catch (error) {
			console.error("导出失败:", error)
			return fail("导出失败：" + String(error))
		}
	})
}
