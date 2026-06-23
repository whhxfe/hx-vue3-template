import request from '@/api/request'
import type { DictItem, ListResult, ApiResponse } from '../../types'
import type { ListItem, ListQuery } from './types'

export type { ListItem, ListQuery }

export { DictItem, ListResult, ApiResponse }

/**
 * 新增数据参数
 */
export interface CreateParams {
	name: string
	gender: "男" | "女"
	age: number
	idCard: string
	phone?: string
	personScore?: number
	warningType?: string
	businessCategory?: string
	dataSource?: string
	manageCategory?: string
	education?: string
	occupationType?: string
	residenceAddress?: string
}

/**
 * 更新数据参数
 */
export interface UpdateParams {
	id: number
	name: string
	gender: "男" | "女"
	age: number
	idCard: string
	phone?: string
	personScore?: number
	warningType?: string
	businessCategory?: string
	dataSource?: string
	manageCategory?: string
	education?: string
	occupationType?: string
	residenceAddress?: string
}

/**
 * pw 模块 API（人员预警）
 */
export const pw = {
	// ==================== 字典下拉 ====================

	/**
	 * 业务类别下拉选项
	 */
	getBusinessCategoryOptions() {
		return request.get<ApiResponse<DictItem[]>>('/ktc/tpm/pw/dict/business-category')
	},

	/**
	 * 人员分值下拉选项
	 */
	getPersonScoreOptions() {
		return request.get<ApiResponse<DictItem[]>>('/ktc/tpm/pw/dict/person-score')
	},

	/**
	 * 预警类型下拉选项
	 */
	getWarningTypeOptions() {
		return request.get<ApiResponse<DictItem[]>>('/ktc/tpm/pw/dict/warning-type')
	},

	/**
	 * 数据来源下拉选项
	 */
	getDataSourceOptions() {
		return request.get<ApiResponse<DictItem[]>>('/ktc/tpm/pw/dict/data-source')
	},

	/**
	 * 管理类别下拉选项
	 */
	getManageCategoryOptions() {
		return request.get<ApiResponse<DictItem[]>>('/ktc/tpm/pw/dict/manage-category')
	},

	/**
	 * 户籍地址下拉选项
	 */
	getHouseholdAddressOptions() {
		return request.get<ApiResponse<DictItem[]>>('/ktc/tpm/pw/dict/household-address')
	},

	/**
	 * 管理部门下拉选项
	 */
	getManageDeptOptions() {
		return request.get<ApiResponse<DictItem[]>>('/ktc/tpm/pw/dict/manage-dept')
	},

	// ==================== 列表数据 ====================

	/**
	 * 获取列表数据
	 */
	getList(query: ListQuery) {
		return request.post<ApiResponse<ListResult<ListItem>>>('/ktc/tpm/pw/list', query)
	},

	// ==================== 新增数据 ====================

	/**
	 * 新增数据
	 */
	create(data: CreateParams) {
		return request.post<ApiResponse<{ id: number }>>('/ktc/tpm/pw/create', data)
	},

	// ==================== 更新数据 ====================

	/**
	 * 更新数据
	 */
	update(data: UpdateParams) {
		return request.put<ApiResponse<{ id: number }>>(`/ktc/tpm/pw/update/${data.id}`, data)
	},

	// ==================== 删除数据 ====================

	/**
	 * 删除单条数据
	 */
	delete(id: number) {
		return request.del(`/ktc/tpm/pw/${id}`) as Promise<ApiResponse<{ id: number }>>
	},

	// ==================== 导入模板 ====================

	/**
	 * 获取导入模板下载地址
	 */
	getImportTemplate() {
		return '/ktc/tpm/pw/template'
	}
}
