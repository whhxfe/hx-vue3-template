<template>
	<div class="trend-chart">
		<div class="chart-header">
			<span class="chart-title">销售趋势</span>
			<el-radio-group v-model="currentType" size="small" @change="handleTypeChange">
				<el-radio-button value="month">月度</el-radio-button>
				<el-radio-button value="year">年度</el-radio-button>
			</el-radio-group>
		</div>
		<div class="chart-body">
			<v-chart :option="chartOption" autoresize />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TrendItem } from '@/modules/_templates/api/screen/types'

interface Props {
	data: TrendItem[]
	type: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
	(type: 'change', value: string): void
}>()

const currentType = ref(props.type)

const handleTypeChange = (value: string) => {
	emit('change', value)
}

const chartOption = computed(() => ({
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'cross',
			crossStyle: {
				color: '#999'
			}
		},
		backgroundColor: 'rgba(255, 255, 255, 0.95)',
		borderColor: '#e4e7ed',
		borderWidth: 1,
		textStyle: {
			color: '#606266'
		}
	},
	legend: {
		data: ['销售额', '订单量'],
		bottom: 0,
		textStyle: {
			color: '#606266'
		}
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '15%',
		top: '10%',
		containLabel: true
	},
	xAxis: {
		type: 'category',
		data: props.data.map((item) => item.month),
		axisLine: {
			lineStyle: {
				color: '#e4e7ed'
			}
		},
		axisLabel: {
			color: '#606266'
		}
	},
	yAxis: [
		{
			type: 'value',
			name: '销售额',
			axisLine: {
				show: false
			},
			axisLabel: {
				color: '#606266',
				formatter: (value: number) => {
					if (value >= 1000000) {
						return (value / 1000000).toFixed(1) + 'M'
					}
					if (value >= 1000) {
						return (value / 1000).toFixed(0) + 'K'
					}
					return value
				}
			},
			splitLine: {
				lineStyle: {
					color: '#f0f0f0'
				}
			}
		},
		{
			type: 'value',
			name: '订单量',
			axisLine: {
				show: false
			},
			axisLabel: {
				color: '#606266'
			},
			splitLine: {
				show: false
			}
		}
	],
	series: [
		{
			name: '销售额',
			type: 'bar',
			data: props.data.map((item) => item.value),
			itemStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{ offset: 0, color: '#409eff' },
						{ offset: 1, color: '#79bbff' }
					]
				},
				borderRadius: [4, 4, 0, 0]
			},
			barWidth: '40%'
		},
		{
			name: '订单量',
			type: 'line',
			yAxisIndex: 1,
			smooth: true,
			symbol: 'circle',
			symbolSize: 8,
			data: props.data.map((item) => item.orderCount),
			lineStyle: {
				color: '#67c23a',
				width: 3
			},
			itemStyle: {
				color: '#67c23a'
			},
			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{ offset: 0, color: 'rgba(103, 194, 58, 0.2)' },
						{ offset: 1, color: 'rgba(103, 194, 58, 0.02)' }
					]
				}
			}
		}
	]
}))
</script>

<style lang="scss" scoped>
.trend-chart {
	background: #fff;
	border-radius: 16px;
	padding: 20px;
	border: 1px solid rgba(0, 0, 0, 0.06);
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

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
	}

	.chart-body {
		height: 320px;
	}
}
</style>
