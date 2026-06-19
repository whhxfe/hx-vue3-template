import type { Database } from "sql.js"
import type { DbModule } from "../../types.js"

const testAutoModule: DbModule = {
  createTables: (db: Database) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS test_auto_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `)
  },
  seedDefaults: (db: Database) => {
    const count = db.exec("SELECT COUNT(*) FROM test_auto_items")[0]?.values[0][0]
    if (count === 0) {
      db.run("INSERT INTO test_auto_items (name) VALUES ('自动扫描测试数据')")
    }
  }
}

export default testAutoModule
