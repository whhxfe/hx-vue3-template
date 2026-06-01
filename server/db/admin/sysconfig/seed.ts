/**
 * 系统配置种子数据
 * - sys_configs: 系统配置默认数据
 */
import type { Database } from "sql.js"
import { defaultSysConfigs } from "../../seed-defaults.js"

/** 表为空时插入默认数据（服务启动时调用） */
export function seedSysconfigDefaults(db: Database) {
  const existing = db.exec("SELECT COUNT(*) FROM sys_configs")
  if (existing[0]?.values[0]?.[0] === 0) {
    for (const config of defaultSysConfigs) {
      db.run(
        "INSERT INTO sys_configs (key, value, type, description, sort_order) VALUES (?, ?, ?, ?, ?)",
        [config.key, config.value, config.type, config.description, config.sort_order]
      )
    }
  }
}

/** 生成 Faker 大数据（npm run seed 时调用） */
export function seedSysconfigFakeData(_db: Database) {
  // sysconfig 使用默认数据即可，不需要额外 Faker 数据
}