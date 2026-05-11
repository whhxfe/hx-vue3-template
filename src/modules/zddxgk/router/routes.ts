import type { RouteRecordRaw } from 'vue-router'
import layout from '../layout.vue'

const routes: RouteRecordRaw[] = [
	{
		name: 'zddxgk',
		path: '/zddxgk',
		component: layout,
		redirect: '/zddxgk/rrgk',
		meta: {
			moduleKey: 'zddxgk',
			title: 'zddxgk'
		},
		children: [
			{
				name: 'Rrgk',
				path: '/zddxgk/rrgk',
				component: () => import('../views/rrgk/index.vue'),
				meta: {
					title: 'rrgk'
				}
			},
			{
				name: 'Rryj',
				path: '/zddxgk/rryj',
				component: () => import('../views/rryj/index.vue'),
				meta: {
					title: 'rryj'
				}
			},
			{
				name: 'Rrst',
				path: '/zddxgk/rrst',
				component: () => import('../views/rrst/index.vue'),
				meta: {
					title: 'rrst'
				}
			},
			{
				name: 'Mbqtjc',
				path: '/zddxgk/mbqtjc',
				component: () => import('../views/mbqtjc/index.vue'),
				meta: {
					title: 'mbqtjc'
				}
			},
			{
				name: 'Mbdyjc',
				path: '/zddxgk/mbdyjc',
				component: () => import('../views/mbdyjc/index.vue'),
				meta: {
					title: 'mbdyjc'
				}
			},
			{
				name: 'Mbmxgl',
				path: '/zddxgk/mbmxgl',
				component: () => import('../views/mbmxgl/index.vue'),
				meta: {
					title: 'mbmxgl'
				}
			}
		]
	}
]

export default routes
