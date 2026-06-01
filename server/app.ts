/**
 * App 工厂：创建 Fastify 实例，注册插件/路由/hooks
 */
import Fastify, { type FastifyRequest, type FastifyReply } from "fastify"
import cors from "@fastify/cors"
import multipart from "@fastify/multipart"
import swagger from "@fastify/swagger"
import swaggerUi from "@fastify/swagger-ui"
import { serverConfig, swaggerConfig, swaggerUiConfig, corsConfig, uploadConfig, loggerConfig } from "./config/index.js"
import { authRoutes } from "./routes/auth"
import { registerModules } from "./routes/modules"
import { registerAdmin } from "./routes/admin"
import { registerCommon } from "./routes/common"
import { logRequest } from "./utils/logger"
import { registerLifecycleHooks } from "./lifecycle"
import { baseAuthHook } from "./utils/base-controller"
import { fail } from "./utils/response"
import { cleanExpiredTokens } from "./routes/auth/token-store"

export async function createApp() {
  // 基础日志配置（用于框架内部日志）
  const app = Fastify({
    logger: {
      level: loggerConfig.level
    }
  })

  // 请求开始时记录时间
  app.addHook("onRequest", async (request: FastifyRequest & { startTime?: number }) => {
    request.startTime = Date.now()
  })

  // 请求完成时记录完整日志
  app.addHook("onResponse", async (request: FastifyRequest & { startTime?: number }, reply: FastifyReply) => {
    logRequest(request, reply, request.startTime!)
  })

  // 注册 CORS
  await app.register(cors, corsConfig)

  // 注册文件上传支持
  await app.register(multipart, {
    limits: {
      fileSize: uploadConfig.fileSize
    }
  })

  // 注册 Swagger
  await app.register(swagger, swaggerConfig)
  await app.register(swaggerUi, swaggerUiConfig)

  // 注册业务路由
  await app.register(authRoutes, { prefix: "/wzsys/account" })
  await registerModules(app, "/wzsys")
  await registerAdmin(app, "/wzsys")
  await registerCommon(app, "/wzsys")

  // 注册统一 token 校验
  // await baseAuthHook.register(app, { prefix: "/wzsys" })

  // 健康检查
  app.get("/", async () => ({
    status: "ok",
    message: "Mock 服务运行中",
    docs: `http://localhost:${serverConfig.port}/docs`
  }))

  // 全局错误处理：统一捕获未处理的错误
  app.setErrorHandler((error: Error, request, reply) => {
    console.error(`❌ ${request.method} ${request.url}:`, error)
    reply.code(200)
    reply.send(fail(error.message || "服务器内部错误"))
  })

  // 注册生命周期 Hook（保存数据库等）
  registerLifecycleHooks(app)

  // 定时清理过期 token（每 10 分钟），防止内存泄漏
  setInterval(() => {
    const count = cleanExpiredTokens()
    if (count > 0) {
      console.log(`🧹 清理了 ${count} 个过期 token`)
    }
  }, 10 * 60 * 1000)

  return app
}
