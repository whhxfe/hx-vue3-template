<template>
	<div class="overview-cards">
		<div v-for="card in cards" :key="card.key" class="card-item" :style="{ '--accent-color': card.color }">
			<div class="card-icon">
				<el-icon :size="32" color="#fff">
					<component :is="card.icon" />
				</el-icon>
			</div>
			<div class="card-content">
				<div class="card-value">{{ card.value }}</div>
				<div class="card-label">{{ card.label }}</div>
				<div class="card-trend" :class="card.trend >= 0 ? 'up' : 'down'">
					<el-icon v-if="card.trend >= 0"><ArrowUp /></el-icon>
					<el-icon v-else><ArrowDown /></el-icon>
					<span>{{ Math.abs(card.trend) }}%</span>
					<span class="trend-label">环比</span>
				</div>
			</div>
			<div class="card-decoration"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUp, ArrowDown, Money, ShoppingCart, TrendCharts, CircleCheck } from '@element-plus/icons-vue'
import type { OverviewData } from '@/modules/_templates/api/screen/types'

interface Props {
	data: OverviewData | null
	loading?: boolean
}

const props = defineProps<Props>()

const cards = computed(() => {
	if (!props.data) {
		return []
	}
	return [
		{
			key: 'totalAmount',
			icon: Money,
			color: '#409eff',
			value: formatMoney(props.data.totalAmount),
			label: '总销售额',
			trend: props.data.growth
		},
		{
			key: 'totalOrders',
			icon: ShoppingCart,
			color: '#67c23a',
			value: formatNumber(props.data.totalOrders),
			label: '订单总数',
			trend: props.data.growth * 0.8
		},
		{
			key: 'avgPrice',
			icon: TrendCharts,
			color: '#e6a23c',
			value: formatMoney(props.data.avgPrice),
			label: '平均客单价',
			trend: props.data.growth * 0.6
		},
		{
			key: 'completionRate',
			icon: CircleCheck,
			color: '#f56c6c',
			value: props.data.completionRate + '%',
			label: '完成率',
			trend: 5.2
		}
	]
})

const formatMoney = (value: number): string => {
	if (value >= 1000000) {
		return (value / 1000000).toFixed(2) + 'M'
	}
	if (value >= 1000) {
		return (value / 1000).toFixed(1) + 'K'
	}
	return value.toFixed(2)
}

const formatNumber = (value: number): string => {
	return value.toLocaleString()
}
</script>

<style lang="scss" scoped>
.overview-cards {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 16px;

	.card-item {
		position: relative;
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 20px;
		background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
		border-radius: 16px;
		border: 1px solid rgba(0, 0, 0, 0.06);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
		overflow: hidden;
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
		}

		.card-icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60px;
			height: 60px;
			border-radius: 16px;
			background: linear-gradient(135deg, var(--accent-color) 0%, var(--accent-color)dd 100%);
			box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
			flex-shrink: 0;
		}

		.card-content {
			flex: 1;
			min-width: 0;
			position: relative;
			z-index: 1;

			.card-value {
				font-size: 28px;
				font-weight: 700;
				color: #1a1a2e;
				line-height: 1.2;
				background: linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%);
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
				background-clip: text;
			}

			.card-label {
				font-size: 14px;
				color: #6b7280;
				margin-top: 4px;
				font-weight: 500;
			}

			.card-trend {
				display: flex;
				align-items: center;
				gap: 4px;
				margin-top: 8px;
				font-size: 13px;
				font-weight: 600;

				&.up {
					color: #10b981;
				}

				&.down {
					color: #ef4444;
				}

				.trend-label {
					color: #9ca3af;
					font-weight: 400;
					margin-left: 4px;
				}
			}
		}

		.card-decoration {
			position: absolute;
			right: -20px;
			bottom: -20px;
			width: 100px;
			height: 100px;
			border-radius: 50%;
			background: linear-gradient(135deg, var(--accent-color) 0%, transparent 70%);
			opacity: 0.1;
		}
	}
}
</style>
