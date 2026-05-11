<template>
	<el-menu
		v-if="menu.length !== 0"
		:class="[mode === 'horizontal' ? 'hx-menu--horizontal w-180' : 'hx-menu--vertical']"
		router
		:mode="mode"
		popper-class="hx-menu-popper"
		:default-active="activePath"
		:ellipsis="true"
	>
		<template v-for="item in menu" :key="item.path">
			<el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
				<template #title>
					<HxIcon v-if="item.icon" class="mr-2" size="middle" type="svg" :name="item.icon"></HxIcon>
					<span>{{ item.title }}</span>
				</template>
				<el-menu-item v-for="item2 in item.children" :key="item2.path" :index="item2.path">
					{{ item2.title }}
				</el-menu-item>
			</el-sub-menu>

			<el-menu-item v-else :key="item.path" :index="item.path">
				<HxIcon v-if="item.icon" class="mr-2"  type="svg" :name="item.icon"></HxIcon>
				<span>{{ item.title }}</span>
			</el-menu-item>
		</template>
	</el-menu>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import { HxIcon } from '@hx/ui'

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
