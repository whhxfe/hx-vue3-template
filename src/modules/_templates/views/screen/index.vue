<template>
	<div class="flex flex-col h-full p-4 bg-bg-base gap-5 overflow-y-auto">
		<!-- 页面标题栏 -->
		<div class="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-primary to-primary/70 rounded-2xl shadow-lg">
			<div>
				<h1 class="m-0 text-xl font-bold text-white drop-shadow-sm">数据分析大屏</h1>
				<span class="text-sm text-white/80 mt-1 block tracking-wide">Data Analytics Dashboard</span>
			</div>
			<div class="flex items-center gap-4">
				<span class="text-sm text-white/90">更新时间: {{ currentTime }}</span>
				<el-button :icon="Refresh" @click="handleRefresh" :loading="globalLoading" class="!bg-white/20 !border-white/30 !text-white hover:!bg-white/30 hover:!border-white/50">
					刷新数据
				</el-button>
			</div>
		</div>

		<!-- KPI 概览卡片 -->
		<div v-loading="overviewLoading">
			<OverviewCards :data="overviewData" />
		</div>

		<!-- 图表区域 -->
		<div class="grid grid-cols-5 gap-4">
			<!-- 趋势图表 -->
			<div class="col-span-3 min-h-100">
				<TrendChart
					:data="trendData"
					:type="trendType"
					@change="handleTrendChange"
				/>
			</div>

			<!-- 分类图表 -->
			<div class="col-span-2 min-h-100">
				<CategoryChart :data="categoryData" />
			</div>
		</div>

		<!-- 底部区域 -->
		<div class="grid grid-cols-2 gap-4">
			<!-- 区域分布 -->
			<div class="min-h-95" v-loading="regionLoading">
				<RegionMap :data="regionData" />
			</div>

			<!-- 排行榜 -->
			<div class="min-h-95" v-loading="rankLoading">
				<RankList
					:data="rankData"
					:type="rankType"
					@change="handleRankChange"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { Refresh } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"
import { useNow } from "@vueuse/core"
import { useAsyncState } from "@vueuse/core"
import OverviewCards from "./components/OverviewCards.vue"
import TrendChart from "./components/TrendChart.vue"
import CategoryChart from "./components/CategoryChart.vue"
import RegionMap from "./components/RegionMap.vue"
import RankList from "./components/RankList.vue"
import { screen, type OverviewData, type TrendItem, type CategoryItem, type RegionItem, type RankItem } from "@/modules/_templates/api/screen"

// ==================== 类型状态 ====================
const trendType = ref("month")
const rankType = ref("top")

// ==================== 概览数据 ====================
const {
	state: overviewData,
	isLoading: overviewLoading,
	execute: loadOverview
} = useAsyncState(async () => {
	const res = await screen.getOverview()
	return (res.state === 2000 || res.state === 200) && res.data ? res.data : null
}, null, { immediate: false })

// ==================== 趋势数据 ====================
const trendLoading = ref(false)
const trendData = ref<TrendItem[]>([])
const loadTrend = async (type: string) => {
	trendLoading.value = true
	try {
		const res = await screen.getTrend(type as "month" | "year")
		if ((res.state === 2000 || res.state === 200) && res.data?.data) {
			trendData.value = res.data.data
		}
	} finally {
		trendLoading.value = false
	}
}

// ==================== 分类数据 ====================
const categoryLoading = ref(false)
const categoryData = ref<CategoryItem[]>([])
const loadCategory = async (type: string = "all") => {
	categoryLoading.value = true
	try {
		const res = await screen.getCategory(type)
		if ((res.state === 2000 || res.state === 200) && res.data?.data) {
			categoryData.value = res.data.data
		}
	} finally {
		categoryLoading.value = false
	}
}

// ==================== 区域数据 ====================
const {
	state: regionData,
	isLoading: regionLoading,
	execute: loadRegion
} = useAsyncState(async () => {
	const res = await screen.getRegion()
	return (res.state === 2000 || res.state === 200) && res.data ? res.data : []
}, [], { immediate: false })

// ==================== 排名数据 ====================
const rankLoading = ref(false)
const rankData = ref<RankItem[]>([])
const loadRank = async (type: string) => {
	rankLoading.value = true
	try {
		const res = await screen.getRank(type as "top" | "bottom")
		if ((res.state === 2000 || res.state === 200) && res.data?.data) {
			rankData.value = res.data.data
		}
	} finally {
		rankLoading.value = false
	}
}

// ==================== 全局加载状态 ====================
const globalLoading = computed(() => {
	return overviewLoading.value && trendLoading.value && categoryLoading.value && regionLoading.value && rankLoading.value
})

// ==================== 当前时间（实时更新） ====================
const now = useNow({ interval: 1000 })
const currentTime = computed(() => {
	return now.value.toLocaleString("zh-CN", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	})
})

// ==================== 初始化加载 ====================
const loadAllData = async () => {
	await Promise.all([
		loadOverview(),
		loadTrend(trendType.value),
		loadCategory(),
		loadRegion(),
		loadRank(rankType.value)
	])
}

// ==================== 事件处理 ====================
const handleRefresh = async () => {
	ElMessage.success("正在刷新数据...")
	await loadAllData()
	ElMessage.success("数据刷新完成")
}

const handleTrendChange = (type: string) => {
	trendType.value = type
	loadTrend(type)
}

const handleRankChange = (type: string) => {
	rankType.value = type
	loadRank(type)
}

// ==================== 生命周期 ====================
onMounted(() => {
	loadAllData()
})
</script>
