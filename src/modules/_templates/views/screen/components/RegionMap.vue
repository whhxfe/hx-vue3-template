<template>
	<div class="region-map">
		<div class="chart-header">
			<span class="chart-title">区域分布</span>
		</div>
		<div class="chart-body">
			<v-chart :option="chartOption" autoresize />
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RegionItem } from '@/modules/_templates/api/screen/types'

interface Props {
	data: RegionItem[]
}

const props = defineProps<Props>()

const chartOption = computed(() => ({
	tooltip: {
		trigger: 'axis',
		axisPointer: {
			type: 'shadow'
		},
		backgroundColor: 'rgba(255, 255, 255, 0.95)',
		borderColor: '#e4e7ed',
		borderWidth: 1,
		textStyle: {
			color: '#606266'
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
	yAxis: {
		type: 'category',
		data: props.data.map((item) => item.region),
		axisLine: {
			lineStyle: {
				color: '#e4e7ed'
			}
		},
		axisLabel: {
			color: '#606266'
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
					const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#c71585', '#8e44ad']
					return colors[params.dataIndex % colors.length]
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
				color: '#909399',
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

<style lang="scss" scoped>
.region-map {
	background: #fff;
	border-radius: 16px;
	padding: 20px;
	border: 1px solid rgba(0, 0, 0, 0.06);
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
	height: 100%;

	.chart-header {
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
				background: linear-gradient(180deg, #e6a23c 0%, #f0b774 100%);
				border-radius: 2px;
			}
		}
	}

	.chart-body {
		height: 320px;
	}
}
</style>
