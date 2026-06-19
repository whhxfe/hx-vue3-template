/**
 * modules 分类聚合入口
 * 自动扫描 modules 目录下的子目录，发现并聚合所有业务数据库模块
 * 
 * 约定：
 * - 每个子目录的 index.ts 导出 DbModule 作为 default export
 * - 以 _ 开头的目录会被跳过
 */
import type { DbModule } from "../types.js"
import path from "path"
import { fileURLToPath } from "url"
import { scanDbModules } from "../../utils/module-scanner.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const businessModules: DbModule[] = await scanDbModules(__dirname)
