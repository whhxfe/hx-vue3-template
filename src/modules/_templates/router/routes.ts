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
			redirect: '/templates/dashboard',
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
					name: `${text.module.name}-screen`,
					path: '/templates/screen',
					component: () => import('../views/screen/index.vue'),
					meta: {
						title: 'screen'
					}
				}
			]
		}
	]
}

export default getRoutes()
