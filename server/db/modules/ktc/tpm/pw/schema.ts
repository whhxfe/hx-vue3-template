/**
 * ktc/tpm/pw 模块表定义（人员预警）
 * - ktc_pw_persons: 人员预警信息表
 */
import type { Database } from "sql.js"

export function createPwTables(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS ktc_pw_persons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      gender TEXT,
      age INTEGER,
      id_card TEXT,
      phone TEXT,
      avatar TEXT,
      education TEXT,
      person_score INTEGER,
      person_category TEXT,
      manage_category TEXT,
      entry_time TEXT,
      data_source TEXT,
      occupation_type TEXT,
      residence_address TEXT,
      relation_info TEXT,
      warning_type TEXT,
      business_category TEXT,
      household_address TEXT,
      manage_dept TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `)
}
