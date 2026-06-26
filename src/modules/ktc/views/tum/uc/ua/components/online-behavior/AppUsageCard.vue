<template>
	<el-card class="analysis-card" shadow="hover">
		<template #header>
			<div class="card-header">
				<div class="card-header-left">
					<el-icon class="card-icon"><Iphone /></el-icon>
					<span class="card-title">使用应用分析</span>
				</div>
				<el-button class="more-btn" text type="primary" @click.stop="dialogVisible = true">
					更多
					<el-icon class="el-icon--right"><ArrowRight /></el-icon>
				</el-button>
			</div>
		</template>
		<div v-loading="loading" class="card-content">
			<div class="stat-item">
				<span class="stat-label">最常用应用</span>
				<span class="stat-value">{{ data.topApp || '-' }}</span>
			</div>
			<el-divider />
			<div class="stat-item">
				<span class="stat-label">使用次数</span>
				<span class="stat-value highlight">{{ data.useCount || 0 }}</span>
			</div>
		</div>
	</el-card>

	<!-- 应用分析弹窗 -->
	<el-dialog v-model="dialogVisible" title="使用应用分析详情" :width="dialogConfig.width" :top="dialogConfig.top" destroy-on-close>
		<div v-loading="chartLoading" class="detail-content">
			<div class="chart-section">
				<h4 class="section-title">使用次数排行</h4>
				<v-chart class="chart" :option="chartOption" autoresize />
			</div>

			<el-divider />

			<div class="category-section">
				<h4 class="section-title">已安装应用</h4>
				<div class="category-layout">
					<div class="category-list">
						<div
							v-for="cat in categories"
							:key="cat.key"
							class="category-item"
							:class="{ active: activeCategory === cat.key }"
							@click="activeCategory = cat.key"
						>
							<span class="category-name">{{ cat.name }}</span>
							<span class="category-count">{{ cat.list.length }}</span>
						</div>
					</div>
					<div class="app-grid">
						<div
							v-for="app in currentApps"
							:key="app.id"
							class="app-item"
							@click="openAppDetail(app)"
						>
							<div class="app-icon" :style="{ background: getAppColor(app.name) }">
								<span class="app-letter">{{ app.name.charAt(0) }}</span>
							</div>
							<div class="app-info">
								<span class="app-name">{{ app.name }}</span>
								<span class="app-count">{{ app.count }}次</span>
							</div>
						</div>
						<div v-if="!currentApps.length" class="empty-text">暂无数据</div>
					</div>
				</div>
			</div>
		</div>
	</el-dialog>

	<!-- 应用详情弹窗 -->
	<el-dialog v-model="appDetailVisible" title="应用使用详情" :width="dialogConfig.width" :top="dialogConfig.top" destroy-on-close>
		<template v-if="currentApp">
			<div class="app-detail-body">
				<div class="app-detail-left">
					<div class="app-detail-icon" :style="{ background: getAppColor(currentApp.name) }">
						<span class="app-letter">{{ currentApp.name.charAt(0) }}</span>
					</div>
					<span class="app-detail-name">{{ currentApp.name }}</span>
				</div>
				<div class="app-detail-right">
					<div class="app-detail-grid">
						<HxLabelText label="账号" text="wx_001" />
						<HxLabelText label="账号名" text="张三" />
						<HxLabelText label="关联手机号" text="138****1234" />
						<HxLabelText label="关联IMSI" text="460001234567890" />
						<HxLabelText label="首次发现时间" text="2024-01-01 08:00:00" />
						<HxLabelText label="最近发现时间" text="2024-01-15 16:30:00" />
						<HxLabelText :label="'使用次数'" :text="String(currentApp.count)" />
					</div>
				</div>
			</div>

			<el-divider />

			<h4 class="section-title">使用明细</h4>
			<el-table :data="appDetailTable" border max-height="300">
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="useTime" label="使用时间" width="auto" />
				<el-table-column prop="baseStationId" label="基站编号" width="120" />
				<el-table-column prop="imsi" label="终端IMSI" width="160" />
			</el-table>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue"
