
export const getMenuConfig = () => {
	return [
		{
			title: '目标人员监测',
			children: [
				{ title: '人员管控', path: '/ktc/tpm/pc' },
				{ title: '人员预警', path: '/ktc/tpm/pw' },
				{ title: '人员上图', path: '/ktc/tpm/pm' }
			]
		},
		{
			title: '目标群体监测',
			children: [
				{
					title: '群体管控',
					path: '/ktc/tgm/gc',
					children: [
						{ title: '人员管理', path: '/ktc/tgm/gc/pmg' },
						{ title: '群组管理', path: '/ktc/tgm/gc/gm' },
						{ title: '子群体管理', path: '/ktc/tgm/gc/sgm' },
						{ title: '群体档案', path: '/ktc/tgm/gc/ga' }
					]
				},
				{ title: '群体预警', path: '/ktc/tgm/gw' }
			]
		},
		{
			title: '目标单元监测',
			children: [
				{
					title: '单元管控',
					path: '/ktc/tum/uc',
					children: [
						{ title: '单元档案', path: '/ktc/tum/uc/ua' }
					]
				},
				{ title: '单元上图', path: '/ktc/tum/um' }
			]
		}
	]
}

export default getMenuConfig()
