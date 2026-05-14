<template>
	<div class="screen-container">
		<!-- 页面标题栏 -->
		<div class="screen-header">
			<div class="header-title">
				<h1>数据分析大屏</h1>
				<span class="header-subtitle">Data Analytics Dashboard</span>
			</div>
			<div class="header-actions">
				<span class="update-time">更新时间: {{ currentTime }}</span>
				<el-button type="primary" :icon="Refresh" @click="handleRefresh" :loading="globalLoading">
					刷新数据
				</el-button>
			</div>
		</div>

		<!-- KPI 概览卡片 -->
		<div class="overview-section" v-loading="overviewLoading">
			<OverviewCards :data="overviewData" />
		</div>

		<!-- 图表区域 -->
		<div class="charts-grid">
			<!-- 趋势图表 -->
			<div class="chart-item trend-item">
				<TrendChart
					:data="trendData"
					:type="trendType"
					@change="handleTrendChange"
				/>
			</div>

			<!-- 分类图表 -->
			<div class="chart-item category-item">
				<CategoryChart :data="categoryData" />
			</div>
		</div>

		<!-- 底部区域 -->
		<div class="bottom-grid">
			<!-- 区域分布 -->
			<div class="bottom-item region-item" v-loading="regionLoading">
				<RegionMap :data="regionData" />
			</div>

			<!-- 排行榜 -->
			<div class="bottom-item rank-item" v-loading="rankLoading">
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import OverviewCards from './components/OverviewCards.vue'
import TrendChart from './components/TrendChart.vue'
import CategoryChart from './components/CategoryChart.vue'
import RegionMap from './components/RegionMap.vue'
import RankList from './components/RankList.vue'
import { screen, type OverviewData, type TrendItem, type CategoryItem, type RegionItem, type RankItem } from '@/modules/_templates/api/screen'

// 状态数据
const overviewData = ref<OverviewData | null>(null)
const trendData = ref<TrendItem[]>([])
const categoryData = ref<CategoryItem[]>([])
const regionData = ref<RegionItem[]>([])
const rankData = ref<RankItem[]>([])

// 类型状态
const trendType = ref('month')
const rankType = ref('top')

// 加载状态
const overviewLoading = ref(false)
const trendLoading = ref(false)
const categoryLoading = ref(false)
const regionLoading = ref(false)
const rankLoading = ref(false)

// 全局加载状态
const globalLoading = computed(() => {
	return overviewLoading.value && trendLoading.value && categoryLoading.value && regionLoading.value && rankLoading.value
})

// 当前时间
const currentTime = ref('')
let timeInterval: number | null = null

const updateTime = () => {
	const now = new Date()
	currentTime.value = now.toLocaleString('zh-CN', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})
}

// 加载概览数据
const loadOverview = async () => {
	overviewLoading.value = true
	try {
		const res = await screen.getOverview()
		if (res.data) {
			overviewData.value = res.data
		}
	} catch (error) {
		console.error('加载概览数据失败:', error)
	} finally {
		overviewLoading.value = false
	}
}

// 加载趋势数据
const loadTrend = async (type: string) => {
	trendLoading.value = true
	try {
		const res = await screen.getTrend(type as 'month' | 'year')
		if (res.data?.data) {
			trendData.value = res.data.data
		}
	} catch (error) {
		console.error('加载趋势数据失败:', error)
	} finally {
		trendLoading.value = false
	}
}

// 加载分类数据
const loadCategory = async (type: string = 'all') => {
	categoryLoading.value = true
	try {
		const res = await screen.getCategory(type)
		if (res.data?.data) {
			categoryData.value = res.data.data
		}
	} catch (error) {
		console.error('加载分类数据失败:', error)
	} finally {
		categoryLoading.value = false
	}
}

// 加载区域数据
const loadRegion = async () => {
	regionLoading.value = true
	try {
		const res = await screen.getRegion()
		if (res.data) {
			regionData.value = res.data
		}
	} catch (error) {
		console.error('加载区域数据失败:', error)
	} finally {
		regionLoading.value = false
	}
}

// 加载排名数据
const loadRank = async (type: string) => {
	rankLoading.value = true
	try {
		const res = await screen.getRank(type as 'top' | 'bottom')
		if (res.data?.data) {
			rankData.value = res.data.data
		}
	} catch (error) {
		console.error('加载排名数据失败:', error)
	} finally {
		rankLoading.value = false
	}
}

// 加载所有数据
const loadAllData = async () => {
	await Promise.all([
		loadOverview(),
		loadTrend(trendType.value),
		loadCategory(),
		loadRegion(),
		loadRank(rankType.value)
	])
}

// 刷新数据
const handleRefresh = async () => {
	ElMessage.success('正在刷新数据...')
	await loadAllData()
	ElMessage.success('数据刷新完成')
}

// 趋势类型切换
const handleTrendChange = (type: string) => {
	trendType.value = type
	loadTrend(type)
}

// 排名类型切换
const handleRankChange = (type: string) => {
	rankType.value = type
	loadRank(type)
}

// 初始化
onMounted(() => {
	updateTime()
	timeInterval = window.setInterval(updateTime, 1000)
	loadAllData()
})

// 清理
onUnmounted(() => {
	if (timeInterval) {
		clearInterval(timeInterval)
	}
})
</script>

<style lang="scss" scoped>
.screen-container {
	padding: 16px;
	height: 100%;
	overflow-y: auto;
	background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%);
}

.screen-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
	padding: 16px 24px;
	background: linear-gradient(135deg, #409eff 0%, #79bbff 100%);
	border-radius: 16px;
	box-shadow: 0 4px 20px rgba(64, 158, 255, 0.3);

	.header-title {
		h1 {
			margin: 0;
			font-size: 24px;
			font-weight: 700;
			color: #ffffff;
			text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		}

		.header-subtitle {
			font-size: 13px;
			color: rgba(255, 255, 255, 0.8);
			margin-top: 4px;
			display: block;
			letter-spacing: 1px;
		}
	}

	.header-actions {
		display: flex;
		align-items: center;
		gap: 16px;

		.update-time {
			font-size: 13px;
			color: rgba(255, 255, 255, 0.9);
		}

		:deep(.el-button) {
			background: rgba(255, 255, 255, 0.2);
			border-color: rgba(255, 255, 255, 0.3);
			color: #ffffff;

			&:hover {
				background: rgba(255, 255, 255, 0.3);
				border-color: rgba(255, 255, 255, 0.5);
			}
		}
	}
}

.overview-section {
	margin-bottom: 16px;
}

.charts-grid {
	display: grid;
	grid-template-columns: 1.5fr 1fr;
	gap: 16px;
	margin-bottom: 16px;

	.chart-item {
		min-height: 400px;
	}

	.trend-item {
		grid-column: 1;
	}

	.category-item {
		grid-column: 2;
	}
}

.bottom-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;

	.bottom-item {
		min-height: 380px;
	}
}
</style>
