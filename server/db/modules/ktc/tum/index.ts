/**
 * tum 目标单元监测数据库模块入口
 */
import type { Database } from "sql.js"
import type { DbModule } from "@db/types"
import { ucModule } from "./uc"
import { umModule } from "./um"

export const tumModule: DbModule = {
  createTables: (db: Database) => {
    ucModule.createTables(db)
    umModule.createTables(db)
  },
  seedDefaults: (db: Database) => {
    ucModule.seedDefaults(db)
    umModule.seedDefaults(db)
  }
}
