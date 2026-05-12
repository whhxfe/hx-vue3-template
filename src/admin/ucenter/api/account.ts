/**
 * 账号管理 API
 */
import request from '@/api/request'

/** 账号列表查询参数 */
export interface AccountQuery {
	page?: number
	pageSize?: number
	username?: string
	display_name?: string
	role_id?: number
	status?: number
}

/** 账号列表响应（统一响应体 data 中的结构） */
export interface AccountListData {
	list: any[]
	total: number
	page: number
	pageSize: number
}

/** 获取账号列表 */
export function getAccountList(params: AccountQuery) {
	return request.get<{ state: number; message: string; data: AccountListData }>('/admin/ucenter/accounts', { params })
}

/** 创建账号 */
export function createAccount(data: any) {
	return request.post('/admin/ucenter/accounts', data)
}

/** 更新账号 */
export function updateAccount(id: number, data: any) {
	return request.put(`/admin/ucenter/accounts/${id}`, data)
}

/** 删除账号 */
export function deleteAccount(id: number) {
	return request.del(`/admin/ucenter/accounts/${id}`)
}
