import type { RouteRecordRaw } from 'vue-router'
import layout from '../layout.vue'

export const getRoutes = (): RouteRecordRaw[] => {
	return [
		{
			name: 'amc',
			path: '/amc',
			component: layout,
			redirect: '/amc/lsp',
			meta: {
				moduleKey: 'amc',
				title: '审计管理中心'
			},
			children: [
				{
					name: 'amc-lsp',
					path: '/amc/lsp',
					component: () => import('../views/lsp/index.vue'),
					meta: {
						title: '日志标准化处理'
					}
				},
				{
					name: 'amc-lmc',
					path: '/amc/lmc',
					component: () => import('../views/lmc/index.vue'),
					meta: {
						title: '日志管理'
					}
				},
				{
					name: 'amc-lvs',
					path: '/amc/lvs',
					component: () => import('../views/lvs/index.vue'),
					meta: {
						title: '日志统计大屏'
					}
				}
			]
		}
	]
}

export default getRoutes()
