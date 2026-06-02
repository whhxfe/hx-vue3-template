/**
 * 操作日志种子数据
 */
import type { Database } from "sql.js"
import { faker } from "@faker-js/faker/locale/zh_CN"

/** 表为空时插入默认数据（服务启动时调用） */
export function seedLogsDefaults(_db: Database) {
  // 操作日志没有需要初始化的默认数据
}

/** 生成 Faker 大数据（npm run seed 时调用） */
export function seedLogsFakeData(db: Database) {
  // 查询已有用户 ID（依赖 users 表数据）
  const userIdResult = db.exec("SELECT id FROM users")
  const userIds: number[] = userIdResult[0]?.values.map((row: any[]) => row[0] as number) || []

  console.log("🌱 正在生成日志数据...")
  const actions = ["登录", "登出", "创建", "编辑", "删除", "导出", "导入", "审批"]
  let logCount = 0
  for (let i = 0; i < 200; i++) {
    const createdAt = faker.date.between({ from: "2024-01-01", to: new Date() })
    db.run(
      `INSERT INTO logs (user_id, action, detail, ip, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        faker.helpers.arrayElement(userIds),
        faker.helpers.arrayElement(actions),
        faker.lorem.sentence(),
        faker.internet.ip(),
        createdAt.toISOString().replace("T", " ").slice(0, 19)
      ]
    )
    logCount++
  }
  console.log(`  ✅ 已生成 ${logCount} 条日志数据`)
}