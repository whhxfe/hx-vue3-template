import request from '@/api/request'
import type { DictItem, ApiResponse } from '../types'
import type { ListItem, ListQuery, FollowStatus } from './types'
export { FOLLOW_STATUS_OPTIONS } from './types'

export type { ListItem, ListQuery, FollowStatus }
export type { ApiResponse }

/**
 * ryst 模块 API
 */
export const ryst = {
	// ==================== 字典下拉 ====================

	/**
	 * 数据来源下拉选项
	 */
	getSourceOptions() {
		return request.get<ApiResponse<DictItem[]>>('/zddxgk/ryst/dict/source')
	},

	/**
	 * 类别下拉选项
	 */
	getCategoryOptions() {
		return request.get<ApiResponse<DictItem[]>>('/zddxgk/ryst/dict/category')
	},

	// ==================== 列表数据 ====================

	/**
	 * 获取列表数据
	 */
	getList(query: ListQuery) {
		return request.post<ApiResponse<{
			list: ListItem[]
			total: number
			page: number
			pageSize: number
		}>>('/zddxgk/ryst/list', query)
	}
}
