import request from '@/api/request'
import type { ConfigGroup, ConfigItem, ConfigListResult } from './types'

export type { ConfigGroup, ConfigItem }

export const settings = {
	// 获取配置分组
	getGroups() {
		return request.get<{ state: number; message: string; data: ConfigGroup[] }>(
			'/templates/settings/groups'
		)
	},

	// 获取配置项列表
	getConfigList(groupId?: string) {
		return request.get<{ state: number; message: string; data: ConfigListResult }>(
			'/templates/settings/items',
			{ params: { groupId } }
		)
	},

	// 更新配置项
	updateConfig(key: string, value: string | number | boolean) {
		return request.put<{ state: number; message: string }>(
			`/templates/settings/items/${key}`,
			{ value }
		)
	},

	// 批量更新配置项
	batchUpdate(configs: Record<string, string | number | boolean>) {
		return request.put<{ state: number; message: string }>(
			'/templates/settings/batch',
			{ configs }
		)
	}
}
