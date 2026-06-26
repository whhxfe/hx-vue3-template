import request from '@/api/request'
import type { ApiResponse } from '../../types'
import type { ListItem, ListQuery } from './types'
export { CONTROL_CATEGORY_OPTIONS } from './types'
export type { ListItem, ListQuery, ControlCategory }

import type { ControlCategory } from './types'

/**
 * um 模块 API（单元上图）
 */
export const um = {
	// ==================== 字典下拉 ====================

	/**
	 * 单元类型下拉选项
	 */
	getUnitTypeOptions() {
		return request.get<ApiResponse<{ label: string; value: string }[]>>('/ktc/tum/um/dict/unit-type')
	},

	/**
	 * 管控类别下拉选项
	 */
	getControlCategoryOptions() {
		return request.get<ApiResponse<{ label: string; value: string }[]>>('/ktc/tum/um/dict/control-category')
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
		}>>('/ktc/tum/um/list', query)
	}
}
