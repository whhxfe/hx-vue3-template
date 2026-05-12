import type { RouteRecordRaw } from 'vue-router'
import layout from '../layout.vue'

const routes: RouteRecordRaw[] = [
	{
		name: 'Dict',
		path: '/admin/dict',
		component: layout,
		redirect: '/admin/dict/types',
		meta: {
			moduleKey: 'dict',
			title: '数据字典'
		},
		children: [
			{
				name: 'DictTypes',
				path: '/admin/dict/types',
				component: () => import('../views/dict-types.vue'),
				meta: {
					title: '字典类型'
				}
			},
			{
				name: 'DictItems',
				path: '/admin/dict/items',
				component: () => import('../views/dict-items.vue'),
				meta: {
					title: '字典项管理'
				}
			}
		]
	}
]

export default routes
