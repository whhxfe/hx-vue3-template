import type { Router, RouteRecordRaw } from 'vue-router'

/**
 * 扫描所有模块的路由配置
 * 路径格式: /src/modules/{moduleKey}/router/routes.ts
 */
const moduleRoutes = import.meta.glob<{ default: RouteRecordRaw[] }>(
	'@/modules/*/router/routes.ts',
	{ eager: true }
)

/**
 * 从文件路径中提取模块 key
 * @param path - 文件路径，如 /src/modules/zddxgk/router/routes.ts
 * @returns 模块 key，如 zddxgk
 */
function extractModuleKey(path: string): string | null {
	const match = path.match(/src\/modules\/([^/]+)/)
	return match?.[1] || null
}

/**
 * 动态注册模块路由
 * @param router - VueRouter 实例
 * @param allowedModules - 用户允许访问的模块 key 列表
 */
export function registerModuleRoutes(router: Router, allowedModules: string[] = []) {
	for (const [path, module] of Object.entries(moduleRoutes)) {
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
			console.log(`[Router] 已注册模块路由: ${moduleKey}`)
		} else {
			console.log(`[Router] 跳过模块路由（未授权）: ${moduleKey}`)
		}
	}
}

/**
 * 获取所有已扫描到的模块列表
 */
export function getAllModules(): string[] {
	const modules: string[] = []
	for (const path of Object.keys(moduleRoutes)) {
		const moduleKey = extractModuleKey(path)
		if (moduleKey) {
			modules.push(moduleKey)
		}
	}
	return modules
}