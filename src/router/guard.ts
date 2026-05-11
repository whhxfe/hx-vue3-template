import type { Router } from "vue-router"
import { useSysStore } from "@/store"
import { setupDynamicRoutes } from "./index"

/** 白名单路由：无需登录即可访问 */
const whiteList = ["/", "/login", "/403", "/404", "/303"]

export function setupRouterGuard(router: Router) {
	router.beforeEach(async (to) => {
		const sysStore = useSysStore()

		try {
			// Step 1: 优先处理 URL 中的 token（SSO 回调场景）
			const queryToken = to.query.token as string | undefined
			if (queryToken) {
				await sysStore.setTokenAsync(queryToken)
				const { token: _, ...cleanQuery } = to.query
				return { path: to.path, replace: true, query: cleanQuery }
			}

			// Step 2: 白名单路由直接放行
			if (whiteList.includes(to.path)) {
				return true
			}

			// Step 3: 无需鉴权的页面直接放行
			if (to.meta.noAuth) {
				return true
			}

			// Step 4: 未登录 → 跳转登录页
			if (!sysStore.token) {
				return {
					name: "Login",
					query: { redirect: to.path, ...to.query }
				}
			}

			// Step 5: 已登录但用户信息未加载 → 拉取用户信息
			if (!sysStore.userInfo) {
				const userInfo = await sysStore.fetchUserInfo()
				if (!userInfo) {
					return {
						name: "Login",
						query: { redirect: to.path }
					}
				}
			}

		// Step 6: 动态路由尚未加载 → 注册动态路由
			if (!sysStore.routesLoaded) {
				setupDynamicRoutes()
				return true
			}

			// Step 7: 一切就绪，正常放行
			return true
		} catch (error) {
			console.error("路由守卫异常:", error)
			return {
				name: "Login",
				query: { redirect: to.path, ...to.query }
			}
		}
	})

	router.afterEach((to) => {
		// SYS_CONFIG 来自 public/config.js 全局变量
		const pageTitle = (to.meta.title as string) || SYS_CONFIG.SYSTEM_NAME
		document.title = pageTitle
	})
}