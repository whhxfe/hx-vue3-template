<template>
	<HxLayout title="数据录入管理" :menu="visibleMenu">
		<router-view />
	</HxLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { HxLayout } from "@/hx-components"
import { useSysStore } from '@/store'

const sysStore = useSysStore()

const allMenuItems = [
	{ title: "数据导入", path: "/pbct/import", minRoleLevel: 1 },
	{ title: "数据查询", path: "/pbct/query", minRoleLevel: -1 }
]

const roleLevel = computed(() => Number(sysStore.userInfo?.roleLevel ?? -1))

// 仅展示当前用户有权限访问的菜单
const visibleMenu = computed(() => {
	return allMenuItems.filter(item => roleLevel.value <= item.minRoleLevel || item.minRoleLevel === -1)
})
</script>

<style lang="scss" scoped></style>
