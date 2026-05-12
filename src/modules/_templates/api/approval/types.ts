/**
 * 审批流程类型定义
 */
export interface ApprovalItem {
	id: number
	title: string
	applicant: string
	department: string
	type: 'leave' | 'reimburse' | 'overtime' | 'purchase'
	amount?: number
	days?: number
	status: 'pending' | 'approved' | 'rejected'
	createTime: string
	updateTime: string
	remark?: string
	history?: ApprovalHistory[]
}

export interface ApprovalHistory {
	operator: string
	action: 'submit' | 'approve' | 'reject'
	time: string
	comment?: string
}

export interface ApprovalFormData {
	title: string
	type: ApprovalItem['type']
	days?: number
	amount?: number
	remark?: string
}

export interface ApprovalListResult {
	list: ApprovalItem[]
	total: number
	page: number
	pageSize: number
}
