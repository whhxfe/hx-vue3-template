/**
 * 用户中心种子数据
 * - roles: 角色默认数据
 * - accounts: 账号默认数据
 * - role_menus: 角色权限关联数据
 */
import type { Database } from "sql.js"
import { faker } from "@faker-js/faker/locale/zh_CN"

/** 表为空时插入默认数据（服务启动时调用） */
export function seedUcenterDefaults(_db: Database) {
  // 用户中心没有需要服务启动时初始化的默认数据
}

/** 生成 Faker 大数据（npm run seed 时调用） */
export function seedUcenterFakeData(db: Database) {
  console.log("🌱 正在生成角色数据...")
  db.run("INSERT INTO roles (name, code, description, sort_order) VALUES ('超级管理员', 'super', '拥有所有模块权限', 0)")
  db.run("INSERT INTO roles (name, code, description, sort_order) VALUES ('管理员', 'admin', '系统管理权限', 1)")
  db.run("INSERT INTO roles (name, code, description, sort_order) VALUES ('普通用户', 'user', '基本访问权限', 2)")
  console.log("  ✅ 已生成 3 条角色数据")

  // 分配角色模块权限
  console.log("🌱 正在生成角色权限数据...")
  const roleIdResult = db.exec("SELECT id, code FROM roles")
  const roleMap: Record<string, number> = {}
  roleIdResult[0]?.values.forEach((row: any[]) => {
    roleMap[row[1] as string] = row[0] as number
  })

  // super 角色拥有全部模块
  const allModules = ["ucenter", "sysconfig", "syslog", "dict", "notice", "_templates", "zddxgk", "pbct"]
  for (const mod of allModules) {
    db.run("INSERT INTO role_menus (role_id, module_key) VALUES (?, ?)", [roleMap.super, mod])
  }
  // admin 角色
  for (const mod of ["ucenter", "sysconfig", "_templates"]) {
    db.run("INSERT INTO role_menus (role_id, module_key) VALUES (?, ?)", [roleMap.admin, mod])
  }
  // user 角色
  db.run("INSERT INTO role_menus (role_id, module_key) VALUES (?, ?)", [roleMap.user, "_templates"])
  console.log("  ✅ 已生成角色权限关联数据")

  // 生成账号数据
  console.log("🌱 正在生成账号数据...")
  const accounts = [
    { username: "super", password: "super", display_name: "超级管理员", email: "super@example.com", phone: "13800000001", role: "super" },
    { username: "admin", password: "admin", display_name: "管理员", email: "admin@example.com", phone: "13800000002", role: "admin" },
    { username: "user", password: "user", display_name: "测试用户", email: "user@example.com", phone: "13800000003", role: "user" }
  ]
  for (const acc of accounts) {
    db.run(
      "INSERT INTO accounts (username, password, display_name, email, phone, status, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [acc.username, acc.password, acc.display_name, acc.email, acc.phone, 1, roleMap[acc.role]]
    )
  }
  console.log(`  ✅ 已生成 ${accounts.length} 条账号数据`)
}