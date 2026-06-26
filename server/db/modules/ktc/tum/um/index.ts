/**
 * tum/um 单元上图数据库模块入口
 */
import type { Database } from "sql.js"
import type { DbModule } from "@db/types"
import { createUmTables } from "./schema"
import { seedUmDefaults } from "./seed"

export const umModule: DbModule = {
	createTables: (db: Database) => {
		createUmTables(db)
	},
	seedDefaults: (db: Database) => {
		seedUmDefaults(db)
	}
}