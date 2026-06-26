/**
 * ktc/tum/um 模块表定义（单元上图）
 * - ktc_um_units: 单元上图信息表
 */
import type { Database } from "sql.js"

export function createUmTables(db: Database) {
	db.run(`
		CREATE TABLE IF NOT EXISTS ktc_um_units (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			ip TEXT NOT NULL DEFAULT '',
			adsl TEXT DEFAULT '',
			unit_type TEXT NOT NULL,
			control_category TEXT NOT NULL,
			unit_tag TEXT DEFAULT '',
			port_count INTEGER DEFAULT 0,
			terminal_count INTEGER DEFAULT 0,
			ip_location TEXT DEFAULT '',
			focus_person TEXT DEFAULT '',
			focus_unit TEXT DEFAULT '',
			warning_type TEXT DEFAULT '',
			is_judged INTEGER DEFAULT 0,
			is_controlled INTEGER DEFAULT 0,
			entry_time TEXT,
			longitude REAL,
			latitude REAL,
			unit_type_name TEXT,
			control_category_name TEXT,
			warning_type_name TEXT,
			created_at TEXT DEFAULT (datetime('now')),
			updated_at TEXT DEFAULT (datetime('now'))
		)
	`)
}
