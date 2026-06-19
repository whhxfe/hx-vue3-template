<template>
	<AppLayout :title="title" :menu="menuConfig">
		<router-view />
	</AppLayout>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { AppLayout } from "@/components"
import { menuConfig, useTextAlias } from "./config"
const text = useTextAlias()
const title = ref(text.module.title)
</script>

<style lang="scss" scoped>

</style>
