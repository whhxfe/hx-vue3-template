import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success } from "@utils/response"
import type { LmcItem } from "./types"

/**
 * LMC: 日志管理路由
 *
 * 层级路由: /wzsys/amc/lmc/...
 */
const logTypes = ["business", "system", "security", "performance", "audit"]
const levels: Array<"debug" | "info" | "warn" | "error"> = ["debug", "info", "warn", "error"]
const methods = ["GET", "POST", "PUT", "DELETE"]
const systems = ["gateway", "auth", "order", "payment", "storage", "notification", "search"]
const names = ["张三", "李四", "王五", "赵六", "钱七"]

const mockData: LmcItem[] = Array.from({ length: 50 }, (_, i) => {
	const level = levels[Math.floor(Math.random() * levels.length)]
	const system = systems[Math.floor(Math.random() * systems.length)]
	return {
		id: i + 1,
		logCode: `LOG-${String(i + 1).padStart(6, "0")}`,
		logType: logTypes[Math.floor(Math.random() * logTypes.length)],
		logLevel: level,
		sourceSystem: system,
		operator: names[Math.floor(Math.random() * names.length)],
		operatorIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
		requestMethod: methods[Math.floor(Math.random() * methods.length)],
		requestPath: `/${system}/api/v1/${["query", "create", "update", "delete"][Math.floor(Math.random() * 4)]}`,
		responseStatus: level === "error" ? [500, 502, 503][Math.floor(Math.random() * 3)] : [200, 201, 204][Math.floor(Math.random() * 3)],
		executionDuration: Math.floor(Math.random() * 3000),
		errorMessage: level === "error" ? "NullPointerException at line 42" : "",
		createTime: `2026-06-${String(Math.floor(i / 7) + 1).padStart(2, "0")} ${String(i % 24).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`
	}
})

export const lmcRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	app.get<{ Querystring: Record<string, string> }>("/list", async (request) => {
		const { page = "1", pageSize = "10", logCode, logType, logLevel, sourceSystem, operator, startTime, endTime } = request.query

		const filtered = mockData.filter(item => {
			if (logCode && !item.logCode.includes(logCode)) return false
			if (logType && item.logType !== logType) return false
			if (logLevel && item.logLevel !== logLevel) return false
			if (sourceSystem && !item.sourceSystem.includes(sourceSystem)) return false
			if (operator && !item.operator.includes(operator)) return false
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
