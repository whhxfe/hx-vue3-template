/**
 * tum/uc 单元管控模块服务层
 * 使用内存存储数据（生产环境应使用数据库）
 */

import type { UnitItem, CreateParams, UpdateParams, JudgeParams, ControlParams } from "./types"

// 内存存储
let units: UnitItem[] = []
let nextId = 1

/**
 * 初始化测试数据
 */
export function initTestData() {
	if (units.length > 0) return

	const testUnits: Omit<UnitItem, 'id'>[] = [
		{ ip: "192.168.1.100", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "focus", controlCategoryName: "重点关注", unitTag: "服务器", categoryTag: "已研判", portCount: 48, terminalCount: 25, ipLocation: "武汉市", focusPerson: "张三", focusUnit: "XX科技公司", focusReason: "异常流量访问境外IP", warningType: "red", warningTypeName: "红色预警", isJudged: true, isControlled: true, entryTime: "2024-01-15 10:30:00" },
		{ ip: "192.168.1.101", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "level1", controlCategoryName: "一级", unitTag: "终端", categoryTag: "已布控", portCount: 24, terminalCount: 12, ipLocation: "武汉市", focusPerson: "李四", focusUnit: "YY网络公司", focusReason: "频繁扫描内网端口", warningType: "orange", warningTypeName: "橙色预警", isJudged: false, isControlled: true, entryTime: "2024-01-16 14:20:00" },
		{ ip: "10.0.0.50", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "level2", controlCategoryName: "二级", unitTag: "交换机", categoryTag: "", portCount: 96, terminalCount: 80, ipLocation: "黄石市", focusPerson: "王五", focusUnit: "ZZ数据中心", focusReason: "设备异常重启频繁", warningType: "yellow", warningTypeName: "黄色预警", isJudged: false, isControlled: false, entryTime: "2024-01-17 09:15:00" },
		{ ip: "", adsl: "ADSL001234", unitType: "adsl", unitTypeName: "ADSL", controlCategory: "level3", controlCategoryName: "三级", unitTag: "家庭宽带", categoryTag: "已研判", portCount: 4, terminalCount: 3, ipLocation: "十堰市", focusPerson: "赵六", focusUnit: "", focusReason: "疑似私建代理服务器", warningType: "blue", warningTypeName: "蓝色预警", isJudged: true, isControlled: false, entryTime: "2024-01-18 16:45:00" },
		{ ip: "172.16.0.200", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "focus", controlCategoryName: "重点关注", unitTag: "防火墙", categoryTag: "已布控", portCount: 8, terminalCount: 1, ipLocation: "宜昌市", focusPerson: "钱七", focusUnit: "网络安全中心", focusReason: "遭受DDoS攻击", warningType: "red", warningTypeName: "红色预警", isJudged: true, isControlled: true, entryTime: "2024-02-01 08:30:00" },
		{ ip: "192.168.2.50", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "level1", controlCategoryName: "一级", unitTag: "服务器", categoryTag: "", portCount: 32, terminalCount: 15, ipLocation: "襄阳市", focusPerson: "孙八", focusUnit: "电商公司", focusReason: "数据库异常访问", warningType: "orange", warningTypeName: "橙色预警", isJudged: false, isControlled: false, entryTime: "2024-02-02 11:20:00" },
		{ ip: "", adsl: "ADSL005678", unitType: "adsl", unitTypeName: "ADSL", controlCategory: "other", controlCategoryName: "其他", unitTag: "家庭宽带", categoryTag: "", portCount: 4, terminalCount: 2, ipLocation: "荆州市", focusPerson: "周九", focusUnit: "", focusReason: "异常上网行为", warningType: "blue", warningTypeName: "蓝色预警", isJudged: false, isControlled: false, entryTime: "2024-02-03 15:10:00" },
		{ ip: "10.10.10.1", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "focus", controlCategoryName: "重点关注", unitTag: "核心路由器", categoryTag: "已研判", portCount: 64, terminalCount: 200, ipLocation: "武汉市", focusPerson: "吴十", focusUnit: "电信运营商", focusReason: "骨干网络异常波动", warningType: "red", warningTypeName: "红色预警", isJudged: true, isControlled: true, entryTime: "2024-02-04 09:00:00" },
		{ ip: "192.168.3.100", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "level2", controlCategoryName: "二级", unitTag: "AP设备", categoryTag: "已布控", portCount: 2, terminalCount: 50, ipLocation: "鄂州市", focusPerson: "郑十一", focusUnit: "酒店", focusReason: "公共WiFi安全隐患", warningType: "yellow", warningTypeName: "黄色预警", isJudged: false, isControlled: true, entryTime: "2024-02-05 14:30:00" },
		{ ip: "", adsl: "ADSL009012", unitType: "adsl", unitTypeName: "ADSL", controlCategory: "level1", controlCategoryName: "一级", unitTag: "家庭宽带", categoryTag: "", portCount: 4, terminalCount: 4, ipLocation: "荆门市", focusPerson: "冯十二", focusUnit: "", focusReason: "涉嫌网络诈骗", warningType: "orange", warningTypeName: "橙色预警", isJudged: false, isControlled: false, entryTime: "2024-02-06 10:45:00" },
		{ ip: "172.20.0.50", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "level3", controlCategoryName: "三级", unitTag: "监控设备", categoryTag: "已研判", portCount: 8, terminalCount: 16, ipLocation: "孝感市", focusPerson: "陈十三", focusUnit: "安防公司", focusReason: "监控设备漏洞", warningType: "blue", warningTypeName: "蓝色预警", isJudged: true, isControlled: false, entryTime: "2024-02-07 16:20:00" },
		{ ip: "192.168.4.200", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "focus", controlCategoryName: "重点关注", unitTag: "数据库服务器", categoryTag: "已布控", portCount: 16, terminalCount: 5, ipLocation: "黄冈市", focusPerson: "褚十四", focusUnit: "金融机构", focusReason: "数据库拖库风险", warningType: "red", warningTypeName: "红色预警", isJudged: true, isControlled: true, entryTime: "2024-03-01 08:00:00" },
		{ ip: "10.0.1.100", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "level2", controlCategoryName: "二级", unitTag: "VPN网关", categoryTag: "", portCount: 4, terminalCount: 30, ipLocation: "咸宁市", focusPerson: "卫十五", focusUnit: "远程办公", focusReason: "VPN账号异常登录", warningType: "yellow", warningTypeName: "黄色预警", isJudged: false, isControlled: false, entryTime: "2024-03-02 13:15:00" },
		{ ip: "", adsl: "ADSL003456", unitType: "adsl", unitTypeName: "ADSL", controlCategory: "other", controlCategoryName: "其他", unitTag: "家庭宽带", categoryTag: "已研判", portCount: 4, terminalCount: 6, ipLocation: "随州市", focusPerson: "蒋十六", focusUnit: "", focusReason: "大流量异常上传", warningType: "blue", warningTypeName: "蓝色预警", isJudged: true, isControlled: false, entryTime: "2024-03-03 17:30:00" },
		{ ip: "192.168.5.150", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "level1", controlCategoryName: "一级", unitTag: "邮件服务器", categoryTag: "已布控", portCount: 16, terminalCount: 100, ipLocation: "恩施市", focusPerson: "沈十七", focusUnit: "教育机构", focusReason: "钓鱼邮件发送源", warningType: "orange", warningTypeName: "橙色预警", isJudged: false, isControlled: true, entryTime: "2024-03-04 09:45:00" },
		{ ip: "172.30.0.80", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "level3", controlCategoryName: "三级", unitTag: "IoT设备", categoryTag: "", portCount: 2, terminalCount: 20, ipLocation: "仙桃市", focusPerson: "韩十八", focusUnit: "智慧园区", focusReason: "IoT设备弱口令", warningType: "blue", warningTypeName: "蓝色预警", isJudged: false, isControlled: false, entryTime: "2024-03-05 11:00:00" },
		{ ip: "192.168.6.100", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "focus", controlCategoryName: "重点关注", unitTag: "Web服务器", categoryTag: "已研判", portCount: 8, terminalCount: 3, ipLocation: "潜江市", focusPerson: "杨十九", focusUnit: "互联网公司", focusReason: "Webshell植入", warningType: "red", warningTypeName: "红色预警", isJudged: true, isControlled: true, entryTime: "2024-04-01 10:00:00" },
		{ ip: "", adsl: "ADSL007890", unitType: "adsl", unitTypeName: "ADSL", controlCategory: "level2", controlCategoryName: "二级", unitTag: "家庭宽带", categoryTag: "已布控", portCount: 4, terminalCount: 5, ipLocation: "天门市", focusPerson: "朱二十", focusUnit: "", focusReason: "僵尸网络节点", warningType: "yellow", warningTypeName: "黄色预警", isJudged: false, isControlled: true, entryTime: "2024-04-02 14:30:00" },
		{ ip: "10.20.0.200", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "level1", controlCategoryName: "一级", unitTag: "存储设备", categoryTag: "", portCount: 32, terminalCount: 8, ipLocation: "神农架", focusPerson: "秦二一", focusUnit: "数据中心", focusReason: "存储设备异常读写", warningType: "orange", warningTypeName: "橙色预警", isJudged: false, isControlled: false, entryTime: "2024-04-03 16:00:00" },
		{ ip: "192.168.7.50", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "other", controlCategoryName: "其他", unitTag: "打印机", categoryTag: "已研判", portCount: 1, terminalCount: 1, ipLocation: "武汉市", focusPerson: "尤二二", focusUnit: "办公园区", focusReason: "打印机安全漏洞", warningType: "blue", warningTypeName: "蓝色预警", isJudged: true, isControlled: false, entryTime: "2024-04-04 08:30:00" },
		{ ip: "172.40.0.100", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "focus", controlCategoryName: "重点关注", unitTag: "负载均衡器", categoryTag: "已布控", portCount: 16, terminalCount: 50, ipLocation: "武汉市", focusPerson: "许二三", focusUnit: "云服务商", focusReason: "负载均衡配置异常", warningType: "red", warningTypeName: "红色预警", isJudged: true, isControlled: true, entryTime: "2024-05-01 09:00:00" },
		{ ip: "", adsl: "ADSL004567", unitType: "adsl", unitTypeName: "ADSL", controlCategory: "level3", controlCategoryName: "三级", unitTag: "家庭宽带", categoryTag: "", portCount: 4, terminalCount: 3, ipLocation: "黄石市", focusPerson: "何二四", focusUnit: "", focusReason: "P2P下载异常", warningType: "blue", warningTypeName: "蓝色预警", isJudged: false, isControlled: false, entryTime: "2024-05-02 12:15:00" },
		{ ip: "192.168.8.200", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "level2", controlCategoryName: "二级", unitTag: "DNS服务器", categoryTag: "已研判", portCount: 8, terminalCount: 2, ipLocation: "十堰市", focusPerson: "吕二五", focusUnit: "ISP运营商", focusReason: "DNS劫持风险", warningType: "yellow", warningTypeName: "黄色预警", isJudged: true, isControlled: false, entryTime: "2024-05-03 15:45:00" },
		{ ip: "10.30.0.150", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "focus", controlCategoryName: "重点关注", unitTag: "入侵检测系统", categoryTag: "已布控", portCount: 4, terminalCount: 1, ipLocation: "宜昌市", focusPerson: "施二六", focusUnit: "安全公司", focusReason: "IDS规则被绕过", warningType: "red", warningTypeName: "红色预警", isJudged: true, isControlled: true, entryTime: "2024-06-01 10:30:00" },
		{ ip: "192.168.9.100", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "level1", controlCategoryName: "一级", unitTag: "日志服务器", categoryTag: "", portCount: 16, terminalCount: 5, ipLocation: "襄阳市", focusPerson: "张二七", focusUnit: "运维中心", focusReason: "日志被篡改", warningType: "orange", warningTypeName: "橙色预警", isJudged: false, isControlled: false, entryTime: "2024-06-02 14:00:00" },
		{ ip: "", adsl: "ADSL008901", unitType: "adsl", unitTypeName: "ADSL", controlCategory: "other", controlCategoryName: "其他", unitTag: "家庭宽带", categoryTag: "已研判", portCount: 4, terminalCount: 4, ipLocation: "荆州市", focusPerson: "孔二八", focusUnit: "", focusReason: "挖矿行为", warningType: "blue", warningTypeName: "蓝色预警", isJudged: true, isControlled: false, entryTime: "2024-06-03 17:00:00" },
		{ ip: "172.50.0.200", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "level2", controlCategoryName: "二级", unitTag: "无线控制器", categoryTag: "已布控", portCount: 8, terminalCount: 100, ipLocation: "鄂州市", focusPerson: "曹二九", focusUnit: "商场", focusReason: "无线网络钓鱼", warningType: "yellow", warningTypeName: "黄色预警", isJudged: false, isControlled: true, entryTime: "2024-07-01 09:30:00" },
		{ ip: "192.168.10.50", adsl: "", unitType: "fixed_ip", unitTypeName: "固定IP", controlCategory: "level3", controlCategoryName: "三级", unitTag: "摄像头", categoryTag: "", portCount: 1, terminalCount: 1, ipLocation: "荆门市", focusPerson: "严三十", focusUnit: "小区物业", focusReason: "摄像头弱口令", warningType: "blue", warningTypeName: "蓝色预警", isJudged: false, isControlled: false, entryTime: "2024-07-02 11:45:00" }
	]

	units = testUnits.map((unit, index) => ({
		...unit,
		id: index + 1
	}))
	nextId = units.length + 1
}

