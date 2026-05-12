import type { RouteRecordRaw } from 'vue-router'
import layout from '../layout.vue'
import { useTextAlias } from '../config'

export const getRoutes = (): RouteRecordRaw[] => {
	const text = useTextAlias()

	return [
		{
			name: text.module.name,
			path: '/templates',
			component: layout,
			redirect: '/templates/data-management',
			meta: {
				moduleKey: '_templates',
				title: 'templates'
			},
			children: [
				{
					name: `${text.module.name}-dashboard`,
					path: '/templates/dashboard',
					component: () => import('../views/dashboard/index.vue'),
					meta: {
						title: 'dashboard'
					}
				},
				{
					name: `${text.module.name}-data-management`,
					path: '/templates/data-management',
					component: () => import('../views/data-management/index.vue'),
					meta: {
						title: 'dataManagement'
					}
				},
				{
					name: `${text.module.name}-settings`,
					path: '/templates/settings',
					component: () => import('../views/settings/index.vue'),
					meta: {
						title: 'settings'
					}
				},
				{
					name: `${text.module.name}-analytics`,
					path: '/templates/analytics',
					component: () => import('../views/analytics/index.vue'),
					meta: {
						title: 'analytics'
					}
				}
			]
		}
	]
}

export default getRoutes()
