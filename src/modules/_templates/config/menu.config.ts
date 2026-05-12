import { useTextAlias } from './text.config'

export const getMenuConfig = () => {
	const text = useTextAlias()
	return [
		{
			title: text.menu.dashboard,
			path: '/templates/dashboard'
		},
		{
			title: text.menu.dataManagement,
			path: '/templates/data-management'
		},
		{
			title: text.menu.settings,
			path: '/templates/settings'
		},
		{
			title: text.menu.analytics,
			path: '/templates/analytics'
		}
	]
}

export default getMenuConfig()
