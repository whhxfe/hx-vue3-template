/**
 * pmg 人员管理模块 API
 */
import request from '@/api/request'

export interface PmgPerson {
	id: number
	groupId: number
	name: string
	gender: string
	age: number
	idCard: string
	phone: string
	nation: string
	address: string
	addressName?: string
	warningTypes: string[]
	warningTypeNames?: string[]
	followStatus: string
	followStatusName?: string
	avatar?: string
	entryTime: string
}

export interface PmgListQuery {
	page?: number
	pageSize?: number
	groupId?: number
	keyword?: string
	address?: string
	followStatus?: string
	sortField?: string
	sortOrder?: string
}

export interface PmgAddressCount {
	label: string
	value: string
	count: number
}

export const pmg = {
	getList(query: PmgListQuery) {
		return request.post<ApiResponse<{
			list: PmgPerson[]
			total: number
			page: number
			pageSize: number
		}>>('/ktc/tgm/gc/pmg/list', query)
	},

	getAddressCounts(groupId: number) {
		return request.get<ApiResponse<PmgAddressCount[]>>(`/ktc/tgm/gc/pmg/address-counts?groupId=${groupId}`)
	},

	create(data: Partial<PmgPerson>) {
		return request.post<ApiResponse<{ id: number }>>('/ktc/tgm/gc/pmg/create', data)
	},

	update(data: Partial<PmgPerson> & { id: number }) {
		return request.put<ApiResponse<{ id: number }>>(`/ktc/tgm/gc/pmg/update/${data.id}`, data)
	},

	delete(id: number) {
		return request.del(`/ktc/tgm/gc/pmg/${id}`) as Promise<ApiResponse<{ id: number }>>
	}
}

interface ApiResponse<T = unknown> {
	state: number
	message: string
	data: T
}
