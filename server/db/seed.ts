/**
 * Faker 数据生成统一入口
 * 参考 init.ts 模块化组织，通过 allModules 遍历调用各模块的 seedFakeData
 * 运行方式：cd server && npm run seed
 */
import { createDatabase, getDb, saveDatabase } from "./manager.js"
import type { DbModule } from "./types.js"
import { baseModules } from "./base/index.js"
import { adminModules } from "./admin/index.js"
import { commonModules } from "./common/index.js"
import { businessModules } from "./modules/index.js"

const allModules: DbModule[] = [...baseModules, ...adminModules, ...commonModules, ...businessModules]

async function seed() {
  // 先创建数据库实例
  await createDatabase()
  const db = getDb()

  // ========== 建表 + 默认数据 ==========
  for (const mod of allModules) {
    mod.createTables(db)
    mod.seedDefaults(db)
  }

  // ========== 清空旧 Faker 数据 ==========
  const tablesToClear = [
    "users", "logs", "settings",
    "accounts", "roles", "role_menus",
    "rygk_persons", "rygk_categories", "rygk_trees",
    "notices"
  ]
  for (const table of tablesToClear) {
    db.run(`DELETE FROM ${table}`)
  }

  // ========== 按模块顺序生成 Faker 数据 ==========
  for (const mod of allModules) {
    mod.seedFakeData?.(db)
  }

  // ========== 持久化到文件 ==========
  saveDatabase()
  console.log("\n🎉 数据填充完成！已保存到 mock.db")
}

seed().catch((err) => {
  console.error("❌ 数据填充失败:", err)
  process.exit(1)
})