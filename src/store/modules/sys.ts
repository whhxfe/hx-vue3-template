import { defineStore } from "pinia"
import { ref, watch, computed } from "vue"
import * as authApi from "@/api/auth"
import type { UserInfo } from "@/api/auth"

const useSysStore = defineStore("sys", () => {
	const token = ref<string | null>(sessionStorage.getItem("auth_token"))

	const userInfo = ref<UserInfo | null>(
		sessionStorage.getItem("user_info") ? JSON.parse(sessionStorage.getItem("user_info")!) : null
	)

	const showTokenDialog = ref(false)
	const routesLoaded = ref(false)

	// 用户已授权的模块列表（从 userInfo 派生）
	const authorizedModules = computed(() => userInfo.value?.modules || [])

	// 用户已授权的后台系统模块列表（从 userInfo 派生）
	const authorizedAdminModules = computed(() => userInfo.value?.adminModules || [])

	// 标识是否正在加载用户信息
	const isLoadingUserInfo = ref(false)

	/**
	 * 统一的获取用户信息入口
	 * 仅在有 token 且尚未加载用户信息时调用
	 */
	const fetchUserInfo = async (): Promise<UserInfo | null> => {
		if (!token.value) return null
		if (userInfo.value) return userInfo.value
		if (isLoadingUserInfo.value) {
			// 等待正在进行的加载完成
			return waitForUserInfo()
		}

		isLoadingUserInfo.value = true
		try {
			const res = await authApi.getUserInfo({ token: token.value })
			if (res.state === 2000) {
				setUserInfo(res.data)
				return res.data
			}
			return null
		} finally {
			isLoadingUserInfo.value = false
		}
	}

	/**
	 * 等待用户信息加载完成
	 */
	const waitForUserInfo = (timeout = 10000): Promise<UserInfo | null> => {
		return new Promise((resolve) => {
			if (userInfo.value) {
				resolve(userInfo.value)
				return
			}

			const startTime = Date.now()
			const check = () => {
				if (userInfo.value) {
					resolve(userInfo.value)
					return
				}
				if (Date.now() - startTime > timeout) {
					console.warn("[SysStore] Timeout waiting for user info")
					resolve(null)
					return
				}
				setTimeout(check, 50)
			}
			check()
		})
	}

	const setToken = (newToken: string) => {
		token.value = newToken
		sessionStorage.setItem("auth_token", newToken)
	}

	/**
	 * 异步设置Token并获取用户信息
	 */
	const setTokenAsync = async (newToken: string): Promise<UserInfo | null> => {
		token.value = newToken
		sessionStorage.setItem("auth_token", newToken)
		return await fetchUserInfo()
	}

	const setUserInfo = (info: any) => {
		userInfo.value = info
		sessionStorage.setItem("user_info", JSON.stringify(info))
		// authorizedModules 现在是 computed 属性，会自动从 userInfo.modules 派生
	}

	const clearToken = () => {
		token.value = null
		sessionStorage.removeItem("auth_token")
	}

	const clearUserInfo = () => {
		userInfo.value = null
		sessionStorage.removeItem("user_info")
		// authorizedModules 是 computed 属性，会自动变为空数组
	}
	const setShowTokenDialog = (val: boolean) => {
		showTokenDialog.value = val
	}

	const setRoutesLoaded = (val: boolean) => {
		routesLoaded.value = val
	}

	const logout = () => {
		clearToken()
		clearUserInfo()
		showTokenDialog.value = false
		routesLoaded.value = false
	}

	// token 变化时重置用户信息（登出场景）
	watch(
		token,
		(newToken, oldToken) => {
			if (newToken === oldToken) return
			if (!newToken) {
				// token 被清空时，重置相关状态
				clearUserInfo()
				routesLoaded.value = false
			}
		}
	)

	return {
		userInfo,
		setUserInfo,
		clearUserInfo,
		token,
		showTokenDialog,
		setToken,
		setTokenAsync,
		fetchUserInfo,
		waitForUserInfo,
		isLoadingUserInfo,
		clearToken,
		setShowTokenDialog,
		logout,
		routesLoaded,
		setRoutesLoaded,
		authorizedModules,
		authorizedAdminModules
	}
})

export default useSysStore
