/**
 * Faker 数据生成统一入口
 * 按模块调用各模块的 seed 函数
 * 运行方式：cd server && npm run seed
 */
import { initDatabase } from "./init.js"
import { getDb, saveDatabase } from "./manager.js"

// 各模块 Faker 种子
import { seedBaseFakeData } from "./base/seed.js"
import { seedUcenterFakeData } from "./admin/ucenter/seed.js"
import { seedSysconfigFakeData } from "./admin/sysconfig/seed.js"
import { seedDictFakeData } from "./common/dict/seed.js"
import { seedNoticeFakeData } from "./common/notice/seed.js"
import { seedSyslogFakeData } from "./common/syslog/seed.js"
import { seedZddxgkFakeData } from "./modules/zddxgk/seed.js"
import { seedRyyjFakeData } from "./modules/ryyj/seed.js"
import { seedRystFakeData } from "./modules/ryst/seed.js"
import { seedPbctFakeData } from "./modules/pbct/seed.js"

async function seed() {
  // 先初始化数据库（建表 + 默认数据）
  await initDatabase()
  const db = getDb()

  // ========== 清空旧数据 ==========
  const tablesToClear = [
    "users", "logs", "settings",
    "accounts", "roles", "role_menus",
    "rygk_persons", "rygk_categories", "rygk_trees",
    "notices"
  ]
  for (const table of tablesToClear) {
    db.run(`DELETE FROM ${table}`)
  }

  // ========== 按模块生成 Faker 数据 ==========
  seedBaseFakeData(db)
  seedUcenterFakeData(db)
  seedSysconfigFakeData(db)
  seedDictFakeData(db)
  seedNoticeFakeData(db)
  seedSyslogFakeData(db)
  seedZddxgkFakeData(db)
  seedRyyjFakeData(db)
  seedRystFakeData(db)
  seedPbctFakeData(db)

  // ========== 持久化到文件 ==========
  saveDatabase()
  console.log("\n🎉 数据填充完成！已保存到 mock.db")
}

seed().catch((err) => {
  console.error("❌ 数据填充失败:", err)
  process.exit(1)
})