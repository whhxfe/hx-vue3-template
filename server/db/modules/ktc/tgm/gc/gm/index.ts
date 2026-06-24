/**
 * tgm/gc/gm 群组管理数据库模块入口
 */
import type { Database } from "sql.js"
import type { DbModule } from "@db/types"
import { createGmTables } from "./schema"
import { seedGmDefaults, seedGmFakeData } from "./seed"

export const gmModule: DbModule = {
  createTables: (db: Database) => createGmTables(db),
  seedDefaults: (db: Database) => seedGmDefaults(db),
  seedFakeData: (db: Database) => seedGmFakeData(db)
}
