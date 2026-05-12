/** Token 状态响应 */
export interface TokenStateResponse {
	valid: boolean
	accountId?: string
	accountName?: string
	expiresIn: number
}

export interface LoginResponse {
	info: string
	level: string
	modules: string[]
	adminModules: string[]
	expiresIn: number
}

export interface MockUser {
	password: string
	accountId: string
	accountName: string
	username: string
	email?: string
	phone?: string
	avatar?: string
	roleName: string
	roleLevel: string
	modules: string[]
	adminModules: string[]
}

export interface MockUserInfo {
	accountId: string
	accountName: string
	username: string
	email?: string
	phone?: string
	avatar?: string
	roleName: string
	roleLevel: string
	modules: string[]
	adminModules: string[]
}
