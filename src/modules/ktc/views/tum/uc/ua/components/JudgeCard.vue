<template>
	<el-card class="judge-card" shadow="hover">
		<!-- 研判结论（tag 独占一行） -->
		<div class="judge-conclusion">
			<span class="conclusion-label">研判结论</span>
			<el-tag :type="getCategoryTagType(record.controlCategory)" size="default">
				{{ record.controlCategoryName }}
			</el-tag>
		</div>

		<el-divider class="card-divider" />

		<!-- 研判单位 / 研判人 / 研判时间（一行三列） -->
		<div class="judge-meta">
			<div class="meta-item">
				<span class="meta-label">研判单位</span>
				<span class="meta-value" :title="record.judgeUnit">{{ record.judgeUnit || "—" }}</span>
			</div>
			<div class="meta-item">
				<span class="meta-label">研判人</span>
				<span class="meta-value" :title="record.judgeUser">{{ record.judgeUser || "—" }}</span>
			</div>
			<div class="meta-item">
				<span class="meta-label">研判时间</span>
				<span class="meta-value" :title="record.judgeTime">{{ record.judgeTime || "—" }}</span>
			</div>
		</div>

		<el-divider class="card-divider" />

		<!-- 研判依据（独占一行） -->
		<div class="judge-reason">
			<span class="reason-label">研判依据</span>
			<div class="reason-content" :title="record.judgeReason">
				{{ record.judgeReason || "—" }}
			</div>
		</div>
	</el-card>
</template>

<script setup lang="ts">
import type { JudgeRecord } from "@/modules/ktc/api/tum/uc/ua"

defineOptions({ name: "JudgeCard" })

defineProps<{
	record: JudgeRecord
}>()

const getCategoryTagType = (category: string): "danger" | "warning" | "info" | "success" | "primary" => {
	const map: Record<string, "danger" | "warning" | "info"> = {
		focus: "danger",
		level1: "warning",
		level2: "info",
		level3: "info",
		custom: "primary",
		other: "info"
	}
	return map[category] || "info"
}
</script>

<style lang="scss" scoped>
.judge-card {
	border-radius: 6px;
	height: 100%;

	:deep(.el-card__body) {
		padding: 16px 18px;
	}

	.card-divider {
		margin: 12px 0;
	}
}

.judge-conclusion {
	display: flex;
	align-items: center;
	gap: 10px;

	.conclusion-label {
		font-size: 13px;
		color: var(--el-text-color-secondary);
		flex-shrink: 0;
	}
}

.judge-meta {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 12px 16px;

	.meta-item {
		display: flex;
		align-items: center;
		gap: 6px;
		min-width: 0;

		.meta-label {
			font-size: 13px;
			color: var(--el-text-color-secondary);
			flex-shrink: 0;
		}

		.meta-value {
			font-size: 13px;
			color: var(--el-text-color-primary);
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			min-width: 0;
		}
	}
}

.judge-reason {
	display: flex;
	align-items: flex-start;
	gap: 6px;

	.reason-label {
		font-size: 13px;
		color: var(--el-text-color-secondary);
		flex-shrink: 0;
	}

	.reason-content {
		font-size: 13px;
		color: var(--el-text-color-primary);
		line-height: 1.6;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		word-break: break-all;
	}
}
</style>
