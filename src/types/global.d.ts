// 声明 virtual:svg-icons-register 模块
declare module "virtual:svg-icons-register" {
	const content: any
	export default content
}

declare module "virtual:unocss-devtools" {
	const content: any
	export default content
}

declare global {
	interface MenuItem {
		title: string
		path?: string
		icon?: string
		children?: MenuItem[]
	}
}

export {}