import { useAsyncState } from "@vueuse/core"
import { Iphone, ArrowRight } from "@element-plus/icons-vue"
import { HxLabelText } from "@whhx/ui"
import VChart from "vue-echarts"
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { BarChart } from "echarts/charts"
import { GridComponent, TooltipComponent, DataZoomComponent } from "echarts/components"
import { ua } from "@/modules/ktc/api"
import type { AppUsageOverview } from "@/modules/ktc/api/tum/uc/ua"
import { onlineBehaviorDialogConfig as dialogConfig } from "@/modules/ktc/config"

use([CanvasRenderer, BarChart, GridComponent, TooltipComponent, DataZoomComponent])

defineOptions({ name: "AppUsageCard" })

const props = defineProps<{
	unitId: number
	dateRange?: [string, string] | null
}>()

const dialogVisible = ref(false)
const appDetailVisible = ref(false)
const activeCategory = ref("social")

interface AppItem {
	id: number
	name: string
	count: number
	icon: string
}

interface CategoryGroup {
	key: string
	name: string
	list: AppItem[]
}

const currentApp = ref<AppItem | null>(null)

const currentApps = computed(() => {
	const cat = categories.value.find(c => c.key === activeCategory.value)
	return cat?.list || []
})

const appColors = ["#409eff", "#67c23a", "#e6a23c", "#f56c6c", "#909399", "#b37feb", "#36cfc9", "#ff85c0", "#ffc069", "#95de64"]

const getAppColor = (name: string) => {
	let hash = 0
	for (let i = 0; i < name.length; i++) {
		hash = name.charCodeAt(i) + ((hash << 5) - hash)
	}
	return appColors[Math.abs(hash) % appColors.length]
}

const appDetailTable = ref<{ useTime: string; baseStationId: string; imsi: string }[]>([])

// 卡片概览数据（使用 useAsyncState 统一管理 loading）
const { state: data, isLoading: loading, execute: loadData } = useAsyncState<AppUsageOverview>(
	async () => {
		if (!props.unitId) return { topApp: "", useCount: 0 }
		const res = await ua.getAppUsageOverview({
			unitId: props.unitId,
			startDate: props.dateRange?.[0],
			endDate: props.dateRange?.[1]
		})
		return res.data || { topApp: "", useCount: 0 }
	},
	{ topApp: "", useCount: 0 },
	{ immediate: false, resetOnExecute: false }
)

const { state: chartData, isLoading: chartLoading, execute: loadChart } = useAsyncState(
	async () => {
		return [
			{ appName: "微信", useCount: 1580, useDuration: "45小时" },
			{ appName: "抖音", useCount: 1240, useDuration: "38小时" },
			{ appName: "QQ", useCount: 980, useDuration: "30小时" },
			{ appName: "微博", useCount: 890, useDuration: "25小时" },
			{ appName: "支付宝", useCount: 720, useDuration: "18小时" },
			{ appName: "淘宝", useCount: 680, useDuration: "22小时" },
			{ appName: "Bilibili", useCount: 560, useDuration: "16小时" },
			{ appName: "百度", useCount: 520, useDuration: "14小时" },
			{ appName: "快手", useCount: 480, useDuration: "15小时" },
			{ appName: "高德地图", useCount: 380, useDuration: "10小时" },
			{ appName: "美团", useCount: 340, useDuration: "9小时" },
			{ appName: "腾讯视频", useCount: 290, useDuration: "12小时" },
			{ appName: "网易云音乐", useCount: 230, useDuration: "8小时" },
			{ appName: "WPS", useCount: 180, useDuration: "6小时" },
			{ appName: "钉钉", useCount: 150, useDuration: "5小时" }
		]
	},
	[],
	{ immediate: false }
)

