/**
 * 基础模块种子数据
 * - users: Faker 生成 50 条用户数据
 * - settings: 系统设置默认数据
 * - logs: Faker 生成 200 条操作日志
 */
import type { Database } from "sql.js"
import { faker } from "@faker-js/faker/locale/zh_CN"

/** 表为空时插入默认数据（服务启动时调用） */
export function seedBaseDefaults(_db: Database) {
  // 基础表没有需要初始化的默认数据
}

/** 生成 Faker 大数据（npm run seed 时调用） */
export function seedBaseFakeData(db: Database) {
  const departments = ["研发部", "产品部", "市场部", "运营部", "财务部", "人力资源部", "行政部"]
  const roles = ["admin", "manager", "user"]

  // ========== 生成用户数据 ==========
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

  // 获取用户 ID 列表
  const userIdResult = db.exec("SELECT id FROM users")
  const userIds: number[] = userIdResult[0]?.values.map((row: any[]) => row[0] as number) || []

  // ========== 生成操作日志 ==========
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

  // ========== 生成系统设置 ==========
  console.log("🌱 正在生成设置数据...")
  const settingsData = [
    { key: "site_name", value: "XX 管理平台", description: "站点名称" },
    { key: "site_logo", value: "/logo.png", description: "站点 Logo" },
    { key: "page_size", value: "20", description: "默认分页大小" },
    { key: "upload_max_size", value: "10", description: "上传文件大小限制(MB)" },
    { key: "session_timeout", value: "30", description: "会话超时时间(分钟)" },
    { key: "enable_register", value: "true", description: "是否开放注册" },
    { key: "sms_enabled", value: "false", description: "是否启用短信" },
    { key: "email_smtp", value: "smtp.example.com", description: "SMTP 服务器" }
  ]

  for (const s of settingsData) {
    db.run("INSERT INTO settings (key, value, description) VALUES (?, ?, ?)", [s.key, s.value, s.description])
  }
  console.log(`  ✅ 已生成 ${settingsData.length} 条设置数据`)
}