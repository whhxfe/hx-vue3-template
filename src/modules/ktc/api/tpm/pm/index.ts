import request from '@/api/request'
import type { DictItem, ApiResponse } from '../../types'
import type { ListItem, ListQuery, FollowStatus } from './types'
export { FOLLOW_STATUS_OPTIONS } from './types'

export type { ListItem, ListQuery, FollowStatus }
export type { ApiResponse }

/**
 * pm 模块 API（人员上图）
 */
export const pm = {
	// ==================== 字典下拉 ====================

	/**
	 * 数据来源下拉选项
	 */
	getSourceOptions() {
		return request.get<ApiResponse<DictItem[]>>('/ktc/tpm/pm/dict/source')
	},

	/**
	 * 类别下拉选项
	 */
	getCategoryOptions() {
		return request.get<ApiResponse<DictItem[]>>('/ktc/tpm/pm/dict/category')
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
		}>>('/ktc/tpm/pm/list', query)
	}
}
