/**
 * ryst 模块数据库表结构
 */
import type { Database } from "sql.js"

/**
 * 创建 ryst 相关表结构
 */
export function createRystTables(db: Database): void {
	// 人员视图信息表
	db.run(`
		CREATE TABLE IF NOT EXISTS ryst_persons (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			gender TEXT,
			age INTEGER,
			phone TEXT,
			id_card TEXT,
			avatar TEXT,
			residence_address TEXT,
			category TEXT,
			data_source TEXT,
			tags TEXT,
			follow_status TEXT DEFAULT '0',
			longitude REAL,
			latitude REAL,
			entry_time TEXT,
			data_source_name TEXT,
			category_name TEXT,
			created_at TEXT DEFAULT (datetime('now')),
			updated_at TEXT DEFAULT (datetime('now'))
		)
	`)

	// 检查是否已有数据
	const result = db.exec("SELECT COUNT(*) FROM ryst_persons")
	const count = result[0]?.values[0]?.[0] as number

	if (count === 0) {
		insertRystSampleData(db)
	}
}

/**
 * 插入 ryst 示例数据
 */
function insertRystSampleData(db: Database): void {
		const sampleData = [
		{
			name: "张三", gender: "男", age: 35, phone: "13800138001", id_card: "420100199001011234",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan",
			residence_address: "武汉市洪山区", category: "1", data_source: "community",
			follow_status: "1", longitude: 114.31, latitude: 30.52,
			data_source_name: "社区采集", category_name: "重点关注人员",
			tags: "党员,志愿者", entry_time: "2024-01-15"
		},
		{
			name: "李四", gender: "女", age: 28, phone: "13900139002", id_card: "420200199202021234",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisi",
			residence_address: "黄石市黄石港区", category: "2", data_source: "hospital",
			follow_status: "0", longitude: 115.03, latitude: 30.20,
			data_source_name: "医院录入", category_name: "独居老人",
			tags: "独居老人", entry_time: "2024-02-20"
		},
		{
			name: "王五", gender: "男", age: 45, phone: "13700137003", id_card: "420300198001031234",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu",
			residence_address: "十堰市茅箭区", category: "1", data_source: "police",
			follow_status: "1", longitude: 111.50, latitude: 32.63,
			data_source_name: "公安推送", category_name: "重点关注人员",
			tags: "低保户", entry_time: "2024-01-08"
		},
		{
			name: "赵六", gender: "女", age: 52, phone: "13600136004", id_card: "420500197201041234",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhaoliu",
			residence_address: "宜昌市西陵区", category: "2", data_source: "grid",
			follow_status: "2", longitude: 111.28, latitude: 30.69,
			data_source_name: "网格录入", category_name: "困难群体",
			tags: "困难家庭", entry_time: "2024-03-01"
		},
		{
			name: "钱七", gender: "男", age: 33, phone: "13500135005", id_card: "420600199103051234",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=qianqi",
			residence_address: "襄阳市襄城区", category: "3", data_source: "self",
			follow_status: "0", longitude: 112.14, latitude: 32.02,
			data_source_name: "自主上报", category_name: "普通人员",
			tags: "", entry_time: "2024-03-10"
		},
		{
			name: "孙八", gender: "女", age: 41, phone: "13400134006", id_card: "420700198401061234",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sunba",
			residence_address: "鄂州市鄂城区", category: "1", data_source: "community",
			follow_status: "1", longitude: 114.89, latitude: 30.39,
			data_source_name: "社区采集", category_name: "重点关注人员",
			tags: "残疾人", entry_time: "2024-02-28"
		},
		{
			name: "周九", gender: "男", age: 29, phone: "13300133007", id_card: "421000199501071234",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhoujiu",
			residence_address: "荆州市沙市区", category: "2", data_source: "hospital",
			follow_status: "2", longitude: 112.23, latitude: 30.32,
			data_source_name: "医院录入", category_name: "困难群体",
			tags: "慢性病", entry_time: "2024-01-25"
		},
		{
			name: "吴十", gender: "女", age: 38, phone: "13200132008", id_card: "421100198601081234",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wushi",
			residence_address: "黄冈市黄州区", category: "1", data_source: "police",
			follow_status: "1", longitude: 114.87, latitude: 30.45,
			data_source_name: "公安推送", category_name: "重点关注人员",
			tags: "刑满释放", entry_time: "2024-02-15"
		},
		{
			name: "郑十一", gender: "男", age: 55, phone: "13100131009", id_card: "421200197001091234",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhengshiyi",
			residence_address: "咸宁市咸安区", category: "2", data_source: "grid",
			follow_status: "0", longitude: 114.32, latitude: 29.84,
			data_source_name: "网格录入", category_name: "独居老人",
			tags: "独居老人", entry_time: "2024-03-05"
		},
		{
			name: "冯十二", gender: "女", age: 62, phone: "13000130010", id_card: "421300196201101234",
			avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fengshier",
			residence_address: "随州市曾都区", category: "1", data_source: "community",
			follow_status: "1", longitude: 113.38, latitude: 31.69,
			data_source_name: "社区采集", category_name: "重点关注人员",
			tags: "退役军人,党员", entry_time: "2024-01-30"
		}
	]

		for (const data of sampleData) {
		db.run(
			`INSERT INTO ryst_persons 
			(name, gender, age, phone, id_card, avatar, residence_address, category, data_source, follow_status, longitude, latitude, data_source_name, category_name, tags, entry_time)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				data.name, data.gender, data.age, data.phone, data.id_card, data.avatar, data.residence_address,
				data.category, data.data_source, data.follow_status, data.longitude, data.latitude,
				data.data_source_name, data.category_name, data.tags, data.entry_time
			]
		)
	}
}
