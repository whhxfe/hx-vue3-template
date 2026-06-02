/**
 * pbct 模块路由
 */
import type { FastifyInstance } from "fastify"
import { pbctService } from "./service"
import type { ListQuery, ImportData } from "./types"

/**
 * 兼容多种日期格式，统一转换为 YYYY-MM-DD
 * 支持: Date对象, 2024/3/12, 2024-03-12, 2024-3-12, 2024年3月12日, 2024年03月12日, Excel序列号(45362)
 */
function formatDate(value: any): string {
	if (!value && value !== 0) return ""
	// XLSX 解析的 Date 对象（带时间戳）
	if (value instanceof Date) {
		const y = value.getFullYear()
		const m = String(value.getMonth() + 1).padStart(2, "0")
		const d = String(value.getDate()).padStart(2, "0")
		return `${y}-${m}-${d}`
	}
	// Excel 序列号（1900年起，1900-01-01为1，但Excel有1900-02-29的bug）
	// day >= 60 需要减1修正
	if (typeof value === "number" && value > 0) {
		const serial = value
		if (serial >= 60) {
			// Excel 1900 leap year bug: day 60 = 1900-02-29 (nonexistent)
			const d = new Date(Date.UTC(1899, 11, 30 + serial))
			const y = d.getUTCFullYear()
			const m = String(d.getUTCMonth() + 1).padStart(2, "0")
			const day = String(d.getUTCDate()).padStart(2, "0")
			return `${y}-${m}-${day}`
		}
	}
	const str = String(value).trim()
	// yyyy/M/d 或 yyyy/MM/dd
	const slashMatch = str.match(/^(\d{1,4})\/(\d{1,2})\/(\d{1,2})$/)
	if (slashMatch) {
		const [, y, m, d] = slashMatch
		return `${y.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
	}
	// yyyy-M-d 或 yyyy-MM-dd
	const dashMatch = str.match(/^(\d{1,4})-(\d{1,2})-(\d{1,2})$/)
	if (dashMatch) {
		const [, y, m, d] = dashMatch
		return `${y.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
	}
	// yyyy年M月d日 或 yyyy年MM月DD日
	const cnMatch = str.match(/^(\d{1,4})年(\d{1,2})月(\d{1,2})日?$/)
	if (cnMatch) {
		const [, y, m, d] = cnMatch
		return `${y.padStart(4, "0")}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
	}
	// 已经是标准格式或无法解析，原样返回
	return str
}

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
	source?: string
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
	 * 获取列表数据（从记录表查询）
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
				sortOrder: req.query.sortOrder,
				source: req.query.source
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
			const data = await (req as any).file()

			if (!data) {
				return reply.send({
					state: 4000,
					message: "请上传文件",
					data: null
				})
			}

			const buffer = await data.toBuffer()
			const XLSX = await import("xlsx")

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

			const headers = jsonData[0].map((h) => String(h).trim())

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

			const dataList: ImportData[] = []
			const missingHandleTimeRows: number[] = []

			for (let i = 1; i < jsonData.length; i++) {
				const row = jsonData[i]
				const rowData: Record<string, any> = {}

				headers.forEach((header, index) => {
					const field = headerMap[header]
					if (field) {
						if (field === "handleTime") {
							// 日期字段直接保留原始值（可能是Date对象或Excel序列号）
							rowData[field] = row[index]
						} else {
							rowData[field] = row[index] !== undefined ? String(row[index]).trim() : ""
						}
					}
				})

				if (!rowData.name && !rowData.phone && !rowData.idCard) {
					continue
				}

				// 格式化日期后再存入
				const formattedHandleTime = formatDate(rowData.handleTime || "")
				if (!formattedHandleTime) {
					missingHandleTimeRows.push(i + 1)
					continue
				}

				if (!rowData.name) {
					throw new Error(`第 ${i + 1} 行：姓名为必填项`)
				}

				const idCard = rowData.idCard || ""

				dataList.push({
					handleTime: formattedHandleTime,
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

			if (missingHandleTimeRows.length > 0) {
				return reply.send({
					state: 4000,
					message: `以下行处理时间为必填项：第 ${missingHandleTimeRows.join("、")} 行`,
					data: null
				})
			}

			if (dataList.length === 0) {
				return reply.send({
					state: 4000,
					message: "没有有效数据可导入",
					data: null
				})
			}

			// 调用服务层（source = import）
			const result = await pbctService.importData(dataList, "import")

			let message = `导入完成，成功 ${result.successCount} 条`
			if (result.skipCount > 0) {
				message += `，跳过 ${result.skipCount} 条（记录已存在）`
			}
			if (result.failCount > 0) {
				message += `，失败 ${result.failCount} 条`
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
	 * 新增数据（与导入逻辑相同）
	 */
	app.post<{ Body: AddBody }>("/add", async (req, reply) => {
		try {
			const { handleTime: rawHandleTime, name, idCard, phone, gender, ethnicity, virtualAccount, handleReason, handleResult, householdAddress, residenceAddress, district } = req.body

			const handleTime = formatDate(rawHandleTime || "")

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

			const result = await pbctService.add({
				handleTime,
				name,
				idCard,
				phone: phone || "",
				gender: gender || "男",
				ethnicity: ethnicity || "",
				virtualAccount: virtualAccount || "",
				handleReason: handleReason || "",
				handleResult: handleResult || "",
				householdAddress: householdAddress || "",
				residenceAddress: residenceAddress || "",
				district: district || ""
			})

			if (result.skipCount > 0) {
				return reply.send({
					state: 4000,
					message: "该记录已存在（整行数据完全相同）",
					data: null
				})
			}

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
	 * 删除记录
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

			const sampleData = [
				["2024-01-15", "张三", "420100199001011234", "13800138000", "男", "汉族", "VA001", "政策补贴申请", "已审批通过", "湖北省武汉市", "湖北省武汉市武昌区", "武汉市"],
				["2024-02-20", "李四", "420200199002021234", "13900139000", "女", "汉族", "VA002", "困难认定", "待审核", "湖北省黄石市", "湖北省黄石市黄石港区", "黄石市"],
				["2024-03-10", "王五", "420300198001031234", "13700137000", "男", "土家族", "VA003", "残贴申请", "已发放", "湖北省十堰市", "湖北省十堰市茅箭区", "十堰市"]
			]

			const data = [headers, ...sampleData]

			const worksheet = XLSX.utils.aoa_to_sheet(data)
			const workbook = XLSX.utils.book_new()
			XLSX.utils.book_append_sheet(workbook, worksheet, "数据导出")

			worksheet["!cols"] = [
				{ wch: 12 },
				{ wch: 10 },
				{ wch: 20 },
				{ wch: 15 },
				{ wch: 6 },
				{ wch: 10 },
				{ wch: 12 },
				{ wch: 15 },
				{ wch: 15 },
				{ wch: 30 },
				{ wch: 30 },
				{ wch: 15 }
			]

			const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

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
