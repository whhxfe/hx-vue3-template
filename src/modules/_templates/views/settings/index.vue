<template>
	<div class="settings-page">
		<div class="header">
			<h2>系统设置</h2>
			<el-button v-if="hasChanges" type="warning" @click="handleReset">
				<el-icon><RefreshRight /></el-icon>
				重置
			</el-button>
			<el-button type="primary" :disabled="!hasChanges" @click="handleSave">
				<el-icon><Check /></el-icon>
				保存设置
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
						@click="handleGroupChange(group.id)"
					>
						<el-icon v-if="group.icon"><component :is="group.icon" /></el-icon>
						<span class="group-name">{{ group.name }}</span>
					</div>
				</div>
			</el-aside>

			<!-- 右侧配置内容 -->
			<el-main class="settings-main">
				<div class="current-group">
					<div class="group-header">
						<h3>{{ currentGroup?.name }}</h3>
						<span v-if="currentGroup?.description" class="group-desc">{{ currentGroup.description }}</span>
					</div>

					<div class="config-list">
						<el-form label-position="top" @submit.prevent>
							<template v-for="item in currentGroupItems" :key="item.id">
								<el-form-item :label="item.label">
									<template #label>
										<div class="form-item-label">
											<span>{{ item.label }}</span>
											<el-tag
												v-if="modifiedItems.has(item.key)"
												type="warning"
												size="small"
												class="modified-tag"
											>
												已修改
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
										:placeholder="item.placeholder"
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
											v-for="option in item.options"
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
										:placeholder="item.placeholder"
										@input="handleValueChange(item.key, item.value)"
									/>

									<div v-if="item.description" class="item-description">
										{{ item.description }}
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

const handleGroupChange = (groupId: string) => {
	setActiveGroup(groupId)
}

const handleValueChange = (key: string, value: ConfigItem['value']) => {
	updateItemValue(key, value)
}

const handleReset = () => {
	resetChanges()
	// 重新初始化数据以恢复原始值
	initMockData()
	ElMessage.success('已重置所有修改')
}

const handleSave = () => {
	const modifiedConfigs = getModifiedConfigs()
	console.log('保存配置:', modifiedConfigs)
	// 实际项目中这里调用 API
	ElMessage.success('保存成功')
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
