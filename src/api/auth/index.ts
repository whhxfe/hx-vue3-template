import request from '@/api/request'
import type {
	LoginParams,
	LoginData,
	GetUserInfoParams,
	UserInfo,
	LogoutParams,
	CheckTokenParams,
	TokenState
} from './types'

export type { LoginParams, LoginData, GetUserInfoParams, UserInfo, LogoutParams, CheckTokenParams, TokenState }

/**
 * 登录
 */
export function login(params: LoginParams) {
	return request.get<ApiResponse<LoginData>>('/account/login', params)
}

/**
 * 登出
 */
export function logout(params?: LogoutParams) {
	return request.get<ApiResponse<void>>('/account/loginOut', params)
}

/**
 * 校验 Token
 */
export function checkToken(params?: CheckTokenParams) {
	return request.get<ApiResponse<TokenState>>('/account/getAccState', params)
}

/**
 * 通过 Token 获取用户信息
 */
export function getUserInfo(params: GetUserInfoParams) {
	return request.post<ApiResponse<UserInfo>>('/account/getUsInfoByTo', params)
}

/**
 * 获取所有可用业务模块列表
 */
export function getModules() {
	return request.get<ApiResponse<ModuleInfo[]>>('/account/modules')
}

export interface ModuleInfo {
	key: string
	name: string
	path: string
}

export default {
	login,
	logout,
	checkToken,
	getUserInfo,
	getModules
}
