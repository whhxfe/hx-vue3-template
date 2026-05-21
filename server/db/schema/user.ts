/**
 * 用户中心相关表定义
 */
import type { Database } from "sql.js"

/**
 * 创建用户相关表
 */
export function createUserTables(db: Database) {
	db.run(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE,
			phone TEXT,
			department TEXT,
			role TEXT DEFAULT 'user',
			avatar TEXT,
			status INTEGER DEFAULT 1,
			created_at TEXT DEFAULT (datetime('now')),
			updated_at TEXT DEFAULT (datetime('now'))
		)
	`)

	db.run(`
		CREATE TABLE IF NOT EXISTS accounts (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT NOT NULL UNIQUE,
			password TEXT NOT NULL,
			display_name TEXT,
			email TEXT,
			phone TEXT,
			status INTEGER DEFAULT 1,
			role_id INTEGER,
			created_at TEXT DEFAULT (datetime('now')),
			updated_at TEXT DEFAULT (datetime('now')),
			FOREIGN KEY (role_id) REFERENCES roles(id)
		)
	`)

	db.run(`
		CREATE TABLE IF NOT EXISTS roles (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL UNIQUE,
			code TEXT NOT NULL UNIQUE,
			description TEXT,
			status INTEGER DEFAULT 1,
			sort_order INTEGER DEFAULT 0,
			created_at TEXT DEFAULT (datetime('now'))
		)
	`)

	db.run(`
		CREATE TABLE IF NOT EXISTS role_menus (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			role_id INTEGER NOT NULL,
			module_key TEXT NOT NULL,
			created_at TEXT DEFAULT (datetime('now')),
			FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
		)
	`)

	db.run(`
		CREATE TABLE IF NOT EXISTS logs (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER,
			action TEXT NOT NULL,
			detail TEXT,
			ip TEXT,
			created_at TEXT DEFAULT (datetime('now')),
			FOREIGN KEY (user_id) REFERENCES users(id)
		)
	`)

	db.run(`
		CREATE TABLE IF NOT EXISTS settings (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			key TEXT NOT NULL UNIQUE,
			value TEXT,
			description TEXT,
			updated_at TEXT DEFAULT (datetime('now'))
		)
	`)
}
