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
			redirect: '/zddxgk/rrgk',
			meta: {
				moduleKey: 'zddxgk',
				title: text.route.zddxgk
			},
			children: [
				{
					name: `${text.module.name}-rrgk`,
					path: '/zddxgk/rrgk',
					component: () => import('../views/rrgk/index.vue'),
					meta: {
						title: text.route.rrgk
					}
				},
				{
					name: `${text.module.name}-rryj`,
					path: '/zddxgk/rryj',
					component: () => import('../views/rryj/index.vue'),
					meta: {
						title: text.route.rryj
					}
				},
				{
					name: `${text.module.name}-rrst`,
					path: '/zddxgk/rrst',
					component: () => import('../views/rrst/index.vue'),
					meta: {
						title: text.route.rrst
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
