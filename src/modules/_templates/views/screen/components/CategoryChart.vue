<template>
	<div class="relative bg-bg-elevated rounded-2xl p-5 border border-border-base shadow-base h-full flex flex-col">
		<div class="mb-4 pb-3 border-b border-dashed border-border-base">
			<span class="text-base font-semibold text-text-primary relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-4 before:bg-gradient-to-b before:from-success before:to-success/50 before:rounded-sm">
				销售分类
			</span>
		</div>
		<div class="flex-1 flex flex-col gap-4 overflow-hidden">
			<div class="h-50">
				<v-chart :option="pieOption" autoresize />
			</div>
			<div class="grid grid-cols-2 gap-2 overflow-y-auto">
				<div
					v-for="(item, index) in data"
					:key="item.name"
					class="flex items-center gap-2 p-2 rounded-lg bg-bg-hover transition-colors cursor-pointer hover:bg-bg-active"
				>
					<span class="w-2.5 h-2.5 rounded-full flex-shrink-0" :style="{ background: colors[index % colors.length] }"></span>
					<span class="flex-1 text-sm text-text-regular truncate">{{ item.name }}</span>
					<span class="text-sm font-semibold text-text-primary">{{ formatMoney(item.value) }}</span>
					<span class="text-xs text-text-placeholder min-w-10 text-right">{{ item.percentage.toFixed(1) }}%</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePreferredDark } from '@vueuse/core'
import type { CategoryItem } from '@/modules/_templates/api/screen/types'

interface Props {
	data: CategoryItem[]
}

const props = defineProps<Props>()
const prefersDark = usePreferredDark()
const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#c71585']

const chartColors = computed(() => ({
	bgOverlay: prefersDark.value ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
	border: prefersDark.value ? '#3a3a3c' : '#e4e7ed',
	textPrimary: prefersDark.value ? '#b4b4b4' : '#606266',
}))

const pieOption = computed(() => ({
	tooltip: {
		trigger: 'item',
		formatter: '{b}: {c} ({d}%)',
		backgroundColor: chartColors.value.bgOverlay,
		borderColor: chartColors.value.border,
		borderWidth: 1,
		textStyle: {
			color: chartColors.value.textPrimary
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
				borderColor: prefersDark.value ? '#1d1d1d' : '#fff',
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
					color: prefersDark.value ? '#e8e8e8' : '#303133'
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
