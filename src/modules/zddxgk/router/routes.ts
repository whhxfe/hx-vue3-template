import type { RouteRecordRaw } from 'vue-router'
import layout from '../layout.vue'
import { useTextAlias } from '../config'

export const getRoutes = (): RouteRecordRaw[] => {
	const text = useTextAlias()

	return [
		{
			name: text.module.name,
			path: '/zddxgk',
			component: layout,
			redirect: '/zddxgk/rygk',
			meta: {
				moduleKey: 'zddxgk',
				title: text.route.zddxgk
			},
			children: [
				{
					name: `${text.module.name}-rygk`,
					path: '/zddxgk/rygk',
					component: () => import('../views/rygk/index.vue'),
					meta: {
						title: text.route.rygk
					}
				},
				{
					name: `${text.module.name}-ryyj`,
					path: '/zddxgk/ryyj',
					component: () => import('../views/ryyj/index.vue'),
					meta: {
						title: text.route.ryyj
					}
				},
				{
					name: `${text.module.name}-ryst`,
					path: '/zddxgk/ryst',
					component: () => import('../views/ryst/index.vue'),
					meta: {
						title: text.route.ryst
					}
				},
				{
					name: `${text.module.name}-mbqtjc`,
					path: '/zddxgk/mbqtjc',
					component: () => import('../views/mbqtjc/index.vue'),
					meta: {
						title: text.route.mbqtjc
					}
				},
				{
					name: `${text.module.name}-mbdyjc`,
					path: '/zddxgk/mbdyjc',
					component: () => import('../views/mbdyjc/index.vue'),
					meta: {
						title: text.route.mbdyjc
					}
				},
				{
					name: `${text.module.name}-mbmxgl`,
					path: '/zddxgk/mbmxgl',
					component: () => import('../views/mbmxgl/index.vue'),
					meta: {
						title: text.route.mbmxgl
					}
				}
			]
		}
	]
}

export default getRoutes()
