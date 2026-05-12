/**
 * Text 配置类型定义
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
	viewAll: string
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
	trend: string
	week: string
	month: string
	year: string
	person: string
	yuan: string
}

export interface DashboardText {
	title: string
	monthlySales: string
	salesCategory: string
	annualTrend: string
	latestOrders: string
	exportData: string
	orderNo: string
	productName: string
	orderAmount: string
	orderStatus: string
	orderTime: string
	action: string
	view: string
	export: string
	selectCategory: string
	selectYear: string
	statusPending: string
	statusProcessing: string
	statusCompleted: string
	statusCancelled: string
	categoryAll: string
	categoryElectronic: string
	categoryOffice: string
	categoryDaily: string
}

export interface AnalyticsText {
	title: string
	totalVisits: string
	activeUsers: string
	totalOrders: string
	totalSales: string
	trendAnalysis: string
	categoryStats: string
	distribution: string
}

export interface ApprovalText {
	title: string
	submitApplication: string
	approve: string
	reject: string
	viewDetail: string
	pending: string
	approved: string
	rejected: string
	leave: string
	overtime: string
	reimburse: string
	purchase: string
	submitApplicationAction: string
	approvedAction: string
	rejectedAction: string
	applicant: string
	department: string
	type: string
	days: string
	amount: string
	remark: string
	applyTime: string
	approvalHistory: string
	approvalOpinion: string
	applicationTitle: string
	applicationType: string
	placeholder: {
		title: string
		type: string
		opinion: string
	}
	confirmApprove: string
	confirmReject: string
	daysUnit: string
}

export interface DataManagementText {
	title: string
	addData: string
	editData: string
	searchPlaceholder: string
	categoryFilter: string
	statusFilter: string
	id: string
	name: string
	code: string
	category: string
	status: string
	createTime: string
	description: string
	action: string
	categoryDataSource: string
	categoryConfig: string
	categoryRuleTemplate: string
	deleteSuccess: string
	updateSuccess: string
	addSuccess: string
	placeholder: {
		name: string
		code: string
		category: string
		status: string
		description: string
	}
}

export interface SettingsText {
	title: string
	saveSettings: string
	basicSettings: string
	notificationSettings: string
	securitySettings: string
	appearanceSettings: string
	siteName: string
	siteLogo: string
	defaultLanguage: string
	emailNotification: string
	smsNotification: string
	notifyEmail: string
	passwordExpireDays: string
	loginRetryLimit: string
	sessionTimeout: string
	theme: string
	compactMode: string
	sidebarCollapsed: string
	resetSuccess: string
	saveSuccess: string
	modified: string
	placeholder: {
		siteName: string
		siteLogo: string
		notifyEmail: string
	}
	description: {
		siteName: string
		siteLogo: string
		defaultLanguage: string
		emailNotification: string
		smsNotification: string
		notifyEmail: string
		passwordExpireDays: string
		loginRetryLimit: string
		sessionTimeout: string
		theme: string
		compactMode: string
		sidebarCollapsed: string
	}
	languageOptions: {
		zhCN: string
		enUS: string
	}
	timeoutOptions: {
		minutes15: string
		minutes30: string
		hour1: string
		hours2: string
		never: string
	}
	themeOptions: {
		light: string
		dark: string
		auto: string
	}
}

export interface MenuText {
	templates: string
	dashboard: string
	dataManagement: string
	approval: string
	settings: string
	analytics: string
}

export interface RouteText {
	templates: string
	dashboard: string
	dataManagement: string
	approval: string
	settings: string
	analytics: string
}

export interface ModuleText {
	title: string
	name: string
}

export interface TextConfig {
	common: CommonText
	dashboard: DashboardText
	analytics: AnalyticsText
	approval: ApprovalText
	dataManagement: DataManagementText
	settings: SettingsText
	menu: MenuText
	route: RouteText
	module: ModuleText
}

export type TextAlias = 'a' | 'b'
