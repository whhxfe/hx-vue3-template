/**
 * 数据库模块标准接口
 * 每个子模块通过实现此接口完成自注册
 */
import type { Database } from "sql.js"

export interface DbModule {
  /** 创建该模块的数据库表 */
  createTables: (db: Database) => void
  /** 插入默认数据（仅表为空时执行） */
  seedDefaults: (db: Database) => void
  /** 生成 Faker 大数据（npm run seed 时调用） */
  seedFakeData?: (db: Database) => void
}
