import request from '@/api/request'
import type { ApiResponse } from '../../types'

export interface ListItem {
	id: number
	ip: string
	adsl: string
	unitType: string
	unitTypeName: string
	controlCategory: string
	controlCategoryName: string
	unitTag: string
	categoryTag: string
	portCount: number
	terminalCount: number
	ipLocation: string
	focusPerson: string
	focusUnit: string
	focusReason: string
	warningType: string
	warningTypeName: string
	isJudged: boolean
	isControlled: boolean
	entryTime: string
}

export interface ListQuery {
	page?: number
	pageSize?: number
	keyword?: string
	unitType?: string
	controlCategory?: string
	entryTimeStart?: string
	entryTimeEnd?: string
	categoryFilter?: string[]
}

export interface CreateParams {
	ip: string
	adsl?: string
	unitType: string
	controlCategory: string
	portCount?: number
	terminalCount?: number
	ipLocation?: string
	warningType?: string
	focusPerson?: string
	focusUnit?: string
	focusReason?: string
}

export interface UpdateParams extends CreateParams {
	id: number
}

export interface JudgeParams {
	id: number
	controlCategory: string
	judgeReason: string
}

/**
 * 研判历史记录（被 ua 模块 re-import 使用）
 */
export interface JudgeRecord {
	id: number
	unitId: number
	controlCategory: string
	controlCategoryName: string
	judgeReason: string
	judgeUser: string
	judgeUnit: string
	judgeTime: string
}

export interface ControlParams {
	id: number
	controlResource: string
	monitorTime: string
}

/**
 * uc 模块 API（单元管控）
 */
export const uc = {
	// ==================== 字典下拉 ====================

	/**
	 * 单元类型下拉选项
	 */
	getUnitTypeOptions() {
		return request.get<ApiResponse<{ label: string; value: string }[]>>('/ktc/tum/uc/dict/unit-type')
	},

	/**
	 * 管控类别下拉选项
	 */
	getControlCategoryOptions() {
		return request.get<ApiResponse<{ label: string; value: string }[]>>('/ktc/tum/uc/dict/control-category')
	},

	/**
	 * 布控资源下拉选项
	 */
	getControlResourceOptions() {
		return request.get<ApiResponse<{ label: string; value: string }[]>>('/ktc/tum/uc/dict/control-resource')
	},

	/**
	 * 预警类型下拉选项
	 */
	getWarningTypeOptions() {
		return request.get<ApiResponse<{ label: string; value: string }[]>>('/ktc/tum/uc/dict/warning-type')
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
		}>>('/ktc/tum/uc/list', query)
	},

	// ==================== 详情 ====================

	/**
	 * 获取单元详情
	 */
	getDetail(id: number) {
		return request.get<ApiResponse<ListItem>>(`/ktc/tum/uc/detail/${id}`)
	},

	// ==================== 新增 ====================

	/**
	 * 录入单元信息
	 */
	create(data: CreateParams) {
		return request.post<ApiResponse<{ id: number }>>('/ktc/tum/uc/create', data)
	},

	// ==================== 更新 ====================

	/**
	 * 更新单元信息
	 */
	update(data: UpdateParams) {
		return request.put<ApiResponse<{ id: number }>>(`/ktc/tum/uc/update/${data.id}`, data)
	},

	// ==================== 删除 ====================

	/**
	 * 删除单条数据
	 */
	delete(id: number) {
		return request.del(`/ktc/tum/uc/${id}`) as Promise<ApiResponse<{ id: number }>>
	},

	// ==================== 研判 ====================

	/**
	 * 提交研判
	 */
	judge(data: JudgeParams) {
		return request.post<ApiResponse<{ id: number }>>('/ktc/tum/uc/judge', data)
	},

	// ==================== 布控 ====================

	/**
	 * 提交布控
	 */
	control(data: ControlParams) {
		return request.post<ApiResponse<{ id: number }>>('/ktc/tum/uc/control', data)
	},

	// ==================== 导入模板 ====================

	/**
	 * 获取导入模板下载地址
	 */
	getImportTemplate() {
		return '/ktc/tum/uc/template'
	}
}
