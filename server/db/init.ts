/**
 * 数据库统一初始化入口
 * 负责：创建数据库实例 → 建表 → 初始化默认数据
 * 按模块组织，每个模块独立管理自己的 schema 和 seed
 *
 * 新增模块时只需：
 * 1. 在 db/modules/ 下创建子目录
 * 2. 在子目录创建 index.ts 导出 DbModule 作为 default export
 * 3. 自动扫描器会自动发现并注册（以 _ 开头的目录会被跳过）
 */
import { createDatabase, saveDatabase } from "./manager.js"
import type { DbModule } from "./types.js"
import { baseModules } from "./base/index.js"
import { adminModules } from "./admin/index.js"
import { commonModules } from "./common/index.js"
import { businessModules } from "./modules/index.js"

const allModules: DbModule[] = [...baseModules, ...adminModules, ...commonModules, ...businessModules]

/**
 * 初始化数据库
 * 创建实例 → 建表 → 插入默认数据（仅表为空时）
 */
export async function initDatabase() {
  const db = await createDatabase()

  // 按模块顺序执行建表和种子数据初始化
  for (const mod of allModules) {
    mod.createTables(db)
    mod.seedDefaults(db)
  }

  saveDatabase()

  return db
}