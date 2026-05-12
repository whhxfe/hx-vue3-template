/**
 * 数据字典 API
 */
import request from '@/api/request'

/** 字典类型 */
export interface DictType {
	id: number
	type: string
	name: string
	description: string | null
	sort_order: number
	status: number
	created_at: string
	updated_at: string
}

/** 字典项 */
export interface DictItem {
	id: number
	type: string
	label: string
	value: string
	sort_order: number
	status: number
	remark: string | null
	created_at: string
}

/** 类型查询参数 */
export interface TypeQuery {
	page?: number
	pageSize?: number
	type?: string
	name?: string
}

/** 类型列表响应 */
export interface TypeListData {
	list: DictType[]
	total: number
	page: number
	pageSize: number
}

/** 字典项查询参数 */
export interface ItemQuery {
	page?: number
	pageSize?: number
	type?: string
	label?: string
	status?: number
}

/** 字典项列表响应 */
export interface ItemListData {
	list: DictItem[]
	total: number
	page: number
	pageSize: number
}

/** ========== 字典类型 ========== */

/** 获取字典类型列表 */
export function getDictTypeList(params: TypeQuery) {
	return request.get<{ state: number; message: string; data: TypeListData }>('/admin/dict/types', { params })
}

/** 获取所有字典类型（下拉选择用） */
export function getAllDictTypes() {
	return request.get<{ state: number; message: string; data: Array<{ type: string; name: string }> }>('/admin/dict/types/all')
}

/** 创建字典类型 */
export function createDictType(data: { type: string; name: string; description?: string; sort_order?: number }) {
	return request.post('/admin/dict/types', data)
}

/** 更新字典类型 */
export function updateDictType(id: number, data: Partial<{ name: string; description: string; sort_order: number; status: number }>) {
	return request.put(`/admin/dict/types/${id}`, data)
}

/** 删除字典类型 */
export function deleteDictType(id: number) {
	return request.del(`/admin/dict/types/${id}`)
}

/** ========== 字典项 ========== */

/** 获取字典项列表 */
export function getDictItemList(params: ItemQuery) {
	return request.get<{ state: number; message: string; data: ItemListData }>('/admin/dict/items', { params })
}

/** 获取指定类型的字典项 */
export function getDictItemsByType(type: string) {
	return request.get<{ state: number; message: string; data: Array<{ value: string; label: string }> }>(`/admin/dict/items/${type}`)
}

/** 创建字典项 */
export function createDictItem(data: { type: string; label: string; value: string; sort_order?: number; status?: number; remark?: string }) {
	return request.post('/admin/dict/items', data)
}

/** 更新字典项 */
export function updateDictItem(id: number, data: Partial<{ label: string; value: string; sort_order: number; status: number; remark: string }>) {
	return request.put(`/admin/dict/items/${id}`, data)
}

/** 删除字典项 */
export function deleteDictItem(id: number) {
	return request.del(`/admin/dict/items/${id}`)
}