const { state: categories, execute: loadCategoryData } = useAsyncState(
	async (): Promise<CategoryGroup[]> => {
		return [
			{
				key: "social",
				name: "通讯社交",
				list: [
					{ id: 1, name: "微信", count: 1580, icon: "ChatDotSquare" },
					{ id: 2, name: "QQ", count: 980, icon: "ChatLineSquare" },
					{ id: 3, name: "微博", count: 520, icon: "Promotion" },
					{ id: 4, name: "钉钉", count: 320, icon: "Bell" },
					{ id: 5, name: "飞书", count: 210, icon: "EditPen" }
				]
			},
			{
				key: "tool",
				name: "移动工具",
				list: [
					{ id: 6, name: "支付宝", count: 720, icon: "Wallet" },
					{ id: 7, name: "百度", count: 480, icon: "Search" },
					{ id: 8, name: "高德地图", count: 260, icon: "MapLocation" },
					{ id: 9, name: "WPS", count: 180, icon: "Document" },
					{ id: 10, name: "百度网盘", count: 120, icon: "FolderOpened" }
				]
			},
			{
				key: "travel",
				name: "交通出行",
				list: [
					{ id: 11, name: "滴滴出行", count: 180, icon: "Taxi" },
					{ id: 12, name: "12306", count: 85, icon: "Train" },
					{ id: 13, name: "美团", count: 420, icon: "Shop" },
					{ id: 14, name: "携程", count: 62, icon: "Aim" }
				]
			},
			{
				key: "edu",
				name: "学习教育",
				list: [
					{ id: 15, name: "学习强国", count: 250, icon: "Reading" },
					{ id: 16, name: "网易云课堂", count: 95, icon: "VideoCamera" },
					{ id: 17, name: "百度文库", count: 78, icon: "Notebook" }
				]
			},
			{
				key: "entertain",
				name: "影音娱乐",
				list: [
					{ id: 18, name: "抖音", count: 890, icon: "VideoCameraFilled" },
					{ id: 19, name: "快手", count: 450, icon: "VideoPlay" },
					{ id: 20, name: "Bilibili", count: 380, icon: "Trophy" },
					{ id: 21, name: "腾讯视频", count: 290, icon: "Film" },
					{ id: 22, name: "网易云音乐", count: 160, icon: "Headset" }
				]
			},
			{
				key: "life",
				name: "生活服务",
				list: [
					{ id: 23, name: "美团外卖", count: 310, icon: "Chicken" },
					{ id: 24, name: "饿了么", count: 180, icon: "Cup" },
					{ id: 25, name: "58同城", count: 88, icon: "HomeFilled" },
					{ id: 26, name: "大众点评", count: 120, icon: "Star" }
				]
			}
		]
	},
	[] as CategoryGroup[]
)

const chartOption = computed(() => {
	const sorted = [...chartData.value].sort((a, b) => b.useCount - a.useCount)
	return {
		tooltip: { trigger: "axis" as const, axisPointer: { type: "shadow" as const } },
		grid: { left: "3%", right: "4%", bottom: "15%", containLabel: true },
		xAxis: { type: "category" as const, data: sorted.map(item => item.appName), axisLabel: { rotate: 45, fontSize: 11 } },
		yAxis: { type: "value" as const, name: "使用次数" },
		series: [{ name: "使用次数", type: "bar" as const, data: sorted.map(item => item.useCount), itemStyle: { color: "#409eff", borderRadius: [4, 4, 0, 0] } }],
		dataZoom: sorted.length > 10 ? [{ type: "inside" as const, start: 0, end: 100 }, { type: "slider" as const, start: 0, end: 100, height: 20, bottom: 10 }] : undefined
	}
})

const openAppDetail = (app: AppItem) => {
	currentApp.value = app
	appDetailTable.value = [
		{ useTime: "2024-01-15 08:30:15", baseStationId: "BS001", imsi: "460001234567890" },
		{ useTime: "2024-01-15 09:15:22", baseStationId: "BS002", imsi: "460001234567890" },
		{ useTime: "2024-01-15 10:20:08", baseStationId: "BS001", imsi: "460009876543210" },
		{ useTime: "2024-01-15 11:45:33", baseStationId: "BS003", imsi: "460001234567890" },
		{ useTime: "2024-01-15 13:30:45", baseStationId: "BS002", imsi: "460005678901234" }
	]
	appDetailVisible.value = true
}

watch(() => [props.unitId, props.dateRange], () => loadData(0), { immediate: true })
watch(dialogVisible, (val) => {
	if (val && props.unitId) {
		activeCategory.value = "social"
		loadChart()
		loadCategoryData()
	}
})
</script>

