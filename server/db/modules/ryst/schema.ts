/**
 * ryst 模块表定义（人员视图）
 * - ryst_persons: 人员视图信息表
 */
import type { Database } from "sql.js"

export function createRystTables(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS ryst_persons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      gender TEXT,
      age INTEGER,
      phone TEXT,
      id_card TEXT,
      avatar TEXT,
      residence_address TEXT,
      category TEXT,
      data_source TEXT,
      tags TEXT,
      follow_status TEXT DEFAULT '0',
      longitude REAL,
      latitude REAL,
      entry_time TEXT,
      data_source_name TEXT,
      category_name TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `)
}