/**
 * 使用 Faker 生成模拟数据并写入 SQLite (sql.js)
 * 运行方式：cd server && npm run seed
 */
import { faker } from "@faker-js/faker/locale/zh_CN"
import { initDatabase, saveDatabase, getDb } from "./db"

async function seed() {
	await initDatabase()
	const db = getDb()

	// ========== 清空旧数据 ==========
	db.run("DELETE FROM users")
	db.run("DELETE FROM logs")
	db.run("DELETE FROM settings")
	db.run("DELETE FROM accounts")
	db.run("DELETE FROM roles")
	db.run("DELETE FROM role_menus")
	db.run("DELETE FROM rygk_persons")
	db.run("DELETE FROM rygk_categories")
	db.run("DELETE FROM rygk_trees")

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

	// ========== 用户中心：角色、账号、权限 ==========

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

	// 生成账号数据
	console.log("🌱 正在生成账号数据...")
	db.run(
		"INSERT INTO accounts (username, password, display_name, email, phone, status, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
		["super", "super", "超级管理员", "super@example.com", "13800000001", 1, roleMap.super]
	)
	db.run(
		"INSERT INTO accounts (username, password, display_name, email, phone, status, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
		["admin", "admin", "管理员", "admin@example.com", "13800000002", 1, roleMap.admin]
	)
	db.run(
		"INSERT INTO accounts (username, password, display_name, email, phone, status, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
		["user", "user", "测试用户", "user@example.com", "13800000003", 1, roleMap.user]
	)
	console.log("  ✅ 已生成 3 条账号数据（super、admin、user）")

	// ========== rygk 模块测试数据 ==========

	const categories = [
		{ name: "重点关注", code: "important", description: "需要重点关注的人员", sort_order: 1 },
		{ name: "一般人员", code: "normal", description: "普通人员", sort_order: 2 },
		{ name: "困难群体", code: "difficult", description: "生活困难需要帮扶的人员", sort_order: 3 },
		{ name: "特殊人群", code: "special", description: "特殊类型人员", sort_order: 4 }
	]
	const dataSources = ["community", "hospital", "police", "grid", "self"]
	const addresses = [
		{ code: "420100", name: "武汉市" },
		{ code: "420200", name: "黄石市" },
		{ code: "420300", name: "十堰市" },
		{ code: "420500", name: "宜昌市" },
		{ code: "420600", name: "襄阳市" },
		{ code: "420700", name: "鄂州市" },
		{ code: "421000", name: "荆州市" },
		{ code: "421100", name: "黄冈市" },
		{ code: "421200", name: "咸宁市" },
		{ code: "421300", name: "随州市" }
	]
	const tags = ["独居老人", "低保户", "残疾人", "留守儿童", "退役军人", "党员", "志愿者", "困难家庭", "慢性病患者", "孕妇"]
	const surnames = ["张", "王", "李", "刘", "陈", "杨", "黄", "赵", "周", "吴"]
	const givenNames = ["伟", "芳", "娜", "敏", "静", "丽", "强", "磊", "军", "洋"]

	// 生成树结构
	console.log("🌱 正在生成 rygk 树结构...")
	// 业务管理树
	db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", [
		"yhgl",
		"企业管理",
		0,
		1,
		"office-building"
	])
	db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", [
		"yhgl",
		"企业管理-已标记",
		0,
		2,
		"star"
	])
	db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", [
		"yhgl",
		"企业管理-回收站",
		0,
		3,
		"delete"
	])
	// 业务管理子节点
	const yhglRootId = db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] as number
	db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", [
		"yhgl",
		"国有企业",
		yhglRootId,
		1,
		"bank"
	])
	db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", [
		"yhgl",
		"民营企业",
		yhglRootId,
		2,
		"factory"
	])
	db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", [
		"yhgl",
		"外资企业",
		yhglRootId,
		3,
		"globe"
	])

	// 关系机构树
	db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", [
		"gxjg",
		"全部机构",
		0,
		1,
		"building"
	])
	db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", [
		"gxjg",
		"合作机构",
		0,
		2,
		"handshake"
	])
	db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", [
		"gxjg",
		"关联机构",
		0,
		3,
		"link"
	])
	// 关系机构子节点
	const gxjgRootId = db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] as number
	db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", [
		"gxjg",
		"总公司",
		gxjgRootId,
		1,
		"building"
	])
	db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", [
		"gxjg",
		"分公司",
		gxjgRootId,
		2,
		"office"
	])
	console.log("  ✅ 已生成树结构数据")

	// 生成类别
	console.log("🌱 正在生成 rygk 类别数据...")
	for (const cat of categories) {
		db.run("INSERT INTO rygk_categories (name, code, description, sort_order) VALUES (?, ?, ?, ?)", [
			cat.name,
			cat.code,
			cat.description,
			cat.sort_order
		])
	}
	console.log(`  ✅ 已生成 ${categories.length} 条类别数据`)

	// 生成人员数据
	console.log("🌱 正在生成 rygk 人员数据...")
	let personCount = 0
	// 关联到 yhgl 树结构（随机分配到各节点）
	const treeNodeRows = db.exec("SELECT id, type FROM rygk_trees WHERE status = 1")
	const allNodes: { id: number; type: string }[] = treeNodeRows[0]?.values.map((row: any[]) => ({
		id: row[0] as number,
		type: row[1] as string
	})) || []
	const yhglNodes = allNodes.filter((r) => r.type === "yhgl")
	const gxjgNodes = allNodes.filter((r) => r.type === "gxjg")

	for (let i = 0; i < 100; i++) {
		const gender = faker.helpers.arrayElement(["男", "女"])
		const category = faker.helpers.arrayElement(categories)
		const dataSource = faker.helpers.arrayElement(dataSources)
		const address = faker.helpers.arrayElement(addresses)
		const followStatus = faker.helpers.arrayElement(["0", "0", "0", "1"]) // 75% 未关注
		const entryTime = faker.date.between({ from: "2024-01-01", to: new Date() })

		// 随机生成 1-3 个标签
		const personTags: string[] = []
		const tagCount = faker.number.int({ min: 1, max: 3 })
		for (let j = 0; j < tagCount; j++) {
			const tag = faker.helpers.arrayElement(tags)
			if (!personTags.includes(tag)) {
				personTags.push(tag)
			}
		}

		// 30% 概率有头像
		const hasAvatar = faker.number.int({ min: 1, max: 10 }) <= 3

		const month = String(faker.number.int({ min: 1, max: 12 })).padStart(2, "0")
		const day = String(faker.number.int({ min: 1, max: 28 })).padStart(2, "0")

		// 70% 分配到 yhgl 树，30% 分配到 gxjg 树
		const useYhgl = faker.number.int({ min: 1, max: 10 }) <= 7
		const targetNodes = useYhgl ? yhglNodes : gxjgNodes
		const targetNode = faker.helpers.arrayElement(targetNodes)

		db.run(
			`INSERT INTO rygk_persons 
			(name, gender, age, phone, id_card, residence_address, category, data_source, tags, follow_status, avatar, tree_id, tree_type, entry_time) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				faker.helpers.arrayElement(surnames) + faker.helpers.arrayElement(givenNames),
				gender,
				faker.number.int({ min: 18, max: 80 }),
				faker.phone.number({ style: "national" }),
				`420100${faker.number.int({ min: 1950, max: 2005 })}${month}${day}${String(i).padStart(4, "0")}X`,
				address.code,
				category.code,
				dataSource,
				JSON.stringify(personTags),
				followStatus,
				hasAvatar ? faker.image.avatar() : null,
				targetNode.id,
				targetNode.type,
				entryTime.toISOString().replace("T", " ").slice(0, 19)
			]
		)
		personCount++
	}
	console.log(`  ✅ 已生成 ${personCount} 条人员数据`)

	// ========== 持久化到文件 ==========
	saveDatabase()
	console.log("\n🎉 数据填充完成！已保存到 mock.db")
}

seed().catch((err) => {
	console.error("❌ 数据填充失败:", err)
	process.exit(1)
})
