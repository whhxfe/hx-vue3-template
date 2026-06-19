<template>
	<div class="w-full h-full">
		<!-- Horizontal 模式 -->
		<template v-if="currentMode === 'horizontal'">
			<AppHeader :title="title">
				<AppMenu :menu="menu" mode="horizontal" />
			</AppHeader>
			<main class="h-[calc(100%_-_60px)] overflow-y-auto relative" id="main">
				<slot />
			</main>
		</template>

		<!-- Vertical 模式 -->
		<template v-else>
			<AppHeader :title="title" />
			<main class="w-full h-[calc(100%_-_60px)] flex">
				<div class="w-50 shrink-0" v-if="menu.length > 0">
					<AppMenu :menu="menu" mode="vertical" />
				</div>
				<div class="flex-1 overflow-y-auto relative" id="target">
					<slot />
				</div>
			</main>
		</template>

		<!-- 公共组件 -->
		<el-backtop :target="backtopTarget" :visibility-height="100" :right="30" :bottom="50" />
		<SettingsDrawer v-model="showSettings" />
	</div>
</template>

<script setup lang="ts">
import { provide } from "vue"
import { AppHeader, AppMenu } from "@/components"
import SettingsDrawer from "../header/settings-drawer.vue"
import { useLayout } from "@/hooks/useLayout"

interface Props {
	title?: string
	menu?: MenuItem[]
}

withDefaults(defineProps<Props>(), {
	title: "标题",
	menu: () => [],
})

const { currentMode, backtopTarget, showSettings, openSettings } = useLayout()
provide("openSettings", openSettings)
</script>

<style lang="scss" ></style>