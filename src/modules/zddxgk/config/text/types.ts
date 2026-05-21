/**
 * zddxgk 模块文字配置类型定义
 */

export interface ModuleText {
	title: string
	name: string
}

export interface RouteText {
	zddxgk: string
	rygk: string
	ryyj: string
	ryst: string
	mbqtjc: string
	mbdyjc: string
	mbmxgl: string
}

export interface MenuText {
	rygk: string
	ryyj: string
	ryst: string
	mbqtjc: string
	mbdyjc: string
	mbmxgl: string
}

export interface TextConfig {
	module: ModuleText
	route: RouteText
	menu: MenuText
}

export type TextAlias = 'a' | 'b'
