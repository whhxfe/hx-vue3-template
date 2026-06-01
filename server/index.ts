/**
 * Fastify Mock Server 入口
 * 启动方式：cd server && npm run dev
 */
import { initDatabase } from "./db/init"
import { createApp } from "./app"
import { serverConfig } from "./config/index.js"
import { setupGracefulShutdown } from "./lifecycle"
import { forceReleasePort } from "./utils/port-manager.js"

// 保存服务器实例引用，用于优雅关闭
let appInstance: any = null

const startServer = async (retryCount = 0) => {
  const maxRetries = 5
  try {
    await initDatabase()

    const app = await createApp()
    appInstance = app

    await app.listen({ port: serverConfig.port, host: serverConfig.host })
    console.log(`服务器已启动: http://${serverConfig.host}:${serverConfig.port}`)
  } catch (error: any) {
    if (error.code === "EADDRINUSE") {
      console.error(`端口 ${serverConfig.port} 已被占用 (EADDRINUSE)`)
      if (retryCount < maxRetries) {
        forceReleasePort(serverConfig.port)
        const delay = 1000 + retryCount * 500 // 递增等待：1s, 1.5s, 2s...
        console.log(`等待 ${delay}ms 后重试 (第 ${retryCount + 1}/${maxRetries} 次)...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        return startServer(retryCount + 1)
      }
    }
    console.error("服务器启动失败:", error)
    process.exit(1)
  }
}

// 设置优雅关闭信号监听
setupGracefulShutdown(() => appInstance, serverConfig.port)

startServer()