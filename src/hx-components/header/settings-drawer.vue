<template>
	<el-drawer v-model="visible" title="偏好设置" direction="rtl" size="360px">
		<div class="settings-content">
			<div class="settings-section">
				<div class="settings-section__title">主题</div>
				<div class="settings-section__content">
					<div class="theme-options">
						<div
							v-for="theme in themeOptions"
							:key="theme.value"
							class="theme-option"
							:class="{ active: currentTheme === theme.value }"
							@click="setTheme(theme.value)"
						>
							<div class="theme-option__preview" :style="{ background: theme.preview }"></div>
							<div class="theme-option__label">{{ theme.label }}</div>
						</div>
					</div>
				</div>
			</div>

			<div class="settings-section">
				<div class="settings-section__title">导航布局</div>
				<div class="settings-section__content">
					<div class="layout-options">
						<div
							v-for="layout in layoutOptions"
							:key="layout.value"
							class="layout-option"
							:class="{ active: preferences.layout === layout.value }"
							@click="setLayout(layout.value)"
						>
							<div class="layout-option__icon">
								<HxIcon :name="layout.icon" />
							</div>
							<div class="layout-option__label">{{ layout.label }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</el-drawer>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { ElMessage } from "element-plus"
import { HxIcon } from "@hx/ui"
import { useSettingsStore } from "@/store"
import { useTheme } from "@/hooks/useTheme"
import { storeToRefs } from "pinia"

interface Props {
	modelValue: boolean
}

interface Emits {
	(e: "update:modelValue", value: boolean): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const settingsStore = useSettingsStore()
const { preferences } = storeToRefs(settingsStore)
const { setTheme: setThemeMode, currentTheme } = useTheme()

const visible = computed({
	get: () => props.modelValue,
	set: (val) => emits("update:modelValue", val)
})

const themeOptions = [
	{ label: "默认", value: "default", preview: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
	{ label: "深色", value: "dark", preview: "#1a1a2e" }
]

const layoutOptions = [
	{ label: "侧边导航", value: "vertical", icon: "sidebar" },
	{ label: "顶部导航", value: "horizontal", icon: "menu" }
]

const setTheme = (theme: string) => {
	setThemeMode(theme)
	ElMessage.success(`主题已切换为: ${themeOptions.find((t) => t.value === theme)?.label}`)
}

const setLayout = (layout: string) => {
	settingsStore.setLayout(layout)
	ElMessage.success(`布局已切换为: ${layoutOptions.find((l) => l.value === layout)?.label}`)
}
</script>

<style lang="scss" scoped>
.settings-content {
	padding: 0 4px;
}

.settings-section {
	margin-bottom: 24px;

	&__title {
		font-size: 14px;
		font-weight: 600;
		color: var(--el-text-color-primary);
		margin-bottom: 12px;
		padding-left: 8px;
		border-left: 3px solid var(--el-color-primary);
	}

	&__content {
		padding: 0 8px;
	}
}

.theme-options {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 12px;
}

.theme-option {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 12px;
	border-radius: 8px;
	border: 2px solid transparent;
	cursor: pointer;
	transition: all 0.2s;

	&:hover {
		background-color: var(--el-fill-color-light);
	}

	&.active {
		border-color: var(--el-color-primary);
		background-color: var(--el-color-primary-light-9);
	}

	&__preview {
		width: 48px;
		height: 32px;
		border-radius: 4px;
		margin-bottom: 8px;
	}

	&__label {
		font-size: 12px;
		color: var(--el-text-color-regular);
	}
}

.layout-options {
	display: flex;
	gap: 12px;
}

.layout-option {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 16px;
	border-radius: 8px;
	border: 2px solid var(--el-border-color);
	cursor: pointer;
	transition: all 0.2s;

	&:hover {
		border-color: var(--el-color-primary-light-5);
	}

	&.active {
		border-color: var(--el-color-primary);
		background-color: var(--el-color-primary-light-9);
	}

	&__icon {
		font-size: 24px;
		margin-bottom: 8px;
		color: var(--el-text-color-regular);
	}

	&__label {
		font-size: 12px;
		color: var(--el-text-color-regular);
	}
}
</style>