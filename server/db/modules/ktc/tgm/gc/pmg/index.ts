/**
 * tgm/gc/pmg 人员管理数据库模块入口
 */
import type { Database } from "sql.js"
import type { DbModule } from "@db/types"

export const pmgModule: DbModule = {
  createTables: (_db: Database) => {
    // TODO: 创建表结构
  },
  seedDefaults: (_db: Database) => {
    // TODO: 初始化默认数据
  }
}
