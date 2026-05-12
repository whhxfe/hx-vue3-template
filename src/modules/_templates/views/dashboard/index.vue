<template>
	<div class="dashboard-container">
		<!-- 统计卡片区域 -->
		<div class="stats-cards" v-loading="statsLoading">
			<div v-for="stat in statsData" :key="stat.title" class="stat-card">
				<div class="stat-icon" :style="{ background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)` }">
					<el-icon :size="28" color="#ffffff">
						<component :is="stat.icon" />
					</el-icon>
				</div>
				<div class="stat-content">
					<div class="stat-value">{{ stat.value }}</div>
					<div class="stat-title">{{ stat.title }}</div>
					<div class="stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
						<el-icon v-if="stat.trend > 0"><ArrowUp /></el-icon>
						<el-icon v-else><ArrowDown /></el-icon>
						<span>{{ Math.abs(stat.trend) }}%</span>
						<span class="trend-text">较上周</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 图表区域 -->
		<div class="charts-section">
			<!-- 左侧柱状图 -->
			<div class="chart-card bar-chart" v-loading="chartLoading">
				<div class="chart-header">
					<span class="chart-title">月度销售额统计</span>
					<el-radio-group v-model="barPeriod" size="small" @change="handleBarPeriodChange">
						<el-radio-button value="week">本周</el-radio-button>
						<el-radio-button value="month">本月</el-radio-button>
						<el-radio-button value="year">本年</el-radio-button>
					</el-radio-group>
				</div>
				<div class="chart-body">
					<v-chart :option="barOption" autoresize />
				</div>
			</div>

			<!-- 右侧饼图 -->
			<div class="chart-card pie-chart" v-loading="chartLoading">
				<div class="chart-header">
					<span class="chart-title">销售分类占比</span>
					<el-select v-model="pieType" size="small" placeholder="选择分类" @change="handlePieTypeChange">
						<el-option label="全部" value="all" />
						<el-option label="电子产品" value="electronic" />
						<el-option label="办公用品" value="office" />
						<el-option label="生活用品" value="daily" />
					</el-select>
				</div>
				<div class="chart-body">
					<v-chart :option="pieOption" autoresize />
				</div>
			</div>
		</div>

		<!-- 底部折线图 -->
		<div class="chart-card line-chart" v-loading="chartLoading">
			<div class="chart-header">
				<span class="chart-title">年度销售趋势</span>
				<div class="chart-actions">
					<el-date-picker
						v-model="lineYear"
						type="year"
						size="small"
						placeholder="选择年份"
						format="YYYY"
						value-format="YYYY"
						@change="handleYearChange"
					/>
					<el-button size="small" @click="handleExportData">导出数据</el-button>
				</div>
			</div>
			<div class="chart-body">
				<v-chart :option="lineOption" autoresize />
			</div>
		</div>

		<!-- 底部数据列表 -->
		<div class="data-list-section">
			<div class="section-header">
				<span class="section-title">最新订单</span>
				<el-button type="primary" link @click="handleViewAllOrders">查看全部</el-button>
			</div>
			<el-table v-loading="orderLoading" :data="orderList" stripe>
				<el-table-column prop="orderNo" label="订单编号" width="180" />
				<el-table-column prop="product" label="商品名称" min-width="200" />
				<el-table-column prop="amount" label="订单金额" width="120" align="right">
					<template #default="{ row }">
						<span class="amount">¥{{ row.amount.toFixed(2) }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="订单状态" width="100" align="center">
					<template #default="{ row }">
						<el-tag :type="getStatusType(row.status)" size="small">
							{{ getStatusText(row.status) }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="下单时间" width="180" />
				<el-table-column label="操作" width="120" align="center">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleViewOrder(row)">查看</el-button>
						<el-button type="primary" link @click="handleExportOrder(row)">导出</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { ElMessage } from "element-plus"
import {
	ArrowUp,
	ArrowDown
} from "@element-plus/icons-vue"
import { dashboard, type StatItem, type ChartData, type PieItem, type OrderItem } from '@/modules/_templates/api'

const statsData = ref<StatItem[]>([])
const monthlySalesData = ref<ChartData[]>([])
const pieChartData = ref<PieItem[]>([])
const salesTrendData = ref<ChartData[]>([])
const orderList = ref<OrderItem[]>([])
const statsLoading = ref(false)
const chartLoading = ref(false)
const orderLoading = ref(false)

const barPeriod = ref("month")
const pieType = ref("all")
const lineYear = ref(new Date().getFullYear().toString())

// 加载统计数据
const loadStats = async () => {
	statsLoading.value = true
	try {
		const res = await dashboard.getStats()
		if (res.data) {
			statsData.value = res.data
		}
	} catch (error) {
		console.error('加载统计数据失败:', error)
	} finally {
		statsLoading.value = false
	}
}

// 加载月度销售数据
const loadMonthlySales = async (period: string) => {
	chartLoading.value = true
	try {
		const res = await dashboard.getMonthlySales(period as 'week' | 'month' | 'year')
		if (res.data) {
			monthlySalesData.value = res.data
		}
	} catch (error) {
		console.error('加载月度销售数据失败:', error)
	} finally {
		chartLoading.value = false
	}
}

// 加载饼图数据
const loadPieData = async (type: string) => {
	chartLoading.value = true
	try {
		const res = await dashboard.getPieData(type)
		if (res.data) {
			pieChartData.value = res.data
		}
	} catch (error) {
		console.error('加载饼图数据失败:', error)
	} finally {
		chartLoading.value = false
	}
}

// 加载年度趋势数据
const loadSalesTrend = async (year: string) => {
	chartLoading.value = true
	try {
		const res = await dashboard.getSalesTrend(year)
		if (res.data) {
			salesTrendData.value = res.data
		}
	} catch (error) {
		console.error('加载年度趋势数据失败:', error)
	} finally {
		chartLoading.value = false
	}
}

// 加载订单列表
const loadOrders = async (page: number = 1, pageSize: number = 10) => {
	orderLoading.value = true
	try {
		const res = await dashboard.getOrders(page, pageSize)
		if (res.data) {
			orderList.value = res.data.list || []
		}
	} catch (error) {
		console.error('加载订单列表失败:', error)
	} finally {
		orderLoading.value = false
	}
}

// 初始化加载所有数据
const loadAllData = async () => {
	await Promise.all([
		loadStats(),
		loadMonthlySales(barPeriod.value),
		loadPieData(pieType.value),
		loadSalesTrend(lineYear.value),
		loadOrders()
	])
}

// 柱状图配置
const barOption = computed(() => ({
	tooltip: {
		trigger: "axis",
		axisPointer: {
			type: "shadow"
		}
	},
	grid: {
		left: "3%",
		right: "4%",
		bottom: "3%",
		top: "10%",
		containLabel: true
	},
	xAxis: {
		type: "category",
		data: monthlySalesData.value.map((item: ChartData) => item.month),
		axisLine: {
			lineStyle: {
				color: "#e4e7ed"
			}
		},
		axisLabel: {
			color: "#606266"
		}
	},
	yAxis: {
		type: "value",
		axisLine: {
			show: false
		},
		axisLabel: {
			color: "#606266"
		},
		splitLine: {
			lineStyle: {
				color: "#f0f0f0"
			}
		}
	},
	series: [
		{
			name: "销售额",
			type: "bar",
			data: monthlySalesData.value.map((item: ChartData) => item.value),
			itemStyle: {
				color: {
					type: "linear",
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{ offset: 0, color: "#409eff" },
						{ offset: 1, color: "#79bbff" }
					]
				},
				borderRadius: [4, 4, 0, 0]
			},
			barWidth: "50%"
		}
	]
}))

// 饼图配置
const pieOption = computed(() => ({
	tooltip: {
		trigger: "item",
		formatter: "{b}: {c} ({d}%)"
	},
	legend: {
		orient: "vertical",
		right: "5%",
		top: "center",
		textStyle: {
			color: "#606266"
		}
	},
	series: [
		{
			name: "销售分类",
			type: "pie",
			radius: ["45%", "70%"],
			center: ["35%", "50%"],
			avoidLabelOverlap: false,
			itemStyle: {
				borderRadius: 6,
				borderColor: "#fff",
				borderWidth: 2
			},
			label: {
				show: false,
				position: "center"
			},
			emphasis: {
				label: {
					show: true,
					fontSize: 16,
					fontWeight: "bold"
				}
			},
			labelLine: {
				show: false
			},
			data: pieChartData.value.map((item: PieItem) => ({
				value: item.value,
				name: item.name,
				itemStyle: { color: item.color }
			}))
		}
	]
}))

// 折线图配置
const lineOption = computed(() => ({
	tooltip: {
		trigger: "axis"
	},
	legend: {
		data: ["销售额", "订单量"],
		bottom: 0,
		textStyle: {
			color: "#606266"
		}
	},
	grid: {
		left: "3%",
		right: "4%",
		bottom: "15%",
		top: "5%",
		containLabel: true
	},
	xAxis: {
		type: "category",
		boundaryGap: false,
		data: salesTrendData.value.map((item: ChartData) => item.month),
		axisLine: {
			lineStyle: {
				color: "#e4e7ed"
			}
		},
		axisLabel: {
			color: "#606266"
		}
	},
	yAxis: {
		type: "value",
		axisLine: {
			show: false
		},
		axisLabel: {
			color: "#606266"
		},
		splitLine: {
			lineStyle: {
				color: "#f0f0f0"
			}
		}
	},
	series: [
		{
			name: "销售额",
			type: "line",
			smooth: true,
			symbol: "circle",
			symbolSize: 8,
			data: salesTrendData.value.map((item: ChartData) => item.value),
			lineStyle: {
				color: "#409eff",
				width: 2
			},
			itemStyle: {
				color: "#409eff"
			},
			areaStyle: {
				color: {
					type: "linear",
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{ offset: 0, color: "rgba(64, 158, 255, 0.3)" },
						{ offset: 1, color: "rgba(64, 158, 255, 0.05)" }
					]
				}
			}
		},
		{
			name: "订单量",
			type: "line",
			smooth: true,
			symbol: "circle",
			symbolSize: 8,
			data: salesTrendData.value.map((item: ChartData) => Math.floor(item.value / 20)),
			lineStyle: {
				color: "#67c23a",
				width: 2
			},
			itemStyle: {
				color: "#67c23a"
			}
		}
	]
}))

