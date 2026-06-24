/**
 * gm 群组管理模块 API
 */
import request from '@/api/request'

export interface GmGroup {
	id: number
	groupId: number
	name: string
	number: string
	type: string
	memberCount: number
	activeCount: number
	description: string
	entryTime: string
}

export interface GmListQuery {
	page?: number
	pageSize?: number
	groupId?: number
	keyword?: string
	type?: string
	entryTimeStart?: string
	entryTimeEnd?: string
	sortField?: string
	sortOrder?: string
}

interface ApiResponse<T = unknown> {
	state: number
	message: string
	data: T
}

export const gm = {
	getList(query: GmListQuery) {
		return request.post<ApiResponse<{
			list: GmGroup[]
			total: number
			page: number
			pageSize: number
		}>>('/ktc/tgm/gc/gm/list', query)
	},

	create(data: Partial<GmGroup>) {
		return request.post<ApiResponse<{ id: number }>>('/ktc/tgm/gc/gm/create', data)
	},

	update(data: Partial<GmGroup> & { id: number }) {
		return request.put<ApiResponse<{ id: number }>>(`/ktc/tgm/gc/gm/update/${data.id}`, data)
	},

	delete(id: number) {
		return request.del(`/ktc/tgm/gc/gm/${id}`) as Promise<ApiResponse<{ id: number }>>
	}
}
