import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success } from "@utils/response"
import type { LspItem } from "./types"

/**
 * LSP: 日志标准化处理路由
 *
 * 层级路由: /wzsys/amc/lsp/...
 */
const mockData: LspItem[] = [
	{ id: 1, sourceSystem: "gateway", originalFormat: '{"time":"2026-06-01 10:00:00","msg":"request"}', formatVersion: "v1.0.0", transformStatus: "completed", processDuration: 120, processor: "admin", createTime: "2026-06-01 10:00:00", updateTime: "2026-06-01 10:00:12" },
	{ id: 2, sourceSystem: "auth", originalFormat: '{"timestamp":1709347200,"level":"INFO"}', formatVersion: "v2.1.0", transformStatus: "completed", processDuration: 85, processor: "operator01", createTime: "2026-06-01 11:00:00", updateTime: "2026-06-01 11:00:09" },
	{ id: 3, sourceSystem: "order", originalFormat: "<log><t>2026-06-01</t><m>create order</m></log>", formatVersion: "v1.2.0", transformStatus: "processing", processDuration: 2300, processor: "operator02", createTime: "2026-06-01 12:00:00", updateTime: "2026-06-01 12:00:02" },
	{ id: 4, sourceSystem: "payment", originalFormat: "2026-06-01|ERROR|payment failed|code=500", formatVersion: "v1.0.0", transformStatus: "failed", processDuration: 0, processor: "admin", createTime: "2026-06-01 13:00:00", updateTime: "2026-06-01 13:00:01" },
	{ id: 5, sourceSystem: "storage", originalFormat: "INFO 2026-06-01 storage upload success", formatVersion: "v3.0.0", transformStatus: "pending", processDuration: 0, processor: "operator01", createTime: "2026-06-01 14:00:00", updateTime: "2026-06-01 14:00:00" },
	{ id: 6, sourceSystem: "gateway", originalFormat: '{"time":"2026-06-01 15:00:00","msg":"response"}', formatVersion: "v1.0.0", transformStatus: "completed", processDuration: 95, processor: "admin", createTime: "2026-06-01 15:00:00", updateTime: "2026-06-01 15:00:10" },
	{ id: 7, sourceSystem: "auth", originalFormat: "WARN 2026-06-01 token expiring soon", formatVersion: "v2.1.0", transformStatus: "completed", processDuration: 68, processor: "operator02", createTime: "2026-06-01 16:00:00", updateTime: "2026-06-01 16:00:07" },
	{ id: 8, sourceSystem: "order", originalFormat: "[2026-06-01 17:00] INFO order #12345 created", formatVersion: "v1.2.0", transformStatus: "completed", processDuration: 110, processor: "operator01", createTime: "2026-06-01 17:00:00", updateTime: "2026-06-01 17:00:11" }
]

export const lspRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	app.get<{ Querystring: Record<string, string> }>("/list", async (request) => {
		const { page = "1", pageSize = "10", sourceSystem, transformStatus, processor, startTime, endTime } = request.query

		const filtered = mockData.filter(item => {
			if (sourceSystem && !item.sourceSystem.includes(sourceSystem)) return false
			if (transformStatus && item.transformStatus !== transformStatus) return false
			if (processor && !item.processor.includes(processor)) return false
			return true
		})

		const start = (Number(page) - 1) * Number(pageSize)
		const list = filtered.slice(start, start + Number(pageSize))

		return success({ list, total: filtered.length })
	})

	app.post("/add", async () => {
		return success({ message: "新增成功" })
	})

	app.post("/update", async () => {
		return success({ message: "更新成功" })
	})

	app.post<{ Body: { id: number } }>("/delete", async (request) => {
		return success({ message: "删除成功" })
	})
}
