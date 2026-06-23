/**
 * ktc/tgm/gc 模块表定义（群体管控）
 */
import type { Database } from "sql.js"

export function createGcTables(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS ktc_gc_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category_type TEXT,
      is_judged INTEGER DEFAULT 0,
      member_count INTEGER DEFAULT 0,
      territory TEXT,
      police_name TEXT,
      unit_name TEXT,
      reason TEXT,
      active_count INTEGER DEFAULT 0,
      recommend_count INTEGER DEFAULT 0,
      group_count INTEGER DEFAULT 0,
      sub_group_count INTEGER DEFAULT 0,
      warning_types TEXT,
      tags TEXT,
      entry_time TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `)
}
