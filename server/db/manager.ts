/**
 * 数据库实例管理器
 * 负责 sql.js 实例的创建、获取、持久化
 * 未来可扩展为支持多数据库实例（按模块隔离）
 */
import initSqlJs, { type Database } from "sql.js"
import fs from "fs"
import { dbConfig } from "../config/index.js"

/** 默认数据库实例 */
let db!: Database

/**
 * 初始化数据库实例
 * 如果存在 db 文件则加载，否则创建新库
 */
export async function createDatabase(): Promise<Database> {
  const SQL = await initSqlJs()

  if (fs.existsSync(dbConfig.dbPath)) {
    const buffer = fs.readFileSync(dbConfig.dbPath)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }

  return db
}

/**
 * 获取数据库实例
 * @param name 数据库名称（预留未来多库扩展，默认 'default'）
 */
export function getDb(name: string = "default"): Database {
  // 当前所有模块使用同一个实例
  // 未来可扩展为：const dbs = { default: db, module1: db1, ... }
  return db
}

/**
 * 持久化数据库到文件
 * @param name 数据库名称（预留未来多库扩展）
 */
export function saveDatabase(name: string = "default") {
  if (db) {
    const data = db.export()
    fs.writeFileSync(dbConfig.dbPath, Buffer.from(data))
  }
}