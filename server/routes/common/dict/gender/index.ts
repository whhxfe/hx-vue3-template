/**
 * 性别字典接口
 * GET /wzsys/public/dict/gender
 */
import type { FastifyInstance } from "fastify"
import { success } from "@utils/response"
import genderData from "./data.json"

export async function genderRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return success(genderData)
  })
}