export interface User {
	id: string | number
	username: string
	nickname: string
	email: string
	avatar?: string
	phone?: string
	status: 'active' | 'inactive' | 'banned'
	roles: string[]
	createTime: string
	updateTime: string
}

export interface UserListParams {
	page?: number
	pageSize?: number
	keyword?: string
	status?: User['status']
}

export interface UserListResponse {
	list: User[]
	total: number
	page: number
	pageSize: number
}
