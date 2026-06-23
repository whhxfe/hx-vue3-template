/**
 * ktc 模块路由入口（重点对象管控）
 *
 * 层级路由: /wzsys/ktc/...
 * prefix 已在 modules/index.ts 中指定为 /ktc
 * 此时 app.prefix 已经是 /wzsys/ktc
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { pcRoutes } from "./tpm/pc"
import { pwRoutes } from "./tpm/pw"
import { pmRoutes } from "./tpm/pm"
import { tgmRoutes } from "./tgm"
import { tumRoutes } from "./tum"

const ktcRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// ======== 目标人员监测 tpm ========
	await app.register(pcRoutes, { prefix: "/tpm/pc" })
	await app.register(pwRoutes, { prefix: "/tpm/pw" })
	await app.register(pmRoutes, { prefix: "/tpm/pm" })

	// ======== 目标群体监测 tgm ========
	await app.register(tgmRoutes, { prefix: "/tgm" })

	// ======== 目标单元监测 tum ========
	await app.register(tumRoutes, { prefix: "/tum" })
}

export default ktcRoutes
