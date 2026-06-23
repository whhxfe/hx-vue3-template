/**
 * ktc/tpm/pc 模块表定义（人员管控）
 * - ktc_pc_persons: 人员表
 * - ktc_pc_categories: 人员类别表
 * - ktc_pc_trees: 树结构表
 */
import type { Database } from "sql.js"

export function createPcTables(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS ktc_pc_persons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      gender TEXT DEFAULT '男',
      age INTEGER,
      phone TEXT,
      id_card TEXT,
      residence_address TEXT,
      category TEXT,
      data_source TEXT,
      tags TEXT,
      follow_status TEXT DEFAULT '0',
      avatar TEXT,
      tree_id INTEGER,
      tree_type TEXT,
      longitude REAL,
      latitude REAL,
      entry_time TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS ktc_pc_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      description TEXT,
      sort_order INTEGER DEFAULT 0,
      status INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS ktc_pc_trees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      parent_id INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      icon TEXT,
      status INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `)
}
