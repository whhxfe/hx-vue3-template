<template>
	<AppLayout title="组件测试页" :menu="menu">
		<router-view />
	</AppLayout>
</template>

<script setup lang="ts">
import menu from "./menu.config.ts"
import { AppLayout } from "@/components"
</script>

<style lang="scss"></style>
