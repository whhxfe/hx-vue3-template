<template>
	<div class="panel">
		<h1>UnoCSS 测试页面</h1>

		<div class="m-4 p-4 bg-blue-200 text-center rounded-lg"></div>
		<div
			bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600"
			text="sm white"
			font="mono light"
			cursor-pointer
			hover="text-3xl"
			p="y-2 x-4"
			border="2 rounded blue-200"
		>
			hello world
		</div>
		<!-- An orange alarm from Material Design Icons -->
		<i></i>
		<i class="i-mdi-account-alert text-orange-400" />
		<i class="i-mdi-alarm text-orange-400" />
		<i class="i-mdi-3d-rotation text-orange-400" />
		<i class="i-mdi:account-circle text-9xl" />
		<i class="i-mdi:account-box text-blue" />
		<i class="i-mdi:youtube text-#f00" />

		<ul class="h-100 overflow-auto p-5">
			<li v-for="item in 10" :key="item" class="p-5 h-12 shadow mb-5 last:mb-0">{{ item }}</li>
		</ul>
	</div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