<style lang="scss" scoped>
.analysis-card {
	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.card-header-left {
			display: flex;
			align-items: center;
			gap: 8px;
			.card-icon { font-size: 18px; color: var(--el-color-primary); }
			.card-title { font-size: 14px; font-weight: 600; }
		}
		.more-btn { padding: 0; font-size: 12px; }
	}
	.card-content {
		min-height: 80px;
		.stat-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 8px 0;
			.stat-label { font-size: 13px; color: var(--el-text-color-secondary); }
			.stat-value {
				font-size: 14px;
				font-weight: 600;
				color: var(--el-text-color-primary);
				&.highlight { color: var(--el-color-primary); font-size: 18px; }
			}
		}
		.el-divider { margin: 8px 0; }
	}
}

.detail-content {
	.chart-section {
		.section-title { margin: 0 0 16px; font-size: 14px; font-weight: 600; }
		.chart { height: 300px; }
	}

	.category-section {
		.section-title { margin: 0 0 16px; font-size: 14px; font-weight: 600; }

		.category-layout {
			display: flex;
			gap: 20px;
			min-height: 300px;

			.category-list {
				width: 130px;
				flex-shrink: 0;
				display: flex;
				flex-direction: column;
				gap: 4px;

				.category-item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 10px 16px;
					border-radius: 6px;
					cursor: pointer;
					transition: all 0.2s;

					&:hover { background: var(--el-fill-color-light); }

					&.active {
						background: var(--el-color-primary-light-9);
						color: var(--el-color-primary);
						font-weight: 500;

						.category-count {
							background: var(--el-color-primary);
							color: #fff;
						}
					}

					.category-name { font-size: 13px; }

					.category-count {
						font-size: 11px;
						color: var(--el-text-color-secondary);
						background: var(--el-fill-color);
						border-radius: 10px;
						padding: 1px 8px;
						min-width: 20px;
						text-align: center;
					}
				}
			}

			.app-grid {
				flex: 1;
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 12px;
				align-content: start;

				.app-item {
					display: flex;
					align-items: center;
					gap: 12px;
					padding: 12px;
					border-radius: 8px;
					background: var(--el-fill-color-lighter);
					transition: all 0.2s;
					cursor: pointer;

					&:hover {
						background: var(--el-color-primary-light-9);
						transform: translateY(-1px);
					}

					.app-icon {
						width: 40px;
						height: 40px;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 10px;
						flex-shrink: 0;
						.app-letter { font-size: 18px; font-weight: 600; color: #fff; }
					}

					.app-info {
						display: flex;
						flex-direction: column;
						gap: 4px;
						min-width: 0;
						.app-name { font-size: 13px; font-weight: 500; color: var(--el-text-color-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
						.app-count { font-size: 12px; color: var(--el-text-color-secondary); }
					}
				}

				.empty-text {
					grid-column: 1 / -1;
					font-size: 13px;
					color: var(--el-text-color-placeholder);
					padding: 40px 0;
					text-align: center;
				}
			}
		}
	}
}

.section-title {
	margin: 0 0 16px;
	font-size: 14px;
	font-weight: 600;
	position: relative;
	padding-left: 12px;

	&::before {
		content: "";
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 3px;
		height: 14px;
		background: var(--el-color-primary);
		border-radius: 2px;
	}
}

.app-detail-body {
	display: flex;
	gap: 32px;
	margin-bottom: 20px;
	padding: 24px;
	background: var(--el-fill-color-lighter);
	border-radius: 8px;
	border: 1px solid var(--el-border-color-extra-light);
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

	.app-detail-left {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		flex-shrink: 0;
		width: 100px;
		padding: 12px 0;

		.app-detail-icon {
			width: 64px;
			height: 64px;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 16px;
			box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
			.app-letter { font-size: 28px; font-weight: 600; color: #fff; }
		}

		.app-detail-name {
			font-size: 16px;
			font-weight: 600;
			color: var(--el-text-color-primary);
			text-align: center;
		}
	}

	.app-detail-right {
		flex: 1;
		display: flex;
		align-items: center;

		.app-detail-grid {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 8px 24px;
			width: 100%;
		}
	}
}
</style>