<template>
	<section id="section-basic" class="ua-section">
		<div class="section-header">
			<h3 class="section-title">基本信息</h3>
		</div>
		<div class="section-body" v-loading="loading">
			<template v-if="unitData">
				<!-- 第一行：账号、单元类型、管控类别 -->
				<div class="basic-top-row">
					<div class="account-info">
						<span class="account-label">当前{{ unitData.unitType === 'fixed_ip' ? 'IP' : 'ADSL' }}账号</span>
						<span class="account-value">{{ unitData.ip || unitData.adsl }}</span>
					</div>
					<div class="type-info">
						<span class="type-label">单元类型</span>
						<el-tag :type="unitData.unitType === 'fixed_ip' ? 'primary' : 'success'">
							{{ unitData.unitTypeName }}
						</el-tag>
					</div>
					<div class="category-info">
						<span class="category-label">管控类别</span>
						<el-tag :type="getCategoryTagType(unitData.controlCategory)">
							{{ unitData.controlCategoryName }}
						</el-tag>
					</div>
				</div>

				<!-- 详细信息 -->
				<div class="basic-detail">
					<div class="detail-grid">
						<HxLabelText label="端口数量" :text="String(unitData.portCount ?? '—')" />
						<HxLabelText label="终端数量" :text="String(unitData.terminalCount ?? '—')" />
						<HxLabelText label="IP所属地" :text="unitData.ipLocation || '—'" />
						<HxLabelText label="关注人员" :text="unitData.focusPerson || '—'" />
						<HxLabelText label="关注单位" :text="unitData.focusUnit || '—'" />
						<HxLabelText label="关注原因" :text="unitData.focusReason || '—'" />
						<HxLabelText label="预警类型" :text="unitData.warningTypeName || '—'" />
					</div>
				</div>
			</template>
		</div>
	</section>
</template>

<script setup lang="ts">
import { watch } from "vue"
import { useAsyncState } from "@vueuse/core"
import { HxLabelText } from "@whhx/ui"
import { uc } from "@/modules/ktc/api"
import type { ListItem } from "@/modules/ktc/api/tum/uc"

defineOptions({ name: "BasicInfo" })

const props = defineProps<{
	unitId: number
}>()

const { state: unitData, isLoading: loading, execute: loadUnitData } = useAsyncState<ListItem | null>(
	async () => {
		if (!props.unitId) return null
		const res = await uc.getDetail(props.unitId)
		return res.data || null
	},
	null,
	{ immediate: false }
)

watch(() => props.unitId, (id) => {
	if (id) {
		loadUnitData()
	}
}, { immediate: true })

const getCategoryTagType = (category: string): "danger" | "warning" | "info" | "success" | "primary" => {
	const map: Record<string, "danger" | "warning" | "info"> = {
		focus: "danger",
		level1: "warning",
		level2: "info",
		level3: "info",
		other: "info"
	}
	return map[category] || "info"
}
</script>

<style lang="scss" scoped>
.ua-section {
	background: var(--el-bg-color);
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

	.section-header {
		padding: 16px 20px;
		border-bottom: 1px solid var(--el-border-color-lighter);

		.section-title {
			margin: 0;
			font-size: 15px;
			font-weight: 600;
			color: var(--el-text-color-primary);
			position: relative;
			padding-left: 12px;

			&::before {
				content: "";
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 3px;
				height: 16px;
				background: var(--el-color-primary);
				border-radius: 2px;
			}
		}
	}

	.section-body {
		padding: 20px;
		min-height: 120px;
	}
}

.basic-top-row {
	display: flex;
	align-items: center;
	gap: 32px;
	padding-bottom: 20px;
	border-bottom: 1px solid var(--el-border-color-lighter);
	margin-bottom: 20px;

	.account-info,
	.type-info,
	.category-info {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.account-label,
	.type-label,
	.category-label {
		font-size: 13px;
		color: var(--el-text-color-secondary);
	}

	.account-value {
		font-size: 18px;
		font-weight: 600;
		color: var(--el-text-color-primary);
	}
}

.detail-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16px 24px;
}
</style>
