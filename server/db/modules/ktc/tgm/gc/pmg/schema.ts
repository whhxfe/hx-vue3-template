/**
 * tgm/gc/pmg 模块表定义（群体人员管理）
 */
import type { Database } from "sql.js"

export function createPmgTables(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS ktc_pmg_persons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      gender TEXT DEFAULT '男',
      age INTEGER,
      phone TEXT,
      id_card TEXT,
      nation TEXT DEFAULT '汉',
      address TEXT,
      warning_types TEXT,
      follow_status TEXT DEFAULT '0',
      avatar TEXT,
      entry_time TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `)
}
