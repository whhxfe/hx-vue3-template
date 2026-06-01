/**
 * 审批状态字典接口
 * GET /wzsys/public/dict/approval-status
 */
import type { FastifyInstance } from "fastify"
import { success } from "@utils/response"
import approvalStatusData from "./data.json"

export async function approvalStatusRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return success(approvalStatusData)
  })
}