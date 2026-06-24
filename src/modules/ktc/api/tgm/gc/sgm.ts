/**
 * sgm 子群体管理模块 API
 */
import request from '@/api/request'

export interface SgmGroup {
	id: number
	parentGroupId: number
	name: string
	categoryType: string
	categoryTypeName?: string
	memberCount: number
	territory: string
	policeName: string
	unitName: string
	reason: string
	activeCount: number
	recommendCount: number
	groupCount: number
	warningTypes: string[]
	warningTypeNames?: string[]
	tags: string[]
	tagsName?: string[]
	entryTime: string
}

export interface SgmListQuery {
	page?: number
	pageSize?: number
	parentGroupId?: number
	keyword?: string
	categoryType?: string
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

export const sgm = {
	getList(query: SgmListQuery) {
		return request.post<ApiResponse<{
			list: SgmGroup[]
			total: number
			page: number
			pageSize: number
		}>>('/ktc/tgm/gc/sgm/list', query)
	},

	create(data: Partial<SgmGroup>) {
		return request.post<ApiResponse<{ id: number }>>('/ktc/tgm/gc/sgm/create', data)
	},

	update(data: Partial<SgmGroup> & { id: number }) {
		return request.put<ApiResponse<{ id: number }>>(`/ktc/tgm/gc/sgm/update/${data.id}`, data)
	},

	delete(id: number) {
		return request.del(`/ktc/tgm/gc/sgm/${id}`) as Promise<ApiResponse<{ id: number }>>
	},

	close(id: number) {
		return request.put<ApiResponse<{ id: number }>>(`/ktc/tgm/gc/sgm/close/${id}`)
	}
}
