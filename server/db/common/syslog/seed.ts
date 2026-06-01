/**
 * 操作日志种子数据
 */
import type { Database } from "sql.js"

/** 表为空时插入默认数据（服务启动时调用） */
export function seedSyslogDefaults(_db: Database) {
  // 操作日志没有需要初始化的默认数据
}

/** 生成 Faker 大数据（npm run seed 时调用） */
export function seedSyslogFakeData(_db: Database) {
  // 操作日志由接口调用自动产生，不需要 Faker 生成
}