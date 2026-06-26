/**
 * tum/uc/ua 单元档案服务层
 *
 * 使用内存存储，根据 unitId 程序化生成稳定 mock 数据
 * （同一 unitId 多次请求数据一致，跨请求不会变化）
 */

import type {
	TerminalItem,
	WebsiteItem,
	WebsiteVisitDetail,
	JudgeRecord,
	WebsiteCommonItem,
	AppCommonItem,
	KeywordCommonItem,
	MediaCommonItem,
	BehaviorLogItem,
	NetHabitOverview,
	NetHabitChartPoint,
	NetHabitListItem,
	PacketOverview,
	PacketItem,
	AppUsageOverview,
	AppUsageItem,
	WebsiteVisitOverview,
	WebsiteVisitTopItem,
	ContentOverview,
	ContentDetailItem,
	MediaOverview,
	MediaDetailItem,
	LargeFileOverview,
	LargeFileItem,
	KeyPortOverview,
	KeyPortItem
} from "./types"

// ==================== 工具函数 ====================

/** 简单字符串 hash 整数化（保证同 unitId 产出同序列） */
function hashStr(s: string): number {
	let h = 0
	for (let i = 0; i < s.length; i++) {
		h = (h * 31 + s.charCodeAt(i)) | 0
	}
	return Math.abs(h)
}

/** 基于 unitId 的可复现伪随机 */
function makeRng(seed: number) {
	let s = seed || 1
	return () => {
		s = (s * 9301 + 49297) % 233280
		return s / 233280
	}
}

/** 随机整数（含上下界） */
function randInt(rng: () => number, min: number, max: number): number {
	return Math.floor(rng() * (max - min + 1)) + min
}

/** 随机挑选 */
function pick<T>(rng: () => number, arr: readonly T[]): T {
	return arr[Math.floor(rng() * arr.length)]
}

/** 用 unitId + key 生成稳定 mock 数组（按 pageSize 切片） */
function generateList<T>(
	unitId: number,
	key: string,
	count: number,
	factory: (rng: () => number, index: number) => T
): T[] {
	const rng = makeRng(hashStr(`${unitId}#${key}`))
	return Array.from({ length: count }, (_, i) => factory(rng, i + 1))
}

