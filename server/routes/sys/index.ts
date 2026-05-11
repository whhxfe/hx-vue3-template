/**
 * 系统相关接口 Mock 路由
 * 仅保留系统管理相关接口，认证接口已移至 auth 模块
 */
import type { FastifyInstance } from "fastify"

// 该文件暂时保留占位，未来可在此添加系统配置管理等接口
export async function sysRoutes(app: FastifyInstance) {
	// 系统配置、字典管理等接口可在此添加
}
