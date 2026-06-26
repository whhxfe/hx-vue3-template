// ==================== 单元档案 ua 公共类型 ====================

/** 终端分析 */
export interface TerminalItem {
	id: number
	imei: string
	imsi: string
	mac: string
	visitSites: string
	usedApps: string
	lastActiveTime: string
}

export interface TerminalQuery {
	unitId: number
	page?: number
	pageSize?: number
	sortField?: string
	sortOrder?: "asc" | "desc"
}

/** 访问网站分析 */
export interface WebsiteItem {
	id: number
	terminalId: number
	domain: string
	ip: string
	relatedPhone: string
	firstFoundTime: string
	lastFoundTime: string
	imsi: string
	visitCount: number
}

export interface WebsiteQuery {
	terminalId: number
	page?: number
	pageSize?: number
	keyword?: string
	sortField?: string
	sortOrder?: "asc" | "desc"
}

/** 网站访问详情 */
export interface WebsiteVisitDetail {
	id: number
	websiteId: number
	visitTime: string
	baseStationId: string
	relatedPhone: string
}

export interface WebsiteVisitQuery {
	websiteId: number
	page?: number
	pageSize?: number
}

// ==================== 共性分析 ====================

export interface CommonQuery {
	unitId: number
	page?: number
	pageSize?: number
}

export interface WebsiteTerminal {
	id: number
	imei: string
	imsi: string
	mac: string
	visitTime: string
	visitDuration: string
}

export interface WebsiteCommonItem {
	id: number
	domain: string
	ip: string
	websiteType: string
	commonTerminals: number
	remark: string
	terminals: WebsiteTerminal[]
}

export interface AppTerminal {
	id: number
	imei: string
	imsi: string
	mac: string
	useTime: string
	useDuration: string
}

export interface AppCommonItem {
	id: number
	appName: string
	domain: string
	appType: string
	commonTerminals: number
	remark: string
	terminals: AppTerminal[]
}

export interface KeywordTerminal {
	id: number
	imei: string
	imsi: string
	mac: string
	publishTime: string
	publishPlatform: string
}

export interface KeywordCommonItem {
	id: number
	keyword: string
	keywordType: string
	commonTerminals: number
	remark: string
	terminals: KeywordTerminal[]
}

export interface MediaTerminal {
	id: number
	imei: string
	imsi: string
	mac: string
	publishTime: string
	publishPlatform: string
}

export interface MediaCommonItem {
	id: number
	name: string
	mediaType: string
	commonTerminals: number
	remark: string
	terminals: MediaTerminal[]
}

// ==================== 行为日志 ====================

export interface BehaviorLogItem {
	id: number
	sourceIp: string
	sourcePort: number
	destIp: string
	destPort: number
	protocol: string
	action: string
	dataSource: string
	resourceType: string
	interceptTime: string
	relatedPhone: string
}

export interface BehaviorLogQuery {
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
}

// ==================== 线上行为分析公共类型 ====================

export interface DateRangeQuery {
	unitId: number
	startDate?: string
	endDate?: string
}

// ==================== 上网习惯 ====================

export interface NetHabitOverview {
	peakPeriod: string
	onlineCount: number
}

export interface NetHabitChartPoint {
	hour: string
	count: number
}

export interface NetHabitListItem {
	id: number
	onlineTime: string
	baseStationId: string
	target: string
	relatedPhone: string
}

export interface NetHabitListQuery extends DateRangeQuery {
	page?: number
	pageSize?: number
}

// ==================== 报文分析 ====================

export interface PacketOverview {
	commonType: string
	count: number
}

export interface PacketItem {
	id: number
	name: string
	type: string
	length: number
	captureTime: string
	imsi: string
}

export interface PacketDetailQuery extends DateRangeQuery {
	page?: number
	pageSize?: number
	keyword?: string
	sortField?: "length" | "captureTime" | string
	sortOrder?: "asc" | "desc"
}

// ==================== APP 使用 ====================

export interface AppUsageOverview {
	topApp: string
	useCount: number
}

export interface AppUsageItem {
	appName: string
	useCount: number
	useDuration: string
}

// ==================== 访问网站 ====================

export interface WebsiteVisitOverview {
	topWebsite: string
	visitCount: number
}

export interface WebsiteVisitTopItem {
	website: string
	visitCount: number
}

// ==================== 内容分析 ====================

export interface ContentOverview {
	keywords: string[]
	keywordCount: number
	personCount: number
	tibetanCount: number
}

export interface ContentDetailItem {
	id: number
	content: string
	highlightedContent: string
	interceptTime: string
	url: string
	appName: string
	appAccount: string
	netAccount: string
	imsi: string
	baseStation: string
	keyword?: string
	personName?: string
	personId?: string
	translation?: string
}

export type ContentType = "keyword" | "person" | "tibetan"

export interface ContentDetailQuery extends DateRangeQuery {
	type?: ContentType
	page?: number
	pageSize?: number
}

// ==================== 多媒体分析 ====================

export interface MediaOverview {
	imageCount: number
	audioCount: number
	videoCount: number
}

export type MediaType = "image" | "audio" | "video"

export interface MediaDetailItem {
	id: number
	type: MediaType
	filename: string
	url: string
	account: string
	interceptTime: string
	source: string
}

export interface MediaDetailQuery extends DateRangeQuery {
	type?: MediaType
	page?: number
	pageSize?: number
}

// ==================== 大文件分析 ====================

export interface LargeFileOverview {
	fileCount: number
	topApp: string
	topFileType: string
}

export interface LargeFileItem {
	id: number
	filename: string
	size: string
	type: string
	app: string
	createTime: string
}

// ==================== 重点端口分析 ====================

export interface KeyPortOverview {
	portCount: number
	totalVisits: number
	topPort: string
}

export interface KeyPortItem {
	id: number
	port: string
	protocol: string
	visitCount: number
	targetIp: string
	lastVisitTime: string
}
