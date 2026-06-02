/**
 * 系统设置表定义
 * - settings: 系统设置表
 */
import type { Database } from "sql.js"

export function createSettingsTables(db: Database) {
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