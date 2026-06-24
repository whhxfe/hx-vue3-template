/**
 * tgm/gc/gm 模块表定义（群组管理）
 */
import type { Database } from "sql.js"

export function createGmTables(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS ktc_gm_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      number TEXT,
      type TEXT,
      member_count INTEGER DEFAULT 0,
      active_count INTEGER DEFAULT 0,
      description TEXT,
      entry_time TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `)
}
