import type { RouteRecordRaw } from 'vue-router'
import layout from '../layout.vue'

export const getRoutes = (): RouteRecordRaw[] => {
	return [
		{
			name: 'Ktc',
			path: '/ktc',
			component: layout,
			redirect: '/ktc/tpm/pc',
			meta: {
				moduleKey: 'ktc',
				title: '重点对象管控'
			},
			children: [
				// ======== 目标人员监测 tpm ========
				{
					name: 'Ktc-Tpm',
					path: '/ktc/tpm',
					redirect: '/ktc/tpm/pc',
					meta: { title: '目标人员监测' }
				},
				{
					name: 'Ktc-PersonControl',
					path: '/ktc/tpm/pc',
					component: () => import('../views/tpm/pc/index.vue'),
					meta: { title: '人员管控' }
				},
				{
					name: 'Ktc-PersonWarning',
					path: '/ktc/tpm/pw',
					component: () => import('../views/tpm/pw/index.vue'),
					meta: { title: '人员预警' }
				},
				{
					name: 'Ktc-PersonMap',
					path: '/ktc/tpm/pm',
					component: () => import('../views/tpm/pm/index.vue'),
					meta: { title: '人员上图' }
				},
				// ======== 目标群体监测 tgm ========
				{
					name: 'Ktc-Tgm',
					path: '/ktc/tgm',
					redirect: '/ktc/tgm/gc',
					meta: { title: '目标群体监测' }
				},
				{
					name: 'Ktc-GroupControl',
					path: '/ktc/tgm/gc',
					component: () => import('../views/tgm/gc/index.vue'),
					meta: { title: '群体管控' }
				},
			{
				name: 'Ktc-PersonManage',
				path: '/ktc/tgm/gc/pmg',
				component: () => import('../views/tgm/gc/pmg/index.vue'),
				meta: { title: '人员管理', activeMenu: '/ktc/tgm/gc' }
			},
				{
					name: 'Ktc-GroupManage',
					path: '/ktc/tgm/gc/gm',
					component: () => import('../views/tgm/gc/gm/index.vue'),
					meta: { title: '群组管理' }
				},
				{
					name: 'Ktc-SubGroupManage',
					path: '/ktc/tgm/gc/sgm',
					component: () => import('../views/tgm/gc/sgm/index.vue'),
					meta: { title: '子群体管理' }
				},
				{
					name: 'Ktc-GroupArchive',
					path: '/ktc/tgm/gc/ga',
					component: () => import('../views/tgm/gc/ga/index.vue'),
					meta: { title: '群体档案' }
				},
				{
					name: 'Ktc-GroupWarning',
					path: '/ktc/tgm/gw',
					component: () => import('../views/tgm/gw/index.vue'),
					meta: { title: '群体预警' }
				},
				// ======== 目标单元监测 tum ========
				{
					name: 'Ktc-Tum',
					path: '/ktc/tum',
					redirect: '/ktc/tum/uc',
					meta: { title: '目标单元监测' }
				},
				{
					name: 'Ktc-UnitControl',
					path: '/ktc/tum/uc',
					component: () => import('../views/tum/uc/index.vue'),
					meta: { title: '单元管控' }
				},
				{
					name: 'Ktc-UnitArchive',
					path: '/ktc/tum/uc/ua',
					component: () => import('../views/tum/uc/ua/index.vue'),
					meta: { title: '单元档案' }
				},
				{
					name: 'Ktc-UnitMap',
					path: '/ktc/tum/um',
					component: () => import('../views/tum/um/index.vue'),
					meta: { title: '单元上图' }
				}
			]
		}
	]
}

export default getRoutes()
