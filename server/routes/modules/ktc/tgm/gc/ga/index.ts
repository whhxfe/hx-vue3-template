/**
 * tgm/gc/ga 群体档案模块路由
 *
 * 层级路由: /wzsys/ktc/tgm/gc/ga/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success, pagedList } from "@utils/response"
import { queryAll } from "@utils/db-helper"

export const gaRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// 群体基本信息
	app.get("/info", async (request) => {
		const groupId = Number((request.query as any).groupId)
		if (!groupId) return success(null)

		const rows = queryAll("SELECT * FROM ktc_gc_groups WHERE id = ?", [groupId])
		if (rows.length === 0) return success(null)

		const row = rows[0]
		const warningTypes = row.warning_types ? JSON.parse(row.warning_types) : []
		const categoryMap: Record<string, string> = {
			"上访群体": "上访群体", "涉稳群体": "涉稳群体", "维权群体": "维权群体",
			"利益诉求": "利益诉求", "重点关注": "重点关注"
		}

		return success({
			id: row.id,
			name: row.name,
			categoryType: categoryMap[row.category_type] || row.category_type || "",
			controlCategory: "重点关注",
			territory: row.territory || "",
			memberCount: row.member_count || 0,
			activeCount: row.active_count || 0,
			recommendCount: row.recommend_count || 0,
			policeName: row.police_name || "",
			unitName: row.unit_name || "",
			reason: row.reason || "",
			warningTypes
		})
	})

	// 共性分析 - tabs
	app.get("/community-tabs", async (request) => {
		const tabs = [
			{ key: "group", label: "同群人员", count: 23 },
			{ key: "location", label: "同位置聚集人员", count: 15 },
			{ key: "ticket", label: "购买进京机票人员", count: 8 }
		]
		return success(tabs)
	})

	// 共性分析 - 数据
	app.get("/community-groups", async (request) => {
		const groupId = Number((request.query as any).groupId)
		const type = (request.query as any).type || "group"

		if (type === "group") {
			const groups = [
				{ id: 1, groupName: "群组名称001", groupNumber: "388673721", groupType: "QQ群", commonMembers: 3, description: "相关描述信息，相关描述信息", members: [
					{ id: 1, qqNumber: "503928176", nickname: "一级侦查员", phone: "18873972938", name: "李泽宽", idCard: "230823198610212832" },
					{ id: 2, qqNumber: "1029586983", nickname: "秋风", phone: "18976442019", name: "李泽宽", idCard: "230823198610212832" },
					{ id: 3, qqNumber: "305968799", nickname: "落叶", phone: "15809182392", name: "李泽宽", idCard: "230823198610212832" }
				]},
				{ id: 2, groupName: "群组名称002", groupNumber: "84732908", groupType: "微信群", commonMembers: 5, description: "相关描述信息", members: [] },
				{ id: 3, groupName: "群组名称003", groupNumber: "103857165", groupType: "QQ群", commonMembers: 2, description: "相关描述信息，相关描述信息", members: [] }
			]
			return success(groups)
		}

		if (type === "location") {
			const groups = [
				{ id: 10, groupName: "聚集地点-林芝广场", groupNumber: "--", groupType: "线下", commonMembers: 8, description: "多次在林芝广场聚集", members: [
					{ id: 10, qqNumber: "200111222", nickname: "阳光", phone: "13800001111", name: "王明", idCard: "542600199001011234" },
					{ id: 11, qqNumber: "300222333", nickname: "风雨", phone: "13900002222", name: "李华", idCard: "542600199002021234" }
				]},
				{ id: 11, groupName: "聚集地点-八一镇", groupNumber: "--", groupType: "线下", commonMembers: 5, description: "多次在八一镇区域聚集", members: [] }
			]
			return success(groups)
		}

		if (type === "ticket") {
			const groups = [
				{ id: 20, groupName: "进京航班-CA4112", groupNumber: "CA4112", groupType: "机票", commonMembers: 4, description: "2026年3月15日成都至北京航班", members: [
					{ id: 20, qqNumber: "400333444", nickname: "行者", phone: "15800003333", name: "张伟", idCard: "542600199003031234" },
					{ id: 21, qqNumber: "500444555", nickname: "远行", phone: "15900004444", name: "刘洋", idCard: "542600199004041234" }
				]},
				{ id: 21, groupName: "进京航班-CA1234", groupNumber: "CA1234", groupType: "机票", commonMembers: 2, description: "2026年4月20日拉萨至北京航班", members: [] }
			]
			return success(groups)
		}

		return success([])
	})

	// 行为活动
	app.post("/behavior-activities", async (request) => {
		const { page = 1, pageSize = 10 } = (request.body || {}) as any
		const mockData = Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			sourceIp: "192.268.110.35",
			sourcePort: "8080",
			destIp: "192.168.35.11",
			destPort: "8082",
			protocol: "HTTPS",
			action: ["搜索", "登录", "上线", "评论"][i % 4],
			dataSource: "5GZK数据",
			resourceType: "业务库",
			captureTime: `2026-02-20 10:32:0${i}`,
			phone: "18925868686"
		}))

		const start = (page - 1) * pageSize
		const list = mockData.slice(start, start + pageSize)
		return pagedList(list, mockData.length, page, pageSize)
	})

	// 研判信息
	app.get("/judgments", async (request) => {
		const judgments = [
			{ id: 1, conclusion: "重点关注", conclusionType: "danger", unit: "林芝市公安局网安支队", person: "张林芝", time: "2026-05-09 12:34:00", basis: "相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明" },
			{ id: 2, conclusion: "一级", conclusionType: "warning", unit: "林芝市公安局网安支队", person: "张林芝", time: "2026-05-07 10:13:20", basis: "相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明" }
		]
		return success(judgments)
	})

	// 我的一天 - 历史动态
	app.get("/my-day", async (request) => {
		const groups = [
			{
				date: "2023-04-23", weekday: "星期日",
				items: [
					{ title: "进入重点区域", time: "21:05:36", detail: "区域名称：康宁寺 | 入侵时间：21:05:36 | 关联手机号：13860296858", level: "info" },
					{ title: "访问境外IP", time: "20:13:42", detail: "域名：www.mayivpn.comIP | IP：192.180.11.25 | 关联手机号：18966886856", level: "normal" },
					{ title: "访问境外IP", time: "20:07:21", detail: "域名：www.mayivpn.comIP | IP：192.180.11.25 | 关联手机号：18966886856", level: "normal" },
					{ title: "使用VPN工具/协议", time: "20:01:13", detail: "应用：蚂蚁VPN | 动作：登录 | 域名：www.mayivpn.com | IP：192.168.110.35 | 关联手机号：13860296858", level: "warning" },
					{ title: "重点人聚集", time: "19:25:08", detail: "聚集地：沿河西路中国电信附近 | 聚集人数：5人 | 聚集时间：19:25:08 | 关联手机号：13860296858", level: "info" },
					{ title: "访问境外IP", time: "16:22:01", detail: "IP地址：192.180.11.25 | 访问时间：16:22:01 | 关联手机号：13860296858", level: "normal" },
					{ title: "命中敏感信息", time: "15:12:30", detail: "命中内容：<span style='color:#f56c6c'>活佛</span>保佑家人平安，黄天当立<span style='color:#f56c6c'>达赖</span>救世。<span style='color:#f56c6c'>活佛</span>保佑家人平安，黄天当立 | 使用应用：微信 | 使用账号：basang1011 | 动作：私聊文件发送 | 域名：www.wechat.com | IP：192.168.110.35 | 关联手机号：13860296858", level: "danger" },
					{ title: "访问境外IP", time: "10:29:56", detail: "域名：www.mayivpn.comIP | IP：192.180.11.25 | 关联手机号：18966886856", level: "normal" }
				]
			},
			{
				date: "2023-04-22", weekday: "星期六",
				items: [
					{ title: "访问境外IP", time: "18:30:15", detail: "域名：www.mayivpn.comIP | IP：192.180.11.25 | 关联手机号：18966886856", level: "normal" },
					{ title: "使用VPN工具/协议", time: "15:22:10", detail: "应用：蚂蚁VPN | 动作：连接 | 域名：www.mayivpn.com | IP：192.168.110.35 | 关联手机号：13860296858", level: "warning" },
					{ title: "重点人聚集", time: "14:10:33", detail: "聚集地：林芝广场 | 聚集人数：8人 | 聚集时间：14:10:33 | 关联手机号：13860296858", level: "info" }
				]
			}
		]
		return success(groups)
	})

	// 操作日志
	app.get("/op-logs", async (request) => {
		const groups = [
			{
				date: "2023-04-23", weekday: "星期日",
				items: [
					{ title: "添加群体成员", operator: "张林芝", time: "2026-05-09 11:05:36" },
					{ title: "添加群组", operator: "张林芝", time: "2026-05-09 11:05:36" },
					{ title: "添加群体成员", operator: "张林芝", time: "2026-05-09 11:05:36" },
					{ title: "删除群体成员", operator: "张林芝", time: "2026-05-09 11:05:36" },
					{ title: "添加群组", operator: "张林芝", time: "2026-05-09 11:05:36" },
					{ title: "修改群体名称", operator: "张林芝", time: "2026-05-09 11:05:36" }
				]
			},
			{
				date: "2023-04-22", weekday: "星期六",
				items: [
					{ title: "修改群体成员信息", operator: "李国安", time: "2026-05-08 14:20:15" },
					{ title: "添加群体成员", operator: "李国安", time: "2026-05-08 14:20:15" }
				]
			},
			{
				date: "2023-04-21", weekday: "星期五",
				items: [
					{ title: "删除群组", operator: "王建军", time: "2026-05-07 09:30:22" },
					{ title: "修改群体属地", operator: "王建军", time: "2026-05-07 09:30:22" }
				]
			},
			{
				date: "2023-04-20", weekday: "星期四",
				items: [
					{ title: "添加群体成员", operator: "张林芝", time: "2026-05-06 16:45:10" }
				]
			}
		]
		return success(groups)
	})

	// 上网时段分析 - 图表数据
	app.get("/online-time-chart", async (request) => {
		const hours = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]
		const values = [3, 5, 2, 5, 2, 3, 8, 15, 45, 20, 8, 5, 38, 22, 8, 5, 3, 12, 28, 35, 42, 30, 18, 8]
		return success({ hours, values })
	})

	// 上网时段分析 - 明细列表
	app.post("/online-time-list", async (request) => {
		const { page = 1, pageSize = 10 } = (request.body || {}) as any
		const sites = ["知乎", "www.baidu.com", "支付宝", "微信", "抖音", "淘宝", "QQ", "微博"]
		const phones = ["18925868686", "13852355950", "13860296858", "18966886856"]

		const mockData = Array.from({ length: 300 }, (_, i) => ({
			id: i + 1,
			time: "2021-12-27 10:16:32",
			stationId: "KK89K-LLS98YT-SS8CB-SSUT",
			siteOrApp: sites[i % sites.length],
			phone: phones[i % phones.length]
		}))

		const start = (page - 1) * pageSize
		const list = mockData.slice(start, start + pageSize)
		return pagedList(list, mockData.length, page, pageSize)
	})

	// 上网地点分析
	app.get("/online-locations", async (request) => {
		const addresses = [
			"哈尔滨市木兰县铁道村122号",
			"哈尔滨市道里区中央大街88号",
			"哈尔滨市南岗区红军街15号",
			"哈尔滨市香坊区红旗大街100号",
			"哈尔滨市道外区靖宇街56号",
			"哈尔滨市平房区新疆大街1号",
			"哈尔滨市松北区世茂大道1号",
			"哈尔滨市呼兰区利民开发区"
		]
		const phones = ["18925868686", "13852355950", "13860296858", "18966886856"]

		const list = Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			time: "2021-12-27 10:16:32",
			address: addresses[i % addresses.length],
			phone: phones[i % phones.length],
			lng: 126.63 + Math.random() * 0.1,
			lat: 45.75 + Math.random() * 0.1
		}))

		return success({ list, total: 86 })
	})

	// 使用应用分析
	app.get("/app-analysis", async (request) => {
		const chartData = {
			names: ["微信", "抖音", "MOMO...", "新浪微博", "百度", "搜狗输...", "哈啰出行", "知乎", "Soul", "墨迹天气", "百度贴吧", "腾讯会议", "QQ空间", "高德地图", "铁路12...", "携程旅行", "滴滴出行"],
			values: [620, 580, 520, 480, 450, 420, 380, 350, 300, 280, 240, 200, 180, 150, 120, 100, 80]
		}

		const groups = [
			{
				category: "通讯社交",
				icon: "💬",
				apps: [
					{ name: "微信", count: 286 },
					{ name: "QQ", count: 26 },
					{ name: "新浪微博", count: 120 },
					{ name: "MOMO陌陌", count: 88 },
					{ name: "知乎", count: 53 },
					{ name: "百度贴吧", count: 25 },
					{ name: "Soul", count: 96 },
					{ name: "QQ空间", count: 25 }
				]
			},
			{
				category: "工具",
				icon: "🔧",
				apps: [
					{ name: "百度", count: 120 },
					{ name: "QQ浏览器", count: 26 },
					{ name: "搜狗输入法", count: 120 },
					{ name: "UC浏览器", count: 25 },
					{ name: "WPS Office", count: 11 },
					{ name: "百度贴吧", count: 36 },
					{ name: "墨迹天气", count: 110 },
					{ name: "腾讯会议", count: 12 },
					{ name: "中国移动", count: 36 }
				]
			},
			{
				category: "出行",
				icon: "🚗",
				apps: [
					{ name: "哈啰出行", count: 85 },
					{ name: "高德地图", count: 65 },
					{ name: "滴滴出行", count: 42 },
					{ name: "铁路12306", count: 35 },
					{ name: "携程旅行", count: 28 }
				]
			}
		]

		return success({ chartData, groups })
	})

	// 应用使用详情
	app.post("/app-detail-list", async (request) => {
		const { page = 1, pageSize = 10 } = (request.body || {}) as any
		const phones = ["18925868686", "13852355950", "13860296858"]

		const mockData = Array.from({ length: 300 }, (_, i) => ({
			id: i + 1,
			time: "2021-12-27 10:16:32",
			stationId: "KK89K-LLS98YT-SS8CB-SSUT",
			phone: phones[i % phones.length]
		}))

		const start = (page - 1) * pageSize
		const list = mockData.slice(start, start + pageSize)
		return pagedList(list, mockData.length, page, pageSize)
	})

	// 访问网站列表
	app.post("/website-list", async (request) => {
		const { page = 1, pageSize = 10, keyword = "" } = (request.body || {}) as any
		const domains = ["www.baidu.com", "www.qiandaibao.cn", "www.xiaomi.com", "www.wangyi.com", "www.souhu.com"]
		const ips = ["192.168.10.11", "192.168.10.12", "192.168.10.13"]
		const phones = ["18925868686", "13852355950", "13860296858"]
		const counts = [35, 32, 30, 28, 27, 25, 24, 20, 19, 16]

		const mockData = Array.from({ length: 300 }, (_, i) => ({
			id: i + 1,
			domain: domains[i % domains.length],
			ip: ips[i % ips.length],
			firstTime: "2018-03-03 10:32:01",
			lastTime: "2021-12-27 10:16:32",
			phone: phones[i % phones.length],
			visitCount: counts[i % counts.length]
		}))

		const filtered = keyword
			? mockData.filter(d => d.domain.includes(keyword) || d.ip.includes(keyword))
			: mockData

		const start = (page - 1) * pageSize
		const list = filtered.slice(start, start + pageSize)
		return success({ list, total: filtered.length, totalCount: 105 })
	})

	// 网站访问次数详情
	app.post("/website-detail-list", async (request) => {
		const { page = 1, pageSize = 10 } = (request.body || {}) as any
		const phones = ["18925868686", "13852355950", "13860296858"]

		const mockData = Array.from({ length: 300 }, (_, i) => ({
			id: i + 1,
			time: "2021-12-27 10:16:32",
			stationId: "KK89K-LLS98YT-SS8CB-SSUT",
			phone: phones[i % phones.length]
		}))

		const start = (page - 1) * pageSize
		const list = mockData.slice(start, start + pageSize)
		return pagedList(list, mockData.length, page, pageSize)
	})

	// 内容分析列表
	app.get("/content-list", async (request) => {
		const tab = (request.query as any).tab || "keyword"

		const mockData = Array.from({ length: 11 }, (_, i) => ({
			id: i + 1,
			content: i % 2 === 0
				? "活佛保佑家人平安，黄天当立达赖救世，活佛保佑家人平安，黄天当立达赖救世，活佛保佑家人平安，黄天当立达赖..."
				: "聆听大师教义能感绝心灵被净化，内心从没有过的宁静安详，聆听大师教义能感绝心灵被净化，内心从没有过的宁静安详...",
			keywords: i % 2 === 0 ? ["达赖"] : ["教义"],
			hasMultiPerson: i % 3 === 0,
			captureTime: "2025-12-18 12:34:00",
			url: "http://searchera.ximalaya.com/gushihot/gtl",
			appName: i % 3 === 0 ? "微信" : (i % 3 === 1 ? "新浪微博" : "QQ"),
			appAccount: i % 3 === 0 ? "zhaxidele" : (i % 3 === 1 ? "RedFlower" : "1108409367"),
			fullContent: i % 2 === 0
				? "活佛保佑家人平安，黄天当立达赖救世，活佛保佑家人平安，黄天当立达赖救世，活佛保佑家人平安，黄天当立达赖救世，活佛保佑家人平安，黄天当立达赖救世，活佛保佑家人平安，黄天当立达赖救世，活佛保佑家人平安，黄天当立达赖救世，活佛保佑家人平安，黄天当立达赖救世，活佛保佑家人平安，黄天当立达赖救世"
				: "聆听大师教义能感绝心灵被净化，内心从没有过的宁静安详，在这浮躁的世界感受一丝安宁，聆听大师教义能感绝心灵被净化，内心从没有过的宁静安详，在这浮躁的世界感受一丝安宁"
		}))

		let filtered = mockData
		if (tab === "person") {
			filtered = mockData.filter(d => d.hasMultiPerson)
		} else if (tab === "tibetan") {
			filtered = mockData.filter(d => d.keywords.includes("达赖"))
		}

		return success({ list: filtered, total: filtered.length })
	})

	// 多媒体分析列表
	app.get("/media-list", async (request) => {
		const tab = (request.query as any).tab || "image"
		const sources = ["https", "微信", "新浪微博", "QQ", "抖音"]
		const accounts = ["admin", "zhaxidele", "RedFlower", "1108409367", "basang1011"]
		const thumbs = [
			"https://picsum.photos/seed/a/100/80",
			"https://picsum.photos/seed/b/100/80",
			"https://picsum.photos/seed/c/100/80",
			"https://picsum.photos/seed/d/100/80",
			"https://picsum.photos/seed/e/100/80",
			"https://picsum.photos/seed/f/100/80"
		]

		const mockData = Array.from({ length: tab === "image" ? 51 : (tab === "audio" ? 32 : 19) }, (_, i) => ({
			id: i + 1,
			type: tab,
			thumbUrl: tab === "image" ? thumbs[i % thumbs.length] : undefined,
			url: "https://searchera.ximalaya.com/guideWordV3/q.0",
			source: sources[i % sources.length],
			account: accounts[i % accounts.length],
			captureTime: "2023-03-16 10:33:10"
		}))

		return success({ list: mockData, total: mockData.length })
	})

	// 大文件分析列表
	app.post("/large-file-list", async (request) => {
		const { page = 1, pageSize = 10, keyword = "" } = (request.body || {}) as any
		const fileNames = ["键盘上跳舞", "活佛教义", "复仇者联盟", "TCRJ", "杀死比尔"]
		const fileTypes = ["安装程序", "压缩文件", "视频", "文档"]
		const fileFormats = [".exe", ".rar", ".avi", ".docx"]
		const fileSizes = [1425.62, 128.00, 2423.56, 59.10, 2298.15]
		const appNames = ["迅雷", "百度网盘", "百度网盘", "微信", "百度网盘"]

		const mockData = Array.from({ length: 300 }, (_, i) => ({
			id: i + 1,
			fileName: fileNames[i % fileNames.length],
			fileType: fileTypes[i % fileTypes.length],
			fileFormat: fileFormats[i % fileFormats.length],
			fileSize: fileSizes[i % fileSizes.length],
			appName: appNames[i % appNames.length],
			captureTime: "2025-12-27 10:16:32"
		}))

		const filtered = keyword
			? mockData.filter(d => d.fileName.includes(keyword) || d.appName.includes(keyword))
			: mockData

		const start = (page - 1) * pageSize
		const list = filtered.slice(start, start + pageSize)
		return success({ list, total: filtered.length, totalCount: 1317 })
	})

	// 重点端口分析列表
	app.post("/key-port-list", async (request) => {
		const { page = 1, pageSize = 10, keyword = "" } = (request.body || {}) as any
		const ports = ["8082", "1025", "8181", "2028", "3310", "4512", "8081", "1209", "1890", "4604"]
		const ips = ["192.168.11.35", "192.168.110.20", "192.168.100.25", "192.168.21.100", "192.168.35.100"]
		const visitCounts = [86, 32, 11, 23, 18, 30, 65, 33, 71, 22]

		const mockData = Array.from({ length: 300 }, (_, i) => ({
			id: i + 1,
			port: ports[i % ports.length],
			ip: ips[i % ips.length],
			firstTime: "2025-12-27 10:16:32",
			lastTime: "2025-12-27 10:16:32",
			visitCount: visitCounts[i % visitCounts.length]
		}))

		const filtered = keyword
			? mockData.filter(d => d.port.includes(keyword) || d.ip.includes(keyword))
			: mockData

		const start = (page - 1) * pageSize
		const list = filtered.slice(start, start + pageSize)
		return success({ list, total: filtered.length, totalCount: 219 })
	})

	// 提交研判
	app.post("/judgment", async (request) => {
		const { groupId, categoryType, basis } = request.body as any
		if (!groupId || !categoryType || !basis) {
			return success(null)
		}
		return success({ id: 1 }, "研判成功")
	})
}
