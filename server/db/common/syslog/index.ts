/**
 * syslog 模块入口（系统日志）
 * 统一导出建表和种子数据函数
 */
import type { Database } from "sql.js"
import type { DbModule } from "../../types.js"
import { createSyslogTables } from "./schema.js"
import { seedSyslogDefaults, seedSyslogFakeData } from "./seed.js"

export const syslogModule: DbModule = {
  createTables: (db: Database) => createSyslogTables(db),
  seedDefaults: (db: Database) => seedSyslogDefaults(db),
  seedFakeData: (db: Database) => seedSyslogFakeData(db)
}
