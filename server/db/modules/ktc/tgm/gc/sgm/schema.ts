/**
 * tgm/gc/sgm 模块表定义（子群体管理）
 */
import type { Database } from "sql.js"

export function createSgmTables(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS ktc_sgm_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      parent_group_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      category_type TEXT,
      member_count INTEGER DEFAULT 0,
      territory TEXT,
      police_name TEXT,
      unit_name TEXT,
      reason TEXT,
      active_count INTEGER DEFAULT 0,
      recommend_count INTEGER DEFAULT 0,
      group_count INTEGER DEFAULT 0,
      warning_types TEXT,
      tags TEXT,
      status INTEGER DEFAULT 0,
      entry_time TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `)
}
