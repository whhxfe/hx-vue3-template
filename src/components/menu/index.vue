<template>
	<el-menu
		v-if="menu.length !== 0"
		:class="[mode === 'horizontal' ? 'app-menu--horizontal w-180' : 'app-menu--vertical']"
		router
		:mode="mode"
		popper-class="app-menu-popper"
		:default-active="activePath"
		:ellipsis="true"
	>
		<template v-for="item in menu" :key="item.path">
			<SubMenu v-if="item.children && item.children.length > 0" :item="item" />
			<el-menu-item v-else :index="item.path">
				<HxIcon v-if="item.icon" class="mr-2" type="svg" :name="item.icon"></HxIcon>
				<span>{{ item.title }}</span>
			</el-menu-item>
		</template>
	</el-menu>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import { HxIcon } from '@whhx/ui'
import SubMenu from "./SubMenu.vue"

interface Props {
	menu?: MenuItem[]
	mode?: "horizontal" | "vertical"
}

const props = withDefaults(defineProps<Props>(), {
	menu: () => [],
	mode: "vertical"
})

const route = useRoute()

const activePath = computed(() => route.path)
</script>

<style lang="scss"></style>
