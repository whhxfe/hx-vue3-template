import { useTextAlias } from './text.config'

export const getMenuConfig = () => {
	const text = useTextAlias()
	return [
		{
			title: text.menu.dashboard,
			path: '/templates/dashboard'
		},
		{
			title: text.menu.screen,
			path: '/templates/screen'
		}
	]
}

export default getMenuConfig()
