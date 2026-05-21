/**
 * rygk 模块类型定义
 */

export interface TreeNode {
	id: number
	label: string
	count?: number
	icon?: string
	children?: TreeNode[]
}

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
	phone: string
	idCard: string
	residenceAddress: string
	residenceAddressName?: string
	tags: string[]
	tagsName?: string[]
	category: string
	categoryName?: string
	dataSource: string
	dataSourceName?: string
	followStatus: "0" | "1"
	followStatusName?: string
	entryTime: string
}

export interface ListQuery {
	page?: number
	pageSize?: number
	dataSource?: string
	category?: string
	residenceAddress?: string
	followStatus?: string
	entryTimeStart?: string
	entryTimeEnd?: string
	treeId?: number | string
	treeType?: string
	keyword?: string
}

export interface ListResult {
	list: ListItem[]
	total: number
	page: number
	pageSize: number
}

// ========== 人员信息（数据库行）==========
export interface PersonRow {
	id: number
	name: string
	gender: string
	age: number | null
	phone: string | null
	id_card: string | null
	residence_address: string | null
	category: string | null
	data_source: string | null
	tags: string | null
	follow_status: string
	avatar: string | null
	tree_id: number | null
	tree_type: string | null
	entry_time: string
	created_at: string
	updated_at: string
}
