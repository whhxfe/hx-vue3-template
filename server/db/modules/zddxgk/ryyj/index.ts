/**
 * ryyj 子模块入口（人员预警）
 * 作为 zddxgk 的子模块
 */
import type { Database } from "sql.js"
import type { DbModule } from "../../../types.js"
import { createRyyjTables } from "./schema.js"
import { seedRyyjDefaults, seedRyyjFakeData } from "./seed.js"

export const ryyjModule: DbModule = {
  createTables: (db: Database) => createRyyjTables(db),
  seedDefaults: (db: Database) => seedRyyjDefaults(db),
  seedFakeData: (db: Database) => seedRyyjFakeData(db)
}