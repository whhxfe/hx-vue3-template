import request from '@/api/request'
import type { TreeNode, DictItem, ListItem, ListQuery, ApiResponse } from './types'
import { pmg } from './pmg'

export type { TreeNode, DictItem, ListItem, ListQuery }
export { pmg }

/**
 * 新增群体参数
 */
export interface CreateParams {
	name: string
	categoryType: string
	territory: string
	policeName: string
	unitName: string
	reason: string
	tags?: string[]
}

/**
 * 更新群体参数
 */
export interface UpdateParams extends CreateParams {
	id: number
}

/**
 * gc 模块 API（群体管控）
 */
export const gc = {
	// ==================== 树形数据 ====================

	/**
	 * 获取左侧分类树
	 */
	getTree() {
		return request.get<ApiResponse<TreeNode[]>>('/ktc/tgm/gc/tree')
	},

	// ==================== 字典下拉 ====================

	/**
	 * 管控类别下拉选项
	 */
	getCategoryOptions() {
		return request.get<ApiResponse<DictItem[]>>('/ktc/tgm/gc/dict/category')
	},

	/**
	 * 预警类型下拉选项
	 */
	getWarningTypeOptions() {
		return request.get<ApiResponse<DictItem[]>>('/ktc/tgm/gc/dict/warning-type')
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
		}>>('/ktc/tgm/gc/list', query)
	},

	// ==================== 新增数据 ====================

	/**
	 * 新增群体
	 */
	create(data: CreateParams) {
		return request.post<ApiResponse<{ id: number }>>('/ktc/tgm/gc/create', data)
	},

	// ==================== 更新数据 ====================

	/**
	 * 更新群体
	 */
	update(data: UpdateParams) {
		return request.put<ApiResponse<{ id: number }>>(`/ktc/tgm/gc/update/${data.id}`, data)
	},

	// ==================== 删除数据 ====================

	/**
	 * 删除群体
	 */
	delete(id: number) {
		return request.del(`/ktc/tgm/gc/${id}`) as Promise<ApiResponse<{ id: number }>>
	}
}
