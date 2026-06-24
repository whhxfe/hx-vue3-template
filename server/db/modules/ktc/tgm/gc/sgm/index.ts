/**
 * tgm/gc/sgm 子群体管理数据库模块入口
 */
import type { Database } from "sql.js"
import type { DbModule } from "@db/types"
import { createSgmTables } from "./schema"
import { seedSgmDefaults, seedSgmFakeData } from "./seed"

export const sgmModule: DbModule = {
  createTables: (db: Database) => createSgmTables(db),
  seedDefaults: (db: Database) => seedSgmDefaults(db),
  seedFakeData: (db: Database) => seedSgmFakeData(db)
}
