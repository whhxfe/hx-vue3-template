/**
 * tgm/gc 群体管控数据库模块入口
 */
import type { Database } from "sql.js"
import type { DbModule } from "@db/types"
import { pmgModule } from "./pmg"
import { gmModule } from "./gm"
import { sgmModule } from "./sgm"
import { gaModule } from "./ga"

export const gcModule: DbModule = {
  createTables: (db: Database) => {
    pmgModule.createTables(db)
    gmModule.createTables(db)
    sgmModule.createTables(db)
    gaModule.createTables(db)
  },
  seedDefaults: (db: Database) => {
    pmgModule.seedDefaults(db)
    gmModule.seedDefaults(db)
    sgmModule.seedDefaults(db)
    gaModule.seedDefaults(db)
  }
}
