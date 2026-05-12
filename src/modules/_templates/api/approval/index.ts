import request from '@/api/request'
import type { ApprovalItem, ApprovalFormData, ApprovalListResult } from './types'

export type { ApprovalItem, ApprovalFormData }

export const approval = {
	// 获取审批列表
	getList(params?: { page?: number; pageSize?: number; status?: string }) {
		return request.get<{ state: number; message: string; data: ApprovalListResult }>(
			'/templates/approval/list',
			{ params }
		)
	},

	// 获取详情
	getById(id: number) {
		return request.get<{ state: number; message: string; data: ApprovalItem }>(
			`/templates/approval/${id}`
		)
	},

	// 提交申请
	submit(data: ApprovalFormData) {
		return request.post<{ state: number; message: string }>('/templates/approval', data)
	},

	// 审批操作
	approve(id: number, comment?: string) {
		return request.post<{ state: number; message: string }>(
			`/templates/approval/${id}/approve`,
			{ comment }
		)
	},

	// 驳回操作
	reject(id: number, comment?: string) {
		return request.post<{ state: number; message: string }>(
			`/templates/approval/${id}/reject`,
			{ comment }
		)
	}
}
