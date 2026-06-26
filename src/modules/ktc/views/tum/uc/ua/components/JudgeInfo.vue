<template>
	<div id="section-judge" class="judge-info-container">
		<h4 class="sub-section-title">研判信息</h4>

		<div v-loading="loading" class="judge-body">
			<template v-if="records.length">
				<div class="card-grid">
					<div v-for="record in records" :key="record.id" class="card-cell">
						<JudgeCard :record="record" />
					</div>
				</div>
			</template>
			<template v-else>
				<div class="empty-state">
					<HxIcon type="iconify" name="ep:document" class="empty-icon" />
					<span>暂无研判信息</span>
				</div>
			</template>
		</div>

		<!-- 右下角 sticky 浮动按钮 -->
		<div class="floating-action">
			<el-button type="primary" class="judge-btn" size="large" @click="openDialog">
				<el-icon class="judge-btn-icon"><EditPen /></el-icon>
				<span>研判</span>
			</el-button>
		</div>

		<!-- 研判弹窗 -->
		<JudgeDialog v-model="dialogVisible" :unit-id="unitId" @success="handleJudgeSuccess" />
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useAsyncState } from "@vueuse/core"
import { EditPen } from "@element-plus/icons-vue"
import { HxIcon } from "@whhx/ui"
import { ua } from "@/modules/ktc/api"
import type { JudgeRecord } from "@/modules/ktc/api/tum/uc/ua"
import JudgeCard from "./JudgeCard.vue"
import JudgeDialog from "./JudgeDialog.vue"

defineOptions({ name: "JudgeInfo" })

const props = defineProps<{
	unitId: number
}>()

const dialogVisible = ref(false)

const { state: records, isLoading: loading, execute: loadRecords } = useAsyncState<JudgeRecord[]>(
	async () => {
		if (!props.unitId) return []
		const res = await ua.getJudgeList(props.unitId)
		return res.data?.list || []
	},
	[],
	{ immediate: false, resetOnExecute: false }
)

const openDialog = () => {
	if (!props.unitId) return
	dialogVisible.value = true
}

const handleJudgeSuccess = () => {
	loadRecords(0)
}

watch(() => props.unitId, (id) => {
	if (id) {
		loadRecords(0)
	}
}, { immediate: true })
</script>

<style lang="scss" scoped>
.judge-info-container {
	position: relative;
	padding: 16px;
	background: var(--el-fill-color-lighter);
	border-radius: 6px;
	border: 1px solid var(--el-border-color-extra-light);
}

.sub-section-title {
	margin: 0 0 16px 0;
	font-size: 14px;
	font-weight: 600;
	color: var(--el-text-color-primary);
	position: relative;
	padding-left: 10px;

	&::before {
		content: "";
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 3px;
		height: 14px;
		background: var(--el-color-primary);
		border-radius: 2px;
	}
}

.judge-body {
	min-height: 120px;
	max-height: 480px;
	overflow-y: auto;
	overflow-x: hidden;
	padding-right: 4px;

	&::-webkit-scrollbar {
		width: 6px;
	}

	&::-webkit-scrollbar-thumb {
		background: var(--el-border-color);
		border-radius: 3px;

		&:hover {
			background: var(--el-border-color-darker);
		}
	}

	&::-webkit-scrollbar-track {
		background: transparent;
	}
}

.card-grid {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 120px;
	color: var(--el-text-color-placeholder);
	gap: 8px;

	.empty-icon {
		font-size: 32px;
		opacity: 0.4;
	}
}

.floating-action {
	position: sticky;
	bottom: 16px;
	display: flex;
	justify-content: flex-end;
	margin-top: 12px;
	z-index: 2;
	pointer-events: none;

	.judge-btn {
		pointer-events: auto;
		box-shadow: 0 4px 12px rgba(64, 158, 255, 0.35);
		border-radius: 20px;
		padding: 10px 20px;

		.judge-btn-icon {
			font-size: 16px;
		}
	}
}
</style>
