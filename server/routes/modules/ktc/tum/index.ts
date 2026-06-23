/**
 * tum 目标单元监测模块路由入口
 *
 * 层级路由: /wzsys/ktc/tum/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { ucRoutes } from "./uc"
import { umRoutes } from "./um"

export const tumRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	await app.register(ucRoutes, { prefix: "/uc" })
	await app.register(umRoutes, { prefix: "/um" })
}
