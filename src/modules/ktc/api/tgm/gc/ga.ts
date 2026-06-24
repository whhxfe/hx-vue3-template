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
	}
}
