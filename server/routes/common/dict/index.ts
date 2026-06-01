/**
 * 公共字典模块入口
 * 按字典类型独立注册路由
 * prefix: /wzsys/public/dict（由 common/index.ts 传入）
 *
 * 路由列表：
 *   - /gender          → 性别字典
 *   - /status          → 状态字典
 *   - /yes-no          → 是否字典
 *   - /approval-status → 审批状态字典
 *   - /ethnicity       → 民族字典
 *   - /district        → 所属区县字典（支持 cityName 查询参数）
 */
import type { FastifyPluginAsync } from "fastify"
import { genderRoutes } from "./gender"
import { statusRoutes } from "./status"
import { yesNoRoutes } from "./yes-no"
import { approvalStatusRoutes } from "./approval-status"
import { ethnicityRoutes } from "./ethnicity"
import { districtRoutes } from "./district"

export const dictRoutes: FastifyPluginAsync = async (app) => {
  await app.register(genderRoutes, { prefix: "/gender" })
  await app.register(statusRoutes, { prefix: "/status" })
  await app.register(yesNoRoutes, { prefix: "/yes-no" })
  await app.register(approvalStatusRoutes, { prefix: "/approval-status" })
  await app.register(ethnicityRoutes, { prefix: "/ethnicity" })
  await app.register(districtRoutes, { prefix: "/district" })
}

export default dictRoutes