/**
 * 获取列表数据
 */
export function getUnits(query: {
	page?: number
	pageSize?: number
	keyword?: string
	unitType?: string
	controlCategory?: string
	entryTimeStart?: string
	entryTimeEnd?: string
	categoryFilter?: string[]
}) {
	initTestData()

	let filtered = [...units]

	// 关键字筛选
	if (query.keyword) {
		const keyword = query.keyword.toLowerCase()
		filtered = filtered.filter(u =>
			u.ip.toLowerCase().includes(keyword) ||
			u.adsl.toLowerCase().includes(keyword)
		)
	}

	// 单元类型筛选
	if (query.unitType) {
		filtered = filtered.filter(u => u.unitType === query.unitType)
	}

	// 管控类别筛选
	if (query.controlCategory) {
		filtered = filtered.filter(u => u.controlCategory === query.controlCategory)
	}

	// 类别筛选（已研判、已布控）
	if (query.categoryFilter && query.categoryFilter.length > 0) {
		filtered = filtered.filter(u => {
			if (query.categoryFilter!.includes("judged") && !u.isJudged) return false
			if (query.categoryFilter!.includes("controlled") && !u.isControlled) return false
			return true
		})
	}

	// 录入时间筛选
	if (query.entryTimeStart) {
		filtered = filtered.filter(u => u.entryTime >= query.entryTimeStart!)
	}
	if (query.entryTimeEnd) {
		filtered = filtered.filter(u => u.entryTime <= query.entryTimeEnd!)
	}

	const total = filtered.length
	const page = query.page || 1
	const pageSize = query.pageSize || 10
	const start = (page - 1) * pageSize
	const list = filtered.slice(start, start + pageSize)

	return { list, total, page, pageSize }
}

