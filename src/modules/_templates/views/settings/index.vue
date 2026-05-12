<template>
	<div class="settings-page">
		<div class="header">
			<h2>{{ text.settings.title }}</h2>
			<el-button v-if="hasChanges" type="warning" @click="handleReset">
				<el-icon><RefreshRight /></el-icon>
				{{ text.common.reset }}
			</el-button>
			<el-button type="primary" :disabled="!hasChanges" @click="handleSave">
				<el-icon><Check /></el-icon>
				{{ text.settings.saveSettings }}
			</el-button>
		</div>

		<div v-loading="loading" class="settings-container">
			<!-- 左侧分组导航 -->
			<el-aside width="220px" class="settings-sidebar">
				<div class="group-list">
					<div
						v-for="group in groups"
						:key="group.id"
						class="group-item"
						:class="{ active: activeGroupId === group.id }"
						@click="setActiveGroup(group.id)"
					>
						<el-icon v-if="group.icon"><component :is="group.icon" /></el-icon>
						<span class="group-name">{{ getGroupName(group.id) }}</span>
					</div>
				</div>
			</el-aside>

			<!-- 右侧配置内容 -->
			<el-main class="settings-main">
				<div class="current-group">
					<div class="group-header">
						<h3>{{ getGroupName(activeGroupId) }}</h3>
						<span v-if="getGroupDescription(activeGroupId)" class="group-desc">{{ getGroupDescription(activeGroupId) }}</span>
					</div>

					<div class="config-list">
						<el-form label-position="top" @submit.prevent>
							<template v-for="item in currentGroupItems" :key="item.id">
								<el-form-item :label="getConfigLabel(item)">
									<template #label>
										<div class="form-item-label">
											<span>{{ getConfigLabel(item) }}</span>
											<el-tag
												v-if="modifiedItems.has(item.key)"
												type="warning"
												size="small"
												class="modified-tag"
											>
												{{ text.settings.modified }}
											</el-tag>
										</div>
									</template>

									<!-- 开关类型 -->
									<el-switch
										v-if="item.type === 'switch'"
										v-model="item.value"
										:active-value="true"
										:inactive-value="false"
										@change="handleValueChange(item.key, item.value)"
									/>

									<!-- 输入框类型 -->
									<el-input
										v-else-if="item.type === 'input'"
										v-model="item.value"
										:placeholder="getConfigPlaceholder(item)"
										@input="handleValueChange(item.key, item.value)"
									/>

									<!-- 数字输入框类型 -->
									<el-input-number
										v-else-if="item.type === 'number'"
										v-model="item.value"
										:min="0"
										@change="handleValueChange(item.key, item.value)"
									/>

									<!-- 下拉选择类型 -->
									<el-select
										v-else-if="item.type === 'select'"
										v-model="item.value"
										style="width: 100%"
										@change="handleValueChange(item.key, item.value)"
									>
										<el-option
											v-for="option in getConfigOptions(item)"
											:key="option.value"
											:label="option.label"
											:value="option.value"
										/>
									</el-select>

									<!-- 文本域类型 -->
									<el-input
										v-else-if="item.type === 'textarea'"
										v-model="item.value"
										type="textarea"
										:rows="3"
										:placeholder="getConfigPlaceholder(item)"
										@input="handleValueChange(item.key, item.value)"
									/>

									<div v-if="getConfigDescription(item)" class="item-description">
										{{ getConfigDescription(item) }}
									</div>
								</el-form-item>
							</template>
						</el-form>
					</div>
				</div>
			</el-main>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Check, RefreshRight } from '@element-plus/icons-vue'
import { useSettingsStore } from '../../store/settings'
import type { ConfigItem } from '../../api/settings/types'
import { useTextAlias } from '@/modules/_templates/config'

const text = useTextAlias()

const {
	groups,
	configItems,
	loading,
	activeGroupId,
	modifiedItems,
	currentGroupItems,
	hasChanges,
	setActiveGroup,
	updateItemValue,
	resetChanges,
	getModifiedConfigs,
	initMockData
} = useSettingsStore()

const currentGroup = computed(() => groups.value.find(g => g.id === activeGroupId.value))

// 获取分组名称（翻译）
const getGroupName = (groupId: string) => {
	const groupMap: Record<string, string> = {
		basic: text.settings.basicSettings,
		notification: text.settings.notificationSettings,
		security: text.settings.securitySettings,
		appearance: text.settings.appearanceSettings
	}
	return groupMap[groupId] || groupId
}

// 获取分组描述（翻译）
const getGroupDescription = (groupId: string) => {
	const descMap: Record<string, string> = {
		basic: text.settings.description.siteName,
		notification: text.settings.description.emailNotification,
		security: text.settings.description.passwordExpireDays,
		appearance: text.settings.description.theme
	}
	return descMap[groupId] || ''
}

// 获取配置项标签（翻译）
const getConfigLabel = (item: ConfigItem) => {
	const labelMap: Record<string, string> = {
		'site-name': text.settings.siteName,
		'site-logo': text.settings.siteLogo,
		'default-lang': text.settings.defaultLanguage,
		'email-notify': text.settings.emailNotification,
		'sms-notify': text.settings.smsNotification,
		'notify-email': text.settings.notifyEmail,
		'pwd-expire': text.settings.passwordExpireDays,
		'login-retry': text.settings.loginRetryLimit,
		'session-timeout': text.settings.sessionTimeout,
		'theme': text.settings.theme,
		'compact-mode': text.settings.compactMode,
		'sidebar-collapsed': text.settings.sidebarCollapsed
	}
	return labelMap[item.id] || item.label
}

