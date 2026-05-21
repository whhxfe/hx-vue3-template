/**
 * 数据库表结构统一导出
 */
import type { Database } from "sql.js"

import { createUserTables } from "./user"
import { createSystemTables } from "./system"
import { createDictTables } from "./dict"
import { createNoticeTables } from "./notice"
import { createRygkTables } from "./rygk"
import { createRyyjTables } from "./ryyj"

export { createUserTables, createSystemTables, createDictTables, createNoticeTables, createRygkTables, createRyyjTables }

/**
 * 创建所有表结构
 */
export function createAllTables(db: Database) {
	createUserTables(db)
	createSystemTables(db)
	createDictTables(db)
	createNoticeTables(db)
	createRygkTables(db)
	createRyyjTables(db)
}
