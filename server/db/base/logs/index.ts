/**
 * logs 模块入口（操作日志）
 * 统一导出建表和种子数据函数
 */
import type { Database } from "sql.js"
import type { DbModule } from "../../types.js"
import { createLogsTables } from "./schema.js"
import { seedLogsDefaults, seedLogsFakeData } from "./seed.js"

export const logsModule: DbModule = {
  createTables: (db: Database) => createLogsTables(db),
  seedDefaults: (db: Database) => seedLogsDefaults(db),
  seedFakeData: (db: Database) => seedLogsFakeData(db)
}
