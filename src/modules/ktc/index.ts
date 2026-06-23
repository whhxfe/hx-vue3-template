/**
 * ktc 模块统一入口
 *
 * 该文件用于动态注册模块，导出模块的所有配置
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
	name: 'ktc',
	routes: getRoutes(),
	api,
	menu: getMenuConfig()
}

export default moduleConfig
