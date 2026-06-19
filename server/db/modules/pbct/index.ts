/**
 * pbct 模块入口（排查台账）
 * 统一导出建表和种子数据函数
 */
import type { Database } from "sql.js"
import type { DbModule } from "../../types.js"
import { createPbctTables } from "./schema.js"
import { seedPbctDefaults, seedPbctFakeData } from "./seed.js"

const pbctModule: DbModule = {
  createTables: (db: Database) => createPbctTables(db),
  seedDefaults: (db: Database) => seedPbctDefaults(db),
  seedFakeData: (db: Database) => seedPbctFakeData(db)
}

export default pbctModule
