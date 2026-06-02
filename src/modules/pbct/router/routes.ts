import type { RouteRecordRaw } from 'vue-router'
import layout from '../layout.vue'

export const getRoutes = (): RouteRecordRaw[] => {
	return [
		{
			name: 'pbct',
			path: '/pbct',
			component: layout,
			redirect: '/pbct/query',
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
						title: 'import',
						/** 仅 super(0) 和 admin(1) 可访问，user(2) 不可见 */
						minRoleLevel: 1
					}
				},
				{
					name: 'pbct-query',
					path: '/pbct/query',
					component: () => import('../views/query/index.vue'),
					meta: {
						title: 'query',
						/** 所有角色均可访问 */
						minRoleLevel: -1
					}
				}
			]
		}
	]
}

export default getRoutes()
