/**
 * 系统配置管理 API
 */
import request from '@/api/request'

/** 系统配置项 */
export interface SysConfig {
	id: number
	key: string
	value: string
	description: string | null
	type: string
	sort_order: number
	status: number
	created_at: string
	updated_at: string
}

/** 配置查询参数 */
export interface ConfigQuery {
	page?: number
	pageSize?: number
	key?: string
}

/** 配置列表响应 */
export interface ConfigListData {
	list: SysConfig[]
	total: number
	page: number
	pageSize: number
}

/** 获取配置列表 */
export function getConfigList(params: ConfigQuery) {
	return request.get<{ state: number; message: string; data: ConfigListData }>('/admin/sysconfig/configs', { params })
}

/** 获取单个配置 */
export function getConfig(key: string) {
	return request.get<{ state: number; message: string; data: SysConfig }>(`/admin/sysconfig/configs/${key}`)
}

/** 更新单个配置 */
export function updateConfig(key: string, value: string) {
	return request.put(`/admin/sysconfig/configs/${key}`, { value })
}

/** 批量更新配置 */
export function batchUpdateConfig(configs: Array<{ key: string; value: string }>) {
	return request.put('/admin/sysconfig/configs', configs)
}

/** 获取所有启用的配置 */
export function getAllEnabledConfigs() {
	return request.get<{ state: number; message: string; data: Record<string, string> }>('/admin/sysconfig/configs/enabled/all')
}
