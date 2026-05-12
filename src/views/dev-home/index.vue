<template>
	<div class="page">
		<div class="panel">
			<!-- Admin 后台管理 -->
			<section class="section">
				<h2 class="section__title">Admin 后台管理</h2>
				<div class="card-grid">
					<template v-for="item in adminMenu" :key="item.path">
						<router-link :to="item.path" class="card card--admin">
							<div class="card__title">{{ item.title }}</div>
							<div class="card__path">{{ item.path }}</div>
						</router-link>
					</template>
				</div>
			</section>

			<!-- 可用模块 -->
			<section class="section">
				<h2 class="section__title">可用模块</h2>
				<div class="card-grid">
					<template v-for="item in moduleMenu" :key="item.path">
						<router-link :to="item.path" class="card">
							<div class="card__title">{{ item.title }}</div>
							<div class="card__path">{{ item.path }}</div>
						</router-link>
					</template>
				</div>
			</section>

			<!-- 基础页面 -->
			<section class="section">
				<h2 class="section__title">基础页面</h2>
				<div class="card-grid">
					<template v-for="item in basicMenu" :key="item.path">
						<router-link :to="item.path" class="card">
							<div class="card__title">{{ item.title }}</div>
							<div class="card__path">{{ item.path }}</div>
						</router-link>
					</template>
				</div>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { storeToRefs } from "pinia"
import { useSysStore } from "@/store"

interface MenuItem {
	title: string
	path: string
}

const sysStore = useSysStore()
const { token, authorizedModules } = storeToRefs(sysStore)

const basicMenu: MenuItem[] = [
	{ title: "login", path: "/login" },
	{ title: "home", path: "/" },
	{ title: "profile", path: "/profile" },
	{ title: "404", path: "/404" },
	{ title: "403", path: "/403" },
]

// Admin 后台管理菜单（固定显示）
const adminMenu: MenuItem[] = [
	{ title: "用户中心", path: "/admin/ucenter" },
	{ title: "系统配置", path: "/admin/sysconfig" },
	{ title: "系统日志", path: "/admin/syslog" },
	{ title: "数据字典", path: "/admin/dict" },
	{ title: "通知公告", path: "/admin/notice" },
]

const moduleMap: Record<string, MenuItem> = {
	_templates: { title: "templates", path: "/templates" },
	zddxgk: { title: "zddxgk", path: "/zddxgk" },
}

const moduleMenu = computed<MenuItem[]>(() => {
	const result: MenuItem[] = []
	for (const key of authorizedModules.value) {
		const item = moduleMap[key]
		if (item) {
			result.push(item)
		}
	}

	// 有 token 但没有任何模块匹配时，展示全部模块作为示例
	if (result.length === 0 && token.value) {
		return Object.values(moduleMap)
	}
	return result
})
</script>

<style lang="scss" scoped>
.section {
	margin-top: 16px;

	&__title {
		font-size: 18px;
		font-weight: 700;
		margin-bottom: 8px;
		color: var(--el-text-color-primary);
	}
}

.card-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16px;
}

.card {
	display: block;
	padding: 16px;
	border: 1px solid var(--el-border-color-light);
	border-radius: 8px;
	text-decoration: none;
	transition: background-color 0.2s, border-color 0.2s;

	&:hover {
		background-color: var(--el-fill-color-light);
		border-color: var(--el-color-primary-light-5);
	}

	&--admin {
		border-left: 3px solid var(--el-color-success);
	}

	&__title {
		font-weight: 500;
		color: var(--el-text-color-primary);
	}

	&__path {
		font-size: 14px;
		color: var(--el-text-color-secondary);
		margin-top: 4px;
	}
}
</style>