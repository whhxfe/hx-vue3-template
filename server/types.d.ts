/**
 * 扩展 FastifySchema 类型，支持 Swagger 的 summary/tags 等字段
 */
import "fastify"

declare module "fastify" {
	interface FastifySchema {
		summary?: string
		description?: string
		tags?: string[]
		operationId?: string
		deprecated?: boolean
	}
}