/**
 * tgm/gc/sgm 子群体管理数据库模块入口
 */
import type { Database } from "sql.js"
import type { DbModule } from "@db/types"

export const sgmModule: DbModule = {
  createTables: (_db: Database) => {
    // TODO: 创建表结构
  },
  seedDefaults: (_db: Database) => {
    // TODO: 初始化默认数据
  }
}
