/**
 * 认证相关接口 Mock 路由
 * 模拟 /account/ 下的所有接口
 * 数据来源：SQLite (accounts / roles / role_menus 表)
 */
import type { FastifyInstance, FastifyRequest } from "fastify"
import type { MockUserInfo } from "./types"
import { getDb } from "../../db/db"
import { success, fail, tokenExpired } from "../../utils/response"

/** token 内存存储 */
const tokenStore = new Map<string, MockUserInfo>()

function generateToken(): string {
	return "mock_token_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8)
}

export async function authRoutes(app: FastifyInstance) {
	/**
	 * GET /account/login
	 * 登录接口
	 */
	app.get("/account/login", {
		schema: {
			summary: "用户登录",
			tags: ["认证接口"],
			querystring: {
				type: "object",
				required: ["username", "password"],
				properties: {
					username: { type: "string", description: "账号" },
					password: { type: "string", description: "密码" }
				}
			},
			response: {
				200: {
					type: "object",
					properties: {
						state: { type: "integer" },
						message: { type: "string" },
						data: {
							type: "object",
							properties: {
								info: { type: "string", description: "token" },
								level: { type: "string", description: "角色等级" },
								modules: { type: "array", items: { type: "string" }, description: "授权模块" }
							}
						}
					}
				}
			}
		}
	}, async (request: FastifyRequest) => {
		const { username, password } = request.query as { username?: string; password?: string }

		if (!username || !password) {
			return fail("账号或密码不能为空")
		}

		// 从 SQLite accounts 表查询用户
		const db = getDb()
		const stmt = db.prepare(`
			SELECT a.*, r.code as role_code, r.sort_order as role_level
			FROM accounts a
			LEFT JOIN roles r ON a.role_id = r.id
			WHERE a.username = ?
		`)
		stmt.bind([username])
		let account: Record<string, any> | undefined
		if (stmt.step()) {
			account = stmt.getAsObject()
		}
		stmt.free()

		if (!account || account.password !== password) {
			return fail("账号或密码错误")
		}

		// 查询该角色授权的模块
		const menuStmt = db.prepare("SELECT module_key FROM role_menus WHERE role_id = ?")
		menuStmt.bind([account.role_id])
		const modules: string[] = []
		while (menuStmt.step()) {
			const row = menuStmt.getAsObject()
			modules.push(row.module_key as string)
		}
		menuStmt.free()

		const roleLevel = String(account.role_level ?? 99)
		const userInfo: MockUserInfo = {
			accountId: String(account.id),
			accountName: account.display_name as string || account.username as string,
			accountMemo: account.username as string,
			roleName: account.role_code as string,
			roleLevel,
			modules
		}

		const token = generateToken()
		tokenStore.set(token, userInfo)

		return success({ info: token, level: roleLevel, modules }, "登录成功")
	})

	/**
	 * GET /account/loginOut
	 * 登出接口
	 */
	app.get("/account/loginOut", {
		schema: {
			summary: "用户登出",
			tags: ["认证接口"],
			headers: {
				type: "object",
				properties: {
					token: { type: "string" }
				}
			}
		}
	}, async (request: FastifyRequest) => {
		const token = request.headers.token as string | undefined
		if (token) {
			tokenStore.delete(token)
		}
		return success(null, "登出成功")
	})

	/**
	 * GET /account/getAccState
	 * 校验 token 状态
	 */
	app.get("/account/getAccState", {
		schema: {
			summary: "校验 token 状态",
			tags: ["认证接口"],
			querystring: {
				type: "object",
				properties: {
					token: { type: "string" }
				}
			}
		}
	}, async (request: FastifyRequest) => {
		const query = request.query as { token?: string }
		const token = query.token || (request.headers.token as string)

		if (token && tokenStore.has(token)) {
			return success(null, "token 有效")
		}
		return tokenExpired()
	})

	/**
	 * POST /account/getUsInfoByTo
	 * 通过 token 获取用户信息
	 */
	app.post("/account/getUsInfoByTo", {
		schema: {
			summary: "获取用户信息",
			tags: ["认证接口"],
			body: {
				type: "object",
				required: ["token"],
				properties: {
					token: { type: "string" }
				}
			},
			response: {
				200: {
					type: "object",
					properties: {
						state: { type: "integer" },
						message: { type: "string" },
						data: {
							type: "object",
							properties: {
								accountId: { type: "string" },
								accountName: { type: "string" },
								accountMemo: { type: "string" },
								roleName: { type: "string" },
								roleLevel: { type: "string" },
								modules: { type: "array", items: { type: "string" } }
							}
						}
					}
				}
			}
		}
	}, async (request: FastifyRequest) => {
		const { token } = request.body as { token?: string }

		if (!token) {
			return fail("token 不能为空")
		}

		const user = tokenStore.get(token)
		if (user) {
			return success(user, "获取成功")
		}
		return tokenExpired()
	})
}
