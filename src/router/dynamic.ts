import type { Router, RouteRecordRaw } from 'vue-router'

/**
 * 扫描系统模块路由（admin/*）
 * 后台系统模块按 adminModules 权限动态注册
 */
const systemRoutes = import.meta.glob<{ default: RouteRecordRaw[] }>(
	'@/admin/*/router/routes.ts',
	{ eager: true }
)

/**
 * 扫描业务模块路由（modules/*）
 * 业务模块按用户权限动态注册
 */
const businessRoutes = import.meta.glob<{ default: RouteRecordRaw[] }>(
	'@/modules/*/router/routes.ts',
	{ eager: true }
)

/**
 * 从文件路径中提取模块 key
 * @param path - 文件路径，如 /src/modules/zddxgk/router/routes.ts
 * @returns 模块 key，如 zddxgk
 */
function extractModuleKey(path: string): string | null {
	const match = path.match(/src\/(?:admin|modules)\/([^/]+)/)
	return match?.[1] || null
}

/**
 * 动态注册后台系统模块路由
 * @param router - VueRouter 实例
 * @param allowedAdminModules - 用户允许访问的后台系统模块 key 列表
 */
export function registerSystemRoutes(router: Router, allowedAdminModules: string[] = []) {
	for (const [path, module] of Object.entries(systemRoutes)) {
		const routes = module.default
		if (!routes || routes.length === 0) continue

		const moduleKey = extractModuleKey(path)
		if (!moduleKey) continue

		// 权限过滤：仅当模块在 allowedAdminModules 列表中时注册
		if (allowedAdminModules.includes(moduleKey)) {
			routes.forEach(route => {
				router.addRoute(route)
			})
			console.log(`[Router] 已注册后台系统模块路由: ${moduleKey}`)
		} else {
			console.log(`[Router] 跳过后台系统模块路由（未授权）: ${moduleKey}`)
		}
	}
}

/**
 * 动态注册业务模块路由
 * @param router - VueRouter 实例
 * @param allowedModules - 用户允许访问的模块 key 列表
 */
export function registerBusinessRoutes(router: Router, allowedModules: string[] = []) {
	for (const [path, module] of Object.entries(businessRoutes)) {
		const routes = module.default
		if (!routes || routes.length === 0) continue

		const moduleKey = extractModuleKey(path)
		if (!moduleKey) continue

		// 权限过滤：始终允许 _templates 示例模块
		const isAllowed = allowedModules.includes(moduleKey) || moduleKey === '_templates'

		if (isAllowed) {
			routes.forEach(route => {
				router.addRoute(route)
			})
			console.log(`[Router] 已注册业务模块路由: ${moduleKey}`)
		} else {
			console.log(`[Router] 跳过业务模块路由（未授权）: ${moduleKey}`)
		}
	}
}

/**
 * 统一动态注册模块路由
 * @param router - VueRouter 实例
 * @param allowedModules - 用户允许访问的业务模块 key 列表
 * @param allowedAdminModules - 用户允许访问的后台系统模块 key 列表
 */
export function registerModuleRoutes(router: Router, allowedModules: string[] = [], allowedAdminModules: string[] = []) {
	// 1. 注册后台系统模块（按权限过滤）
	registerSystemRoutes(router, allowedAdminModules)

	// 2. 注册业务模块（按权限过滤）
	registerBusinessRoutes(router, allowedModules)
}

/**
 * 获取所有已扫描到的模块列表（业务模块）
 */
export function getAllBusinessModules(): string[] {
	const modules: string[] = []
	for (const path of Object.keys(businessRoutes)) {
		const moduleKey = extractModuleKey(path)
		if (moduleKey) {
			modules.push(moduleKey)
		}
	}
	return modules
}

/**
 * 获取所有已扫描到的系统模块列表
 */
export function getAllSystemModules(): string[] {
	const modules: string[] = []
	for (const path of Object.keys(systemRoutes)) {
		const moduleKey = extractModuleKey(path)
		if (moduleKey) {
			modules.push(moduleKey)
		}
	}
	return modules
}
