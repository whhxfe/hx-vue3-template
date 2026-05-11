import type { RouteRecordRaw } from 'vue-router'
import layout from '../layout.vue'

const routes: RouteRecordRaw[] = [
	{
		name: '_templates',
		path: '/templates',
		component: layout,
		redirect: '/templates/user-list',
		meta: {
			moduleKey: '_templates',
			title: 'templates'
		},
		children: [
			{
				name: 'UserList',
				path: '/templates/user-list',
				component: () => import('../views/UserList.vue'),
				meta: {
					title: 'userList'
				}
			},
			{
				name: 'UserDetail',
				path: '/templates/user-detail/:id',
				component: () => import('../views/UserDetail.vue'),
				meta: {
					title: 'userDetail',
					hidden: true
				}
			}
		]
	}
]

export default routes
