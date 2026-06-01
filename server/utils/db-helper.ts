/**
 * 数据库助手函数
 * 统一封装 sql.js 的常用数据库操作
 * 避免在每个路由文件中重复定义同样的函数
 */
import { getDb, saveDatabase } from "@db/manager"

/**
 * 查询多条记录
 */
export function queryAll(sql: string, params: any[] = []): Record<string, any>[] {
  const db = getDb()
  const stmt = db.prepare(sql)
  stmt.bind(params)
  const rows: Record<string, any>[] = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject())
  }
  stmt.free()
  return rows
}

/**
 * 查询单条记录
 */
export function queryOne(sql: string, params: any[] = []): Record<string, any> | undefined {
  return queryAll(sql, params)[0]
}

/**
 * 查询标量值（单个字段）
 */
export function queryScalar(sql: string, params: any[] = []): any {
  const db = getDb()
  const stmt = db.prepare(sql)
  stmt.bind(params)
  let result: any = undefined
  if (stmt.step()) {
    const row = stmt.getAsObject()
    result = Object.values(row)[0]
  }
  stmt.free()
  return result
}

/**
 * 执行写操作并保存数据库
 */
export function runAndSave(sql: string, params: any[] = []) {
  const db = getDb()
  db.run(sql, params)
  saveDatabase()
}

/**
 * 批量执行写操作并保存数据库（仅最后一次 saveDatabase）
 * 适用于多条 INSERT/UPDATE/DELETE 需要原子执行的场景
 */
export function runBatch(operations: Array<{ sql: string; params?: any[] }>) {
  const db = getDb()
  for (const op of operations) {
    db.run(op.sql, op.params ?? [])
  }
  saveDatabase()
}

/**
 * 获取最后插入的自增 ID
 */
export function lastInsertId(): number {
  const db = getDb()
  const result = db.exec("SELECT last_insert_rowid() as id")
  return result[0]?.values[0]?.[0] as number ?? 0
}

/**
 * 统一分页参数解析
 * 兼容前端 params[page]&params[pageSize] 的传参格式
 */
export function parsePagination(query: Record<string, any>): {
  page: number
  pageSize: number
  offset: number
  keyword: string
} {
  const page = Number(query["params[page]"] || query.page || 1)
  const pageSize = Number(query["params[pageSize]"] || query.pageSize || 20)
  const keyword = query.keyword || query["params[keyword]"] || ""
  const offset = (page - 1) * pageSize
  return { page, pageSize, offset, keyword }
}