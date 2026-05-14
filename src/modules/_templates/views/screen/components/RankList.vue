<template>
	<div class="rank-list">
		<div class="list-header">
			<span class="list-title">排行榜</span>
			<el-radio-group v-model="currentType" size="small" @change="handleTypeChange">
				<el-radio-button value="top">TOP 5</el-radio-button>
				<el-radio-button value="bottom">BOTTOM 5</el-radio-button>
			</el-radio-group>
		</div>
		<div class="list-body">
			<div
				v-for="(item, index) in data"
				:key="item.rank"
				class="rank-item"
				:class="{ 'is-top': item.rank <= 3 }"
			>
				<div class="rank-badge" :class="`rank-${item.rank}`">
					<template v-if="item.rank === 1">
						<el-icon color="#ffd700"><StarFilled /></el-icon>
					</template>
					<template v-else-if="item.rank === 2">
						<el-icon color="#c0c0c0"><StarFilled /></el-icon>
					</template>
					<template v-else-if="item.rank === 3">
						<el-icon color="#cd7f32"><StarFilled /></el-icon>
					</template>
					<template v-else>
						<span>{{ item.rank }}</span>
					</template>
				</div>
				<div class="rank-info">
					<div class="rank-name">{{ item.name }}</div>
					<div class="rank-value">{{ formatMoney(item.value) }}</div>
				</div>
				<div class="rank-trend" :class="item.trend >= 0 ? 'up' : 'down'">
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

<style lang="scss" scoped>
.rank-list {
	background: #fff;
	border-radius: 16px;
	padding: 20px;
	border: 1px solid rgba(0, 0, 0, 0.06);
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
	height: 100%;
	display: flex;
	flex-direction: column;

	.list-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
		padding-bottom: 12px;
		border-bottom: 1px dashed #e5e7eb;

		.list-title {
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
				background: linear-gradient(180deg, #f56c6c 0%, #fab6b6 100%);
				border-radius: 2px;
			}
		}
	}

	.list-body {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8px;
		overflow-y: auto;

		.rank-item {
			display: flex;
			align-items: center;
			gap: 12px;
			padding: 12px 16px;
			background: #f8fafc;
			border-radius: 12px;
			transition: all 0.2s;

			&:hover {
				background: #f0f2f5;
				transform: translateX(4px);
			}

			&.is-top {
				background: linear-gradient(135deg, #fff9f0 0%, #fff5e6 100%);
				border: 1px solid rgba(245, 108, 108, 0.1);
			}

			.rank-badge {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 32px;
				height: 32px;
				border-radius: 50%;
				background: #e4e7ed;
				font-size: 14px;
				font-weight: 600;
				color: #606266;
				flex-shrink: 0;

				&.rank-1 {
					background: linear-gradient(135deg, #ffd700 0%, #ffec8b 100%);
					color: #8b6914;
					box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
				}

				&.rank-2 {
					background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
					color: #5a5a5a;
					box-shadow: 0 2px 8px rgba(192, 192, 192, 0.4);
				}

				&.rank-3 {
					background: linear-gradient(135deg, #cd7f32 0%, #daa06d 100%);
					color: #fff;
					box-shadow: 0 2px 8px rgba(205, 127, 50, 0.4);
				}
			}

			.rank-info {
				flex: 1;
				min-width: 0;

				.rank-name {
					font-size: 14px;
					font-weight: 600;
					color: #303133;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.rank-value {
					font-size: 13px;
					color: #909399;
					margin-top: 2px;
				}
			}

			.rank-trend {
				display: flex;
				align-items: center;
				gap: 2px;
				font-size: 13px;
				font-weight: 600;
				padding: 4px 10px;
				border-radius: 20px;

				&.up {
					color: #10b981;
					background: rgba(16, 185, 129, 0.1);
				}

				&.down {
					color: #ef4444;
					background: rgba(239, 68, 68, 0.1);
				}
			}
		}
	}
}
</style>
