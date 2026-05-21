/**
 * 系统管理相关表定义
 */
import type { Database } from "sql.js"

/**
 * 创建系统管理相关表
 */
export function createSystemTables(db: Database) {
	db.run(`
		CREATE TABLE IF NOT EXISTS sys_configs (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			key TEXT NOT NULL UNIQUE,
			value TEXT,
			description TEXT,
			type TEXT DEFAULT 'text',
			sort_order INTEGER DEFAULT 0,
			status INTEGER DEFAULT 1,
			created_at TEXT DEFAULT (datetime('now')),
			updated_at TEXT DEFAULT (datetime('now'))
		)
	`)

	db.run(`
		CREATE TABLE IF NOT EXISTS operation_logs (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER,
			username TEXT,
			action TEXT NOT NULL,
			method TEXT DEFAULT 'GET',
			path TEXT NOT NULL,
			ip TEXT,
			user_agent TEXT,
			request_body TEXT,
			response_body TEXT,
			status_code INTEGER DEFAULT 200,
			duration INTEGER DEFAULT 0,
			error_message TEXT,
			created_at TEXT DEFAULT (datetime('now'))
		)
	`)
}
