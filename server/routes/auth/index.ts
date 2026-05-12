/**
 * 认证相关接口 Mock 路由
 * 模拟 /account/ 下的所有接口
 * 数据来源：SQLite (accounts / roles / role_menus 表)
 */
import type { FastifyInstance, FastifyRequest } from "fastify"
import type { MockUserInfo } from "./types"
import { getDb } from "@db/db"
import { success, fail, tokenExpired } from "@utils/response"

/** Token 有效期（秒）- 24小时 */
const TOKEN_EXPIRES_IN = 24 * 60 * 60

/** token 内存存储：token -> { user: 用户信息, expiresAt: 过期时间戳 } */
const tokenStore = new Map<string, { user: MockUserInfo; expiresAt: number }>()

/**
 * 后台系统模块列表
 * 这些模块归类为 adminModules，用于前端动态注册后台管理路由
 */
const ADMIN_MODULE_KEYS = ['ucenter', 'sysconfig', 'syslog', 'dict', 'notice']

function generateToken(): string {
	return "mock_token_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8)
}

/**
 * 检查 token 是否存在且未过期
 */
function checkToken(token: string): { valid: boolean; user?: MockUserInfo; expiresIn?: number } {
	const entry = tokenStore.get(token)
	if (!entry) {
		return { valid: false }
	}
	if (Date.now() > entry.expiresAt) {
		tokenStore.delete(token)
		return { valid: false }
	}
	const expiresIn = Math.floor((entry.expiresAt - Date.now()) / 1000)
	return { valid: true, user: entry.user, expiresIn }
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
								modules: { type: "array", items: { type: "string" }, description: "授权业务模块" },
								adminModules: { type: "array", items: { type: "string" }, description: "授权后台系统模块" }
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
		const adminModules: string[] = []
		while (menuStmt.step()) {
			const row = menuStmt.getAsObject()
			const moduleKey = row.module_key as string
			// 后台系统模块归类为 adminModules
			if (ADMIN_MODULE_KEYS.includes(moduleKey)) {
				adminModules.push(moduleKey)
			} else {
				modules.push(moduleKey)
			}
		}
		menuStmt.free()

		const roleLevel = String(account.role_level ?? 99)
		const userInfo: MockUserInfo = {
			accountId: String(account.id),
			accountName: (account.display_name as string) || (account.username as string),
			username: account.username as string,
			email: account.email as string | undefined,
			phone: account.phone as string | undefined,
			roleName: account.role_code as string,
			roleLevel,
			modules,
			adminModules
		}

		const token = generateToken()
		const expiresAt = Date.now() + TOKEN_EXPIRES_IN * 1000
		tokenStore.set(token, { user: userInfo, expiresAt })

		return success({ info: token, level: roleLevel, modules, adminModules, expiresIn: TOKEN_EXPIRES_IN }, "登录成功")
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
		return success({ success: true }, "登出成功")
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

		if (token) {
			const result = checkToken(token)
			if (result.valid && result.user) {
				return success({
					valid: true,
					accountId: result.user.accountId,
					accountName: result.user.accountName,
					expiresIn: result.expiresIn
				}, "token 有效")
			}
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
								username: { type: "string" },
								email: { type: "string" },
								phone: { type: "string" },
								roleName: { type: "string" },
								roleLevel: { type: "string" },
								modules: { type: "array", items: { type: "string" } },
								adminModules: { type: "array", items: { type: "string" } }
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

		const result = checkToken(token)
		if (result.valid && result.user) {
			return success(result.user, "获取成功")
		}
		return tokenExpired()
	})
}
