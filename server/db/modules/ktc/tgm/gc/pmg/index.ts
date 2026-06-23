/**
 * tgm/gc/pmg 人员管理数据库模块入口
 */
import type { Database } from "sql.js"
import type { DbModule } from "@db/types"
import { createPmgTables } from "./schema"
import { seedPmgDefaults, seedPmgFakeData } from "./seed"

export const pmgModule: DbModule = {
  createTables: (db: Database) => createPmgTables(db),
  seedDefaults: (db: Database) => seedPmgDefaults(db),
  seedFakeData: (db: Database) => seedPmgFakeData(db)
}
