/** 字典项 */
export interface DictItem {
	value: string
	label: string
}

/**
 * pbct 模块 API 接口
 */
import request from '@/api/request'
import type { ListQuery, ListResult, ListItem, ImportData, AddForm, BatchQueryResult } from './types'

export type { ListItem, ListQuery, ListResult, ImportData, AddForm, BatchQueryResult }

export const pbct = {
/**
 * 获取民族字典
 */
getEthnicityOptions() {
	return request.get<{ state: number; message: string; data: Array<{ value: string; label: string }> }>('/public/dict/ethnicity')
},

/**
 * 获取区县字典
 */
getDistrictOptions() {
	return request.get<{ state: number; message: string; data: Array<{ value: string; label: string }> }>('/public/dict/district')
},

	/**
	 * 获取列表数据
	 */
	getList(params: ListQuery) {
		return request.get<{ state: number; message: string; data: ListResult }>('/pbct/list', {
			page: params.page || 1,
			pageSize: params.pageSize || 10,
			name: params.name || undefined,
			idCard: params.idCard || undefined,
			phone: params.phone || undefined,
			district: params.district || undefined,
			gender: params.gender || undefined,
			ethnicity: params.ethnicity || undefined,
			sortOrder: params.sortOrder || undefined
		})
	},

	/**
	 * 批量查询身份证号
	 */
	batchQuery(idCards: string[]) {
		return request.post<{ state: number; message: string; data: BatchQueryResult }>('/pbct/batch-list', { idCards })
	},

	/**
	 * 新增数据
	 */
	add(data: AddForm) {
		return request.post<{ state: number; message: string }>('/pbct/add', data)
	},

	/**
	 * 删除数据
	 */
	delete(id: number) {
		return request.post<{ state: number; message: string }>('/pbct/delete', { id })
	}
}
