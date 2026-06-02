import request from '@/api/request'
import type { ListQuery, ListResult, ListForm } from './types'

export type { ListItem, ListQuery, ListResult, ListForm } from './types'

export const demo = {
	/**
	 * 获取列表数据
	 */
	getList(params: ListQuery) {
		return request.get<{ state: number; message: string; data: ListResult }>('/templates/list', {
			page: params.page || 1,
			pageSize: params.pageSize || 10,
			name: params.name || undefined,
			phone: params.phone || undefined,
			gender: params.gender || undefined,
			status: params.status || undefined
		})
	},

	/**
	 * 新增数据
	 */
	add(data: ListForm) {
		return request.post<{ state: number; message: string }>('/templates/list/add', data)
	},

	/**
	 * 更新数据
	 */
	update(data: ListForm) {
		return request.post<{ state: number; message: string }>('/templates/list/update', data)
	},

	/**
	 * 删除数据
	 */
	delete(id: number) {
		return request.post<{ state: number; message: string }>('/templates/list/delete', { id })
	}
}
