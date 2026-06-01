/**
 * pbct 模块路由
 */
import type { FastifyInstance } from "fastify"
import { pbctService } from "./service"
import type { ListQuery, ImportData } from "./types"

interface ListParams {
	page?: string
	pageSize?: string
	name?: string
	idCard?: string
	phone?: string
	district?: string
	gender?: string
	ethnicity?: string
	sortOrder?: string
}

interface DeleteBody {
	id: number
}

interface AddBody {
	handleTime: string
	name: string
	idCard: string
	phone?: string
	gender?: string
	ethnicity?: string
	virtualAccount?: string
	handleReason?: string
	handleResult?: string
	householdAddress?: string
	residenceAddress?: string
	district?: string
}

const pbctRoutes = async (app: FastifyInstance) => {
	/**
	 * 获取列表数据
	 */
	app.get<{ Querystring: ListParams }>("/list", async (req, reply) => {
		try {
			const query: ListQuery = {
				page: req.query.page ? Number(req.query.page) : 1,
				pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
				name: req.query.name,
				idCard: req.query.idCard,
				phone: req.query.phone,
				district: req.query.district,
				gender: req.query.gender,
				ethnicity: req.query.ethnicity,
				sortOrder: req.query.sortOrder
			}

			const result = await pbctService.getList(query)

			return reply.send({
				state: 2000,
				message: "success",
				data: result
			})
		} catch (error) {
			console.error("获取列表失败:", error)
			return reply.send({
				state: 5000,
				message: "获取列表失败",
				data: null
			})
		}
	})

	/**
	 * 导入数据（接收 Excel 文件）
	 */
	app.post("/import", async (req, reply) => {
		try {
			// 获取上传的文件
			const data = await (req as any).file()

			if (!data) {
				return reply.send({
					state: 4000,
					message: "请上传文件",
					data: null
				})
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
				return reply.send({
					state: 4000,
					message: "导入文件数据为空",
					data: null
				})
			}

			// 获取表头（第一行）
			const headers = jsonData[0].map((h) => String(h).trim())

			// 表头映射
			const headerMap: Record<string, string> = {
				"处理时间": "handleTime",
				"姓名": "name",
				"身份证": "idCard",
				"身份证号码": "idCard",
				"联系电话": "phone",
				"手机号码": "phone",
				"手机号": "phone",
				"性别": "gender",
				"民族": "ethnicity",
				"虚拟账号": "virtualAccount",
				"处理原因": "handleReason",
				"处理结果": "handleResult",
				"户籍地址": "householdAddress",
				"现居地址": "residenceAddress",
				"居住地址": "residenceAddress",
				"所属区县": "district"
			}

			// 解析数据行
			const dataList: ImportData[] = []
			const idCardSet = new Set<string>()
			const duplicateIdCards: string[] = []
			const missingHandleTimeRows: number[] = []

			for (let i = 1; i < jsonData.length; i++) {
				const row = jsonData[i]
				const rowData: Record<string, any> = {}

				headers.forEach((header, index) => {
					const field = headerMap[header]
					if (field) {
						rowData[field] = row[index] !== undefined ? String(row[index]).trim() : ""
					}
				})

				// 跳过空行
				if (!rowData.name && !rowData.phone && !rowData.idCard) {
					continue
				}

				// 验证必填字段：处理时间
				if (!rowData.handleTime) {
					missingHandleTimeRows.push(i + 1)
					continue
				}

				// 验证必填字段：姓名
				if (!rowData.name) {
					throw new Error(`第 ${i + 1} 行：姓名为必填项`)
				}

				const idCard = rowData.idCard || ""

				// 检查 Excel 内部是否有重复的身份证号
				if (idCard && idCardSet.has(idCard)) {
					duplicateIdCards.push(idCard)
					continue
				}

				if (idCard) {
					idCardSet.add(idCard)
				}

				dataList.push({
					handleTime: rowData.handleTime || "",
					name: rowData.name || "",
					idCard: idCard,
					phone: rowData.phone || "",
					gender: rowData.gender || "男",
					ethnicity: rowData.ethnicity || "",
					virtualAccount: rowData.virtualAccount || "",
					handleReason: rowData.handleReason || "",
					handleResult: rowData.handleResult || "",
					householdAddress: rowData.householdAddress || "",
					residenceAddress: rowData.residenceAddress || "",
					district: rowData.district || ""
				})
			}

			// 检查处理时间是否为空
			if (missingHandleTimeRows.length > 0) {
				return reply.send({
					state: 4000,
					message: `以下行处理时间为必填项：第 ${missingHandleTimeRows.join("、")} 行`,
					data: null
				})
			}

			if (dataList.length === 0) {
				if (duplicateIdCards.length > 0) {
					return reply.send({
						state: 4000,
						message: `Excel 文件中存在重复的身份证号：${[...new Set(duplicateIdCards)].join("、")}`,
						data: null
					})
				}
				return reply.send({
					state: 4000,
					message: "没有有效数据可导入",
					data: null
				})
			}

			// 调用服务层保存数据（包含去重逻辑）
			const result = await pbctService.importData(dataList)

			// 拼接错误信息
			let message = `导入完成，成功 ${result.successCount} 条`
			if (result.failCount > 0) {
				message += `，失败 ${result.failCount} 条`
			}
			if (result.duplicateIdCards && result.duplicateIdCards.length > 0) {
				message += `\n以下身份证号已存在：${result.duplicateIdCards.join("、")}`
			}

			return reply.send({
				state: 2000,
				message: message,
				data: result
			})
		} catch (error: any) {
			console.error("导入数据失败:", error)
			return reply.send({
				state: 5000,
				message: error.message || "导入数据失败",
				data: null
			})
		}
	})

	/**
	 * 新增数据
	 */
	app.post<{ Body: AddBody }>("/add", async (req, reply) => {
		try {
			const { handleTime, name, idCard, phone, gender, ethnicity, virtualAccount, handleReason, handleResult, householdAddress, residenceAddress, district } = req.body

			if (!handleTime) {
				return reply.send({
					state: 4000,
					message: "处理时间为必填项",
					data: null
				})
			}

			if (!name) {
				return reply.send({
					state: 4000,
					message: "姓名为必填项",
					data: null
				})
			}

			if (!idCard) {
				return reply.send({
					state: 4000,
					message: "身份证号为必填项",
					data: null
				})
			}

			await pbctService.add({ handleTime, name, idCard, phone: phone || "", gender: gender || "男", ethnicity: ethnicity || "", virtualAccount: virtualAccount || "", handleReason: handleReason || "", handleResult: handleResult || "", householdAddress: householdAddress || "", residenceAddress: residenceAddress || "", district: district || "" })

			return reply.send({
				state: 2000,
				message: "新增成功",
				data: null
			})
		} catch (error) {
			console.error("新增数据失败:", error)
			return reply.send({
				state: 5000,
				message: "新增数据失败",
				data: null
			})
		}
	})

	/**
	 * 删除数据
	 */
	app.post<{ Body: DeleteBody }>("/delete", async (req, reply) => {
		try {
			const { id } = req.body

			if (!id) {
				return reply.send({
					state: 4000,
					message: "请提供要删除的数据 ID",
					data: null
				})
			}

			await pbctService.delete(id)

			return reply.send({
				state: 2000,
				message: "删除成功",
				data: null
			})
		} catch (error) {
			console.error("删除数据失败:", error)
			return reply.send({
				state: 5000,
				message: "删除数据失败",
				data: null
			})
		}
	})

	/**
	 * 下载导入模板（返回 Excel 文件）
	 */
	app.get("/import-template", async (_req, reply) => {
		try {
			const XLSX = await import("xlsx")

			// 数据导入表头配置
			const headers = [
				"处理时间",
				"姓名",
				"身份证",
				"联系电话",
				"性别",
				"民族",
				"虚拟账号",
				"处理原因",
				"处理结果",
				"户籍地址",
				"现居地址",
				"所属区县"
			]

			// 示例数据
			const sampleData = [
				["2024-01-15", "张三", "420100199001011234", "13800138000", "男", "汉族", "VA001", "政策补贴申请", "已审批通过", "湖北省武汉市", "湖北省武汉市武昌区", "武汉市"],
				["2024-02-20", "李四", "420200199002021234", "13900139000", "女", "汉族", "VA002", "困难认定", "待审核", "湖北省黄石市", "湖北省黄石市黄石港区", "黄石市"],
				["2024-03-10", "王五", "420300198001031234", "13700137000", "男", "土家族", "VA003", "残贴申请", "已发放", "湖北省十堰市", "湖北省十堰市茅箭区", "十堰市"]
			]

			// 合并表头和示例数据
			const data = [headers, ...sampleData]

			// 创建工作簿和工作表
			const worksheet = XLSX.utils.aoa_to_sheet(data)
			const workbook = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(workbook, worksheet, "数据导出")

			// 设置列宽
			worksheet["!cols"] = [
				{ wch: 12 },  // 处理时间
				{ wch: 10 },  // 姓名
				{ wch: 20 },  // 身份证
				{ wch: 15 },  // 联系电话
				{ wch: 6 },   // 性别
				{ wch: 10 },  // 民族
				{ wch: 12 },  // 虚拟账号
				{ wch: 15 },  // 处理原因
				{ wch: 15 },  // 处理结果
				{ wch: 30 },  // 户籍地址
				{ wch: 30 },  // 现居地址
				{ wch: 15 }   // 所属区县
			]

			// 生成 Excel buffer
			const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

			// 设置响应头
			reply.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
			reply.header("Content-Disposition", `attachment; filename*=UTF-8''${encodeURIComponent("导入模板.xlsx")}`)

			return reply.send(buffer)
		} catch (error) {
			console.error("下载导入模板失败:", error)
			return reply.send({
				state: 5000,
				message: "下载导入模板失败",
				data: null
			})
		}
	})
}

export { pbctRoutes }
