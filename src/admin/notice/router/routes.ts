import type { RouteRecordRaw } from 'vue-router'
import layout from '../layout.vue'

const routes: RouteRecordRaw[] = [
	{
		name: 'Notice',
		path: '/admin/notice',
		component: layout,
		redirect: '/admin/notice/list',
		meta: {
			moduleKey: 'notice',
			title: '通知公告'
		},
		children: [
			{
				name: 'NoticeList',
				path: '/admin/notice/list',
				component: () => import('../views/notice-list.vue'),
				meta: {
					title: '公告管理'
				}
			}
		]
	}
]

export default routes
