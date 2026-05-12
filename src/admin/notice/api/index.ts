/**
 * 通知公告 API
 */
import request from '@/api/request'

/** 通知公告 */
export interface Notice {
	id: number
	title: string
	content: string
	type: string
	priority: string
	is_top: number
	status: number
	publish_at: string | null
	unpublish_at: string | null
	author: string
	views: number
	created_at: string
	updated_at: string
}

/** 公告查询参数 */
export interface NoticeQuery {
	page?: number
	pageSize?: number
	title?: string
	type?: string
	status?: number
	start_date?: string
	end_date?: string
}

/** 公告列表响应 */
export interface NoticeListData {
	list: Notice[]
	total: number
	page: number
	pageSize: number
}

/** 获取公告列表 */
export function getNoticeList(params: NoticeQuery) {
	return request.get<{ state: number; message: string; data: NoticeListData }>('/admin/notice/notices', { params })
}

/** 获取公告详情 */
export function getNoticeDetail(id: number) {
	return request.get<{ state: number; message: string; data: Notice | null }>(`/admin/notice/notices/${id}`)
}

/** 创建公告 */
export function createNotice(data: {
	title: string
	content: string
	type?: string
	priority?: string
	author?: string
}) {
	return request.post('/admin/notice/notices', data)
}

/** 更新公告 */
export function updateNotice(id: number, data: Partial<{
	title: string
	content: string
	type: string
	priority: string
	is_top: number
	status: number
	publish_at: string
	unpublish_at: string
	author: string
}>) {
	return request.put(`/admin/notice/notices/${id}`, data)
}

/** 删除公告 */
export function deleteNotice(id: number) {
	return request.del(`/admin/notice/notices/${id}`)
}

/** 发布公告 */
export function publishNotice(id: number) {
	return request.post(`/admin/notice/notices/${id}/publish`)
}

/** 撤回公告 */
export function unpublishNotice(id: number) {
	return request.post(`/admin/notice/notices/${id}/unpublish`)
}
