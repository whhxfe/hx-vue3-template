/**
 * _templates 模块文字配置
 *
 * 用于配置页面中展示的文字信息，便于统一管理和保密配置
 */
export default {
	// ========== 通用 ==========
	common: {
		confirm: '确认',
		cancel: '取消',
		save: '保存',
		delete: '删除',
		edit: '编辑',
		add: '新增',
		search: '搜索',
		reset: '重置',
		export: '导出',
		view: '查看',
		viewAll: '查看全部',
		submit: '提交',
		all: '全部',
		enabled: '启用',
		disabled: '禁用',
		loading: '加载中...',
		noData: '暂无数据',
		success: '操作成功',
		error: '操作失败',
		warning: '警告',
		yes: '是',
		no: '否',
		ok: '确定',
		back: '返回',
		close: '关闭',
		tip: '提示',
		deleteConfirm: '确定要删除「{name}」吗？',
		trend: '较上周',
		week: '本周',
		month: '本月',
		year: '本年',
		person: '人',
		yuan: '元'
	},

	// ========== Dashboard 仪表盘 ==========
	dashboard: {
		title: '仪表盘',
		monthlySales: '月度销售额统计',
		salesCategory: '销售分类占比',
		annualTrend: '年度销售趋势',
		latestOrders: '最新订单',
		exportData: '导出数据',
		orderNo: '订单编号',
		productName: '商品名称',
		orderAmount: '订单金额',
		orderStatus: '订单状态',
		orderTime: '下单时间',
		action: '操作',
		view: '查看',
		export: '导出',
		selectCategory: '选择分类',
		selectYear: '选择年份',
		statusPending: '待处理',
		statusProcessing: '处理中',
		statusCompleted: '已完成',
		statusCancelled: '已取消',
		categoryAll: '全部',
		categoryElectronic: '电子产品',
		categoryOffice: '办公用品',
		categoryDaily: '生活用品'
	},

	// ========== Analytics 数据分析 ==========
	analytics: {
		title: '数据分析',
		totalVisits: '总访问量',
		activeUsers: '活跃用户',
		totalOrders: '总订单数',
		totalSales: '总销售额',
		trendAnalysis: '趋势分析',
		categoryStats: '分类统计',
		distribution: '占比分布'
	},

	// ========== Approval 审批流程 ==========
	approval: {
		title: '审批流程',
		submitApplication: '提交申请',
		approve: '通过',
		reject: '驳回',
		viewDetail: '查看详情',
		pending: '待审批',
		approved: '已通过',
		rejected: '已驳回',
		leave: '请假',
		overtime: '加班',
		reimburse: '报销',
		purchase: '采购',
		submitApplicationAction: '提交申请',
		approvedAction: '审批通过',
		rejectedAction: '审批驳回',
		applicant: '申请人',
		department: '部门',
		type: '类型',
		days: '天数',
		amount: '金额',
		remark: '备注',
		applyTime: '申请时间',
		approvalHistory: '审批历史',
		approvalOpinion: '审批意见',
		applicationTitle: '申请标题',
		applicationType: '申请类型',
		placeholder: {
			title: '请输入申请标题',
			type: '请选择类型',
			opinion: '请输入审批意见（选填）'
		},
		confirmApprove: '通过审批',
		confirmReject: '驳回申请',
		daysUnit: '天'
	},

	// ========== DataManagement 数据管理 ==========
	dataManagement: {
		title: '数据管理',
		addData: '新增数据',
		editData: '编辑数据',
		searchPlaceholder: '搜索名称、编码...',
		categoryFilter: '分类筛选',
		statusFilter: '状态筛选',
		id: 'ID',
		name: '名称',
		code: '编码',
		category: '分类',
		status: '状态',
		createTime: '创建时间',
		description: '描述',
		action: '操作',
		categoryDataSource: '数据源',
		categoryConfig: '配置项',
		categoryRuleTemplate: '规则模板',
		deleteSuccess: '删除成功',
		updateSuccess: '更新成功',
		addSuccess: '新增成功',
		placeholder: {
			name: '请输入名称',
			code: '请输入编码',
			category: '请选择分类',
			status: '请选择状态',
			description: '请输入描述'
		}
	},

	// ========== Settings 系统设置 ==========
	settings: {
		title: '系统设置',
		saveSettings: '保存设置',
		basicSettings: '基础设置',
		notificationSettings: '通知设置',
		securitySettings: '安全设置',
		appearanceSettings: '外观设置',
		siteName: '网站名称',
		siteLogo: '网站Logo',
		defaultLanguage: '默认语言',
		emailNotification: '邮件通知',
		smsNotification: '短信通知',
		notifyEmail: '通知邮箱',
		passwordExpireDays: '密码过期天数',
		loginRetryLimit: '登录重试限制',
		sessionTimeout: '会话超时时间',
		theme: '主题模式',
		compactMode: '紧凑模式',
		sidebarCollapsed: '默认收起侧边栏',
		resetSuccess: '已重置所有修改',
		saveSuccess: '保存成功',
		modified: '已修改',
		placeholder: {
			siteName: '请输入网站名称',
			siteLogo: '请输入Logo URL',
			notifyEmail: '请输入通知邮箱'
		},
		description: {
			siteName: '显示在浏览器标签页和系统标题',
			siteLogo: '系统顶部显示的Logo',
			defaultLanguage: '系统默认使用的语言',
			emailNotification: '开启后系统事件会发送邮件通知',
			smsNotification: '开启后重要事件会发送短信通知',
			notifyEmail: '接收通知的邮箱地址',
			passwordExpireDays: '密码多少天后需要强制更换，0表示不限制',
			loginRetryLimit: '连续登录失败多少次后锁定账号',
			sessionTimeout: '无操作多久后自动退出登录',
			theme: '系统的显示主题',
			compactMode: '开启后界面元素间距会更紧凑',
			sidebarCollapsed: '刷新页面后侧边栏默认收起状态'
		},
		languageOptions: {
			zhCN: '简体中文',
			enUS: 'English'
		},
		timeoutOptions: {
			minutes15: '15分钟',
			minutes30: '30分钟',
			hour1: '1小时',
			hours2: '2小时',
			never: '永不超时'
		},
		themeOptions: {
			light: '浅色模式',
			dark: '深色模式',
			auto: '跟随系统'
		}
	},

	// ========== 菜单 ==========
	menu: {
		templates: '模板中心',
		dashboard: '仪表盘',
		dataManagement: '数据管理',
		approval: '审批流程',
		settings: '系统设置',
		analytics: '数据分析',
		screen: '数据大屏'
	},

	// ========== 路由 meta ==========
	route: {
		templates: '模板中心',
		dashboard: '仪表盘',
		dataManagement: '数据管理',
		approval: '审批流程',
		settings: '系统设置',
		analytics: '数据分析',
		screen: '数据大屏'
	},

	module:{
		title:'模板中心',
		name:'template'
	}
}
