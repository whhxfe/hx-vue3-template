/**
 * pbct 模块表定义（排查台账）
 * - pbct_persons: 人员信息表（以身份证号为唯一键）
 * - pbct_records: 记录表（每次导入/新增生成一条）
 */
import type { Database } from "sql.js"

export function createPbctTables(db: Database) {
	// 人员信息表（主信息，身份证号唯一）
	db.run(`
		CREATE TABLE IF NOT EXISTS pbct_persons (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			id_card TEXT UNIQUE,
			name TEXT NOT NULL,
			phone TEXT,
			gender TEXT DEFAULT '男',
			ethnicity TEXT,
			virtual_account TEXT,
			household_address TEXT,
			residence_address TEXT,
			district TEXT,
			updated_at TEXT DEFAULT (datetime('now')),
			created_at TEXT DEFAULT (datetime('now'))
		)
	`)

	// 记录表（每次导入/新增生成一条）
	db.run(`
		CREATE TABLE IF NOT EXISTS pbct_records (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			person_id INTEGER REFERENCES pbct_persons(id),
			handle_time TEXT NOT NULL,
			name TEXT NOT NULL,
			id_card TEXT,
			phone TEXT,
			gender TEXT DEFAULT '男',
			ethnicity TEXT,
			virtual_account TEXT,
			handle_reason TEXT,
			handle_result TEXT,
			household_address TEXT,
			residence_address TEXT,
			district TEXT,
			source TEXT DEFAULT 'manual',
			import_time TEXT DEFAULT (datetime('now')),
			created_at TEXT DEFAULT (datetime('now'))
		)
	`)
}
