<template>
	<div class="grid grid-cols-4 gap-4">
		<div v-for="card in cards" :key="card.key" class="relative flex items-center gap-4 p-5 bg-bg-elevated rounded-2xl border border-border-base shadow-base overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary" :style="{ '--accent-color': card.color }">
			<!-- 图标 -->
			<div class="flex items-center justify-center w-15 h-15 rounded-2xl flex-shrink-0 shadow-md" :style="{ background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}dd 100%)` }">
				<el-icon :size="32" color="#fff">
					<component :is="card.icon" />
				</el-icon>
			</div>
			<!-- 内容 -->
			<div class="flex-1 min-w-0 relative z-1">
				<div class="text-2xl font-bold leading-tight truncate bg-gradient-to-r from-text-primary to-text-regular bg-clip-text text-transparent">{{ card.value }}</div>
				<div class="text-sm text-text-secondary font-medium mt-1 truncate">{{ card.label }}</div>
				<div
					class="flex items-center gap-1 mt-2 text-xs font-semibold"
					:class="card.trend >= 0 ? 'text-success' : 'text-danger'"
				>
					<el-icon v-if="card.trend >= 0"><ArrowUp /></el-icon>
					<el-icon v-else><ArrowDown /></el-icon>
					<span>{{ Math.abs(card.trend) }}%</span>
					<span class="text-text-placeholder font-normal">环比</span>
				</div>
			</div>
			<!-- 装饰圆 -->
			<div class="absolute -right-5 -bottom-5 w-25 h-25 rounded-full opacity-10 bg-gradient-to-br from-[var(--accent-color)] to-transparent"></div>
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
