/**
 * notice 模块入口（公告通知）
 * 统一导出建表和种子数据函数
 */
import type { Database } from "sql.js"
import type { DbModule } from "../../types.js"
import { createNoticeTables } from "./schema.js"
import { seedNoticeDefaults, seedNoticeFakeData } from "./seed.js"

export const noticeModule: DbModule = {
  createTables: (db: Database) => createNoticeTables(db),
  seedDefaults: (db: Database) => seedNoticeDefaults(db),
  seedFakeData: (db: Database) => seedNoticeFakeData(db)
}
