import { createRouter, createWebHistory } from "vue-router"
import routes from "./routes"
import { setupRouterGuard } from "./guard"
import { registerModuleRoutes } from "./dynamic"
import { useSysStore } from "@/store"

const router = createRouter({
	history: createWebHistory(),
	routes
})

/**
 * 模块级状态：跟踪动态路由是否已注册
 * - 不依赖 Pinia，确保在 app.use(router) 之前即可使用
 */
let _dynamicRoutesRegistered = false

// =============================================
// 公开 API
// =============================================

/**
 * 动态注册模块路由（登录后由路由守卫调用）
 *
 * 三种场景：
 * 1. 刷新页面 — preRegisterRoutesFromCache 已从 sessionStorage 恢复路由，此处仅同步 store 状态
 * 2. 首次登录 — 从 sysStore.authorizedModules 取模块列表并注册
 * 3. 切换账号 — routesLoaded 被重置后重新注册
 */
export function setupDynamicRoutes(): void {
	const sysStore = useSysStore()

	// 刷新场景：路由已预注册，仅同步 store 状态
	if (_dynamicRoutesRegistered) {
		if (!sysStore.routesLoaded) {
			sysStore.setRoutesLoaded(true)
		}
		return
	}

	// 登录场景：首次注册动态路由
	const allowedModules = sysStore.authorizedModules || []
	registerModuleRoutes(router, allowedModules)
	_dynamicRoutesRegistered = true
	sysStore.setRoutesLoaded(true)

	console.log("[Router] 动态路由注册完成:", allowedModules)
}

// =============================================
// 内部辅助
// =============================================

/**
 * 从 sessionStorage 恢复用户模块信息并预注册动态路由
 * 解决刷新页面时路由表尚未构建导致匹配到 404 的问题
 *
 * 调用时机：模块顶层立即执行，早于 app.use(router)
 */
function preRegisterRoutesFromCache() {
	if (_dynamicRoutesRegistered) return

	const cachedUserInfo = sessionStorage.getItem("user_info")
	if (!cachedUserInfo) return

	try {
		const parsed = JSON.parse(cachedUserInfo)
		const modules: string[] = parsed?.modules || []
		if (modules.length > 0) {
			registerModuleRoutes(router, modules)
			_dynamicRoutesRegistered = true
			console.log("[Router] 已从 sessionStorage 预注册路由:", modules)
		}
	} catch {
		console.warn("[Router] 解析缓存的 user_info 失败，跳过预注册")
	}
}

// =============================================
// 初始化
// =============================================

// 预注册：早于 Pinia 初始化，直接从 sessionStorage 读取
// 确保 app.use(router) 首次导航解析之前动态路由已就位
preRegisterRoutesFromCache()

// 注册路由守卫
setupRouterGuard(router)

export default router