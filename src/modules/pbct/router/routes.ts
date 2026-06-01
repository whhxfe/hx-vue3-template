import type { RouteRecordRaw } from 'vue-router'
import layout from '../layout.vue'

export const getRoutes = (): RouteRecordRaw[] => {
	return [
		{
			name: 'pbct',
			path: '/pbct',
			component: layout,
			redirect: '/pbct/import',
			meta: {
				moduleKey: 'pbct',
				title: 'pbct'
			},
			children: [
				{
					name: 'pbct-import',
					path: '/pbct/import',
					component: () => import('../views/import/index.vue'),
					meta: {
						title: 'import'
					}
				},
				{
					name: 'pbct-query',
					path: '/pbct/query',
					component: () => import('../views/query/index.vue'),
					meta: {
						title: 'query'
					}
				}
			]
		}
	]
}

export default getRoutes()
