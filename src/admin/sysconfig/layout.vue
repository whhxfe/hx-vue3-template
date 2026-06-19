<template>
	<AppLayout :title="title" :menu="menu">
		<router-view />
	</AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AppLayout } from '@/components'
import menu from './menu.config'

const title = ref('系统配置')
</script>

<style lang="scss" scoped>
</style>
