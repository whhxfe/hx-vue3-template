/**
 * ryst 子模块入口（人员视图）
 * 作为 zddxgk 的子模块
 */
import type { Database } from "sql.js"
import type { DbModule } from "../../../types.js"
import { createRystTables } from "./schema.js"
import { seedRystDefaults, seedRystFakeData } from "./seed.js"

export const rystModule: DbModule = {
  createTables: (db: Database) => createRystTables(db),
  seedDefaults: (db: Database) => seedRystDefaults(db),
  seedFakeData: (db: Database) => seedRystFakeData(db)
}