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
import { saveDatabase } from "./db/db"

export async function createApp() {
	const app = Fastify({ logger: true })

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