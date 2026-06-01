/**
 * 民族字典接口
 * GET /wzsys/public/dict/ethnicity
 */
import type { FastifyInstance } from "fastify"
import { success } from "@utils/response"
import ethnicityData from "./data.json"

export async function ethnicityRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return success(ethnicityData)
  })
}