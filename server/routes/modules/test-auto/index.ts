import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success } from "@utils/response"
import { queryAll } from "@utils/db-helper"

const testAutoRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/ping", async () => {
    return success({ message: "自动扫描模块正常工作!", timestamp: new Date().toISOString() })
  })

  app.get("/list", async () => {
    const items = queryAll("SELECT * FROM test_auto_items")
    return success(items)
  })
}

export default testAutoRoutes
