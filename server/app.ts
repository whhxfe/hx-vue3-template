/**
 * App 工厂：创建 Fastify 实例，注册插件/路由/hooks
 */
import Fastify from "fastify"
import cors from "@fastify/cors"
import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"
import { swaggerConfig, swaggerUiConfig } from "./swagger"
import { authRoutes } from "./routes/auth"
import { registerModules } from "./routes/modules"
import { registerAdmin } from "./routes/admin"
import { saveDatabase } from "./db/db"

/** 格式化请求参数（防止大文件/大对象） */
function formatParams(data: any, maxLen = 300): string {
	if (!data) return "无"
	try {
		const str = JSON.stringify(data)
		return str.length > maxLen ? str.slice(0, maxLen) + "..." : str
	} catch {
		return String(data).slice(0, maxLen)
	}
}

/** 记录接口访问日志 */
function logRequest(request: any, reply: any, startTime: number) {
	const { method, url } = request
	const duration = Date.now() - startTime
	const token = request.headers.token || request.headers.authorization || "-"
	const ip =
		request.headers["x-forwarded-for"] || request.headers["x-real-ip"] || request.ip || "-"
	const status = reply.statusCode

	// 解析 URL 路径（去除 query string）
	const path = url.split("?")[0]

	// 构建日志内容
	const lines = [
		"",
		"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
		`  🕐  ${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}`,
		`  📡 ${method}  ${path}`,
		`  👤 Token: ${String(token).slice(0, 35)}${String(token).length > 35 ? "..." : ""}`,
		`  🌐 IP:    ${ip}`,
		`  ⏱️  ${duration}ms  |  📊 ${status}`,
		""
	]

	const query = request.query
	const params = request.params
	const body = request.body

	if (query && Object.keys(query).length > 0) {
		lines.push(`  📋 Query:  ${formatParams(query)}`)
	}
	if (params && Object.keys(params).length > 0) {
		lines.push(`  📋 Params: ${formatParams(params)}`)
	}
	if (body && Object.keys(body).length > 0) {
		lines.push(`  📋 Body:   ${formatParams(body)}`)
	}

	lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
	lines.push("")

	console.log(lines.join("\n"))
}

export async function createApp() {
	// 基础日志配置（用于框架内部日志）
	const app = Fastify({
		logger: {
			level: "warn" // 降低框架日志级别，减少干扰
		}
	})

	// 请求开始时记录时间
	app.addHook("onRequest", async (request: any) => {
		request.startTime = Date.now()
	})

	// 请求完成时记录完整日志
	app.addHook("onResponse", async (request: any, reply: any) => {
		logRequest(request, reply, request.startTime)
	})

	// 注册 CORS
	await app.register(cors, {
		origin: "*",
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
	})

	// 注册 Swagger
	await app.register(swagger, swaggerConfig)
	await app.register(swaggerUi, swaggerUiConfig)

	// 注册业务路由
	await app.register(authRoutes, { prefix: "/wzsys" })
	await registerModules(app, "/wzsys")
	await registerAdmin(app, "/wzsys")

	// 健康检查
	app.get("/", async () => ({
		status: "ok",
		message: "Mock 服务运行中",
		docs: `http://localhost:${3000}/docs`
	}))

	// 优雅关闭：保存数据库
	app.addHook("onClose", () => {
		saveDatabase()
		console.log("💾 数据库已保存")
	})

	return app
}