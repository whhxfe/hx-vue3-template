/**
 * pm 子模块入口（人员上图）
 * 作为 ktc/tpm 的子模块
 */
import type { Database } from "sql.js"
import type { DbModule } from "@db/types"
import { createPmTables } from "./schema"
import { seedPmDefaults, seedPmFakeData } from "./seed"

export const pmModule: DbModule = {
  createTables: (db: Database) => createPmTables(db),
  seedDefaults: (db: Database) => seedPmDefaults(db),
  seedFakeData: (db: Database) => seedPmFakeData(db)
}
