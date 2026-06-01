/**
 * 操作日志表定义
 * - operation_logs: 操作日志审计表
 */
import type { Database } from "sql.js"

export function createSyslogTables(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS operation_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      username TEXT,
      action TEXT NOT NULL,
      method TEXT DEFAULT 'GET',
      path TEXT NOT NULL,
      ip TEXT,
      user_agent TEXT,
      request_body TEXT,
      response_body TEXT,
      status_code INTEGER DEFAULT 200,
      duration INTEGER DEFAULT 0,
      error_message TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)
}