/**
 * ryyj 模块类型定义
 */

export interface DictItem {
	label: string
	value: string | number
	disabled?: boolean
}

export interface ListItem {
	id: number
	avatar?: string
	name: string
	gender: "男" | "女"
	age: number
	idCard: string
	phone?: string
	education?: string
	personScore?: number | string
	personCategory?: string
	personCategoryName?: string
	manageCategory?: string
	manageCategoryName?: string
	entryTime?: string
	dataSource?: string
	dataSourceName?: string
	occupationType?: string
	residenceAddress?: string
	relationInfo?: string
	warningType?: string
	warningTypeName?: string
	businessCategory?: string
	businessCategoryName?: string
	householdAddress?: string
	householdAddressName?: string
	manageDept?: string
	manageDeptName?: string
}

export interface ListQuery {
	page?: number
	pageSize?: number
	businessCategory?: string
	personScore?: string
	warningType?: string
	dataSource?: string
	manageCategory?: string
	householdAddress?: string
	manageDept?: string
	entryTimeStart?: string
	entryTimeEnd?: string
}

export interface ListResult {
	list: ListItem[]
	total: number
	page: number
	pageSize: number
}

// ========== 人员预警信息（数据库行）==========
export interface RyyjRow {
	id: number
	name: string
	gender: string | null
	age: number | null
	id_card: string | null
	phone: string | null
	avatar: string | null
	education: string | null
	person_score: number | null
	person_category: string | null
	manage_category: string | null
	entry_time: string | null
	data_source: string | null
	occupation_type: string | null
	residence_address: string | null
	relation_info: string | null
	warning_type: string | null
	business_category: string | null
	household_address: string | null
	manage_dept: string | null
	created_at: string
	updated_at: string
}
