import { useTextAlias } from './text.config'

export const getMenuConfig = () => {
	const text = useTextAlias()
	return [
		{
			title: text.menu.rrgk,
			children: [
				{
					title: text.menu.rrgk,
					path: '/zddxgk/rrgk'
				},
				{
					title: text.menu.rryj,
					path: '/zddxgk/rryj'
				},
				{
					title: text.menu.rrst,
					path: '/zddxgk/rrst'
				}
			]
		},
		{
			title: text.menu.mbqtjc,
			path: '/zddxgk/mbqtjc'
		},
		{
			title: text.menu.mbdyjc,
			path: '/zddxgk/mbdyjc'
		},
		{
			title: text.menu.mbmxgl,
			path: '/zddxgk/mbmxgl'
		}
	]
}

export default getMenuConfig()
