/**
 * 模块自动扫描器
 * 扫描目录下的子目录，自动发现并导入路由模块和数据库模块
 * 
 * 约定：
 * - 路由模块：index.ts 导出 FastifyPluginAsync 作为 default export
 * - 数据库模块：index.ts 导出 DbModule 作为 default export
 * - 以下划线 _ 开头的目录会被跳过（如 _templates）
 */
import fs from "fs"
import path from "path"
import { fileURLToPath, pathToFileURL } from "url"
import type { FastifyPluginAsync } from "fastify"
import type { DbModule } from "../db/types.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * 将绝对路径转换为 file:// URL（兼容 Windows）
 */
function toFileUrl(absolutePath: string): string {
  return pathToFileURL(absolutePath).href
}

/**
 * 扫描目录下的子目录名
 * @param dirPath 要扫描的目录绝对路径
 * @returns 子目录名数组（排除 _ 开头的目录）
 */
function scanSubdirs(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return []

  return fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith("_") && d.name !== "node_modules")
    .map(d => d.name)
}

/**
 * 扫描路由模块目录，返回 [模块名, 路由插件] 数组
 * @param modulesDir 路由模块目录绝对路径（如 server/routes/modules）
 * @returns [moduleName, routePlugin][]
 */
export async function scanRouteModules(
  modulesDir: string
): Promise<[string, FastifyPluginAsync][]> {
  const dirs = scanSubdirs(modulesDir)
  const modules: [string, FastifyPluginAsync][] = []

  for (const dir of dirs) {
    try {
      const modulePath = path.join(modulesDir, dir, "index.js")
      const mod = await import(toFileUrl(modulePath))
      const route = mod.default as FastifyPluginAsync

      if (typeof route === "function") {
        modules.push([dir, route])
        console.log(`[Scanner] 已发现路由模块: ${dir}`)
      } else {
        console.warn(`[Scanner] 模块 ${dir}/index.ts 未导出 default 路由函数，跳过`)
      }
    } catch (error) {
      console.error(`[Scanner] 加载路由模块 ${dir} 失败:`, error)
    }
  }

  return modules
}

/**
 * 扫描数据库模块目录，返回 DbModule 数组
 * @param modulesDir 数据库模块目录绝对路径（如 server/db/modules）
 * @returns DbModule[]
 */
export async function scanDbModules(
  modulesDir: string
): Promise<DbModule[]> {
  const dirs = scanSubdirs(modulesDir)
  const modules: DbModule[] = []

  for (const dir of dirs) {
    try {
      const modulePath = path.join(modulesDir, dir, "index.js")
      const mod = await import(toFileUrl(modulePath))
      const dbModule = mod.default as DbModule

      if (dbModule && typeof dbModule.createTables === "function" && typeof dbModule.seedDefaults === "function") {
        modules.push(dbModule)
        console.log(`[Scanner] 已发现数据库模块: ${dir}`)
      } else {
        console.warn(`[Scanner] 模块 ${dir}/index.ts 未导出有效的 DbModule，跳过`)
      }
    } catch (error) {
      console.error(`[Scanner] 加载数据库模块 ${dir} 失败:`, error)
    }
  }

  return modules
}
