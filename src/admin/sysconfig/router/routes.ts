import type { RouteRecordRaw } from 'vue-router'
import layout from '../layout.vue'

const routes: RouteRecordRaw[] = [
	{
		name: 'Sysconfig',
		path: '/admin/sysconfig',
		component: layout,
		redirect: '/admin/sysconfig/base',
		meta: {
			moduleKey: 'sysconfig',
			title: '系统配置'
		},
		children: [
			{
				name: 'BaseConfig',
				path: '/admin/sysconfig/base',
				component: () => import('../views/base-config.vue'),
				meta: {
					title: '基础配置'
				}
			}
		]
	}
]

export default routes
