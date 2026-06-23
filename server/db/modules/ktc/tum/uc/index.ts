/**
 * tum/uc 单元管控数据库模块入口
 */
import type { Database } from "sql.js"
import type { DbModule } from "@db/types"
import { uaModule } from "./ua"

export const ucModule: DbModule = {
  createTables: (db: Database) => {
    uaModule.createTables(db)
  },
  seedDefaults: (db: Database) => {
    uaModule.seedDefaults(db)
  }
}
