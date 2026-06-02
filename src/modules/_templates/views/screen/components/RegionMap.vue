<template>
	<div class="relative bg-bg-elevated rounded-2xl p-5 border border-border-base shadow-base h-full flex flex-col">
		<div class="mb-5 pb-3 border-b border-dashed border-border-base">
			<span class="text-base font-semibold text-text-primary relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-4 before:bg-gradient-to-b before:from-warning before:to-warning/50 before:rounded-sm">
				区域分布
			</span>
		</div>
		<div class="flex-1">
			<v-chart :option="chartOption" autoresize />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePreferredDark } from '@vueuse/core'
import type { RegionItem } from '@/modules/_templates/api/screen/types'

interface Props {
	data: RegionItem[]
}

const props = defineProps<Props>()
const prefersDark = usePreferredDark()

const chartColors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#c71585', '#8e44ad']

const theme = computed(() => ({
	bgOverlay: prefersDark.value ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
	border: prefersDark.value ? '#3a3a3c' : '#e4e7ed',
	textPrimary: prefersDark.value ? '#b4b4b4' : '#606266',
	splitLine: prefersDark.value ? '#2d2d2d' : '#f0f0f0',
}))

const chartOption = computed(() => ({
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'shadow'
		},
		backgroundColor: theme.value.bgOverlay,
		borderColor: theme.value.border,
		borderWidth: 1,
		textStyle: {
			color: theme.value.textPrimary
		},
		formatter: (params: any) => {
			const item = params[0]
			const regionData = props.data.find((d) => d.region === item.name)
			if (!regionData) return item.name + ': ' + item.value
			return `
				<div style="font-weight: 600; margin-bottom: 4px;">${item.name}</div>
				<div>销售额: <span style="color: #409eff; font-weight: 600;">${formatMoney(regionData.value)}</span></div>
				<div>占比: <span style="color: #67c23a; font-weight: 600;">${regionData.percentage.toFixed(1)}%</span></div>
				<div>增长率: <span style="color: ${regionData.trend >= 0 ? '#10b981' : '#ef4444'}; font-weight: 600;">${regionData.trend >= 0 ? '+' : ''}${regionData.trend}%</span></div>
			`
		}
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		top: '5%',
		containLabel: true
	},
	xAxis: {
		type: 'value',
		axisLine: {
			show: false
		},
		axisLabel: {
			color: theme.value.textPrimary,
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
				color: theme.value.splitLine
			}
		}
	},
	yAxis: {
		type: 'category',
		data: props.data.map((item) => item.region),
		axisLine: {
			lineStyle: {
				color: theme.value.border
			}
		},
		axisLabel: {
			color: theme.value.textPrimary
		},
		axisTick: {
			show: false
		}
	},
	series: [
		{
			name: '销售额',
			type: 'bar',
			data: props.data.map((item) => item.value),
			itemStyle: {
				color: (params: any) => {
					return chartColors[params.dataIndex % chartColors.length]
				},
				borderRadius: [0, 6, 6, 0]
			},
			barWidth: '50%',
			label: {
				show: true,
				position: 'right',
				formatter: (params: any) => {
					const regionData = props.data[params.dataIndex]
					return regionData.percentage.toFixed(1) + '%'
				},
				color: theme.value.textPrimary,
				fontSize: 12
			}
		}
	]
}))

const formatMoney = (value: number): string => {
	if (value >= 1000000) {
		return (value / 1000000).toFixed(2) + 'M'
	}
	if (value >= 1000) {
		return (value / 1000).toFixed(1) + 'K'
	}
	return value.toFixed(0)
}
</script>
