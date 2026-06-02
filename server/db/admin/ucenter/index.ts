/**
 * ucenter 模块入口（用户中心）
 * 统一导出建表和种子数据函数
 */
import type { Database } from "sql.js"
import type { DbModule } from "../../types.js"
import { createUcenterTables } from "./schema.js"
import { seedUcenterDefaults, seedUcenterFakeData } from "./seed.js"

export const ucenterModule: DbModule = {
  createTables: (db: Database) => createUcenterTables(db),
  seedDefaults: (db: Database) => seedUcenterDefaults(db),
  seedFakeData: (db: Database) => seedUcenterFakeData(db)
}