/**
 * 创建单元
 */
export function createUnit(data: CreateParams): UnitItem {
	initTestData()

	const unitTypeMap: Record<string, string> = {
		fixed_ip: "固定IP",
		adsl: "ADSL"
	}

	const controlCategoryMap: Record<string, string> = {
		focus: "重点关注",
		level1: "一级",
		level2: "二级",
		level3: "三级",
		other: "其他"
	}

	const warningTypeMap: Record<string, string> = {
		red: "红色预警",
		orange: "橙色预警",
		yellow: "黄色预警",
		blue: "蓝色预警"
	}

	const newUnit: UnitItem = {
		id: nextId++,
		ip: data.ip,
		adsl: data.adsl || "",
		unitType: data.unitType,
		unitTypeName: unitTypeMap[data.unitType] || data.unitType,
		controlCategory: data.controlCategory,
		controlCategoryName: controlCategoryMap[data.controlCategory] || data.controlCategory,
		unitTag: "",
		categoryTag: "",
		portCount: data.portCount || 0,
		terminalCount: data.terminalCount || 0,
		ipLocation: data.ipLocation || "",
		focusPerson: data.focusPerson || "",
		focusUnit: data.focusUnit || "",
		focusReason: data.focusReason || "",
		warningType: data.warningType || "",
		warningTypeName: warningTypeMap[data.warningType || ""] || "",
		isJudged: false,
		isControlled: false,
		entryTime: new Date().toISOString().replace("T", " ").substring(0, 19)
	}

	units.unshift(newUnit)
	return newUnit
}

