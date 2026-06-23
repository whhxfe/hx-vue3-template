/**
 * ryst 模块类型定义
 */

export interface ListItem {
	id?: number
	avatar?: string
	name: string
	gender: "男" | "女"
	age: number
	phone: string
	idCard: string
	residenceAddress?: string
	residenceAddressName?: string
	tags?: string[]
	tagsName?: string[]
	category?: string
	categoryName?: string
	dataSource?: string
	dataSourceName?: string
	followStatus: "0" | "1" | "2"
	followStatusName?: string
	entryTime?: string
	longitude?: number
	latitude?: number
}

export interface ListQuery {
	page?: number
	pageSize?: number
	dataSource?: string
	category?: string
	followStatus?: string
	entryTimeStart?: string
	entryTimeEnd?: string
	keyword?: string
}

export interface DictItem {
	label: string
	value: string | number
}

export interface RystRow {
	id: number
	name: string
	gender: string
	age: number
	phone: string
	id_card: string
	avatar?: string
	residence_address?: string
	category?: string
	data_source?: string
	tags?: string
	follow_status: string
	longitude?: number
	latitude?: number
	entry_time?: string
	data_source_name?: string
	category_name?: string
}
