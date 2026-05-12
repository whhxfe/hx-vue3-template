/**
 * localStorage 封装工具
 */
import { STORAGE_KEYS } from '@/constants'

/**
 * 存储工具类
 */
export const storage = {
	/**
	 * 获取存储值
	 */
	get: <T>(key: string, defaultValue?: T): T | undefined => {
		try {
			const value = localStorage.getItem(key)
			if (value === null) return defaultValue
			return JSON.parse(value) as T
		} catch {
			return defaultValue
		}
	},

	/**
	 * 设置存储值
	 */
	set: (key: string, value: unknown) => {
		try {
			localStorage.setItem(key, JSON.stringify(value))
		} catch (e) {
			console.error('Storage set error:', e)
		}
	},

	/**
	 * 移除存储值
	 */
	remove: (key: string) => {
		localStorage.removeItem(key)
	},

	/**
	 * 清空所有存储
	 */
	clear: () => {
		localStorage.clear()
	},

	/**
	 * 检查是否存在
	 */
	has: (key: string): boolean => {
		return localStorage.getItem(key) !== null
	},

	/**
	 * 获取 token
	 */
	getToken: (): string | null => {
		return storage.get<string>(STORAGE_KEYS.TOKEN)
	},

	/**
	 * 设置 token
	 */
	setToken: (token: string) => {
		storage.set(STORAGE_KEYS.TOKEN, token)
	},

	/**
	 * 移除 token
	 */
	removeToken: () => {
		storage.remove(STORAGE_KEYS.TOKEN)
	},

	/**
	 * 获取用户信息
	 */
	getUserInfo: <T>(): T | undefined => {
		return storage.get<T>(STORAGE_KEYS.USER_INFO)
	},

	/**
	 * 设置用户信息
	 */
	setUserInfo: (userInfo: unknown) => {
		storage.set(STORAGE_KEYS.USER_INFO, userInfo)
	}
}

export default storage
