/**
 * 公共 API 接口
 * 无需认证即可访问的接口
 */
import request from '@/api/request'

/** 字典项 */
export interface DictItem {
	value: string
	label: string
}

/**
 * 获取指定类型的字典项（公共接口）
 * @param type 字典类型，如 ethnicity, district, gender 等
 */
export function getPublicDict(type: string) {
	return request.get<{ state: number; message: string; data: DictItem[] }>(`/public/dict/${type}`)
}

/**
 * 批量获取字典项（公共接口）
 * @param types 字典类型数组，如 ['ethnicity', 'district']
 */
export function getPublicDicts(types: string[]) {
	return request.get<{ state: number; message: string; data: Record<string, DictItem[]> }>('/public/dicts', {
		params: { types }
	})
}
