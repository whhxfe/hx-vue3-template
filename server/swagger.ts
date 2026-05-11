/**
 * Swagger / OpenAPI 配置
 */

export const PORT = 3000

export const swaggerConfig = {
	openapi: {
		info: {
			title: "HX Mock Server API",
			description: "前端自测 Mock 服务 - Fastify + SQLite(sql.js) + Swagger",
			version: "1.0.0"
		},
		servers: [
			{ url: `http://localhost:${PORT}`, description: "本地开发" }
		],
		tags: [
			{ name: "认证接口", description: "登录/登出/用户信息" },
			{ name: "用户管理", description: "用户 CRUD（SQLite）" },
			{ name: "操作日志", description: "操作日志查询（SQLite）" },
			{ name: "系统设置", description: "系统设置管理（SQLite）" },
			{ name: "数据统计", description: "仪表盘统计数据（SQLite）" },
			{ name: "用户中心", description: "账号管理、角色管理、权限分配" }
		]
	}
}

export const swaggerUiConfig = {
	routePrefix: "/docs",
	uiConfig: {
		docExpansion: "list" as const,
		deepLinking: true
	}
}
