/**
 * Token 存储管理
 * 从 auth/index.ts 中提取，便于在 base-controller 中复用
 */
import { authConfig } from "../../config/index.js"
import type { MockUserInfo } from "./types"

/** token 内存存储：token -> { user: 用户信息, expiresAt: 过期时间戳 } */
const tokenStore = new Map<string, { user: MockUserInfo; expiresAt: number }>()

/**
 * 生成 token 字符串
 */
export function generateToken(): string {
	return authConfig.tokenPrefix + Date.now() + "_" + Math.random().toString(36).slice(2, 8)
}

/**
 * 检查 token 是否存在且未过期
 */
export function checkToken(token: string): { valid: boolean; user?: MockUserInfo; expiresIn?: number } {
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

/**
 * 存储 token 与用户信息的关联
 */
export function setToken(token: string, user: MockUserInfo, expiresAt: number) {
	tokenStore.set(token, { user, expiresAt })
}

/**
 * 删除 token
 */
export function deleteToken(token: string) {
	tokenStore.delete(token)
}

/**
 * 清理过期 token（可定时调用）
 */
export function cleanExpiredTokens(): number {
	const now = Date.now()
	let count = 0
	for (const [token, entry] of tokenStore.entries()) {
		if (now > entry.expiresAt) {
			tokenStore.delete(token)
			count++
		}
	}
	return count
}