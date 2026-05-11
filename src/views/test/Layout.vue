<template>
	<HxLayout title="组件测试页" :menu="menu">
		<router-view />
	</HxLayout>
</template>

<script setup lang="ts">
import menu from "./menu.config.ts"
import { HxLayout } from "@/hx-components"
</script>

<style lang="scss"></style>
