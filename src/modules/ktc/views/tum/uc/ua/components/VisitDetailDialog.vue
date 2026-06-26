<template>
	<el-dialog :model-value="visible" title="网站访问次数" :width="dialogConfig.width" :top="dialogConfig.top" destroy-on-close append-to-body @update:model-value="$emit('update:visible', $event)">
		<div class="visit-detail-content">
			<div class="visit-info-grid">
				<HxLabelText label="网站域名" :text="website?.domain || '—'" />
				<HxLabelText label="IP地址" :text="website?.ip || '—'" />
				<HxLabelText label="关联手机号" :text="website?.relatedPhone || '—'" />
				<HxLabelText label="关联IMSI" :text="website?.imsi || '—'" />
				<HxLabelText label="首次发现时间" :text="website?.firstFoundTime || '—'" />
				<HxLabelText label="最近发现时间" :text="website?.lastFoundTime || '—'" />
				<HxLabelText label="访问次数" :text="String(website?.visitCount || 0)" />
			</div>
			<HxTable
				v-loading="loading"
				:columns="columns"
				:data="data"
				:show-pagination="true"
				:current-page="pagination.currentPage"
				:page-size="pagination.pageSize"
				:total="pagination.total"
				border
				@size-change="$emit('size-change', $event)"
				@current-change="$emit('page-change', $event)"
			/>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { HxTable, HxLabelText } from "@whhx/ui"
import type { TableColumn } from "@whhx/ui"
import type { WebsiteItem, WebsiteVisitDetail } from "@/modules/ktc/api/tum/uc/ua"
import { onlineBehaviorDialogConfig as dialogConfig } from "@/modules/ktc/config"

defineOptions({ name: "VisitDetailDialog" })

defineProps<{
	visible: boolean
	website: WebsiteItem | null
	data: WebsiteVisitDetail[]
	loading: boolean
	pagination: {
		currentPage: number
		pageSize: number
		total: number
	}
}>()

defineEmits<{
	"update:visible": [value: boolean]
	"size-change": [size: number]
	"page-change": [page: number]
}>()

const columns = computed<TableColumn[]>(() => [
	{ type: "index", label: "序号", width: 60, align: "center" },
	{ prop: "visitTime", label: "访问时间", width: 180, align: "center" },
	{ prop: "baseStationId", label: "基站编号", width: 140 },
	{ prop: "relatedPhone", label: "关联手机号", width: "auto" }
])
</script>

<style lang="scss" scoped>
.visit-detail-content {
	.visit-info-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 16px 24px;
		margin-bottom: 24px;
		padding: 20px;
		background: var(--el-fill-color-lighter);
		border-radius: 8px;
		border: 1px solid var(--el-border-color-extra-light);
	}
}
</style>
