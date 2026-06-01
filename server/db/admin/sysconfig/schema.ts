/**
 * 系统配置表定义
 * - sys_configs: 系统配置表
 */
import type { Database } from "sql.js"

export function createSysconfigTables(db: Database) {
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
}