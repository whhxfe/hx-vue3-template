<template>
	<AppLayout title="审计管理中心" :menu="menuConfig">
		<router-view />
	</AppLayout>
</template>

<script setup lang="ts">
import { AppLayout } from "@/components"
import { menuConfig } from "./config"
</script>
