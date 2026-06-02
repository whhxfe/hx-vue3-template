<template>
	<div class="relative bg-bg-elevated rounded-2xl p-5 border border-border-base shadow-base h-full flex flex-col">
		<div class="flex justify-between items-center mb-4 pb-3 border-b border-dashed border-border-base">
			<span class="text-base font-semibold text-text-primary relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-4 before:bg-gradient-to-b before:from-danger before:to-danger/50 before:rounded-sm">
				排行榜
			</span>
			<el-radio-group v-model="currentType" size="small" @change="handleTypeChange">
				<el-radio-button value="top">TOP 5</el-radio-button>
				<el-radio-button value="bottom">BOTTOM 5</el-radio-button>
			</el-radio-group>
		</div>
		<div class="flex-1 flex flex-col gap-2 overflow-y-auto">
			<div
				v-for="(item, index) in data"
				:key="item.rank"
				class="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer hover:translate-x-1"
				:class="item.rank <= 3
					? 'bg-warning/5 border border-warning/10'
					: 'bg-bg-hover hover:bg-bg-active'"
			>
				<div
					class="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 text-sm font-semibold"
					:class="item.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-200 text-yellow-800 shadow-yellow-400/40' : item.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-100 text-gray-600 shadow-gray-300/40' : item.rank === 3 ? 'bg-gradient-to-br from-amber-500 to-amber-300 text-white shadow-amber-500/40' : 'bg-bg-hover text-text-regular'"
					:style="item.rank <= 3 ? { boxShadow: item.rank === 1 ? '0 2px 8px rgba(250, 204, 21, 0.4)' : item.rank === 2 ? '0 2px 8px rgba(192, 192, 192, 0.4)' : '0 2px 8px rgba(205, 127, 50, 0.4)' } : {}"
				>
					<template v-if="item.rank <= 3">
						<el-icon :color="item.rank === 1 ? '#ffd700' : item.rank === 2 ? '#c0c0c0' : '#cd7f32'" :size="16"><StarFilled /></el-icon>
					</template>
					<template v-else>{{ item.rank }}</template>
				</div>
				<div class="flex-1 min-w-0">
					<div class="text-sm font-semibold text-text-primary truncate">{{ item.name }}</div>
					<div class="text-xs text-text-secondary mt-0.5">{{ formatMoney(item.value) }}</div>
				</div>
				<div
					class="flex items-center gap-0.5 text-xs font-semibold px-2.5 py-1 rounded-full"
					:class="item.trend >= 0 ? 'text-success bg-success/10' : 'text-danger bg-danger/10'"
				>
					<el-icon v-if="item.trend >= 0"><ArrowUp /></el-icon>
					<el-icon v-else><ArrowDown /></el-icon>
					<span>{{ Math.abs(item.trend) }}%</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { StarFilled, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import type { RankItem } from '@/modules/_templates/api/screen/types'

interface Props {
	data: RankItem[]
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
