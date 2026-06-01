/**
 * 数据库统一初始化入口
 * 负责：创建数据库实例 → 建表 → 初始化默认数据
 * 按模块组织，每个模块独立管理自己的 schema 和 seed
 */
import { createDatabase, saveDatabase } from "./manager.js"

// 各模块 schema
import { createBaseTables } from "./base/schema.js"
import { createUcenterTables } from "./admin/ucenter/schema.js"
import { createSysconfigTables } from "./admin/sysconfig/schema.js"
import { createDictTables } from "./common/dict/schema.js"
import { createNoticeTables } from "./common/notice/schema.js"
import { createSyslogTables } from "./common/syslog/schema.js"
import { createZddxgkTables } from "./modules/zddxgk/schema.js"
import { createRyyjTables } from "./modules/ryyj/schema.js"
import { createRystTables } from "./modules/ryst/schema.js"
import { createPbctTables } from "./modules/pbct/schema.js"

// 各模块 seed（表为空时的默认数据）
import { seedBaseDefaults } from "./base/seed.js"
import { seedUcenterDefaults } from "./admin/ucenter/seed.js"
import { seedSysconfigDefaults } from "./admin/sysconfig/seed.js"
import { seedDictDefaults } from "./common/dict/seed.js"
import { seedNoticeDefaults } from "./common/notice/seed.js"
import { seedSyslogDefaults } from "./common/syslog/seed.js"
import { seedZddxgkDefaults } from "./modules/zddxgk/seed.js"
import { seedRyyjDefaults } from "./modules/ryyj/seed.js"
import { seedRystDefaults } from "./modules/ryst/seed.js"
import { seedPbctDefaults } from "./modules/pbct/seed.js"

/**
 * 初始化数据库
 * 创建实例 → 建表 → 插入默认数据（仅表为空时）
 */
export async function initDatabase() {
  const db = await createDatabase()

  // ========== 建表 ==========
  createBaseTables(db)
  createUcenterTables(db)
  createSysconfigTables(db)
  createDictTables(db)
  createNoticeTables(db)
  createSyslogTables(db)
  createZddxgkTables(db)
  createRyyjTables(db)
  createRystTables(db)
  createPbctTables(db)

  // ========== 初始化默认数据（仅表为空时执行） ==========
  seedBaseDefaults(db)
  seedUcenterDefaults(db)
  seedSysconfigDefaults(db)
  seedDictDefaults(db)
  seedNoticeDefaults(db)
  seedSyslogDefaults(db)
  seedZddxgkDefaults(db)
  seedRyyjDefaults(db)
  seedRystDefaults(db)
  seedPbctDefaults(db)

  saveDatabase()

  return db
}