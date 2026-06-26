/**
 * ktc/tum/um 模块种子数据（单元上图）
 */
import type { Database } from "sql.js"

/** 表为空时插入默认数据（服务启动时调用） */
export function seedUmDefaults(db: Database) {
	const result = db.exec("SELECT COUNT(*) FROM ktc_um_units")
	const count = result[0]?.values[0]?.[0] as number
	if (count > 0) return

	const sampleData = [
		{ ip: "192.168.1.100", adsl: "", unit_type: "fixed_ip", control_category: "focus", unit_tag: "服务器", port_count: 48, terminal_count: 25, ip_location: "武汉市", focus_person: "张三", focus_unit: "XX科技公司", warning_type: "red", is_judged: 1, is_controlled: 1, entry_time: "2024-01-15 10:30:00", longitude: 114.31, latitude: 30.52, unit_type_name: "固定IP", control_category_name: "重点关注", warning_type_name: "红色预警" },
		{ ip: "192.168.1.101", adsl: "", unit_type: "fixed_ip", control_category: "level1", unit_tag: "终端", port_count: 24, terminal_count: 12, ip_location: "武汉市", focus_person: "李四", focus_unit: "YY网络公司", warning_type: "orange", is_judged: 0, is_controlled: 1, entry_time: "2024-01-16 14:20:00", longitude: 114.35, latitude: 30.58, unit_type_name: "固定IP", control_category_name: "一级", warning_type_name: "橙色预警" },
		{ ip: "10.0.0.50", adsl: "", unit_type: "fixed_ip", control_category: "level2", unit_tag: "交换机", port_count: 96, terminal_count: 80, ip_location: "黄石市", focus_person: "王五", focus_unit: "ZZ数据中心", warning_type: "yellow", is_judged: 0, is_controlled: 0, entry_time: "2024-01-17 09:15:00", longitude: 115.03, latitude: 30.20, unit_type_name: "固定IP", control_category_name: "二级", warning_type_name: "黄色预警" },
		{ ip: "", adsl: "ADSL001234", unit_type: "adsl", control_category: "level3", unit_tag: "家庭宽带", port_count: 4, terminal_count: 3, ip_location: "十堰市", focus_person: "赵六", focus_unit: "", warning_type: "blue", is_judged: 1, is_controlled: 0, entry_time: "2024-01-18 16:45:00", longitude: 111.50, latitude: 32.63, unit_type_name: "ADSL", control_category_name: "三级", warning_type_name: "蓝色预警" },
		{ ip: "172.16.0.200", adsl: "", unit_type: "fixed_ip", control_category: "focus", unit_tag: "防火墙", port_count: 8, terminal_count: 1, ip_location: "宜昌市", focus_person: "钱七", focus_unit: "网络安全中心", warning_type: "red", is_judged: 1, is_controlled: 1, entry_time: "2024-02-01 08:30:00", longitude: 111.28, latitude: 30.69, unit_type_name: "固定IP", control_category_name: "重点关注", warning_type_name: "红色预警" },
		{ ip: "192.168.2.50", adsl: "", unit_type: "fixed_ip", control_category: "level1", unit_tag: "服务器", port_count: 32, terminal_count: 15, ip_location: "襄阳市", focus_person: "孙八", focus_unit: "电商公司", warning_type: "orange", is_judged: 0, is_controlled: 0, entry_time: "2024-02-02 11:20:00", longitude: 112.14, latitude: 32.02, unit_type_name: "固定IP", control_category_name: "一级", warning_type_name: "橙色预警" },
		{ ip: "", adsl: "ADSL005678", unit_type: "adsl", control_category: "other", unit_tag: "家庭宽带", port_count: 4, terminal_count: 2, ip_location: "荆州市", focus_person: "周九", focus_unit: "", warning_type: "blue", is_judged: 0, is_controlled: 0, entry_time: "2024-02-03 15:10:00", longitude: 112.23, latitude: 30.32, unit_type_name: "ADSL", control_category_name: "其他", warning_type_name: "蓝色预警" },
		{ ip: "10.10.10.1", adsl: "", unit_type: "fixed_ip", control_category: "focus", unit_tag: "核心路由器", port_count: 64, terminal_count: 200, ip_location: "武汉市", focus_person: "吴十", focus_unit: "电信运营商", warning_type: "red", is_judged: 1, is_controlled: 1, entry_time: "2024-02-04 09:00:00", longitude: 114.30, latitude: 30.60, unit_type_name: "固定IP", control_category_name: "重点关注", warning_type_name: "红色预警" },
		{ ip: "192.168.3.100", adsl: "", unit_type: "fixed_ip", control_category: "level2", unit_tag: "AP设备", port_count: 2, terminal_count: 50, ip_location: "鄂州市", focus_person: "郑十一", focus_unit: "酒店", warning_type: "yellow", is_judged: 0, is_controlled: 1, entry_time: "2024-02-05 14:30:00", longitude: 114.89, latitude: 30.39, unit_type_name: "固定IP", control_category_name: "二级", warning_type_name: "黄色预警" },
		{ ip: "", adsl: "ADSL009012", unit_type: "adsl", control_category: "level1", unit_tag: "家庭宽带", port_count: 4, terminal_count: 4, ip_location: "荆门市", focus_person: "冯十二", focus_unit: "", warning_type: "orange", is_judged: 0, is_controlled: 0, entry_time: "2024-02-06 10:45:00", longitude: 112.20, latitude: 31.03, unit_type_name: "ADSL", control_category_name: "一级", warning_type_name: "橙色预警" },
		{ ip: "172.20.0.50", adsl: "", unit_type: "fixed_ip", control_category: "level3", unit_tag: "监控设备", port_count: 8, terminal_count: 16, ip_location: "孝感市", focus_person: "陈十三", focus_unit: "安防公司", warning_type: "blue", is_judged: 1, is_controlled: 0, entry_time: "2024-02-07 16:20:00", longitude: 113.91, latitude: 30.92, unit_type_name: "固定IP", control_category_name: "三级", warning_type_name: "蓝色预警" },
		{ ip: "192.168.4.200", adsl: "", unit_type: "fixed_ip", control_category: "focus", unit_tag: "数据库服务器", port_count: 16, terminal_count: 5, ip_location: "黄冈市", focus_person: "褚十四", focus_unit: "金融机构", warning_type: "red", is_judged: 1, is_controlled: 1, entry_time: "2024-03-01 08:00:00", longitude: 114.87, latitude: 30.45, unit_type_name: "固定IP", control_category_name: "重点关注", warning_type_name: "红色预警" },
		{ ip: "10.0.1.100", adsl: "", unit_type: "fixed_ip", control_category: "level2", unit_tag: "VPN网关", port_count: 4, terminal_count: 30, ip_location: "咸宁市", focus_person: "卫十五", focus_unit: "远程办公", warning_type: "yellow", is_judged: 0, is_controlled: 0, entry_time: "2024-03-02 13:15:00", longitude: 114.32, latitude: 29.84, unit_type_name: "固定IP", control_category_name: "二级", warning_type_name: "黄色预警" },
		{ ip: "", adsl: "ADSL003456", unit_type: "adsl", control_category: "other", unit_tag: "家庭宽带", port_count: 4, terminal_count: 6, ip_location: "随州市", focus_person: "蒋十六", focus_unit: "", warning_type: "blue", is_judged: 1, is_controlled: 0, entry_time: "2024-03-03 17:30:00", longitude: 113.38, latitude: 31.69, unit_type_name: "ADSL", control_category_name: "其他", warning_type_name: "蓝色预警" },
		{ ip: "192.168.5.150", adsl: "", unit_type: "fixed_ip", control_category: "level1", unit_tag: "邮件服务器", port_count: 16, terminal_count: 100, ip_location: "恩施市", focus_person: "沈十七", focus_unit: "教育机构", warning_type: "orange", is_judged: 0, is_controlled: 1, entry_time: "2024-03-04 09:45:00", longitude: 109.48, latitude: 30.27, unit_type_name: "固定IP", control_category_name: "一级", warning_type_name: "橙色预警" }
	]

	for (const data of sampleData) {
		db.run(
			`INSERT INTO ktc_um_units
			(ip, adsl, unit_type, control_category, unit_tag, port_count, terminal_count, ip_location, focus_person, focus_unit, warning_type, is_judged, is_controlled, entry_time, longitude, latitude, unit_type_name, control_category_name, warning_type_name)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[data.ip, data.adsl, data.unit_type, data.control_category, data.unit_tag, data.port_count, data.terminal_count, data.ip_location, data.focus_person, data.focus_unit, data.warning_type, data.is_judged, data.is_controlled, data.entry_time, data.longitude, data.latitude, data.unit_type_name, data.control_category_name, data.warning_type_name]
		)
	}
}

/** 生成 Faker 大数据（npm run seed 时调用） */
export function seedUmFakeData(_db: Database) {
	// um 模块使用默认示例数据即可
}
