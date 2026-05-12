/**
 * zddxgk 模块文字配置类型定义
 * 用于保证 A/B 两套配置的字段结构一致性
 */

export interface CommonText {
	confirm: string
	cancel: string
	save: string
	delete: string
	edit: string
	add: string
	search: string
	reset: string
	export: string
	view: string
	submit: string
	all: string
	enabled: string
	disabled: string
	loading: string
	noData: string
	success: string
	error: string
	warning: string
	yes: string
	no: string
	ok: string
	back: string
	close: string
	tip: string
	deleteConfirm: string
	status: string
	createTime: string
	description: string
	action: string
}

export interface RrgkText {
	title: string
	businessManagement: string
	relationOrgan: string
	name: string
	code: string
	type: string
	typeAll: string
	type1: string
	type2: string
	type3: string
	statusActive: string
	statusInactive: string
	createTime: string
	tableView: string
	cardView: string
	searchPlaceholder: string
	resetConfirm: string
}

export interface RryjText {
	title: string
}

export interface RrstText {
	title: string
}

export interface MbqtjcText {
	title: string
}

export interface MbdyjcText {
	title: string
}

export interface MbmxglText {
	title: string
}

export interface MenuText {
	rrgk: string
	rryj: string
	rrst: string
	mbqtjc: string
	mbdyjc: string
	mbmxgl: string
}

export interface RouteText {
	zddxgk: string
	rrgk: string
	rryj: string
	rrst: string
	mbqtjc: string
	mbdyjc: string
	mbmxgl: string
}

export interface ModuleText {
	title: string
	name: string
}

export interface TextConfig {
	common: CommonText
	rrgk: RrgkText
	rryj: RryjText
	rrst: RrstText
	mbqtjc: MbqtjcText
	mbdyjc: MbdyjcText
	mbmxgl: MbmxglText
	menu: MenuText
	route: RouteText
	module: ModuleText
}

export type TextAlias = 'a' | 'b'