/** 格式化 YYYY-MM-DD HH:mm:ss */
function fmtTime(d: Date): string {
	const pad = (n: number) => String(n).padStart(2, "0")
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/** 基准日期（用于相对时间生成） */
function baseDate(unitId: number): Date {
	const rng = makeRng(hashStr(`${unitId}#baseDate`))
	const now = Date.now()
	const offset = randInt(rng, 1, 30) * 24 * 3600 * 1000
	return new Date(now - offset)
}

// ==================== 静态字典 ====================

const IMEI_PREFIXES = ["35", "86", "99", "01", "44"]
const IMSI_PREFIXES = ["46000", "46001", "46002", "46003"]
const MAC_PREFIXES = ["8C:85:90", "A4:5E:60", "F0:F2:49", "00:1B:44", "AC:DE:48"]
const PHONE_PREFIXES = ["138", "139", "150", "152", "158", "186", "188"]
const BASE_STATION_PREFIXES = ["BS-3401", "BS-4201", "BS-4401", "BS-5101", "BS-6101"]
const PROTOCOLS = ["HTTP", "HTTPS", "FTP", "DNS", "SSH", "TELNET", "SMTP", "POP3"]
const ACTIONS = ["ALLOW", "DENY", "INTERCEPT", "ALERT"]
const DATA_SOURCES = ["边界防火墙", "WAF", "IDS", "态势感知", "邮件审计"]
const RESOURCE_TYPES = ["网页访问", "邮件传输", "文件下载", "即时通讯", "视频流"]
const APPS = ["微信", "QQ", "钉钉", "飞书", "企业微信", "抖音", "微博", "Telegram", "WhatsApp", "迅雷"]
const APP_DOMAINS: Record<string, string> = {
	微信: "weixin.qq.com",
	QQ: "qq.com",
	钉钉: "dingtalk.com",
	飞书: "feishu.cn",
	企业微信: "work.weixin.qq.com",
	抖音: "douyin.com",
	微博: "weibo.com",
	Telegram: "telegram.org",
	WhatsApp: "whatsapp.com",
	迅雷: "xunlei.com"
}
const WEBSITES = [
	{ domain: "baidu.com", type: "搜索引擎" },
	{ domain: "weibo.com", type: "社交媒体" },
	{ domain: "taobao.com", type: "电商" },
	{ domain: "jd.com", type: "电商" },
	{ domain: "qq.com", type: "即时通讯" },
	{ domain: "163.com", type: "门户网站" },
	{ domain: "douyin.com", type: "视频" },
	{ domain: "zhihu.com", type: "社区" },
	{ domain: "bilibili.com", type: "视频" },
	{ domain: "gov.cn", type: "政务" },
	{ domain: "weixin.qq.com", type: "即时通讯" },
	{ domain: "csdn.net", type: "技术社区" }
]
const KEYWORDS = ["保密", "反革命", "维权", "上访", "法轮功", "暴恐", "邪教", "虚假信息", "谣言", "群体性事件"]
const KEYWORD_TYPES = ["涉政", "涉稳", "涉恐", "涉黄", "涉毒", "涉枪"]
const MEDIA_TYPES_LABEL: Record<string, string> = {
	image: "图片",
	audio: "音频",
	video: "视频"
}
const PERSON_NAMES = ["张三", "李四", "王五", "赵六", "钱七", "孙八", "周九", "吴十", "郑十一", "王二"]
const PUBLISH_PLATFORMS = ["微信朋友圈", "微博", "抖音", "QQ空间", "贴吧", "知乎", "小红书", "论坛"]
const KEY_PORTS = ["22", "23", "80", "443", "445", "3389", "3306", "6379", "8080", "8443", "9000"]
const PACKET_TYPES = ["TCP", "UDP", "ICMP", "DNS", "TLS", "HTTP"]
const PACKET_NAMES = ["SYN", "ACK", "FIN", "PSH", "RST", "GET", "POST", "QUERY", "RESPONSE"]
const FILE_TYPES = ["EXE", "ZIP", "RAR", "ISO", "PDF", "DOC", "XLS", "VIDEO", "IMAGE"]
const FILE_APPS = ["浏览器下载", "迅雷", "百度网盘", "邮件附件", "FTP客户端", "微信PC版", "钉钉"]

// ==================== 业务函数 ====================

/** 根据 unitId 派生一个源 IP 字符串 */
function getUnitIp(unitId: number): string {
	const rng = makeRng(hashStr(`${unitId}#ip`))
	return `192.168.${randInt(rng, 0, 9)}.${randInt(rng, 2, 250)}`
}

/** 获取终端列表（分页 + 排序） */
export function getTerminals(query: {
	unitId: number
	page?: number
	pageSize?: number
	sortField?: string
	sortOrder?: "asc" | "desc"
}): { list: TerminalItem[]; total: number } {
	const { unitId, page = 1, pageSize = 10, sortField, sortOrder } = query
	const count = 25
	const list = generateList<TerminalItem>(unitId, "terminal", count, (rng, i) => {
		const imei = `${pick(rng, IMEI_PREFIXES)}${String(randInt(rng, 100000000000000, 999999999999999)).slice(0, 14)}`
		const imsi = `${pick(rng, IMSI_PREFIXES)}${String(randInt(rng, 1000000, 9999999))}`
		const mac = `${pick(rng, MAC_PREFIXES)}:${String(randInt(rng, 0, 255)).padStart(2, "0")}:${String(randInt(rng, 0, 255)).padStart(2, "0")}:${String(randInt(rng, 0, 255)).padStart(2, "0")}`
		const baseDateTime = baseDate(unitId)
		const lastTime = new Date(baseDateTime.getTime() - randInt(rng, 0, 7) * 24 * 3600 * 1000 - randInt(rng, 0, 3600 * 1000))
		const visitSites = Array.from({ length: randInt(rng, 2, 5) }, () => pick(rng, WEBSITES).domain).join("、")
		const usedApps = Array.from({ length: randInt(rng, 2, 4) }, () => pick(rng, APPS)).join("、")
		return {
			id: i,
			imei,
			imsi,
			mac,
			visitSites,
			usedApps,
			lastActiveTime: fmtTime(lastTime)
		}
	})
	let sorted = list
	if (sortField) {
		sorted = [...list].sort((a, b) => {
			const va = (a as any)[sortField] ?? ""
			const vb = (b as any)[sortField] ?? ""
			if (typeof va === "number" && typeof vb === "number") {
				return sortOrder === "desc" ? vb - va : va - vb
			}
			return sortOrder === "desc" ? String(vb).localeCompare(String(va)) : String(va).localeCompare(String(vb))
		})
	}
	const start = (page - 1) * pageSize
	return { list: sorted.slice(start, start + pageSize), total: list.length }
}

/** 通过 unitId 取该单元下所有 terminalId（用 unitId 当 terminalId 的子索引） */
function getUnitTerminalIds(unitId: number): number[] {
	const rng = makeRng(hashStr(`${unitId}#terminalIds`))
	const count = randInt(rng, 3, 8)
	return Array.from({ length: count }, (_, i) => unitId * 10 + i + 1)
}

/** 获取访问网站列表 */
export function getWebsites(query: {
	terminalId: number
	page?: number
	pageSize?: number
	keyword?: string
	sortField?: string
	sortOrder?: "asc" | "desc"
}): { list: WebsiteItem[]; total: number } {
	const { terminalId, page = 1, pageSize = 10, keyword, sortField, sortOrder } = query
	const count = 20
	const list = generateList<WebsiteItem>(terminalId, "website", count, (rng, i) => {
		const site = pick(rng, WEBSITES)
		const baseDateTime = baseDate(terminalId)
		const first = new Date(baseDateTime.getTime() - randInt(rng, 0, 30) * 24 * 3600 * 1000)
		const last = new Date(first.getTime() + randInt(rng, 1, 30) * 24 * 3600 * 1000)
		return {
			id: i,
			terminalId,
			domain: site.domain,
			ip: `203.0.113.${randInt(rng, 2, 250)}`,
			relatedPhone: `${pick(rng, PHONE_PREFIXES)}${String(randInt(rng, 10000000, 99999999))}`,
			firstFoundTime: fmtTime(first),
			lastFoundTime: fmtTime(last),
			imsi: `${pick(rng, IMSI_PREFIXES)}${String(randInt(rng, 1000000, 9999999))}`,
			visitCount: randInt(rng, 1, 200)
		}
	})
	let filtered = list
	if (keyword) {
		const k = keyword.toLowerCase()
		filtered = filtered.filter(w => w.domain.toLowerCase().includes(k) || w.ip.includes(k))
	}
	if (sortField) {
		filtered = [...filtered].sort((a, b) => {
			const va = (a as any)[sortField]
			const vb = (b as any)[sortField]
			if (typeof va === "number" && typeof vb === "number") {
				return sortOrder === "desc" ? vb - va : va - vb
			}
			return sortOrder === "desc" ? String(vb).localeCompare(String(va)) : String(va).localeCompare(String(vb))
		})
	}
	const start = (page - 1) * pageSize
	return { list: filtered.slice(start, start + pageSize), total: filtered.length }
}

/** 获取网站访问详情 */
export function getWebsiteVisitDetails(query: {
	websiteId: number
	page?: number
	pageSize?: number
}): { list: WebsiteVisitDetail[]; total: number } {
	const { websiteId, page = 1, pageSize = 10 } = query
	const count = 30
	const list = generateList<WebsiteVisitDetail>(websiteId, "visitDetail", count, (rng, i) => {
		const baseDateTime = baseDate(websiteId)
		const t = new Date(baseDateTime.getTime() - randInt(rng, 0, 30) * 24 * 3600 * 1000 - randInt(rng, 0, 3600 * 24 * 1000))
		return {
			id: i,
			websiteId,
			visitTime: fmtTime(t),
			baseStationId: `${pick(rng, BASE_STATION_PREFIXES)}-${randInt(rng, 100, 999)}`,
			relatedPhone: `${pick(rng, PHONE_PREFIXES)}${String(randInt(rng, 10000000, 99999999))}`
		}
	})
	const start = (page - 1) * pageSize
	return { list: list.slice(start, start + pageSize), total: list.length }
}

/** 获取研判历史 */
export function getJudgeList(unitId: number): { list: JudgeRecord[]; total: number } {
	const count = 8
	const list = generateList<JudgeRecord>(unitId, "judge", count, (rng, i) => {
		const baseDateTime = baseDate(unitId)
		const t = new Date(baseDateTime.getTime() - randInt(rng, 0, 60) * 24 * 3600 * 1000)
		const cat = pick(rng, ["focus", "level1", "level2", "level3", "other"])
		const catNameMap: Record<string, string> = {
			focus: "重点关注",
			level1: "一级",
			level2: "二级",
			level3: "三级",
			other: "其他"
		}
		return {
			id: i,
			unitId,
			judgeTime: fmtTime(t),
			judgePerson: pick(rng, PERSON_NAMES),
			controlCategory: cat,
			controlCategoryName: catNameMap[cat],
			judgeReason: pick(rng, ["异常流量", "可疑行为", "研判确认", "上级批注", "关联告警分析"]),
			remark: pick(rng, ["已通知相关人员", "已升级处理", "持续关注", "已纳入布控", "已归档"])
		}
	})
	return { list, total: list.length }
}

/** 共性分析 - 网站 */
export function getWebsiteCommonList(query: { unitId: number; page?: number; pageSize?: number }): {
	list: WebsiteCommonItem[]
	total: number
	page: number
	pageSize: number
} {
	const { unitId, page = 1, pageSize = 10 } = query
	const count = 8
	const list = generateList<WebsiteCommonItem>(unitId, "commonWebsite", count, (rng, i) => {
		const site = pick(rng, WEBSITES)
		const commonCount = randInt(rng, 2, 4)
		const terminals = Array.from({ length: commonCount }, (_, ti) => {
			const t = new Date(baseDate(unitId).getTime() - randInt(rng, 0, 30) * 24 * 3600 * 1000)
			return {
				id: ti + 1,
				imei: `${pick(rng, IMEI_PREFIXES)}${String(randInt(rng, 100000000000000, 999999999999999)).slice(0, 14)}`,
				imsi: `${pick(rng, IMSI_PREFIXES)}${String(randInt(rng, 1000000, 9999999))}`,
				mac: `${pick(rng, MAC_PREFIXES)}:${String(randInt(rng, 0, 255)).padStart(2, "0")}:${String(randInt(rng, 0, 255)).padStart(2, "0")}:${String(randInt(rng, 0, 255)).padStart(2, "0")}`,
				visitTime: fmtTime(t),
				visitDuration: `${randInt(rng, 1, 30)}分钟`
			}
		})
		return {
			id: i,
			domain: site.domain,
			ip: `203.0.113.${randInt(rng, 2, 250)}`,
			websiteType: site.type,
			commonTerminals: commonCount,
			remark: pick(rng, ["高频访问", "近期上升", "异常时段", "境外站点", "重点关注对象"]),
			terminals
		}
	})
	const start = (page - 1) * pageSize
	return { list: list.slice(start, start + pageSize), total: list.length, page, pageSize }
}

/** 共性分析 - APP */
export function getAppCommonList(query: { unitId: number; page?: number; pageSize?: number }): {
	list: AppCommonItem[]
	total: number
	page: number
	pageSize: number
} {
	const { unitId, page = 1, pageSize = 10 } = query
	const count = 8
	const list = generateList<AppCommonItem>(unitId, "commonApp", count, (rng, i) => {
		const app = pick(rng, APPS)
		const commonCount = randInt(rng, 2, 4)
		const terminals = Array.from({ length: commonCount }, (_, ti) => {
			const t = new Date(baseDate(unitId).getTime() - randInt(rng, 0, 30) * 24 * 3600 * 1000)
			return {
				id: ti + 1,
				imei: `${pick(rng, IMEI_PREFIXES)}${String(randInt(rng, 100000000000000, 999999999999999)).slice(0, 14)}`,
				imsi: `${pick(rng, IMSI_PREFIXES)}${String(randInt(rng, 1000000, 9999999))}`,
				mac: `${pick(rng, MAC_PREFIXES)}:${String(randInt(rng, 0, 255)).padStart(2, "0")}:${String(randInt(rng, 0, 255)).padStart(2, "0")}:${String(randInt(rng, 0, 255)).padStart(2, "0")}`,
				useTime: fmtTime(t),
				useDuration: `${randInt(rng, 5, 120)}分钟`
			}
		})
		return {
			id: i,
			appName: app,
			domain: APP_DOMAINS[app] || `${app.toLowerCase()}.com`,
			appType: pick(rng, ["社交", "办公", "娱乐", "工具", "电商"]),
			commonTerminals: commonCount,
			remark: pick(rng, ["高频使用", "境外服务", "工作时段集中", "夜间活跃", "新发现"]),
			terminals
		}
	})
	const start = (page - 1) * pageSize
	return { list: list.slice(start, start + pageSize), total: list.length, page, pageSize }
}

/** 共性分析 - 关键词 */
export function getKeywordCommonList(query: { unitId: number; page?: number; pageSize?: number }): {
	list: KeywordCommonItem[]
	total: number
	page: number
	pageSize: number
} {
	const { unitId, page = 1, pageSize = 10 } = query
	const count = 8
	const list = generateList<KeywordCommonItem>(unitId, "commonKeyword", count, (rng, i) => {
		const commonCount = randInt(rng, 2, 4)
		const terminals = Array.from({ length: commonCount }, (_, ti) => {
			const t = new Date(baseDate(unitId).getTime() - randInt(rng, 0, 30) * 24 * 3600 * 1000)
			return {
				id: ti + 1,
				imei: `${pick(rng, IMEI_PREFIXES)}${String(randInt(rng, 100000000000000, 999999999999999)).slice(0, 14)}`,
				imsi: `${pick(rng, IMSI_PREFIXES)}${String(randInt(rng, 1000000, 9999999))}`,
				mac: `${pick(rng, MAC_PREFIXES)}:${String(randInt(rng, 0, 255)).padStart(2, "0")}:${String(randInt(rng, 0, 255)).padStart(2, "0")}:${String(randInt(rng, 0, 255)).padStart(2, "0")}`,
				publishTime: fmtTime(t),
				publishPlatform: pick(rng, PUBLISH_PLATFORMS)
			}
		})
		return {
			id: i,
			keyword: pick(rng, KEYWORDS),
			keywordType: pick(rng, KEYWORD_TYPES),
			commonTerminals: commonCount,
			remark: pick(rng, ["近期高频", "敏感词命中", "特定群体扩散", "境外传播"]),
			terminals
		}
	})
	const start = (page - 1) * pageSize
	return { list: list.slice(start, start + pageSize), total: list.length, page, pageSize }
}

/** 共性分析 - 多媒体 */
export function getMediaCommonList(query: { unitId: number; page?: number; pageSize?: number }): {
	list: MediaCommonItem[]
	total: number
	page: number
	pageSize: number
} {
	const { unitId, page = 1, pageSize = 10 } = query
	const count = 8
	const list = generateList<MediaCommonItem>(unitId, "commonMedia", count, (rng, i) => {
		const commonCount = randInt(rng, 2, 4)
		const mediaName = pick(rng, ["宣传图", "集会视频", "录音材料", "敏感图片", "教学视频", "传单图片"])
		const terminals = Array.from({ length: commonCount }, (_, ti) => {
			const t = new Date(baseDate(unitId).getTime() - randInt(rng, 0, 30) * 24 * 3600 * 1000)
			return {
				id: ti + 1,
				imei: `${pick(rng, IMEI_PREFIXES)}${String(randInt(rng, 100000000000000, 999999999999999)).slice(0, 14)}`,
				imsi: `${pick(rng, IMSI_PREFIXES)}${String(randInt(rng, 1000000, 9999999))}`,
				mac: `${pick(rng, MAC_PREFIXES)}:${String(randInt(rng, 0, 255)).padStart(2, "0")}:${String(randInt(rng, 0, 255)).padStart(2, "0")}:${String(randInt(rng, 0, 255)).padStart(2, "0")}`,
				publishTime: fmtTime(t),
				publishPlatform: pick(rng, PUBLISH_PLATFORMS)
			}
		})
		return {
			id: i,
			name: mediaName,
			mediaType: pick(rng, ["图片", "音频", "视频"]),
			commonTerminals: commonCount,
			remark: pick(rng, ["多源转发", "高频传播", "敏感内容", "境外发布"]),
			terminals
		}
	})
	const start = (page - 1) * pageSize
	return { list: list.slice(start, start + pageSize), total: list.length, page, pageSize }
}

/** 行为日志（支持多条件过滤 + 排序） */
export function getBehaviorLog(query: {
	unitId: number
	page?: number
	pageSize?: number
	sourceIp?: string
	destIp?: string
	protocol?: string
	action?: string
	dataSource?: string
	resourceType?: string
	startDate?: string
	endDate?: string
	sortField?: string
	sortOrder?: "asc" | "desc"
}): { list: BehaviorLogItem[]; total: number; page: number; pageSize: number } {
	const {
		unitId,
		page = 1,
		pageSize = 10,
		sourceIp,
		destIp,
		protocol,
		action,
		dataSource,
		resourceType,
		startDate,
		endDate,
		sortField,
		sortOrder
	} = query
	const count = 60
	const unitIp = getUnitIp(unitId)
	const list = generateList<BehaviorLogItem>(unitId, "behaviorLog", count, (rng, i) => {
		const t = new Date(baseDate(unitId).getTime() - randInt(rng, 0, 30) * 24 * 3600 * 1000 - randInt(rng, 0, 3600 * 1000))
		return {
			id: i,
			sourceIp: unitIp,
			sourcePort: randInt(rng, 1024, 65535),
			destIp: `203.0.113.${randInt(rng, 2, 250)}`,
			destPort: randInt(rng, 1, 65535),
			protocol: pick(rng, PROTOCOLS),
			action: pick(rng, ACTIONS),
			dataSource: pick(rng, DATA_SOURCES),
			resourceType: pick(rng, RESOURCE_TYPES),
			interceptTime: fmtTime(t),
			relatedPhone: `${pick(rng, PHONE_PREFIXES)}${String(randInt(rng, 10000000, 99999999))}`
		}
	})
	let filtered = list
	if (sourceIp) filtered = filtered.filter(x => x.sourceIp.includes(sourceIp))
	if (destIp) filtered = filtered.filter(x => x.destIp.includes(destIp))
	if (protocol) filtered = filtered.filter(x => x.protocol === protocol)
	if (action) filtered = filtered.filter(x => x.action === action)
	if (dataSource) filtered = filtered.filter(x => x.dataSource === dataSource)
	if (resourceType) filtered = filtered.filter(x => x.resourceType === resourceType)
	if (startDate) filtered = filtered.filter(x => x.interceptTime >= startDate)
	if (endDate) filtered = filtered.filter(x => x.interceptTime <= endDate)
	if (sortField) {
		filtered = [...filtered].sort((a, b) => {
			const va = (a as any)[sortField]
			const vb = (b as any)[sortField]
			if (typeof va === "number" && typeof vb === "number") {
				return sortOrder === "desc" ? vb - va : va - vb
			}
			return sortOrder === "desc" ? String(vb).localeCompare(String(va)) : String(va).localeCompare(String(vb))
		})
	}
	const start = (page - 1) * pageSize
	return { list: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize }
}

// ==================== 线上行为分析 ====================

/** 上网习惯 - 概览 */
export function getNetHabitOverview(unitId: number): NetHabitOverview {
	const rng = makeRng(hashStr(`${unitId}#netHabitOverview`))
	const peakHour = randInt(rng, 19, 23)
	return {
		peakPeriod: `${String(peakHour).padStart(2, "0")}:00 - ${String((peakHour + 1) % 24).padStart(2, "0")}:00`,
		onlineCount: randInt(rng, 50, 500)
	}
}

/** 上网习惯 - 图表（24 小时） */
export function getNetHabitChart(unitId: number): NetHabitChartPoint[] {
	const rng = makeRng(hashStr(`${unitId}#netHabitChart`))
	const base = randInt(rng, 5, 30)
	return Array.from({ length: 24 }, (_, h) => {
		// 晚上 19-23 流量更高
		const peakBoost = h >= 19 && h <= 23 ? 50 : 0
		return {
			hour: `${String(h).padStart(2, "0")}:00`,
			count: base + peakBoost + randInt(rng, 0, 30)
		}
	})
}

/** 上网习惯 - 列表 */
export function getNetHabitList(query: { unitId: number; page?: number; pageSize?: number }): {
	list: NetHabitListItem[]
	total: number
	page: number
	pageSize: number
} {
	const { unitId, page = 1, pageSize = 10 } = query
	const count = 30
	const list = generateList<NetHabitListItem>(unitId, "netHabitList", count, (rng, i) => {
		const t = new Date(baseDate(unitId).getTime() - randInt(rng, 0, 30) * 24 * 3600 * 1000 - randInt(rng, 0, 3600 * 1000))
		return {
			id: i,
			onlineTime: fmtTime(t),
			baseStationId: `${pick(rng, BASE_STATION_PREFIXES)}-${randInt(rng, 100, 999)}`,
			target: pick(rng, WEBSITES).domain,
			relatedPhone: `${pick(rng, PHONE_PREFIXES)}${String(randInt(rng, 10000000, 99999999))}`
		}
	})
	const start = (page - 1) * pageSize
	return { list: list.slice(start, start + pageSize), total: list.length, page, pageSize }
}

/** 报文分析 - 概览 */
export function getPacketOverview(unitId: number): PacketOverview {
	const rng = makeRng(hashStr(`${unitId}#packetOverview`))
	return {
		commonType: pick(rng, PACKET_TYPES),
		count: randInt(rng, 500, 5000)
	}
}

/** 报文分析 - 详情 */
export function getPacketDetail(query: {
	unitId: number
	page?: number
	pageSize?: number
	keyword?: string
	sortField?: string
	sortOrder?: "asc" | "desc"
}): { list: PacketItem[]; total: number; page: number; pageSize: number } {
	const { unitId, page = 1, pageSize = 10, keyword, sortField, sortOrder } = query
	const count = 50
	const list = generateList<PacketItem>(unitId, "packet", count, (rng, i) => {
		const t = new Date(baseDate(unitId).getTime() - randInt(rng, 0, 30) * 24 * 3600 * 1000 - randInt(rng, 0, 3600 * 1000))
		return {
			id: i,
			name: pick(rng, PACKET_NAMES),
			type: pick(rng, PACKET_TYPES),
			length: randInt(rng, 64, 1500),
			captureTime: fmtTime(t),
			imsi: `${pick(rng, IMSI_PREFIXES)}${String(randInt(rng, 1000000, 9999999))}`
		}
	})
	let filtered = list
	if (keyword) {
		const k = keyword.toLowerCase()
		filtered = filtered.filter(p => p.name.toLowerCase().includes(k) || p.type.toLowerCase().includes(k))
	}
	if (sortField) {
		filtered = [...filtered].sort((a, b) => {
			const va = (a as any)[sortField]
			const vb = (b as any)[sortField]
			if (typeof va === "number" && typeof vb === "number") {
				return sortOrder === "desc" ? vb - va : va - vb
			}
			return sortOrder === "desc" ? String(vb).localeCompare(String(va)) : String(va).localeCompare(String(vb))
		})
	}
	const start = (page - 1) * pageSize
	return { list: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize }
}

/** APP 使用 - 概览 */
export function getAppUsageOverview(unitId: number): AppUsageOverview {
	const rng = makeRng(hashStr(`${unitId}#appUsageOverview`))
	return {
		topApp: pick(rng, APPS),
		useCount: randInt(rng, 100, 2000)
	}
}

/** APP 使用 - 详情 */
export function getAppUsageDetail(query: { unitId: number; page?: number; pageSize?: number }): {
	list: AppUsageItem[]
	total: number
	page: number
	pageSize: number
} {
	const { unitId, page = 1, pageSize = 10 } = query
	const count = APPS.length
	const list = APPS.map((app, i) => {
		const rng = makeRng(hashStr(`${unitId}#appUsage#${app}`))
		return {
			appName: app,
			useCount: randInt(rng, 50, 1500),
			useDuration: `${randInt(rng, 1, 50)}小时${randInt(rng, 0, 59)}分钟`
		}
	})
		.sort((a, b) => b.useCount - a.useCount)
		.map((item, i) => ({ ...item, id: undefined as any })) // 不需要 id 占位
	// 为每个加 id
	const withId = list.map((item, i) => ({ ...item }))
	const start = (page - 1) * pageSize
	return { list: withId.slice(start, start + pageSize), total: withId.length, page, pageSize }
}

/** 访问网站 - 概览 */
export function getWebsiteVisitOverview(unitId: number): WebsiteVisitOverview {
	const rng = makeRng(hashStr(`${unitId}#websiteVisitOverview`))
	return {
		topWebsite: pick(rng, WEBSITES).domain,
		visitCount: randInt(rng, 200, 5000)
	}
}

/** 访问网站 - 详情 */
export function getWebsiteVisitDetail(query: { unitId: number; page?: number; pageSize?: number }): {
	list: WebsiteVisitTopItem[]
	total: number
	page: number
	pageSize: number
} {
	const { unitId, page = 1, pageSize = 10 } = query
	const list = WEBSITES.map(site => {
		const rng = makeRng(hashStr(`${unitId}#websiteVisit#${site.domain}`))
		return {
			website: site.domain,
			visitCount: randInt(rng, 10, 2000)
		}
	})
		.sort((a, b) => b.visitCount - a.visitCount)
	const start = (page - 1) * pageSize
	return { list: list.slice(start, start + pageSize), total: list.length, page, pageSize }
}

/** 内容分析 - 概览 */
export function getContentOverview(unitId: number): ContentOverview {
	const rng = makeRng(hashStr(`${unitId}#contentOverview`))
	const count = randInt(rng, 4, 7)
	const keywords: string[] = []
	for (let i = 0; i < count; i++) {
		const k = KEYWORDS[Math.floor(rng() * KEYWORDS.length)]
		if (!keywords.includes(k)) keywords.push(k)
	}
	return {
		keywords,
		keywordCount: randInt(rng, 20, 200),
		personCount: randInt(rng, 1, 20),
		tibetanCount: randInt(rng, 1, 15)
	}
}

/** 内容分析 - 详情 */
export function getContentDetail(query: {
	unitId: number
	type?: "keyword" | "person" | "tibetan"
	page?: number
	pageSize?: number
}): { list: ContentDetailItem[]; total: number; page: number; pageSize: number } {
	const { unitId, type, page = 1, pageSize = 10 } = query
	const count = 30
	const list = generateList<ContentDetailItem>(unitId, `contentDetail#${type || "all"}`, count, (rng, i) => {
		const t = new Date(baseDate(unitId).getTime() - randInt(rng, 0, 30) * 24 * 3600 * 1000)
		const kw = pick(rng, KEYWORDS)
		const person = pick(rng, PERSON_NAMES)
		const url = `https://${pick(rng, WEBSITES).domain}/post/${randInt(rng, 100000, 999999)}`
		const isTibetan = type === "tibetan" || (type !== "keyword" && type !== "person" && rng() > 0.6)
		const content = isTibetan
			? "བོད་ཀྱི་སྐད་ཡིག་གི་ནང་དོན་འདི་ཡིན།"
			: pick(rng, [
				"最近发生的事情让人非常关注",
				"组织活动应该合理合法",
				"需要大家共同关注社会问题",
				"重要信息请大家及时查看",
				"关于权益保护的一些看法"
			])
		return {
			id: i,
			content,
			highlightedContent: isTibetan ? content : content.replace(kw, `<mark>${kw}</mark>`),
			interceptTime: fmtTime(t),
			url,
			appName: pick(rng, APPS),
			appAccount: `user_${randInt(rng, 10000, 99999)}`,
			netAccount: `${pick(rng, PHONE_PREFIXES)}${String(randInt(rng, 10000000, 99999999))}`,
			imsi: `${pick(rng, IMSI_PREFIXES)}${String(randInt(rng, 1000000, 9999999))}`,
			baseStation: `${pick(rng, BASE_STATION_PREFIXES)}-${randInt(rng, 100, 999)}`,
			keyword: isTibetan ? undefined : kw,
			personName: type === "person" ? person : undefined,
			personId: type === "person" ? `ID${randInt(rng, 1000, 9999)}` : undefined,
			translation: isTibetan ? pick(rng, ["这是藏语内容", "包含敏感藏语词汇", "需要进一步审查"]) : undefined
		}
	})
	const start = (page - 1) * pageSize
	return { list: list.slice(start, start + pageSize), total: list.length, page, pageSize }
}

/** 多媒体 - 概览 */
export function getMediaOverview(unitId: number): MediaOverview {
	const rng = makeRng(hashStr(`${unitId}#mediaOverview`))
	return {
		imageCount: randInt(rng, 50, 500),
		audioCount: randInt(rng, 10, 100),
		videoCount: randInt(rng, 20, 200)
	}
}

/** 多媒体 - 详情 */
export function getMediaDetail(query: {
	unitId: number
	type?: "image" | "audio" | "video"
	page?: number
	pageSize?: number
}): { list: MediaDetailItem[]; total: number; page: number; pageSize: number } {
	const { unitId, type, page = 1, pageSize = 10 } = query
	const count = 24
	const list = generateList<MediaDetailItem>(unitId, `media#${type || "all"}`, count, (rng, i) => {
		const t = new Date(baseDate(unitId).getTime() - randInt(rng, 0, 30) * 24 * 3600 * 1000)
		const mediaType = type || pick(rng, ["image", "audio", "video"] as const)
		const ext = mediaType === "image" ? "jpg" : mediaType === "audio" ? "mp3" : "mp4"
		return {
			id: i,
			type: mediaType,
			filename: `media_${randInt(rng, 100000, 999999)}.${ext}`,
			url: `/mock/${mediaType}/${randInt(rng, 100000, 999999)}.${ext}`,
			account: `user_${randInt(rng, 10000, 99999)}`,
			interceptTime: fmtTime(t),
			source: pick(rng, ["微信", "微博", "抖音", "QQ", "Telegram"])
		}
	})
	const start = (page - 1) * pageSize
	return { list: list.slice(start, start + pageSize), total: list.length, page, pageSize }
}

/** 大文件 - 概览 */
export function getLargeFileOverview(unitId: number): LargeFileOverview {
	const rng = makeRng(hashStr(`${unitId}#largeFileOverview`))
	return {
		fileCount: randInt(rng, 5, 50),
		topApp: pick(rng, FILE_APPS),
		topFileType: pick(rng, FILE_TYPES)
	}
}

/** 大文件 - 详情 */
export function getLargeFileDetail(query: { unitId: number; page?: number; pageSize?: number }): {
	list: LargeFileItem[]
	total: number
	page: number
	pageSize: number
} {
	const { unitId, page = 1, pageSize = 10 } = query
	const count = 20
	const list = generateList<LargeFileItem>(unitId, "largeFile", count, (rng, i) => {
		const t = new Date(baseDate(unitId).getTime() - randInt(rng, 0, 30) * 24 * 3600 * 1000)
		const sizeMB = randInt(rng, 100, 5000)
		return {
			id: i,
			filename: `file_${randInt(rng, 10000, 99999)}.${pick(rng, FILE_TYPES).toLowerCase()}`,
			size: sizeMB >= 1024 ? `${(sizeMB / 1024).toFixed(2)} GB` : `${sizeMB} MB`,
			type: pick(rng, FILE_TYPES),
			app: pick(rng, FILE_APPS),
			createTime: fmtTime(t)
		}
	})
	const start = (page - 1) * pageSize
	return { list: list.slice(start, start + pageSize), total: list.length, page, pageSize }
}

/** 重点端口 - 概览 */
export function getKeyPortOverview(unitId: number): KeyPortOverview {
	const rng = makeRng(hashStr(`${unitId}#keyPortOverview`))
	return {
		portCount: KEY_PORTS.length,
		totalVisits: randInt(rng, 1000, 50000),
		topPort: pick(rng, KEY_PORTS)
	}
}

/** 重点端口 - 详情 */
export function getKeyPortDetail(query: { unitId: number; page?: number; pageSize?: number }): {
	list: KeyPortItem[]
	total: number
	page: number
	pageSize: number
} {
	const { unitId, page = 1, pageSize = 10 } = query
	const list = KEY_PORTS.map(port => {
		const rng = makeRng(hashStr(`${unitId}#keyPort#${port}`))
		const t = new Date(baseDate(unitId).getTime() - randInt(rng, 0, 30) * 24 * 3600 * 1000)
		return {
			id: undefined as any,
			port,
			protocol: pick(rng, PROTOCOLS),
			visitCount: randInt(rng, 10, 5000),
			targetIp: `203.0.113.${randInt(rng, 2, 250)}`,
			lastVisitTime: fmtTime(t)
		}
	})
		.sort((a, b) => b.visitCount - a.visitCount)
		.map((item, i) => ({ ...item, id: i + 1 }))
	const start = (page - 1) * pageSize
	return { list: list.slice(start, start + pageSize), total: list.length, page, pageSize }
}
