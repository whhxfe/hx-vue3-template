import type { RouteRecordRaw } from 'vue-router'
import layout from '../layout.vue'

const routes: RouteRecordRaw[] = [
	{
		name: 'Ucenter',
		path: '/admin/ucenter',
		component: layout,
		redirect: '/admin/ucenter/account',
		meta: {
			moduleKey: 'ucenter',
			title: '用户中心'
		},
		children: [
			{
				name: 'AccountList',
				path: '/admin/ucenter/account',
				component: () => import('../views/account-list.vue'),
				meta: {
					title: '账号管理'
				}
			},
			{
				name: 'RoleList',
				path: '/admin/ucenter/role',
				component: () => import('../views/role-list.vue'),
				meta: {
					title: '角色管理'
				}
			}
		]
	}
]

export default routes
