/**
 * SQLite 数据库初始化
 * 使用 sql.js（纯 WASM，无需 native 编译）
 */
import initSqlJs, { type Database } from "sql.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.resolve(__dirname, "mock.db")

let db: Database

/**
 * 初始化数据库
 * 如果存在 mock.db 文件则加载，否则创建新库
 */
export async function initDatabase(): Promise<Database> {
	const SQL = await initSqlJs()

	if (fs.existsSync(DB_PATH)) {
		const buffer = fs.readFileSync(DB_PATH)
		db = new SQL.Database(buffer)
	} else {
		db = new SQL.Database()
	}

	// 创建表结构
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

	// ---------- 用户中心：账号管理、角色管理、权限分配 ----------

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

	return db
}

/** 持久化数据库到文件 */
export function saveDatabase() {
	if (db) {
		const data = db.export()
		fs.writeFileSync(DB_PATH, Buffer.from(data))
	}
}

/** 获取数据库实例 */
export function getDb(): Database {
	return db
}

export default db