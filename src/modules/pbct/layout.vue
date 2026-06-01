<template>
	<HxLayout title="数据录入管理" :menu="menuConfig">
		<router-view />
	</HxLayout>
</template>

<script setup lang="ts">
import { HxLayout } from "@/hx-components"

const menuConfig = [
	{ title: "数据导入", path: "/pbct/import" },
	{ title: "数据查询", path: "/pbct/query" }
]
</script>

<style lang="scss" scoped></style>
