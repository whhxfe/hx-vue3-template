<template>
	<HxLayout :title="title" :menu="menu">
		<router-view />
	</HxLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { HxLayout } from '@/hx-components'
import menu from './menu.config'

const title = ref('数据字典')
</script>

<style lang="scss" scoped>
</style>