/**
 * 更新单元
 */
export function updateUnit(id: number, data: Partial<CreateParams>): UnitItem | null {
	initTestData()

	const index = units.findIndex(u => u.id === id)
	if (index === -1) return null

	const unitTypeMap: Record<string, string> = {
		fixed_ip: "固定IP",
		adsl: "ADSL"
	}

	const controlCategoryMap: Record<string, string> = {
		focus: "重点关注",
		level1: "一级",
		level2: "二级",
		level3: "三级",
		other: "其他"
	}

	const warningTypeMap: Record<string, string> = {
		red: "红色预警",
		orange: "橙色预警",
		yellow: "黄色预警",
		blue: "蓝色预警"
	}

	units[index] = {
		...units[index],
		...data,
		unitTypeName: data.unitType ? unitTypeMap[data.unitType] : units[index].unitTypeName,
		controlCategoryName: data.controlCategory ? controlCategoryMap[data.controlCategory] : units[index].controlCategoryName,
		warningTypeName: data.warningType ? warningTypeMap[data.warningType] : units[index].warningTypeName
	}

	return units[index]
}

/**
 * 删除单元
 */
export function deleteUnit(id: number): boolean {
	initTestData()

	const index = units.findIndex(u => u.id === id)
	if (index === -1) return false

	units.splice(index, 1)
	return true
}

/**
 * 研判
 */
export function judgeUnit(data: JudgeParams): UnitItem | null {
	initTestData()

	const controlCategoryMap: Record<string, string> = {
		focus: "重点关注",
		level1: "一级",
		level2: "二级",
		level3: "三级",
		other: "其他"
	}

	const index = units.findIndex(u => u.id === data.id)
	if (index === -1) return null

	units[index] = {
		...units[index],
		controlCategory: data.controlCategory,
		controlCategoryName: controlCategoryMap[data.controlCategory] || data.controlCategory,
		isJudged: true,
		categoryTag: "已研判"
	}

	return units[index]
}

/**
 * 布控
 */
export function controlUnit(data: ControlParams): UnitItem | null {
	initTestData()

	const index = units.findIndex(u => u.id === data.id)
	if (index === -1) return null

	units[index] = {
		...units[index],
		isControlled: true,
		categoryTag: units[index].isJudged ? "已研判,已布控" : "已布控"
	}

	return units[index]
}

/**
 * 批量获取数据（用于导出）
 */
export function getUnitsByIds(ids: number[]): UnitItem[] {
	initTestData()
	return units.filter(u => ids.includes(u.id))
}
