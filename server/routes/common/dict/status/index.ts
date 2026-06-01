/**
 * 状态字典接口
 * GET /wzsys/public/dict/status
 */
import type { FastifyInstance } from "fastify"
import { success } from "@utils/response"
import statusData from "./data.json"

export async function statusRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return success(statusData)
  })
}