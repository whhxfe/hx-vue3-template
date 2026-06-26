/**
 * gw 群体预警模块 API
 */
import request from '@/api/request'

export interface WarningItem {
	id: number
	name: string
	idCard: string
	gender: string
	age: number
	warningLevel: string
	warningLevelName?: string
	score: number
	scoreChange: string
	groupName: string
	phone: string
	address: string
	regionAlarm: number
	gatherAlarm: number
	behaviorAlarm: number
	identityInfo: string
	behaviorInfo: string
	relationInfo: string
	isJudged: boolean
	isIgnored: boolean
}

export interface WarningListQuery {
	page?: number
	pageSize?: number
	keyword?: string
	groupName?: string
	score?: string
	warningType?: string
	isJudged?: boolean
	sortField?: string
	sortOrder?: string
}

interface ApiResponse<T = unknown> {
	state: number
	message: string
	data: T
}

export const gw = {
	getList(query: WarningListQuery) {
		return request.post<ApiResponse<{
			list: WarningItem[]
			total: number
			page: number
			pageSize: number
		}>>('/ktc/tgm/gw/list', query)
	},

	getGroupOptions() {
		return request.get<ApiResponse<{ label: string; value: string }[]>>('/ktc/tgm/gw/group-options')
	},

	getScoreOptions() {
		return request.get<ApiResponse<{ label: string; value: string }[]>>('/ktc/tgm/gw/score-options')
	},

	getWarningTypeOptions() {
		return request.get<ApiResponse<{ label: string; value: string }[]>>('/ktc/tgm/gw/warning-type-options')
	},

	exportData(query: WarningListQuery) {
		return request.post<ApiResponse<any>>('/ktc/tgm/gw/export', query)
	}
}
