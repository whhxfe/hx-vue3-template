/**
 * tum/um 单元上图模块类型定义
 */

export interface ListQuery {
	page?: number
	pageSize?: number
	keyword?: string
	unitType?: string
	controlCategory?: string
	entryTimeStart?: string
	entryTimeEnd?: string
}

export interface ListItem {
	id: number
	ip: string
	adsl: string
	unitType: string
	unitTypeName: string
	controlCategory: string
	controlCategoryName: string
	unitTag: string
	portCount: number
	terminalCount: number
	ipLocation: string
	focusPerson: string
	focusUnit: string
	warningType: string
	warningTypeName: string
	isJudged: boolean
	isControlled: boolean
	entryTime: string
	longitude?: number
	latitude?: number
}

export interface DictItem {
	label: string
	value: string | number
}

export interface UnitRow {
	id: number
	ip: string
	adsl: string
	unit_type: string
	control_category: string
	unit_tag: string
	port_count: number
	terminal_count: number
	ip_location: string
	focus_person: string
	focus_unit: string
	warning_type: string
	is_judged: number
	is_controlled: number
	entry_time: string
	longitude?: number
	latitude?: number
	unit_type_name?: string
	control_category_name?: string
	warning_type_name?: string
}
