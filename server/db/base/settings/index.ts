/**
 * settings 模块入口（系统设置）
 * 统一导出建表和种子数据函数
 */
import type { Database } from "sql.js"
import type { DbModule } from "../../types.js"
import { createSettingsTables } from "./schema.js"
import { seedSettingsDefaults, seedSettingsFakeData } from "./seed.js"

export const settingsModule: DbModule = {
  createTables: (db: Database) => createSettingsTables(db),
  seedDefaults: (db: Database) => seedSettingsDefaults(db),
  seedFakeData: (db: Database) => seedSettingsFakeData(db)
}
