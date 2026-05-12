<template>
	<HxLayout :title="title" :menu="menuConfig">
		<router-view />
	</HxLayout>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { HxLayout } from "@/hx-components"
import { menuConfig, useTextAlias } from "./config"
const text = useTextAlias()
const title = ref(text.module.title)
</script>

<style lang="scss" scoped></style>
