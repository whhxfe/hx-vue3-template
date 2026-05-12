<template>
	<HxLayout :title="title" :menu="menu">
		<router-view />
	</HxLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HxLayout } from '@/hx-components'
import menu from './menu.config'

const title = ref('系统日志')
</script>

<style lang="scss" scoped>
</style>
