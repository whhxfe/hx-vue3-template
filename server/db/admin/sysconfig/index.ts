/**
 * sysconfig 模块入口（系统配置）
 * 统一导出建表和种子数据函数
 */
import type { Database } from "sql.js"
import type { DbModule } from "../../types.js"
import { createSysconfigTables } from "./schema.js"
import { seedSysconfigDefaults, seedSysconfigFakeData } from "./seed.js"

export const sysconfigModule: DbModule = {
  createTables: (db: Database) => createSysconfigTables(db),
  seedDefaults: (db: Database) => seedSysconfigDefaults(db),
  seedFakeData: (db: Database) => seedSysconfigFakeData(db)
}
