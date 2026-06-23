/**
 * pw 子模块入口（人员预警）
 * 作为 ktc/tpm 的子模块
 */
import type { Database } from "sql.js"
import type { DbModule } from "@db/types"
import { createPwTables } from "./schema"
import { seedPwDefaults, seedPwFakeData } from "./seed"

export const pwModule: DbModule = {
  createTables: (db: Database) => createPwTables(db),
  seedDefaults: (db: Database) => seedPwDefaults(db),
  seedFakeData: (db: Database) => seedPwFakeData(db)
}
