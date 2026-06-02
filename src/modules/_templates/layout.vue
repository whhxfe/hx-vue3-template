<template>
	<HxLayout title="模板中心" :menu="menuConfig">
		<router-view />
	</HxLayout>
</template>

<script setup lang="ts">
import { HxLayout } from "@/hx-components"
import { menuConfig } from "./config"
</script>

<style lang="scss" scoped></style>
