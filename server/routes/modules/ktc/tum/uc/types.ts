/**
 * tum/uc 单元管控模块类型定义
 */

export interface ListQuery {
	page?: number
	pageSize?: number
	keyword?: string
	unitType?: string
	controlCategory?: string
	entryTimeStart?: string
	entryTimeEnd?: string
	categoryFilter?: string[]
}

export interface UnitItem {
	id: number
	ip: string
	adsl: string
	unitType: string
	unitTypeName: string
	controlCategory: string
	controlCategoryName: string
	unitTag: string
	categoryTag: string
	portCount: number
	terminalCount: number
	ipLocation: string
	focusPerson: string
	focusUnit: string
	focusReason: string
	warningType: string
	warningTypeName: string
	isJudged: boolean
	isControlled: boolean
	entryTime: string
}

export interface CreateParams {
	ip: string
	adsl?: string
	unitType: string
	controlCategory: string
	portCount?: number
	terminalCount?: number
	ipLocation?: string
	warningType?: string
	focusPerson?: string
	focusUnit?: string
	focusReason?: string
}

export interface UpdateParams extends CreateParams {
	id: number
}

export interface JudgeParams {
	id: number
	controlCategory: string
	judgeReason: string
}

export interface ControlParams {
	id: number
	controlResource: string
	monitorTime: [string, string]
}
