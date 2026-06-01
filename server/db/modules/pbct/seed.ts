/**
 * pbct 模块种子数据（数据导入管理）
 */
import type { Database } from "sql.js"

/** 表为空时插入默认数据（服务启动时调用） */
export function seedPbctDefaults(_db: Database) {
  // pbct 没有需要初始化的默认数据
}

/** 生成 Faker 大数据（npm run seed 时调用） */
export function seedPbctFakeData(_db: Database) {
  // pbct 数据由用户导入，不需要 Faker 生成
}