<template>
	<div class="analytics-page">
		<div class="header">
			<h2>{{ text.analytics.title }}</h2>
			<div class="date-range-picker">
				<el-date-picker
					v-model="dateRange"
					type="daterange"
					range-separator="至"
					:start-placeholder="text.common.week"
					:end-placeholder="text.common.month"
					@change="handleDateChange"
				/>
			</div>
		</div>

		<div v-loading="loading" class="content">
			<!-- 统计卡片 -->
			<div class="stat-cards">
				<div v-for="(card, index) in statCards" :key="index" class="stat-card">
					<div class="stat-icon" :style="{ background: card.color }">
						<el-icon><component :is="card.icon" /></el-icon>
					</div>
					<div class="stat-info">
						<div class="stat-title">{{ card.title }}</div>
						<div class="stat-value">
							{{ card.value }}
							<span v-if="card.suffix" class="stat-suffix">{{ card.suffix }}</span>
						</div>
						<div class="stat-trend" :class="card.trend >= 0 ? 'up' : 'down'">
							<el-icon>
								<component :is="card.trend >= 0 ? 'ArrowUp' : 'ArrowDown'" />
							</el-icon>
							{{ Math.abs(card.trend) }}%
							<span class="trend-text">{{ card.trendText }}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- 图表区域 -->
			<div class="charts-grid">
				<!-- 折线图 -->
				<el-card class="chart-card chart-line">
					<template #header>
						<div class="card-header">
							<span>{{ text.analytics.trendAnalysis }}</span>
							<el-radio-group v-model="trendPeriod" size="small" @change="handlePeriodChange">
								<el-radio-button value="week">{{ text.common.week }}</el-radio-button>
								<el-radio-button value="month">{{ text.common.month }}</el-radio-button>
								<el-radio-button value="year">{{ text.common.year }}</el-radio-button>
							</el-radio-group>
						</div>
					</template>
					<div ref="lineChartRef" class="chart-container"></div>
				</el-card>

				<!-- 柱状图 -->
				<el-card class="chart-card chart-bar">
					<template #header>
						<div class="card-header">
							<span>{{ text.analytics.categoryStats }}</span>
						</div>
					</template>
					<div ref="barChartRef" class="chart-container"></div>
				</el-card>

				<!-- 饼图 -->
				<el-card class="chart-card chart-pie">
					<template #header>
						<div class="card-header">
							<span>{{ text.analytics.distribution }}</span>
						</div>
					</template>
					<div ref="pieChartRef" class="chart-container"></div>
				</el-card>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { ArrowUp, ArrowDown, TrendCharts, DataLine, PieChart, User, Money, Document, ShoppingCart } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { useTextAlias } from '@/modules/_templates/config'

const text = useTextAlias()

// 统计数据
const statCards = ref([
	{
		title: text.analytics.totalVisits,
		value: 128947,
		icon: 'TrendCharts',
		color: '#409eff',
		trend: 12.5,
		trendText: text.common.trend
	},
	{
		title: text.analytics.activeUsers,
		value: 8562,
		suffix: text.common.person,
		icon: 'User',
		color: '#67c23a',
		trend: 8.3,
		trendText: text.common.trend
	},
	{
		title: text.analytics.totalOrders,
		value: 3456,
		icon: 'ShoppingCart',
		color: '#e6a23c',
		trend: -2.1,
		trendText: text.common.trend
	},
	{
		title: text.analytics.totalSales,
		value: 156789,
		suffix: text.common.yuan,
		icon: 'Money',
		color: '#f56c6c',
		trend: 15.8,
		trendText: text.common.trend
	}
])

// 图表数据
const trendData = ref([
	{ date: '周一', value: 820 },
	{ date: '周二', value: 932 },
	{ date: '周三', value: 901 },
	{ date: '周四', value: 934 },
	{ date: '周五', value: 1290 },
	{ date: '周六', value: 1330 },
	{ date: '周日', value: 1320 }
])

const barData = ref([
	{ category: '电子产品', value: 4200 },
	{ category: '服装鞋帽', value: 3800 },
	{ category: '食品饮料', value: 2900 },
	{ category: '家居用品', value: 2400 },
	{ category: '美妆护肤', value: 1800 },
	{ category: '其他', value: 1200 }
])

const pieData = ref([
	{ name: '线上渠道', value: 45, color: '#409eff' },
	{ name: '线下门店', value: 30, color: '#67c23a' },
	{ name: '代理渠道', value: 15, color: '#e6a23c' },
	{ name: '其他', value: 10, color: '#909399' }
])

const dateRange = ref<[Date, Date] | null>(null)
const trendPeriod = ref('week')
const loading = ref(false)

// 图表实例
let lineChart: echarts.ECharts | null = null
let barChart: echarts.ECharts | null = null
let pieChart: echarts.ECharts | null = null

