<template>
	<div class="category-chart">
		<div class="chart-header">
			<span class="chart-title">销售分类</span>
		</div>
		<div class="chart-body">
			<div class="pie-wrapper">
				<v-chart :option="pieOption" autoresize />
			</div>
			<div class="legend-list">
				<div v-for="(item, index) in data" :key="item.name" class="legend-item">
					<span class="legend-dot" :style="{ background: colors[index % colors.length] }"></span>
					<span class="legend-name">{{ item.name }}</span>
					<span class="legend-value">{{ formatMoney(item.value) }}</span>
					<span class="legend-percent">{{ item.percentage.toFixed(1) }}%</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CategoryItem } from '@/modules/_templates/api/screen/types'

interface Props {
	data: CategoryItem[]
}

const props = defineProps<Props>()

const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#c71585']

const pieOption = computed(() => ({
	tooltip: {
		trigger: 'item',
		formatter: '{b}: {c} ({d}%)',
		backgroundColor: 'rgba(255, 255, 255, 0.95)',
		borderColor: '#e4e7ed',
		borderWidth: 1,
		textStyle: {
			color: '#606266'
		}
	},
	series: [
		{
			name: '销售分类',
			type: 'pie',
			radius: ['45%', '70%'],
			center: ['50%', '50%'],
			avoidLabelOverlap: false,
			itemStyle: {
				borderRadius: 8,
				borderColor: '#fff',
				borderWidth: 3
			},
			label: {
				show: false,
				position: 'center'
			},
			emphasis: {
				label: {
					show: true,
					fontSize: 14,
					fontWeight: 'bold',
					color: '#303133'
				}
			},
			labelLine: {
				show: false
			},
			data: props.data.map((item, index) => ({
				value: item.value,
				name: item.name,
				itemStyle: {
					color: colors[index % colors.length]
				}
			}))
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
.category-chart {
	background: #fff;
	border-radius: 16px;
	padding: 20px;
	border: 1px solid rgba(0, 0, 0, 0.06);
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
	height: 100%;

	.chart-header {
		margin-bottom: 16px;
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
				background: linear-gradient(180deg, #67c23a 0%, #95d475 100%);
				border-radius: 2px;
			}
		}
	}

	.chart-body {
		display: flex;
		flex-direction: column;
		gap: 16px;

		.pie-wrapper {
			height: 200px;
		}

		.legend-list {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 8px;

			.legend-item {
				display: flex;
				align-items: center;
				gap: 8px;
				padding: 8px 12px;
				background: #f8fafc;
				border-radius: 8px;
				transition: all 0.2s;

				&:hover {
					background: #f0f2f5;
				}

				.legend-dot {
					width: 10px;
					height: 10px;
					border-radius: 50%;
					flex-shrink: 0;
				}

				.legend-name {
					flex: 1;
					font-size: 13px;
					color: #606266;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.legend-value {
					font-size: 13px;
					font-weight: 600;
					color: #303133;
				}

				.legend-percent {
					font-size: 12px;
					color: #909399;
					min-width: 45px;
					text-align: right;
				}
			}
		}
	}
}
</style>
