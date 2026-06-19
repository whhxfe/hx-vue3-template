<script setup lang="ts">
import { ref } from "vue"
import { storeToRefs } from "pinia"
import { ElWatermark } from "element-plus"
import { useSysStore } from "./store"
import { TokenOverdue } from "@/components"
import { HxConfigProvider } from "@whhx/ui"

const sysStore = useSysStore()
const { userInfo, token } = storeToRefs(sysStore)

/** 本地 glob 资源 */
const imageIconModules = import.meta.glob<{ default: string }>("@/assets/icons/**/*", { eager: true })

const iconConfig = {
	svg: {},
	image: {
		source: "local" as const,
		imageIconModules: [imageIconModules]
		// cdnBaseUrl: "/icons"
	},
	/**
	 * iconify 图标集配置
	 *
	 * Offline 模式（预加载）：
	 * - 传入图标集名称数组，内部自动从 @iconify/json/json/* 加载并注册
	 * - 图标集会在构建时打包，适合常用图标，响应快
	 *
	 * CDN 模式（按需加载）：
	 * - 设置 source: "cdn" 并配置 cdnUrl
	 * - 图标按需从 CDN 获取，适合图标数量多、不想增加包体积的场景
	 */
	iconify: {
		// ===== Offline 模式 =====
		// source: "offline" as const,
		// collections: ['ep', 'mdi', 'logos', 'twemoji','mingcute'] as IconifyCollectionName[],

		// ===== CDN 模式 =====
		source: "cdn" as const,
		cdnUrl: SYS_CONFIG.ICONIFY_CDN_URL
	}
}

const requestConfig = {
	headers: {
		token: token.value!
	},
	baseUrl: SYS_CONFIG.API_BASE_URL,
	prefix: SYS_CONFIG.API_PREFIX
}


const form = { cols: 5, gap: 12, minColWidth: 200, actionAlign: "right" as const }
</script>

<template>
	<el-watermark class="h-full" :content="userInfo?.accountName || 'vue3-template'">
		<HxConfigProvider :icon="iconConfig" :request="requestConfig" :form="form">
			<router-view></router-view>
		</HxConfigProvider>
		<TokenOverdue />
	</el-watermark>
</template>

<style lang="scss" scoped>
.app {
	width: 100%;
	height: 100%;
}
</style>
