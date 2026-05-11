/**
 * _templates 模块统一入口
 *
 * 该文件用于动态注册模块，导出模块的所有配置
 */
import type { RouteRecordRaw } from 'vue-router'
import routes from './router/routes'
import * as api from './api'
import menu from './menu.config'

export interface ModuleConfig {
	name: string
	routes: RouteRecordRaw[]
	api: typeof api
	menu: typeof menu
}

const moduleConfig: ModuleConfig = {
	name: '_templates',
	routes,
	api,
	menu
}

export default moduleConfig
