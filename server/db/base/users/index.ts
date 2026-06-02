/**
 * users 模块入口（用户信息）
 * 统一导出建表和种子数据函数
 */
import type { Database } from "sql.js"
import type { DbModule } from "../../types.js"
import { createUsersTables } from "./schema.js"
import { seedUsersDefaults, seedUsersFakeData } from "./seed.js"

export const usersModule: DbModule = {
  createTables: (db: Database) => createUsersTables(db),
  seedDefaults: (db: Database) => seedUsersDefaults(db),
  seedFakeData: (db: Database) => seedUsersFakeData(db)
}