const getStatusType = (status: OrderItem["status"]) => {
	const map: Record<OrderItem["status"], string> = {
		pending: "warning",
		processing: "primary",
		completed: "success",
		cancelled: "info"
	}
	return map[status]
}

const getStatusText = (status: OrderItem["status"]) => {
	const map: Record<OrderItem["status"], string> = {
		pending: "待处理",
		processing: "处理中",
		completed: "已完成",
		cancelled: "已取消"
	}
	return map[status]
}

// 事件处理
const handleBarPeriodChange = (period: string) => {
	loadMonthlySales(period)
}

const handlePieTypeChange = (type: string) => {
	loadPieData(type)
}

const handleYearChange = (year: string) => {
	loadSalesTrend(year)
}

const handleExportData = () => {
	ElMessage.success('导出数据成功')
}

const handleViewAllOrders = () => {
	ElMessage.info('查看全部订单')
}

const handleViewOrder = (row: OrderItem) => {
	ElMessage.info(`查看订单: ${row.orderNo}`)
}

const handleExportOrder = (row: OrderItem) => {
	ElMessage.success(`导出订单: ${row.orderNo}`)
}

// 初始化
onMounted(() => {
	loadAllData()
})
</script>

<style lang="scss" scoped>
.dashboard-container {
	padding: 16px;
	height: 100%;
	overflow-y: auto;
	background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ed 100%);

	.stats-cards {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
		margin-bottom: 16px;

		.stat-card {
			position: relative;
			display: flex;
			align-items: center;
			gap: 16px;
			padding: 20px;
			background: #fff;
			border-radius: 12px;
			border: 1px solid rgba(0, 0, 0, 0.06);
			box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
			transition: all 0.3s ease;
			overflow: hidden;

			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				height: 3px;
				background: linear-gradient(90deg, var(--el-color-primary) 0%, transparent 100%);
				opacity: 0;
				transition: opacity 0.3s;
			}

			&:hover {
				transform: translateY(-2px);
				box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
				border-color: rgba(64, 158, 255, 0.2);

				&::before {
					opacity: 1;
				}
			}

			.stat-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 56px;
				height: 56px;
				border-radius: 14px;
				flex-shrink: 0;
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
			}

			.stat-content {
				flex: 1;
				min-width: 0;
				position: relative;

				.stat-value {
					font-size: 26px;
					font-weight: 700;
					color: #1a1a2e;
					line-height: 1.2;
					background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;
				}

				.stat-title {
					font-size: 14px;
					color: #6b7280;
					margin-top: 4px;
					font-weight: 500;
				}

				.stat-trend {
					display: flex;
					align-items: center;
					gap: 4px;
					margin-top: 8px;
					font-size: 12px;
					font-weight: 500;

					&.up {
						color: #10b981;
					}

					&.down {
						color: #ef4444;
					}

					.trend-text {
						color: #9ca3af;
						margin-left: 4px;
					}
				}
			}
		}
	}

	.charts-section {
		display: grid;
		grid-template-columns: 1.5fr 1fr;
		gap: 16px;
		margin-bottom: 16px;
	}

	.chart-card {
		position: relative;
		background: #fff;
		border-radius: 12px;
		padding: 20px;
		border: 1px solid rgba(0, 0, 0, 0.06);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 1px;
			background: linear-gradient(90deg, transparent 0%, rgba(64, 158, 255, 0.3) 50%, transparent 100%);
		}

		.chart-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20px;
			padding-bottom: 12px;
			border-bottom: 1px dashed #e5e7eb;

			.chart-title {
				font-size: 16px;
				font-weight: 600;
				color: #1f2937;
				position: relative;
				padding-left: 12px;

				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 4px;
					height: 16px;
					background: linear-gradient(180deg, #409eff 0%, #79bbff 100%);
					border-radius: 2px;
				}
			}

			.chart-actions {
				display: flex;
				gap: 8px;
			}
		}

		.chart-body {
			height: 300px;
		}

		&.bar-chart {
			.chart-body {
				height: 320px;
			}
		}

		&.line-chart {
			.chart-body {
				height: 280px;
			}
		}
	}

	.data-list-section {
		position: relative;
		background: #fff;
		border-radius: 12px;
		padding: 20px;
		border: 1px solid rgba(0, 0, 0, 0.06);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 1px;
			background: linear-gradient(90deg, transparent 0%, rgba(64, 158, 255, 0.3) 50%, transparent 100%);
		}

		.section-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 16px;
			padding-bottom: 12px;
			border-bottom: 1px dashed #e5e7eb;

			.section-title {
				font-size: 16px;
				font-weight: 600;
				color: #1f2937;
				position: relative;
				padding-left: 12px;

				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 4px;
					height: 16px;
					background: linear-gradient(180deg, #409eff 0%, #79bbff 100%);
					border-radius: 2px;
				}
			}
		}

		.amount {
			color: #ef4444;
			font-weight: 600;
		}

		:deep(.el-table) {
			--el-table-border-color: #f0f0f0;
			--el-table-header-bg-color: #fafafa;

			th.el-table__cell {
				font-weight: 600;
				color: #374151;
			}

			tr:hover > td.el-table__cell {
				background-color: #f5f7fa !important;
			}
		}
	}
}
</style>
