import { useTextAlias } from './text.config'

export const getMenuConfig = () => {
	const text = useTextAlias()
	return [
		{
			title: text.menu.rygk,
			children: [
				{
					title: text.menu.rygk,
					path: '/zddxgk/rygk'
				},
				{
					title: text.menu.ryyj,
					path: '/zddxgk/ryyj'
				},
				{
					title: text.menu.ryst,
					path: '/zddxgk/ryst'
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
