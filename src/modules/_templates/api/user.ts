import request from '@/api/request'
import type { User, UserListParams, UserListResponse } from './user.types'

export * from './user.types'

/**
 * 获取用户列表
 */
export const getUserList = (params: UserListParams) => {
	return request.get<UserListResponse>('/users', params)
}

/**
 * 获取用户详情
 */
export const getUserById = (id: string | number) => {
	return request.get<User>(`/users/${id}`)
}

/**
 * 创建用户
 */
export const createUser = (data: Partial<User>) => {
	return request.post<User>('/users', data)
}

/**
 * 更新用户
 */
export const updateUser = (id: string | number, data: Partial<User>) => {
	return request.put<User>(`/users/${id}`, data)
}

/**
 * 删除用户
 */
export const deleteUser = (id: string | number) => {
	return request.delete(`/users/${id}`)
}
