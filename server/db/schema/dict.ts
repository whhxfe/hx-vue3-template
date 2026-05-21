/**
 * 数据字典相关表定义
 */
import type { Database } from "sql.js"

/**
 * 创建数据字典相关表
 */
export function createDictTables(db: Database) {
	db.run(`
		CREATE TABLE IF NOT EXISTS dict_types (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			type TEXT NOT NULL UNIQUE,
			name TEXT NOT NULL,
			description TEXT,
			sort_order INTEGER DEFAULT 0,
			status INTEGER DEFAULT 1,
			created_at TEXT DEFAULT (datetime('now')),
			updated_at TEXT DEFAULT (datetime('now'))
		)
	`)

	db.run(`
		CREATE TABLE IF NOT EXISTS dict_items (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			type TEXT NOT NULL,
			label TEXT NOT NULL,
			value TEXT NOT NULL,
			sort_order INTEGER DEFAULT 0,
			status INTEGER DEFAULT 1,
			remark TEXT,
			created_at TEXT DEFAULT (datetime('now')),
			FOREIGN KEY (type) REFERENCES dict_types(type) ON DELETE CASCADE
		)
	`)
}
