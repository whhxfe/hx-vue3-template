/**
 * 登录参数
 */
export interface LoginParams {
	username: string
	password: string
}

/**
 * 登录返回数据
 */
export interface LoginData {
	info: string
	level?: string
	modules?: string[]
	adminModules?: string[]
	expiresIn?: number
}

/**
 * 通过 token 获取用户信息参数
 */
export interface GetUserInfoParams {
	token: string
}

/**
 * 用户信息
 */
export interface UserInfo {
	accountId: string
	accountName: string
	username: string
	email?: string
	phone?: string
	avatar?: string
	roleName: string
	roleLevel: string
	modules?: string[]
	adminModules?: string[]
}

/**
 * 登出参数
 */
export interface LogoutParams {
	token?: string
}

/**
 * 校验 Token 参数
 */
export interface CheckTokenParams {
	token: string
}

/**
 * Token 状态
 */
export interface TokenState {
	valid: boolean
	accountId?: string
	accountName?: string
	expiresIn: number
}
