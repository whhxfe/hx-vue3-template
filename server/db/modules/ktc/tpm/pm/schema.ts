/**
 * ktc/tpm/pm 模块表定义（人员上图）
 * - ktc_pm_persons: 人员上图信息表
 */
import type { Database } from "sql.js"

export function createPmTables(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS ktc_pm_persons (
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
