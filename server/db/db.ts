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

let db!: Database

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

	// ---------- 系统配置管理 ----------
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

	// ---------- 操作日志审计 ----------
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

	// ---------- 数据字典管理 ----------
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

	// ---------- 通知公告管理 ----------
	db.run(`
		CREATE TABLE IF NOT EXISTS notices (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			content TEXT NOT NULL,
			type TEXT DEFAULT 'info',
			priority TEXT DEFAULT 'normal',
			is_top INTEGER DEFAULT 0,
			status INTEGER DEFAULT 0,
			publish_at TEXT,
			unpublish_at TEXT,
			author TEXT DEFAULT '管理员',
			views INTEGER DEFAULT 0,
			created_at TEXT DEFAULT (datetime('now')),
			updated_at TEXT DEFAULT (datetime('now'))
		)
	`)

	// 初始化默认字典数据
	const existingDictTypes = db.exec("SELECT COUNT(*) FROM dict_types")
	if (existingDictTypes[0]?.values[0]?.[0] === 0) {
		// 字典类型
		const defaultTypes = [
			{ type: 'gender', name: '性别', sort_order: 1 },
			{ type: 'status', name: '状态', sort_order: 2 },
			{ type: 'yes_no', name: '是否', sort_order: 3 },
			{ type: 'approval_status', name: '审批状态', sort_order: 4 },
		]

		for (const t of defaultTypes) {
			db.run(
				"INSERT INTO dict_types (type, name, sort_order) VALUES (?, ?, ?)",
				[t.type, t.name, t.sort_order]
			)
		}

		// 字典项
		const defaultItems = [
			// 性别
			{ type: 'gender', label: '男', value: '1', sort_order: 1 },
			{ type: 'gender', label: '女', value: '0', sort_order: 2 },
			{ type: 'gender', label: '未知', value: '-1', sort_order: 3 },
			// 状态
			{ type: 'status', label: '启用', value: '1', sort_order: 1 },
			{ type: 'status', label: '禁用', value: '0', sort_order: 2 },
			// 是否
			{ type: 'yes_no', label: '是', value: '1', sort_order: 1 },
			{ type: 'yes_no', label: '否', value: '0', sort_order: 2 },
			// 审批状态
			{ type: 'approval_status', label: '待审批', value: 'pending', sort_order: 1 },
			{ type: 'approval_status', label: '已通过', value: 'approved', sort_order: 2 },
			{ type: 'approval_status', label: '已拒绝', value: 'rejected', sort_order: 3 },
		]

		for (const item of defaultItems) {
			db.run(
				"INSERT INTO dict_items (type, label, value, sort_order) VALUES (?, ?, ?, ?)",
				[item.type, item.label, item.value, item.sort_order]
			)
		}

		saveDatabase()
	}

	// 初始化默认系统配置
	const existingConfigs = db.exec("SELECT COUNT(*) FROM sys_configs")
	if (existingConfigs[0]?.values[0]?.[0] === 0) {
		const defaultConfigs = [
			{ key: "site_name", value: "HX 管理后台", type: "text", description: "网站名称", sort_order: 1 },
			{ key: "site_logo", value: "", type: "image", description: "网站 Logo", sort_order: 2 },
			{ key: "site_description", value: "基于 HX-Vue3-Template 的后台管理系统", type: "textarea", description: "网站描述", sort_order: 3 },
			{ key: "page_size", value: "20", type: "number", description: "默认分页大小", sort_order: 10 },
			{ key: "upload_max_size", value: "5242880", type: "number", description: "文件上传大小限制(字节)", sort_order: 11 },
		]

		for (const config of defaultConfigs) {
			db.run(
				"INSERT INTO sys_configs (key, value, type, description, sort_order) VALUES (?, ?, ?, ?, ?)",
				[config.key, config.value, config.type, config.description, config.sort_order]
			)
		}
		saveDatabase()
	}

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