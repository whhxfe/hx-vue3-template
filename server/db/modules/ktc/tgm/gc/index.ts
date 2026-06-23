/**
 * tgm/gc 群体管控数据库模块入口
 */
import type { Database } from "sql.js"
import type { DbModule } from "@db/types"
import { createGcTables } from "./schema"
import { seedGcDefaults, seedGcFakeData } from "./seed"
import { pmgModule } from "./pmg"
import { gmModule } from "./gm"
import { sgmModule } from "./sgm"
import { gaModule } from "./ga"

export const gcModule: DbModule = {
  createTables: (db: Database) => {
    createGcTables(db)
    pmgModule.createTables(db)
    gmModule.createTables(db)
    sgmModule.createTables(db)
    gaModule.createTables(db)
  },
  seedDefaults: (db: Database) => {
    seedGcDefaults(db)
    pmgModule.seedDefaults(db)
    gmModule.seedDefaults(db)
    sgmModule.seedDefaults(db)
    gaModule.seedDefaults(db)
  },
  seedFakeData: (db: Database) => {
    seedGcFakeData(db)
    pmgModule.seedFakeData?.(db)
  }
}
