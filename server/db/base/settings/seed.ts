/**
 * 系统设置种子数据
 */
import type { Database } from "sql.js"

/** 表为空时插入默认数据（服务启动时调用） */
export function seedSettingsDefaults(_db: Database) {
  // 系统设置没有需要初始化的默认数据
}

/** 生成 Faker 大数据（npm run seed 时调用） */
export function seedSettingsFakeData(db: Database) {
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