import request from '@/api/request'
import type { DataItem, DataFormData, DataListResult } from './types'

export type { DataItem, DataFormData }

export const dataManagement = {
	// 获取数据列表
	getList(params?: { page?: number; pageSize?: number; keyword?: string; status?: string }) {
		return request.get<{ state: number; message: string; data: DataListResult }>(
			'/templates/data-management/list',
			{ params }
		)
	},

	// 获取详情
	getById(id: number) {
		return request.get<{ state: number; message: string; data: DataItem }>(
			`/templates/data-management/${id}`
		)
	},

	// 新增
	create(data: DataFormData) {
		return request.post<{ state: number; message: string }>('/templates/data-management', data)
	},

	// 更新
	update(id: number, data: DataFormData) {
		return request.put<{ state: number; message: string }>(
			`/templates/data-management/${id}`,
			data
		)
	},

	// 删除
	delete(id: number) {
		return request.delete<{ state: number; message: string }>(
			`/templates/data-management/${id}`
		)
	},

	// 更新状态
	updateStatus(id: number, status: 'active' | 'inactive') {
		return request.patch<{ state: number; message: string }>(
			`/templates/data-management/${id}/status`,
			{ status }
		)
	}
}
