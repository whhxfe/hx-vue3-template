/**
 * 使用 Faker 生成模拟数据并写入 SQLite (sql.js)
 * 运行方式：cd server && npm run seed
 */
import { faker } from "@faker-js/faker/locale/zh_CN"
import { initDatabase, saveDatabase, getDb } from "./db"

async function seed() {
	await initDatabase()
	const db = getDb()

	// 清空旧数据
	db.run("DELETE FROM users")
	db.run("DELETE FROM logs")
	db.run("DELETE FROM settings")
	db.run("DELETE FROM accounts")
	db.run("DELETE FROM roles")
	db.run("DELETE FROM role_menus")

	const departments = ["研发部", "产品部", "市场部", "运营部", "财务部", "人力资源部", "行政部"]
	const roles = ["admin", "manager", "user"]

	/** 生成用户 */
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

	/** 获取用户 ID 列表 */
	const userIdResult = db.exec("SELECT id FROM users")
	const userIds: number[] = userIdResult[0]?.values.map((row: any[]) => row[0] as number) || []

	/** 生成操作日志 */
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

	/** 生成系统设置 */
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
		db.run(
			"INSERT INTO settings (key, value, description) VALUES (?, ?, ?)",
			[s.key, s.value, s.description]
		)
	}
	console.log(`  ✅ 已生成 ${settingsData.length} 条设置数据`)

	/** ---------- 用户中心：角色、账号、权限 ---------- */

	console.log("🌱 正在生成角色数据...")
	db.run("INSERT INTO roles (name, code, description, sort_order) VALUES ('超级管理员', 'super', '拥有所有模块权限', 0)")
	db.run("INSERT INTO roles (name, code, description, sort_order) VALUES ('管理员', 'admin', '系统管理权限', 1)")
	db.run("INSERT INTO roles (name, code, description, sort_order) VALUES ('普通用户', 'user', '基本访问权限', 2)")
	console.log("  ✅ 已生成 3 条角色数据")

	/** 分配角色模块权限 */
	console.log("🌱 正在生成角色权限数据...")
	const roleIdResult = db.exec("SELECT id, code FROM roles")
	const roleMap: Record<string, number> = {}
	roleIdResult[0]?.values.forEach((row: any[]) => {
		roleMap[row[1] as string] = row[0] as number
	})

	// super 角色拥有全部模块（包括所有后台系统模块）
	db.run("INSERT INTO role_menus (role_id, module_key) VALUES (?, ?)", [roleMap.super, "ucenter"])
	db.run("INSERT INTO role_menus (role_id, module_key) VALUES (?, ?)", [roleMap.super, "sysconfig"])
	db.run("INSERT INTO role_menus (role_id, module_key) VALUES (?, ?)", [roleMap.super, "syslog"])
	db.run("INSERT INTO role_menus (role_id, module_key) VALUES (?, ?)", [roleMap.super, "dict"])
	db.run("INSERT INTO role_menus (role_id, module_key) VALUES (?, ?)", [roleMap.super, "notice"])
	db.run("INSERT INTO role_menus (role_id, module_key) VALUES (?, ?)", [roleMap.super, "_templates"])
	db.run("INSERT INTO role_menus (role_id, module_key) VALUES (?, ?)", [roleMap.super, "zddxgk"])
	// admin 角色
	db.run("INSERT INTO role_menus (role_id, module_key) VALUES (?, ?)", [roleMap.admin, "ucenter"])
	db.run("INSERT INTO role_menus (role_id, module_key) VALUES (?, ?)", [roleMap.admin, "sysconfig"])
	db.run("INSERT INTO role_menus (role_id, module_key) VALUES (?, ?)", [roleMap.admin, "_templates"])
	// user 角色
	db.run("INSERT INTO role_menus (role_id, module_key) VALUES (?, ?)", [roleMap.user, "_templates"])
	console.log("  ✅ 已生成角色权限关联数据")

	/** 生成账号数据 */
	console.log("🌱 正在生成账号数据...")
	db.run(
		"INSERT INTO accounts (username, password, display_name, email, phone, status, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
		["super", "super", "超级管理员", "super@example.com", "13800000001", 1, roleMap.super]
	)
	db.run(
		"INSERT INTO accounts (username, password, display_name, email, phone, status, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
		["admin", "admin", "管理员", "admin@example.com", "13800000002", 1, roleMap.admin]
	)
	// 创建常规测试账号：密码为 user
	db.run(
		"INSERT INTO accounts (username, password, display_name, email, phone, status, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
		["user", "user", "测试用户", "user@example.com", "13800000003", 1, roleMap.user]
	)
	console.log("  ✅ 已生成 3 条账号数据（super、admin、user）")

	// 持久化到文件
	saveDatabase()
	console.log("\n🎉 数据填充完成！已保存到 mock.db")
}

seed().catch(err => {
	console.error("❌ 数据填充失败:", err)
	process.exit(1)
})