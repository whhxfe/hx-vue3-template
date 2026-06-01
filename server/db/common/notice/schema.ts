/**
 * 通知公告表定义
 * - notices: 通知公告表
 */
import type { Database } from "sql.js"

export function createNoticeTables(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      priority TEXT DEFAULT 'normal',
      is_top INTEGER DEFAULT 0,
      status INTEGER DEFAULT 0,
      publish_at TEXT,
      unpublish_at TEXT,
      author TEXT DEFAULT '管理员',
      views INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `)
}