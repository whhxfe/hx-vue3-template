<template>
	<div class="relative bg-bg-elevated rounded-2xl p-5 border border-border-base shadow-base">
		<div class="flex justify-between items-center mb-5 pb-3 border-b border-dashed border-border-base">
			<span class="text-base font-semibold text-text-primary relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-4 before:bg-gradient-to-b before:from-primary before:to-primary/50 before:rounded-sm">
				销售趋势
			</span>
			<el-radio-group v-model="currentType" size="small" @change="handleTypeChange">
				<el-radio-button value="month">月度</el-radio-button>
				<el-radio-button value="year">年度</el-radio-button>
			</el-radio-group>
		</div>
		<div class="h-80">
			<v-chart :option="chartOption" autoresize />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePreferredDark } from '@vueuse/core'
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
const prefersDark = usePreferredDark()

const handleTypeChange = (value: string) => {
	emit('change', value)
}

// 主题适配颜色
const chartColors = computed(() => ({
	bgOverlay: prefersDark.value ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
	border: prefersDark.value ? '#3a3a3c' : '#e4e7ed',
	textPrimary: prefersDark.value ? '#b4b4b4' : '#606266',
	splitLine: prefersDark.value ? '#2d2d2d' : '#f0f0f0',
	barGradientEnd: prefersDark.value ? '#79bbff' : '#79bbff',
}))

const chartOption = computed(() => ({
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'cross',
			crossStyle: {
				color: '#999'
			}
		},
		backgroundColor: chartColors.value.bgOverlay,
		borderColor: chartColors.value.border,
		borderWidth: 1,
		textStyle: {
			color: chartColors.value.textPrimary
		}
	},
	legend: {
		data: ['销售额', '订单量'],
		bottom: 0,
		textStyle: {
			color: chartColors.value.textPrimary
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
				color: chartColors.value.border
			}
		},
		axisLabel: {
			color: chartColors.value.textPrimary
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
				color: chartColors.value.textPrimary,
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
					color: chartColors.value.splitLine
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
				color: chartColors.value.textPrimary
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
						{ offset: 1, color: chartColors.value.barGradientEnd }
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
