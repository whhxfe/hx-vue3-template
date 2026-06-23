<template>
	<el-sub-menu :index="item.path">
		<template #title>
			<HxIcon v-if="item.icon" class="mr-2" size="middle" type="svg" :name="item.icon"></HxIcon>
			<router-link v-if="item.path" :to="item.path" class="sub-menu-title-link" @click.stop>{{ item.title }}</router-link>
			<span v-else>{{ item.title }}</span>
		</template>
		<template v-for="child in item.children" :key="child.path">
			<SubMenu v-if="child.children && child.children.length > 0" :item="child" />
			<el-menu-item v-else :index="child.path">
				<HxIcon v-if="child.icon" class="mr-2" type="svg" :name="child.icon"></HxIcon>
				<span>{{ child.title }}</span>
			</el-menu-item>
		</template>
	</el-sub-menu>
</template>

<script setup lang="ts">
import { HxIcon } from '@whhx/ui'

interface Props {
	item: MenuItem
}

defineProps<Props>()
</script>

<style scoped>
.sub-menu-title-link {
	color: inherit;
	text-decoration: none;
}
.sub-menu-title-link:hover {
	color: var(--el-color-primary);
}
</style>