const lineChartRef = ref<HTMLElement>()
const barChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()

// 初始化折线图
const initLineChart = () => {
	if (!lineChartRef.value) return
	lineChart = echarts.init(lineChartRef.value)
	lineChart.setOption({
		tooltip: { trigger: 'axis' },
		grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
		xAxis: {
			type: 'category',
			data: trendData.value.map(item => item.date),
			boundaryGap: false
		},
		yAxis: { type: 'value' },
		series: [
			{
				name: '访问量',
				type: 'line',
				smooth: true,
				data: trendData.value.map(item => item.value),
				areaStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
						{ offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
					])
				},
				itemStyle: { color: '#409eff' },
				lineStyle: { width: 2 }
			}
		]
	})
}

// 初始化柱状图
const initBarChart = () => {
	if (!barChartRef.value) return
	barChart = echarts.init(barChartRef.value)
	barChart.setOption({
		tooltip: { trigger: 'axis' },
		grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
		xAxis: { type: 'category', data: barData.value.map(item => item.category) },
		yAxis: { type: 'value' },
		series: [
			{
				name: '销售额',
				type: 'bar',
				data: barData.value.map(item => item.value),
				itemStyle: {
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
						{ offset: 0, color: '#409eff' },
						{ offset: 1, color: '#79bbff' }
					]),
					borderRadius: [4, 4, 0, 0]
				},
				barWidth: '50%'
			}
		]
	})
}

// 初始化饼图
const initPieChart = () => {
	if (!pieChartRef.value) return
	pieChart = echarts.init(pieChartRef.value)
	pieChart.setOption({
		tooltip: { trigger: 'item', formatter: '{b}: {c}% ({d}%)' },
		legend: { bottom: '5%', left: 'center' },
		series: [
			{
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: '#fff',
					borderWidth: 2
				},
				label: { show: true, formatter: '{b}: {c}%' },
				emphasis: {
					label: { show: true, fontSize: 14, fontWeight: 'bold' }
				},
				data: pieData.value.map(item => ({
					name: item.name,
					value: item.value,
					itemStyle: { color: item.color }
				}))
			}
		]
	})
}

// 响应窗口变化
const handleResize = () => {
	lineChart?.resize()
	barChart?.resize()
	pieChart?.resize()
}

const handleDateChange = () => {
	// 日期范围变化，重新加载数据
	loading.value = true
	setTimeout(() => {
		loading.value = false
	}, 500)
}

const handlePeriodChange = () => {
	// 切换周期，重新加载趋势数据
	loading.value = true
	setTimeout(() => {
		loading.value = false
	}, 300)
}

onMounted(() => {
	nextTick(() => {
		initLineChart()
		initBarChart()
		initPieChart()
	})
	window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
	window.removeEventListener('resize', handleResize)
	lineChart?.dispose()
	barChart?.dispose()
	pieChart?.dispose()
})
</script>

<style lang="scss" scoped>
.analytics-page {
	padding: 20px;

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;

		h2 {
			margin: 0;
			font-size: 18px;
			font-weight: 600;
		}
	}

	.content {
		background: #fff;
		border-radius: 8px;
		padding: 20px;
	}

	.stat-cards {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 20px;
		margin-bottom: 20px;

		.stat-card {
			display: flex;
			align-items: center;
			padding: 20px;
			background: #fafafa;
			border-radius: 8px;
			transition: all 0.3s;

			&:hover {
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
			}

			.stat-icon {
				width: 56px;
				height: 56px;
				border-radius: 12px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 16px;

				.el-icon {
					font-size: 28px;
					color: #fff;
				}
			}

			.stat-info {
				flex: 1;

				.stat-title {
					font-size: 13px;
					color: #909399;
					margin-bottom: 8px;
				}

				.stat-value {
					font-size: 24px;
					font-weight: 600;
					color: #303133;
					line-height: 1.2;

					.stat-suffix {
						font-size: 14px;
						font-weight: normal;
						color: #909399;
					}
				}

				.stat-trend {
					font-size: 12px;
					margin-top: 4px;
					display: flex;
					align-items: center;
					gap: 2px;

					&.up {
						color: #67c23a;
					}

					&.down {
						color: #f56c6c;
					}

					.trend-text {
						color: #909399;
						margin-left: 4px;
					}
				}
			}
		}
	}

	.charts-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20px;

		.chart-card {
			.card-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.chart-container {
				height: 280px;
			}

			&.chart-line {
				grid-column: span 2;
			}
		}
	}
}

@media (max-width: 1200px) {
	.stat-cards {
		grid-template-columns: repeat(2, 1fr);
	}
}

@media (max-width: 768px) {
	.stat-cards {
		grid-template-columns: 1fr;
	}

	.charts-grid {
		grid-template-columns: 1fr;

		.chart-card.chart-line {
			grid-column: span 1;
		}
	}
}
</style>
