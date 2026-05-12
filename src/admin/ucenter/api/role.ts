/**
 * 角色管理 API
 */
import request from '@/api/request'

/** 角色列表查询参数 */
export interface RoleQuery {
	page?: number
	pageSize?: number
	name?: string
	code?: string
}

/** 角色列表响应（统一响应体 data 中的结构） */
export interface RoleListData {
	list: any[]
	total: number
	page: number
	pageSize: number
}

/** 获取角色列表 */
export function getRoleList(params: RoleQuery) {
	return request.get<{ state: number; message: string; data: RoleListData }>('/admin/ucenter/roles', { params })
}

/** 创建角色 */
export function createRole(data: any) {
	return request.post('/admin/ucenter/roles', data)
}

/** 更新角色 */
export function updateRole(id: number, data: any) {
	return request.put(`/admin/ucenter/roles/${id}`, data)
}

/** 删除角色 */
export function deleteRole(id: number) {
	return request.del(`/admin/ucenter/roles/${id}`)
}

/** 获取角色授权的模块 key 列表 */
export function getRoleMenus(roleId: number) {
	return request.get<{ state: number; message: string; data: string[] }>(`/admin/ucenter/roles/${roleId}/menus`)
}

/** 更新角色授权的模块 */
export function updateRoleMenus(roleId: number, moduleKeys: string[]) {
	return request.put(`/admin/ucenter/roles/${roleId}/menus`, { moduleKeys })
}

/** 获取所有可用的模块列表 */
export function getAllModules() {
	return request.get<{ state: number; message: string; data: any[] }>('/admin/ucenter/modules')
}
