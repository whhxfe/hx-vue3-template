import type { RouteRecordRaw } from 'vue-router'
import layout from '../layout.vue'

const routes: RouteRecordRaw[] = [
	{
		name: 'Syslog',
		path: '/admin/syslog',
		component: layout,
		redirect: '/admin/syslog/list',
		meta: {
			moduleKey: 'syslog',
			title: '系统日志'
		},
		children: [
			{
				name: 'LogList',
				path: '/admin/syslog/list',
				component: () => import('../views/log-list.vue'),
				meta: {
					title: '操作日志'
				}
			}
		]
	}
]

export default routes
