/**
 * pc 子模块入口（人员管控）
 * 作为 ktc/tpm 的子模块
 */
import type { Database } from "sql.js"
import type { DbModule } from "@db/types"
import { createPcTables } from "./schema"
import { seedPcDefaults, seedPcFakeData } from "./seed"

export const pcModule: DbModule = {
  createTables: (db: Database) => createPcTables(db),
  seedDefaults: (db: Database) => seedPcDefaults(db),
  seedFakeData: (db: Database) => seedPcFakeData(db)
}
