<template>
	<div class="profile-page">
		<div class="profile-page__content">
			<!-- 头部 -->
			<el-card shadow="never" class="profile-header">
				<div class="profile-header__inner">
					<HxIcon type="iconify" name="lucide:user-circle" size="72" class="profile-header__avatar" />
					<div class="profile-header__info">
						<h2 class="profile-header__name">{{ userInfo?.accountName || "未登录" }}</h2>
						<p class="profile-header__memo">{{ userInfo?.accountMemo || "无备注信息" }}</p>
						<div class="profile-header__tags">
							<el-tag size="small">{{ userInfo?.roleName }}</el-tag>
							<el-tag size="small" type="warning">{{ userInfo?.roleLevel }}</el-tag>
						</div>
					</div>
				</div>
			</el-card>

			<!-- 操作栏 -->
			<div class="profile-actions">
				<el-button :icon="Refresh" :loading="refreshing" @click="handleRefresh">刷新信息</el-button>
			</div>

			<!-- 详细信息 -->
			<el-card shadow="never" class="profile-detail">
				<template #header>
					<span class="profile-detail__title">基本信息</span>
				</template>

				<el-descriptions :column="1" border>
					<el-descriptions-item label="账号ID">
						{{ userInfo?.accountId || "-" }}
					</el-descriptions-item>
					<el-descriptions-item label="账号名称">
						{{ userInfo?.accountName || "-" }}
					</el-descriptions-item>
					<el-descriptions-item label="账号备注">
						{{ userInfo?.accountMemo || "-" }}
					</el-descriptions-item>
					<el-descriptions-item label="角色名称">
						<el-tag size="small">{{ userInfo?.roleName || "-" }}</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="角色级别">
						<el-tag size="small" type="warning">{{ userInfo?.roleLevel || "-" }}</el-tag>
					</el-descriptions-item>
					<el-descriptions-item v-if="modules.length" label="模块权限">
						<div class="modules-tags">
							<el-tag v-for="m in modules" :key="m" size="small" type="info">{{ m }}</el-tag>
						</div>
					</el-descriptions-item>
				</el-descriptions>
			</el-card>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { ElMessage } from "element-plus"
import { Refresh } from "@element-plus/icons-vue"
import { useSysStore } from "@/store"
import { storeToRefs } from "pinia"
import * as authApi from "@/api/auth"

const sysStore = useSysStore()
const { userInfo } = storeToRefs(sysStore)
const refreshing = ref(false)

const modules = computed(() => userInfo.value?.modules || [])

const handleRefresh = async () => {
	refreshing.value = true
	try {
		const res = await authApi.getUserInfo({ token: sysStore.token! })
		if (res.state === 2000) {
			sysStore.setUserInfo(res.data)
			ElMessage.success("用户信息已更新")
		} else {
			ElMessage.warning(res.message || "刷新失败")
		}
	} catch (e) {
		ElMessage.error("网络异常，刷新失败")
	} finally {
		refreshing.value = false
	}
}
</script>

<style lang="scss" scoped>
.profile-page {
	min-height: 100%;
	background: var(--el-bg-color-page);
	padding: 24px;

	&__content {
		max-width: 680px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
}

/* ---- 头部卡片 ---- */
.profile-header {
	border-radius: 12px;

	:deep(.el-card__body) {
		padding: 0;
	}

	&__inner {
		display: flex;
		align-items: center;
		gap: 24px;
		padding: 32px 28px;
		background: linear-gradient(135deg, var(--el-color-primary-light-9) 0%, var(--el-bg-color) 60%);
		border-radius: 12px;
	}

	&__avatar {
		flex-shrink: 0;
		color: var(--el-color-primary);
		opacity: 0.8;
	}

	&__info {
		flex: 1;
		min-width: 0;
	}

	&__name {
		margin: 0 0 4px;
		font-size: 22px;
		font-weight: 600;
		color: var(--el-text-color-primary);
	}

	&__memo {
		margin: 0 0 10px;
		font-size: 13px;
		color: var(--el-text-color-secondary);
	}

	&__tags {
		display: flex;
		gap: 8px;
	}
}

/* ---- 操作栏 ---- */
.profile-actions {
	display: flex;
	justify-content: flex-end;
}

/* ---- 详细信息 ---- */
.profile-detail {
	border-radius: 12px;

	&__title {
		font-size: 15px;
		font-weight: 600;
		color: var(--el-text-color-primary);
	}
}

.modules-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}
</style>