// 获取配置项 placeholder（翻译）
const getConfigPlaceholder = (item: ConfigItem) => {
	const placeholderMap: Record<string, string> = {
		'site-name': text.settings.placeholder.siteName,
		'site-logo': text.settings.placeholder.siteLogo,
		'notify-email': text.settings.placeholder.notifyEmail
	}
	return placeholderMap[item.id] || ''
}

// 获取配置项描述（翻译）
const getConfigDescription = (item: ConfigItem) => {
	const descMap: Record<string, string> = {
		'site-name': text.settings.description.siteName,
		'site-logo': text.settings.description.siteLogo,
		'default-lang': text.settings.description.defaultLanguage,
		'email-notify': text.settings.description.emailNotification,
		'sms-notify': text.settings.description.smsNotification,
		'notify-email': text.settings.description.notifyEmail,
		'pwd-expire': text.settings.description.passwordExpireDays,
		'login-retry': text.settings.description.loginRetryLimit,
		'session-timeout': text.settings.description.sessionTimeout,
		'theme': text.settings.description.theme,
		'compact-mode': text.settings.description.compactMode,
		'sidebar-collapsed': text.settings.description.sidebarCollapsed
	}
	return descMap[item.id] || ''
}

// 获取配置项选项（翻译）
const getConfigOptions = (item: ConfigItem) => {
	if (!item.options) return []

	return item.options.map(opt => {
		// 语言选项
		if (item.id === 'default-lang') {
			const labelMap: Record<string, string> = {
				'zh-CN': text.settings.languageOptions.zhCN,
				'en-US': text.settings.languageOptions.enUS
			}
			return { ...opt, label: labelMap[opt.value as string] || opt.label }
		}

		// 超时选项
		if (item.id === 'session-timeout') {
			const labelMap: Record<string, string> = {
				15: text.settings.timeoutOptions.minutes15,
				30: text.settings.timeoutOptions.minutes30,
				60: text.settings.timeoutOptions.hour1,
				120: text.settings.timeoutOptions.hours2,
				0: text.settings.timeoutOptions.never
			}
			return { ...opt, label: labelMap[opt.value as number] || opt.label }
		}

		// 主题选项
		if (item.id === 'theme') {
			const labelMap: Record<string, string> = {
				light: text.settings.themeOptions.light,
				dark: text.settings.themeOptions.dark,
				auto: text.settings.themeOptions.auto
			}
			return { ...opt, label: labelMap[opt.value as string] || opt.label }
		}

		return opt
	})
}

const handleValueChange = (key: string, value: ConfigItem['value']) => {
	updateItemValue(key, value)
}

const handleReset = () => {
	resetChanges()
	// 重新初始化数据以恢复原始值
	initMockData()
	ElMessage.success(text.settings.resetSuccess)
}

const handleSave = () => {
	const modifiedConfigs = getModifiedConfigs()
	console.log('保存配置:', modifiedConfigs)
	// 实际项目中这里调用 API
	ElMessage.success(text.settings.saveSuccess)
	resetChanges()
}

onMounted(() => {
	initMockData()
})
</script>

<style lang="scss" scoped>
.settings-page {
	padding: 20px;
	height: 100%;

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;

		h2 {
			margin: 0;
			font-size: 18px;
			font-weight: 600;
		}
	}

	.settings-container {
		display: flex;
		height: calc(100vh - 140px);
		background: #fff;
		border-radius: 8px;
		overflow: hidden;
	}

	.settings-sidebar {
		background: #fafafa;
		border-right: 1px solid #ebeef5;
		padding: 16px 0;

		.group-list {
			.group-item {
				display: flex;
				align-items: center;
				padding: 12px 20px;
				cursor: pointer;
				transition: all 0.3s;
				color: #606266;

				&:hover {
					background: #ecf5ff;
					color: #409eff;
				}

				&.active {
					background: #409eff;
					color: #fff;

					&::before {
						content: '';
						position: absolute;
						left: 0;
						width: 4px;
						height: 100%;
						background: #fff;
					}
				}

				.el-icon {
					margin-right: 8px;
					font-size: 18px;
				}

				.group-name {
					font-size: 14px;
				}
			}
		}
	}

	.settings-main {
		padding: 24px;
		overflow-y: auto;

		.current-group {
			max-width: 700px;

			.group-header {
				margin-bottom: 24px;

				h3 {
					margin: 0 0 8px;
					font-size: 18px;
					font-weight: 600;
				}

				.group-desc {
					font-size: 13px;
					color: #909399;
				}
			}

			.config-list {
				.el-form-item {
					margin-bottom: 24px;
					padding-bottom: 24px;
					border-bottom: 1px solid #ebeef5;

					&:last-child {
						border-bottom: none;
					}
				}

				.form-item-label {
					display: flex;
					align-items: center;
					gap: 8px;

					.modified-tag {
						font-size: 11px;
					}
				}

				.item-description {
					margin-top: 8px;
					font-size: 12px;
					color: #909399;
					line-height: 1.5;
				}
			}
		}
	}
}
</style>
