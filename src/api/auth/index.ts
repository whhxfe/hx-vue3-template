import request from '@/api/request'
import type {
	LoginParams,
	LoginData,
	GetUserInfoParams,
	UserInfo,
	LogoutParams,
	CheckTokenParams
} from './types'

export type { LoginParams, LoginData, GetUserInfoParams, UserInfo, LogoutParams, CheckTokenParams }

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
	return request.get<ApiResponse<unknown>>('/account/getAccState', params)
}

/**
 * 通过 Token 获取用户信息
 */
export function getUserInfo(params: GetUserInfoParams) {
	return request.post<ApiResponse<UserInfo>>('/account/getUsInfoByTo', params)
}

export default {
	login,
	logout,
	checkToken,
	getUserInfo
}
