<template>
	<el-card class="analysis-card" shadow="hover">
		<template #header>
			<div class="card-header">
				<div class="card-header-left">
					<el-icon class="card-icon"><Clock /></el-icon>
					<span class="card-title">上网习惯分析</span>
				</div>
				<el-button class="more-btn" text type="primary" @click.stop="dialogVisible = true">
					更多
					<el-icon class="el-icon--right"><ArrowRight /></el-icon>
				</el-button>
			</div>
		</template>
		<div v-loading="loading" class="card-content">
			<div class="stat-item">
				<span class="stat-label">最常上网时段</span>
				<span class="stat-value">{{ data.peakPeriod || '-' }}</span>
			</div>
			<el-divider />
			<div class="stat-item">
				<span class="stat-label">上网次数</span>
				<span class="stat-value highlight">{{ data.onlineCount || 0 }}</span>
			</div>
		</div>
	</el-card>

	<!-- 详情弹窗 -->
	<el-dialog
		v-model="dialogVisible"
		title="上网习惯分析详情"
		:width="dialogConfig.width"
		:top="dialogConfig.top"
		destroy-on-close
	>
		<div v-loading="chartLoading" class="detail-content">
			<div class="chart-section">
				<h4 class="section-title">上网时段统计</h4>
				<v-chart class="chart" :option="chartOption" autoresize />
			</div>
		</div>

		<el-divider />

		<div class="table-section">
			<h4 class="section-title">上网明细</h4>
			<el-table
				v-loading="tableLoading"
				:data="tableData"
				border
				max-height="300"
			>
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="onlineTime" label="上网时间" width="180" />
				<el-table-column prop="baseStationId" label="基站编号" width="140" />
				<el-table-column prop="target" label="访问网站/应用" width="auto" />
				<el-table-column prop="relatedPhone" label="关联手机号" width="140" />
			</el-table>
			<div class="pagination-container">
				<el-pagination
					v-model:current-page="pagination.currentPage"
					v-model:page-size="pagination.pageSize"
					:total="pagination.total"
					:page-sizes="[10, 20, 50]"
					layout="total, sizes, prev, pager, next"
					@size-change="handleSizeChange"
					@current-change="handlePageChange"
				/>
			</div>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue"
import { useAsyncState } from "@vueuse/core"
import { Clock, ArrowRight } from "@element-plus/icons-vue"
import VChart from "vue-echarts"
import { use } from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { LineChart } from "echarts/charts"
import { GridComponent, TooltipComponent, DataZoomComponent } from "echarts/components"
import { ua } from "@/modules/ktc/api"
import type { NetHabitOverview, NetHabitChartPoint, NetHabitListItem } from "@/modules/ktc/api/tum/uc/ua"
import { onlineBehaviorDialogConfig as dialogConfig } from "@/modules/ktc/config"

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, DataZoomComponent])

defineOptions({ name: "NetHabitCard" })

const props = defineProps<{
	unitId: number
	dateRange?: [string, string] | null
}>()

// 卡片概览数据
const { state: data, isLoading: loading, execute: loadData } = useAsyncState<NetHabitOverview>(
	async () => {
		if (!props.unitId) return { peakPeriod: "", onlineCount: 0 }
		const res = await ua.getNetHabitOverview({
			unitId: props.unitId,
			startDate: props.dateRange?.[0],
			endDate: props.dateRange?.[1]
		})
		return res.data || { peakPeriod: "", onlineCount: 0 }
	},
	{ peakPeriod: "", onlineCount: 0 },
	{ immediate: false, resetOnExecute: false }
)

const dialogVisible = ref(false)

const pagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0
})

// 图表数据
const { state: chartData, isLoading: chartLoading, execute: loadChartData } = useAsyncState<NetHabitChartPoint[]>(
	async () => {
		const res = await ua.getNetHabitChart({
			unitId: props.unitId,
			startDate: props.dateRange?.[0],
			endDate: props.dateRange?.[1]
		})
		return res.data || []
	},
	[],
	{ immediate: false, resetOnExecute: false }
)

// 表格数据
const { state: tableData, isLoading: tableLoading, execute: loadTableData } = useAsyncState<NetHabitListItem[]>(
	async () => {
		const res = await ua.getNetHabitList({
			unitId: props.unitId,
			startDate: props.dateRange?.[0],
			endDate: props.dateRange?.[1],
			page: pagination.currentPage,
			pageSize: pagination.pageSize
		})
		pagination.total = res.data?.total || 0
		return res.data?.list || []
	},
	[],
	{ immediate: false, resetOnExecute: false }
)

// 图表配置
const chartOption = computed(() => ({
	tooltip: {
		trigger: "axis",
		axisPointer: { type: "shadow" }
	},
	grid: {
		left: "3%",
		right: "4%",
		bottom: "15%",
		containLabel: true
	},
	xAxis: {
		type: "category",
		data: chartData.value.map(item => item.hour),
		axisLabel: { rotate: 45 }
	},
	yAxis: {
		type: "value",
		name: "次数"
	},
	series: [
		{
			name: "上网次数",
			type: "line",
			data: chartData.value.map(item => item.count),
			smooth: true,
			areaStyle: { opacity: 0.3 },
			itemStyle: { color: "#409eff" }
		}
	],
	dataZoom: [
		{ type: "inside", start: 0, end: 100 },
		{ type: "slider", start: 0, end: 100, height: 20, bottom: 10 }
	]
}))

const handleSizeChange = (size: number) => {
	pagination.pageSize = size
	pagination.currentPage = 1
	loadTableData(0)
}

const handlePageChange = (page: number) => {
	pagination.currentPage = page
	loadTableData(0)
}

watch(() => [props.unitId, props.dateRange], () => {
	loadData(0)
}, { immediate: true })

watch(dialogVisible, (val) => {
	if (val && props.unitId) {
		loadChartData(0)
		loadTableData(0)
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

			.card-icon {
				font-size: 18px;
				color: var(--el-color-primary);
			}

			.card-title {
				font-size: 14px;
				font-weight: 600;
			}
		}

		.more-btn {
			padding: 0;
			font-size: 12px;
		}
	}

	.card-content {
		min-height: 80px;

		.stat-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 8px 0;

			.stat-label {
				font-size: 13px;
				color: var(--el-text-color-secondary);
			}

			.stat-value {
				font-size: 16px;
				font-weight: 600;
				color: var(--el-text-color-primary);

				&.highlight {
					color: var(--el-color-primary);
					font-size: 18px;
				}
			}
		}

		.el-divider {
			margin: 8px 0;
		}
	}
}

.detail-content {
	.chart-section {
		.section-title {
			margin: 0 0 12px 0;
			font-size: 14px;
			font-weight: 600;
			color: var(--el-text-color-primary);
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

		.chart {
			height: 300px;
		}
	}
}

.table-section {
	.section-title {
		margin: 0 0 12px 0;
		font-size: 14px;
		font-weight: 600;
		color: var(--el-text-color-primary);
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

	.pagination-container {
		display: flex;
		justify-content: flex-end;
		margin-top: 12px;
	}
}

:deep(.el-dialog__body) {
	padding-top: 16px;
}
</style>