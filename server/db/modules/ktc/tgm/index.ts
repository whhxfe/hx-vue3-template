/**
 * tgm 目标群体监测数据库模块入口
 */
import type { Database } from "sql.js"
import type { DbModule } from "@db/types"
import { gcModule } from "./gc"
import { gwModule } from "./gw"

export const tgmModule: DbModule = {
  createTables: (db: Database) => {
    gcModule.createTables(db)
    gwModule.createTables(db)
  },
  seedDefaults: (db: Database) => {
    gcModule.seedDefaults(db)
    gwModule.seedDefaults(db)
  },
  seedFakeData: (db: Database) => {
    gcModule.seedFakeData?.(db)
  }
}
