/**
 * 生命周期管理
 * 统一管理优雅关闭信号监听与处理
 */
import type { FastifyInstance } from "fastify"
import { forceReleasePort } from "./utils/port-manager.js"
import { saveDatabase } from "./db/manager.js"

/**
 * 设置优雅关闭信号监听
 * @param server Fastify 服务器实例引用（可变的引用对象）
 * @param port 服务端口，用于最终释放
 */
export function setupGracefulShutdown(
  getServer: () => FastifyInstance | null,
  port: number
) {
  const handler = async (signal: string) => {
    console.log(`\n收到 ${signal} 信号，正在关闭服务器...`)
    try {
      const server = getServer()
      if (server) {
        // 3 秒超时，避免 close() 长时间阻塞
        const closePromise = server.close()
        const timeoutPromise = new Promise<void>((resolve) => setTimeout(resolve, 3000))
        await Promise.race([closePromise, timeoutPromise])
        console.log("服务器已成功关闭")
      }
    } catch (err) {
      console.error("关闭服务器时出错:", err)
    }
    // 最终确保释放端口
    forceReleasePort(port)
    process.exit(0)
  }

  process.on("SIGTERM", () => handler("SIGTERM"))
  process.on("SIGINT", () => handler("SIGINT"))
}

/**
 * 注册 Fastify 实例的 onClose Hook（保存数据库）
 */
export function registerLifecycleHooks(app: FastifyInstance) {
  app.addHook("onClose", () => {
    saveDatabase()
    console.log("💾 数据库已保存")
  })
}