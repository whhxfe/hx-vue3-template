/**
 * ktc 模块入口（重点对象管控）
 * 统一导出建表和种子数据函数
 * 聚合 tpm、tgm、tum 子模块
 */
import type { Database } from "sql.js"
import type { DbModule } from "@db/types"
import { pcModule } from "./tpm/pc"
import { pwModule } from "./tpm/pw"
import { pmModule } from "./tpm/pm"
import { tgmModule } from "./tgm"
import { tumModule } from "./tum"

const ktcModule: DbModule = {
  createTables: (db: Database) => {
    pcModule.createTables(db)
    pwModule.createTables(db)
    pmModule.createTables(db)
    tgmModule.createTables(db)
    tumModule.createTables(db)
  },
  seedDefaults: (db: Database) => {
    pcModule.seedDefaults(db)
    pwModule.seedDefaults(db)
    pmModule.seedDefaults(db)
    tgmModule.seedDefaults(db)
    tumModule.seedDefaults(db)
  },
  seedFakeData: (db: Database) => {
    pcModule.seedFakeData?.(db)
    pwModule.seedFakeData?.(db)
    pmModule.seedFakeData?.(db)
  }
}

export default ktcModule
