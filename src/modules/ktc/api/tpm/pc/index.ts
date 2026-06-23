import request from '@/api/request'
import type { DictItem, ListResult, ApiResponse } from '../../types'
import type { TreeNode, ListItem, ListQuery, FollowLevel } from './types'
export { FOLLOW_LEVEL_OPTIONS } from './types'

export type { TreeNode, ListItem, ListQuery, FollowLevel }
export type { DictItem, ListResult, ApiResponse }

/**
 * 新增数据参数
 */
export interface CreateParams {
	name: string
	gender: "男" | "女"
	age: number
	phone: string
	idCard: string
	residenceAddress: string
	category: string
	dataSource: string
	tags?: string[]
}

/**
 * 更新数据参数
 */
export interface UpdateParams {
	id: number
	name: string
	gender: "男" | "女"
	age: number
	phone: string
	idCard: string
	residenceAddress: string
	category: string
	dataSource: string
	tags?: string[]
	followStatus?: "0" | "1"
}

/**
 * pc 模块 API（人员管控）
 */
export const pc = {
	// ==================== 树形数据 ====================

	/**
	 * 业务管理树
	 */
	getYhglTree() {
		return request.get<ApiResponse<TreeNode[]>>('/ktc/tpm/pc/yhgl/tree')
	},

	/**
	 * 关系机构树
	 */
	getGxjgTree() {
		return request.get<ApiResponse<TreeNode[]>>('/ktc/tpm/pc/gxjg/tree')
	},

	// ==================== 字典下拉 ====================

	/**
	 * 数据来源下拉选项
	 */
	getSourceOptions() {
		return request.get<ApiResponse<DictItem[]>>('/ktc/tpm/pc/dict/source')
	},

	/**
	 * 类别下拉选项
	 */
	getCategoryOptions() {
		return request.get<ApiResponse<DictItem[]>>('/ktc/tpm/pc/dict/category')
	},

	/**
	 * 居住地址下拉选项（湖北省县市）
	 */
	getAddressOptions() {
		return request.get<ApiResponse<DictItem[]>>('/ktc/tpm/pc/dict/address')
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
		}>>('/ktc/tpm/pc/list', query)
	},

	// ==================== 新增数据 ====================

	/**
	 * 新增数据
	 */
	create(data: CreateParams) {
		return request.post<ApiResponse<{ id: number }>>('/ktc/tpm/pc/create', data)
	},

	// ==================== 更新数据 ====================

	/**
	 * 更新数据
	 */
	update(data: UpdateParams) {
		return request.put<ApiResponse<{ id: number }>>(`/ktc/tpm/pc/update/${data.id}`, data)
	},

	/**
	 * 批量更新关注状态
	 */
	updateStatus(params: { ids: number[]; followStatus: "0" | "1" }) {
		return request.put<ApiResponse<{ updatedCount: number }>>('/ktc/tpm/pc/update/status', params)
	},

	// ==================== 删除数据 ====================

	/**
	 * 删除单条数据
	 */
	delete(id: number) {
		return request.del(`/ktc/tpm/pc/${id}`) as Promise<ApiResponse<{ id: number }>>
	},

	// ==================== 类别管理 ====================

	/**
	 * 批量设置人员类别
	 */
	assignCategory(params: { personIds: number[]; categoryCode: string }) {
		return request.post('/ktc/tpm/pc/category/assign', params) as Promise<ApiResponse<{ assignedCount: number }>>
	}
}
