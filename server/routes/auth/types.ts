export interface MockUser {
	password: string
	accountId: string
	accountName: string
	accountMemo: string
	roleName: string
	roleLevel: string
	modules: string[]
}

export interface MockUserInfo {
	accountId: string
	accountName: string
	accountMemo: string
	roleName: string
	roleLevel: string
	modules: string[]
}

export interface LoginParams {
	username: string
	password: string
}

export interface LoginResponse {
	info: string
	level: string
	modules: string[]
}
