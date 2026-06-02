<template>
	<div class="page">
		<h1>404 Not Found</h1>
		<p v-if="fromPath" class="info">原始路径: {{ fromPath }}</p>
		<p v-if="loading" class="loading">正在恢复认证...</p>
		<template v-else>
			<p v-if="error" class="error">{{ error }}</p>
			<el-button type="text" @click="goHome">back home</el-button>
		</template>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import * as authApi from "@/api/auth"
import { setupDynamicRoutes } from "@/router"

const route = useRoute()

const fromPath = ref<string | undefined>(route.query.__from as string | undefined)
const loading = ref(false)
const error = ref<string | undefined>()

onMounted(async () => {
	// 从 sessionStorage 获取 token
	const token = sessionStorage.getItem("auth_token")
	if (!token || !fromPath.value) return

	loading.value = true
	try {
		// 如果 sessionStorage 中没有 user_info，先获取用户信息
		const cachedUserInfo = sessionStorage.getItem("user_info")
		let userInfo = cachedUserInfo ? JSON.parse(cachedUserInfo) : null

		if (!userInfo) {
			const res = await authApi.getUserInfo({ token })
			if (res.state === 2000 && res.data) {
				userInfo = res.data
				sessionStorage.setItem("user_info", JSON.stringify(userInfo))
			} else {
				error.value = "认证失败，请重新登录"
				return
			}
		}

		// 注册动态路由
		const modules: string[] = userInfo.modules || []
		const adminModules: string[] = userInfo.adminModules || []
		setupDynamicRoutes(modules, adminModules)

		// 清除 URL 中的 token 和 __from，重新导航到原始路径
		const cleanQuery = Object.fromEntries(
			Object.entries(route.query).filter(([k]) => k !== "token" && k !== "__from")
		)
		const targetUrl = Object.keys(cleanQuery).length > 0
			? `${fromPath.value}?${new URLSearchParams(cleanQuery).toString()}`
			: fromPath.value!

		history.replaceState(null, "", targetUrl)
	} catch (e) {
		console.error("[404] 恢复认证失败:", e)
		error.value = "认证失败，请重新登录"
	} finally {
		loading.value = false
	}
})

const goHome = () => {
	window.location.href = SYS_CONFIG.HOME_URL
}
</script>

<style lang="scss" scoped>
.page {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	gap: 16px;

	.info {
		color: var(--el-text-color-secondary);
		font-size: 14px;
	}

	.loading {
		color: var(--el-color-primary);
		font-size: 14px;
	}

	.error {
		color: var(--el-color-danger);
		font-size: 14px;
	}
}
</style>
