/**
 * zddxgk 模块入口（站点概况）
 * 统一导出建表和种子数据函数
 * 聚合 rygk、ryyj、ryst 子模块
 */
import type { Database } from "sql.js"
import type { DbModule } from "../../types.js"
import { createZddxgkTables } from "./schema.js"
import { seedZddxgkDefaults, seedZddxgkFakeData } from "./seed.js"
import { ryyjModule } from "./ryyj/index.js"
import { rystModule } from "./ryst/index.js"

const zddxgkModule: DbModule = {
  createTables: (db: Database) => {
    createZddxgkTables(db)
    ryyjModule.createTables(db)
    rystModule.createTables(db)
  },
  seedDefaults: (db: Database) => {
    seedZddxgkDefaults(db)
    ryyjModule.seedDefaults(db)
    rystModule.seedDefaults(db)
  },
  seedFakeData: (db: Database) => {
    seedZddxgkFakeData(db)
    ryyjModule.seedFakeData?.(db)
    rystModule.seedFakeData?.(db)
  }
}

export default zddxgkModule