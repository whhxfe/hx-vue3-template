import type { RouteRecordRaw } from "vue-router"

/**
 * 静态路由配置
 * - 公共路由：Login、404、403 等（无 Layout 包裹）
 * - 基础页面：DevHome、Profile 等（统一由 RouteLayout 包裹）
 * - 错误页面：303、403、404（无 Layout 包裹）
 *
 * 动态模块路由请在 src/modules/{moduleName}/router/routes.ts 中配置
 * 动态注册逻辑见 src/router/dynamic.ts
 */
const routes: RouteRecordRaw[] = [
	{
		path: "/",
		redirect: "/devhome"
	},
	// ---- 需 Layout 包裹的页面（已登录用户均需要侧边栏导航） ----
	{
		path: "/",
component: () => import("@/hx-components/layout/route-layout.vue"),
		children: [
			{
				path: "devhome",
				name: "DevHome",
				meta: { title: "devhome" },
				component: () => import("@/views/dev-home/index.vue")
			},
			{
				path: "profile",
				name: "Profile",
				meta: { title: "个人中心" },
				component: () => import("@/views/profile/index.vue")
			},
			{
				path: "303",
				name: "Redirect",
				meta: { title: "跳转中..." },
				component: () => import("@/views/auth/303.vue")
			},
			{
				path: "403",
				name: "Forbidden",
				meta: { title: "403 无权限" },
				component: () => import("@/views/auth/403.vue")
			},
			{
				path: "404",
				name: "NotFound",
				meta: { title: "404 页面不存在" },
				component: () => import("@/views/auth/404.vue")
			}
		]
	},
	// ---- 无 Layout 的公共页面 ----
	{
		name: "Login",
		path: "/login",
		meta: { noAuth: true },
		component: () => import("@/views/login/v2.vue")
	},
	// ---- 兜底 ----
	{
		path: "/:pathMatch(.*)*",
		redirect: "/404"
	}
]

export default routes
