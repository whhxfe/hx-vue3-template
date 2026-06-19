/**
 * 服务模块（modules）统一注册入口
 * 自动扫描 modules 目录下的子目录，发现并注册路由模块
 * 
 * 约定：
 * - 每个子目录的 index.ts 导出 FastifyPluginAsync 作为 default export
 * - 目录名即为路由前缀（如 zddxgk → /wzsys/zddxgk）
 * - 以 _ 开头的目录会被跳过
 */
import type { FastifyInstance } from "fastify"
import path from "path"
import { fileURLToPath } from "url"
import { scanRouteModules } from "../../utils/module-scanner.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function registerModules(app: FastifyInstance, prefix: string) {
	const modulesDir = path.join(__dirname)
	const modules = await scanRouteModules(modulesDir)

	for (const [name, route] of modules) {
		await app.register(route, { prefix: `${prefix}/${name}` })
		console.log(`[Routes] 已注册模块: ${prefix}/${name}`)
	}
}
