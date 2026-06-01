/**
 * 统一控制器基类
 * 提供 Fastify onRequest hook，对指定前缀的路由进行 token 校验
 *
 * 使用方式：
 *   await baseAuthHook.register(app, { prefix: "/wzsys" })
 *   会自动对 /wzsys/admin/... 和 /wzsys/zddxgk/... 等路径校验 token
 *
 * token 来源（按优先级）：
 *   1. header: Authorization (Bearer xxx)
 *   2. header: token
 *   3. query: token
 *   4. body: token
 */
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import { checkToken } from "../routes/auth/token-store"
import { tokenExpired } from "./response"

export interface BaseAuthOptions {
	/** 路由前缀，例如 "/wzsys" */
	prefix: string
	/** 需要校验的路径 pattern 列表，默认 ["/admin/", "/zddxgk/", "/pbct/", "/templates/"] */
	protectPatterns?: string[]
}

/**
 * 从请求中提取 token
 * 支持多种传参方式
 */
function extractToken(request: FastifyRequest): string | undefined {
	// 1. header: Authorization (Bearer xxx)
	const auth = request.headers.authorization as string | undefined
	if (auth && auth.startsWith("Bearer ")) {
		return auth.slice(7)
	}
	// 2. header: token
	const headerToken = request.headers.token as string | undefined
	if (headerToken) return headerToken
	// 3. query: token
	const queryToken = (request.query as Record<string, unknown>)?.token as string | undefined
	if (queryToken) return queryToken
	// 4. body: token
	const bodyToken = (request.body as Record<string, unknown>)?.token as string | undefined
	if (bodyToken) return bodyToken
	return undefined
}

export const baseAuthHook = {
	/**
	 * 在 Fastify 实例上注册全局 token 校验 hook
	 * 会对匹配 protectPatterns 的路径进行拦截校验
	 */
	async register(app: FastifyInstance, options: BaseAuthOptions) {
		const { prefix, protectPatterns } = options
		const patterns = protectPatterns ?? ["/admin/", "/zddxgk/", "/pbct/", "/templates/"]

		app.addHook("onRequest", async (request: FastifyRequest & { currentUser?: Record<string, unknown> }, reply: FastifyReply) => {
			const url = request.url

			// 判断是否需要校验 token
			const needsAuth = patterns.some((pattern) => url.startsWith(prefix + pattern))
			if (!needsAuth) return

			const token = extractToken(request)

			if (!token) {
				reply.code(200)
				reply.send(tokenExpired("缺少 token"))
				return
			}

			const result = checkToken(token)
			if (!result.valid) {
				reply.code(200)
				reply.send(tokenExpired("token 无效或已过期"))
				return
			}

			// token 有效，将用户信息挂到 request 上，后续路由处理函数可以通过 request.currentUser 获取
			request.currentUser = result.user as unknown as Record<string, unknown>
		})
	}
}
