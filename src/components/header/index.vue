<template>
	<header class="h-15 flex items-center px-5 app-header">
		<div class="flex shrink-0 items-center gap-4 mr-10">
			<div class="flex items-center gap-4 cursor-pointer" @click="backToHome">
				<img class="w-8 h-8" src="/logo.png" alt="logo" />
				<span class="text-white text-2xl">{{ sysConfig.SYSTEM_NAME }}</span>
			</div>
			<span class="text-white text-xl">|</span>
			<span class="text-white text-lg">{{ title }}</span>
		</div>

		<slot></slot>

		<div class="flex items-center gap-4 ml-auto">
			<ThemeSwitch />

			<el-tooltip content="偏好设置" placement="bottom">
				<div class="cursor-pointer p-1 hover:bg-white/10 rounded transition-colors" @click="openSettings">
					<HxIcon type="iconify" name="lucide:settings" size="20" class="text-white" />
				</div>
			</el-tooltip>

			<el-popover placement="bottom" :width="200" trigger="click">
				<div class="user-panel">
					<div class="user-panel__header">
						<HxIcon type="iconify" name="lucide:user-circle" size="40" class="text-white/80" />
						<div class="user-panel__info">
							<span class="user-panel__name">{{ displayName }}</span>
							<span class="user-panel__account">{{ userInfo?.accountMemo || '' }}</span>
						</div>
					</div>
					<div class="user-panel__divider" />
					<div class="user-panel__item" @click="goProfile">
						<HxIcon type="iconify" name="lucide:user" size="16" />
						<span>个人中心</span>
					</div>
					<div class="user-panel__item user-panel__item--danger" @click="handleLogout">
						<HxIcon type="iconify" name="lucide:log-out" size="16" />
						<span>退出登录</span>
					</div>
				</div>

				<template #reference>
					<div class="cursor-pointer hover:opacity-80 transition-opacity">
						<HxIcon type="iconify" name="lucide:user-circle" size="28" class="text-white" />
					</div>
				</template>
			</el-popover>
		</div>

	</header>
</template>

<script setup lang="ts">
import { computed, inject } from "vue"
import { ElMessage } from "element-plus"
import { useRouter } from "vue-router"
import { useSysStore } from "@/store"
import { storeToRefs } from "pinia"
import * as authApi from "@/api/auth"
import { ThemeSwitch } from "@/components"

interface Props {
	title?: string
}

withDefaults(defineProps<Props>(), {
	title: ""
})

const sysConfig = SYS_CONFIG
const router = useRouter()
const sysStore = useSysStore()
const { token, userInfo } = storeToRefs(sysStore)

const displayName = computed(() => userInfo.value?.accountName || "未登录")

const backToHome = () => {
	window.location.href = sysConfig.HOME_URL
}

const openSettings = inject<() => void>("openSettings", () => {})

const goProfile = () => {
	router.push("/profile")
}

const handleLogout = async () => {
	try {
		if (token.value) {
			await authApi.logout({ token: token.value })
		}
	} catch (error) {
		console.error("退出登录失败:", error)
	} finally {
		sysStore.logout()
		router.replace("/login")
		ElMessage.success("已退出登录")
	}
}
</script>

<style lang="scss" scoped>
.app-header {
	background: var(--bg-header, linear-gradient(90deg, #1a3c61, #141a39));
}

.user-panel {
	min-width: 180px;

	&__header {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 8px 12px;
	}

	&__info {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	&__name {
		font-size: 14px;
		font-weight: 600;
		color: var(--el-text-color-primary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__account {
		font-size: 12px;
		color: var(--el-text-color-secondary);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	&__divider {
		height: 1px;
		background-color: var(--el-border-color-light);
		margin: 4px 0;
	}

	&__item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		font-size: 13px;
		color: var(--el-text-color-regular);
		cursor: pointer;
		transition: background-color 0.15s;

		&:hover {
			background-color: var(--el-fill-color-light);
		}

		&--danger {
			color: var(--el-color-danger);

			&:hover {
				background-color: var(--el-color-danger-light-9);
			}
		}
	}
}
</style>
