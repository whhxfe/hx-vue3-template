/**
 * 是否字典接口
 * GET /wzsys/public/dict/yes-no
 */
import type { FastifyInstance } from "fastify"
import { success } from "@utils/response"
import yesNoData from "./data.json"

export async function yesNoRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return success(yesNoData)
  })
}