<template>
	<AppLayout :title="title" :menu="menuConfig">
		<router-view />
	</AppLayout>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { AppLayout } from "@/components"
import { menuConfig,  } from "./config"

const title = ref('ktc')
</script>

<style lang="scss" scoped>

</style>
