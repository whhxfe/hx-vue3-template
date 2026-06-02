/**
 * 用户模块种子数据
 */
import type { Database } from "sql.js"
import { faker } from "@faker-js/faker/locale/zh_CN"

/** 表为空时插入默认数据（服务启动时调用） */
export function seedUsersDefaults(_db: Database) {
  // 用户表没有需要初始化的默认数据
}

/** 生成 Faker 大数据（npm run seed 时调用） */
export function seedUsersFakeData(db: Database) {
  const departments = ["研发部", "产品部", "市场部", "运营部", "财务部", "人力资源部", "行政部"]
  const roles = ["admin", "manager", "user"]

  console.log("🌱 正在生成用户数据...")
  let userCount = 0
  for (let i = 0; i < 50; i++) {
    db.run(
      `INSERT INTO users (name, email, phone, department, role, avatar, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        faker.person.fullName(),
        faker.internet.email(),
        faker.phone.number({ style: "national" }),
        faker.helpers.arrayElement(departments),
        faker.helpers.arrayElement(roles),
        faker.image.avatar(),
        faker.helpers.arrayElement([0, 1, 1, 1])
      ]
    )
    userCount++
  }
  console.log(`  ✅ 已生成 ${userCount} 条用户数据`)
}