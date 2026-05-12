import type { RouteRecordRaw } from 'vue-router'
import layout from '../layout.vue'

const routes: RouteRecordRaw[] = [
	{
		name: '_templates',
		path: '/templates',
		component: layout,
		redirect: '/templates/data-management',
		meta: {
			moduleKey: '_templates',
			title: 'templates'
		},
		children: [
			{
				name: 'Dashboard',
				path: '/templates/dashboard',
				component: () => import('../views/dashboard/index.vue'),
				meta: {
					title: 'dashboard'
				}
			},
			{
				name: 'DataManagement',
				path: '/templates/data-management',
				component: () => import('../views/data-management/index.vue'),
				meta: {
					title: 'dataManagement'
				}
			},
			{
				name: 'Approval',
				path: '/templates/approval',
				component: () => import('../views/approval/index.vue'),
				meta: {
					title: 'approval'
				}
			},
			{
				name: 'Settings',
				path: '/templates/settings',
				component: () => import('../views/settings/index.vue'),
				meta: {
					title: 'settings'
				}
			},
			{
				name: 'Analytics',
				path: '/templates/analytics',
				component: () => import('../views/analytics/index.vue'),
				meta: {
					title: 'analytics'
				}
			}
		]
	}
]

export default routes
