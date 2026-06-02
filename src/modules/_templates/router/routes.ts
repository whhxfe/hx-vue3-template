import type { RouteRecordRaw } from 'vue-router'
import layout from '../layout.vue'

export const getRoutes = (): RouteRecordRaw[] => {
	return [
		{
			name: 'template',
			path: '/templates',
			component: layout,
			redirect: '/templates/dashboard',
			meta: {
				moduleKey: '_templates',
				title: '模板中心'
			},
			children: [
				{
					name: 'template-dashboard',
					path: '/templates/dashboard',
					component: () => import('../views/dashboard/index.vue'),
					meta: {
						title: '仪表盘'
					}
				},
				{
					name: 'template-screen',
					path: '/templates/screen',
					component: () => import('../views/screen/index.vue'),
					meta: {
						title: '数据大屏'
					}
				},
				{
					name: 'template-list',
					path: '/templates/list',
					component: () => import('../views/list/index.vue'),
					meta: {
						title: '列表管理'
					}
				}
			]
		}
	]
}

export default getRoutes()
