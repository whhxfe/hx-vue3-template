<template>
	<HxLayout title="审计管理中心" :menu="menuConfig">
		<router-view />
	</HxLayout>
</template>

<script setup lang="ts">
import { HxLayout } from "@/hx-components"
import { menuConfig } from "./config"
</script>
