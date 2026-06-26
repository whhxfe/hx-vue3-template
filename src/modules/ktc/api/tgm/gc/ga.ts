/**
 * ga 群体档案模块 API
 */
import request from '@/api/request'

export interface GaGroupInfo {
	id: number
	name: string
	categoryType: string
	controlCategory: string
	territory: string
	memberCount: number
	activeCount: number
	recommendCount: number
	policeName: string
	unitName: string
	reason: string
	warningTypes: string[]
}

export interface GaCommunityPerson {
	id: number
	qqNumber: string
	nickname: string
	phone: string
	name: string
	idCard: string
}

export interface GaCommunityGroup {
	id: number
	groupName: string
	groupNumber: string
	groupType: string
	commonMembers: number
	description: string
	members: GaCommunityPerson[]
}

export interface GaCommunityTab {
	key: string
	label: string
	count: number
}

export interface GaBehaviorActivity {
	id: number
	sourceIp: string
	sourcePort: string
	destIp: string
	destPort: string
	protocol: string
	action: string
	dataSource: string
	resourceType: string
	captureTime: string
	phone: string
}

export interface GaJudgment {
	id: number
	conclusion: string
	conclusionType: string
	unit: string
	person: string
	time: string
	basis: string
}

interface ApiResponse<T = unknown> {
	state: number
	message: string
	data: T
}

export const ga = {
	getGroupInfo(groupId: number) {
		return request.get<ApiResponse<GaGroupInfo>>(`/ktc/tgm/gc/ga/info?groupId=${groupId}`)
	},

	getCommunityTabs(groupId: number) {
		return request.get<ApiResponse<GaCommunityTab[]>>(`/ktc/tgm/gc/ga/community-tabs?groupId=${groupId}`)
	},

	getCommunityGroups(groupId: number, type: string) {
		return request.get<ApiResponse<GaCommunityGroup[]>>(`/ktc/tgm/gc/ga/community-groups?groupId=${groupId}&type=${type}`)
	},

	getBehaviorActivities(groupId: number, query?: Record<string, unknown>) {
		return request.post<ApiResponse<{ list: GaBehaviorActivity[]; total: number }>>(`/ktc/tgm/gc/ga/behavior-activities?groupId=${groupId}`, query)
	},

	getJudgments(groupId: number) {
		return request.get<ApiResponse<GaJudgment[]>>(`/ktc/tgm/gc/ga/judgments?groupId=${groupId}`)
	},

	getMyDay(groupId: number, keyword?: string) {
		return request.get<ApiResponse<any[]>>(`/ktc/tgm/gc/ga/my-day?groupId=${groupId}&keyword=${keyword || ""}`)
	},

	getOpLogs(groupId: number, keyword?: string) {
		return request.get<ApiResponse<any[]>>(`/ktc/tgm/gc/ga/op-logs?groupId=${groupId}&keyword=${keyword || ""}`)
	},

	getOnlineTimeChart(groupId: number) {
		return request.get<ApiResponse<{ hours: string[]; values: number[] }>>(`/ktc/tgm/gc/ga/online-time-chart?groupId=${groupId}`)
	},

	getOnlineTimeList(groupId: number, query?: Record<string, unknown>) {
		return request.post<ApiResponse<{ list: any[]; total: number }>>(`/ktc/tgm/gc/ga/online-time-list?groupId=${groupId}`, query)
	},

	getOnlineLocations(groupId: number) {
		return request.get<ApiResponse<{ list: any[]; total: number }>>(`/ktc/tgm/gc/ga/online-locations?groupId=${groupId}`)
	},

	getAppAnalysis(groupId: number) {
		return request.get<ApiResponse<any>>(`/ktc/tgm/gc/ga/app-analysis?groupId=${groupId}`)
	},

	getAppDetailList(groupId: number, appName: string, query?: Record<string, unknown>) {
		return request.post<ApiResponse<{ list: any[]; total: number }>>(`/ktc/tgm/gc/ga/app-detail-list?groupId=${groupId}&appName=${appName}`, query)
	},

	getWebsiteList(groupId: number, query?: Record<string, unknown>) {
		return request.post<ApiResponse<{ list: any[]; total: number; totalCount: number }>>(`/ktc/tgm/gc/ga/website-list?groupId=${groupId}`, query)
	},

	getWebsiteDetailList(groupId: number, domain: string, query?: Record<string, unknown>) {
		return request.post<ApiResponse<{ list: any[]; total: number }>>(`/ktc/tgm/gc/ga/website-detail-list?groupId=${groupId}&domain=${domain}`, query)
	},

	getContentList(groupId: number, tab: string) {
		return request.get<ApiResponse<{ list: any[]; total: number }>>(`/ktc/tgm/gc/ga/content-list?groupId=${groupId}&tab=${tab}`)
	},

	getMediaList(groupId: number, tab: string) {
		return request.get<ApiResponse<{ list: any[]; total: number }>>(`/ktc/tgm/gc/ga/media-list?groupId=${groupId}&tab=${tab}`)
	},

	getLargeFileList(groupId: number, query?: Record<string, unknown>) {
		return request.post<ApiResponse<{ list: any[]; total: number; totalCount: number }>>(`/ktc/tgm/gc/ga/large-file-list?groupId=${groupId}`, query)
	},

	getKeyPortList(groupId: number, query?: Record<string, unknown>) {
		return request.post<ApiResponse<{ list: any[]; total: number; totalCount: number }>>(`/ktc/tgm/gc/ga/key-port-list?groupId=${groupId}`, query)
	},

	submitJudgment(groupId: number, categoryType: string, basis: string) {
		return request.post<ApiResponse<{ id: number }>>(`/ktc/tgm/gc/ga/judgment`, { groupId, categoryType, basis })
	}
}
