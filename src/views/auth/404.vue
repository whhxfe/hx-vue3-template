<template>
	<div class="page">
		<h1>404 Not Found</h1>
		<el-button type="text" @click="goHome">back home</el-button>
	</div>
</template>

<script setup lang="ts">
// import { useSysStore } from "@/store"

// const sysStore = useSysStore()
const path = SYS_CONFIG.HOME_URL
const goHome = () => {
	window.location.href = path
}
</script>

<style lang="scss" scoped>
.page {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}
</style>
