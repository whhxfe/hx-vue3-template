import { ref, computed } from 'vue'
import type { ConfigGroup, ConfigItem } from '../api/settings/types'

// 模拟配置分组
const mockGroups: ConfigGroup[] = [
	{ id: 'basic', name: '基础设置', key: 'basic', description: '系统基础配置' },
	{ id: 'notification', name: '通知设置', key: 'notification', description: '消息通知配置' },
	{ id: 'security', name: '安全设置', key: 'security', description: '安全相关配置' },
	{ id: 'appearance', name: '外观设置', key: 'appearance', description: '界面显示配置' }
]

// 模拟配置项
const mockConfigItems: ConfigItem[] = [
	// 基础设置
	{
		id: 'site-name',
		groupId: 'basic',
		key: 'site_name',
		label: '网站名称',
		type: 'input',
		value: '业务管理系统',
		placeholder: '请输入网站名称',
		description: '显示在浏览器标签页和系统标题'
	},
	{
		id: 'site-logo',
		groupId: 'basic',
		key: 'site_logo',
		label: '网站Logo',
		type: 'input',
		value: '/logo.png',
		placeholder: '请输入Logo URL',
		description: '系统顶部显示的Logo'
	},
	{
		id: 'default-lang',
		groupId: 'basic',
		key: 'default_language',
		label: '默认语言',
		type: 'select',
		value: 'zh-CN',
		options: [
			{ label: '简体中文', value: 'zh-CN' },
			{ label: 'English', value: 'en-US' }
		],
		description: '系统默认使用的语言'
	},
	// 通知设置
	{
		id: 'email-notify',
		groupId: 'notification',
		key: 'email_notification',
		label: '邮件通知',
		type: 'switch',
		value: true,
		description: '开启后系统事件会发送邮件通知'
	},
	{
		id: 'sms-notify',
		groupId: 'notification',
		key: 'sms_notification',
		label: '短信通知',
		type: 'switch',
		value: false,
		description: '开启后重要事件会发送短信通知'
	},
	{
		id: 'notify-email',
		groupId: 'notification',
		key: 'notify_email',
		label: '通知邮箱',
		type: 'input',
		value: 'admin@example.com',
		placeholder: '请输入通知邮箱',
		description: '接收通知的邮箱地址'
	},
	// 安全设置
	{
		id: 'pwd-expire',
		groupId: 'security',
		key: 'password_expire_days',
		label: '密码过期天数',
		type: 'number',
		value: 90,
		description: '密码多少天后需要强制更换，0表示不限制'
	},
	{
		id: 'login-retry',
		groupId: 'security',
		key: 'login_retry_limit',
		label: '登录重试限制',
		type: 'number',
		value: 5,
		description: '连续登录失败多少次后锁定账号'
	},
	{
		id: 'session-timeout',
		groupId: 'security',
		key: 'session_timeout',
		label: '会话超时时间',
		type: 'select',
		value: 30,
		options: [
			{ label: '15分钟', value: 15 },
			{ label: '30分钟', value: 30 },
			{ label: '1小时', value: 60 },
			{ label: '2小时', value: 120 },
			{ label: '永不超时', value: 0 }
		],
		description: '无操作多久后自动退出登录'
	},
	// 外观设置
	{
		id: 'theme',
		groupId: 'appearance',
		key: 'theme_mode',
		label: '主题模式',
		type: 'select',
		value: 'light',
		options: [
			{ label: '浅色模式', value: 'light' },
			{ label: '深色模式', value: 'dark' },
			{ label: '跟随系统', value: 'auto' }
		],
		description: '系统的显示主题'
	},
	{
		id: 'compact-mode',
		groupId: 'appearance',
		key: 'compact_mode',
		label: '紧凑模式',
		type: 'switch',
		value: false,
		description: '开启后界面元素间距会更紧凑'
	},
	{
		id: 'sidebar-collapsed',
		groupId: 'appearance',
		key: 'sidebar_collapsed',
		label: '默认收起侧边栏',
		type: 'switch',
		value: false,
		description: '刷新页面后侧边栏默认收起状态'
	}
]

// 模块状态
const groups = ref<ConfigGroup[]>([])
const configItems = ref<ConfigItem[]>([])
const loading = ref(false)
const activeGroupId = ref('basic')
const modifiedItems = ref<Map<string, ConfigItem['value']>>(new Map())

// 计算属性
const currentGroupItems = computed(() => configItems.value.filter(item => item.groupId === activeGroupId.value))
const hasChanges = computed(() => modifiedItems.value.size > 0)

// Actions
const setGroups = (list: ConfigGroup[]) => {
	groups.value = list
}

const setConfigItems = (list: ConfigItem[]) => {
	configItems.value = list
}

const setLoading = (value: boolean) => {
	loading.value = value
}

const setActiveGroup = (groupId: string) => {
	activeGroupId.value = groupId
}

const updateItemValue = (key: string, value: ConfigItem['value']) => {
	const index = configItems.value.findIndex(item => item.key === key)
	if (index !== -1) {
		// 如果值与原始值相同，移除记录
		if (configItems.value[index].value === value) {
			modifiedItems.value.delete(key)
		} else {
			modifiedItems.value.set(key, value)
		}
	}
}

const resetChanges = () => {
	modifiedItems.value.clear()
}

const getModifiedConfigs = (): Record<string, ConfigItem['value']> => {
	const result: Record<string, ConfigItem['value']> = {}
	modifiedItems.value.forEach((value, key) => {
		result[key] = value
	})
	return result
}

// 导出 store
export const useSettingsStore = () => {
	return {
		groups,
		configItems,
		loading,
		activeGroupId,
		modifiedItems,
		currentGroupItems,
		hasChanges,
		setGroups,
		setConfigItems,
		setLoading,
		setActiveGroup,
		updateItemValue,
		resetChanges,
		getModifiedConfigs,
		// 模拟初始化数据
		initMockData: () => {
			groups.value = [...mockGroups]
			configItems.value = [...mockConfigItems]
		}
	}
}

export type SettingsStore = ReturnType<typeof useSettingsStore>
