<template>
	<AppLayout title="模板中心" :menu="menuConfig">
		<router-view />
	</AppLayout>
</template>

<script setup lang="ts">
import { AppLayout } from "@/components"
import { menuConfig } from "./config"
</script>

<style lang="scss" scoped></style>
