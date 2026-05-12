/**
 * admin 模块统一入口
 *
 * 该目录包含系统管理相关的功能模块
 * - ucenter: 用户中心（账号管理、角色管理等）
 * - sysconfig: 系统配置管理
 * - syslog: 操作日志审计
 * - dict: 数据字典管理
 * - notice: 通知公告管理
 */
import type { RouteRecordRaw } from 'vue-router'
import ucenterRoutes from './ucenter/router/routes'
import ucenterMenu from './ucenter/menu.config'
import sysconfigRoutes from './sysconfig/router/routes'
import sysconfigMenu from './sysconfig/menu.config'
import syslogRoutes from './syslog/router/routes'
import syslogMenu from './syslog/menu.config'
import dictRoutes from './dict/router/routes'
import dictMenu from './dict/menu.config'
import noticeRoutes from './notice/router/routes'
import noticeMenu from './notice/menu.config'

export interface SystemModuleConfig {
	name: string
	routes: RouteRecordRaw[]
	menu: any[]
}

const systemModules: SystemModuleConfig[] = [
	{
		name: 'ucenter',
		routes: ucenterRoutes,
		menu: ucenterMenu
	},
	{
		name: 'sysconfig',
		routes: sysconfigRoutes,
		menu: sysconfigMenu
	},
	{
		name: 'syslog',
		routes: syslogRoutes,
		menu: syslogMenu
	},
	{
		name: 'dict',
		routes: dictRoutes,
		menu: dictMenu
	},
	{
		name: 'notice',
		routes: noticeRoutes,
		menu: noticeMenu
	}
]

export {
	ucenterRoutes, ucenterMenu,
	sysconfigRoutes, sysconfigMenu,
	syslogRoutes, syslogMenu,
	dictRoutes, dictMenu,
	noticeRoutes, noticeMenu
}

export default systemModules
