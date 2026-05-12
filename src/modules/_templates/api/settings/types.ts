/**
 * 系统设置类型定义
 */
export interface ConfigGroup {
	id: string
	name: string
	key: string
	icon?: string
	description?: string
}

export interface ConfigItem {
	id: string
	groupId: string
	key: string
	label: string
	type: 'switch' | 'input' | 'select' | 'number' | 'textarea'
	value: string | number | boolean
	options?: { label: string; value: string | number }[]
	placeholder?: string
	description?: string
}

export interface ConfigListResult {
	list: ConfigItem[]
	total: number
}
