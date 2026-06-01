/**
 * pbct 模块表定义（数据导入管理）
 * - pbct_persons: 人员处理表
 */
import type { Database } from "sql.js"

export function createPbctTables(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS pbct_persons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      -- 基础信息
      handle_time TEXT NOT NULL,
      name TEXT NOT NULL,
      id_card TEXT,
      phone TEXT,
      gender TEXT DEFAULT '男',
      ethnicity TEXT,
      -- 账号信息
      virtual_account TEXT,
      -- 处理信息
      handle_reason TEXT,
      handle_result TEXT,
      -- 地址信息
      household_address TEXT,
      residence_address TEXT,
      -- 所属区县
      district TEXT,
      -- 时间戳
      entry_time TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)
}