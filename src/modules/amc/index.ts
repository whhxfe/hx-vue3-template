/**
 * AMC 模块统一入口
 *
 * 审计管理中心 (Audit Management Center)
 * - lsp: 日志标准化处理 (Log Standardization Processing)
 * - lmc: 日志管理 (Log Management Center)
 * - lvs: 日志统计大屏 (Log Visualization Screen)
 */
import type { RouteRecordRaw } from 'vue-router'
import { getRoutes } from './router/routes'
import { getMenuConfig } from './config/menu.config'
import * as api from './api'

export interface ModuleConfig {
	name: string
	routes: RouteRecordRaw[]
	api: typeof api
	menu: ReturnType<typeof getMenuConfig>
}

const moduleConfig: ModuleConfig = {
	name: 'amc',
	routes: getRoutes(),
	api,
	menu: getMenuConfig()
}

export default moduleConfig
