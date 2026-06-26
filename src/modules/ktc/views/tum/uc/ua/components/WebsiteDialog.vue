<template>
	<el-dialog :model-value="visible" title="访问网站分析" :width="dialogConfig.width" :top="dialogConfig.top" destroy-on-close append-to-body @update:model-value="$emit('update:visible', $event)">
		<div class="website-dialog-content">
			<div class="website-header">
				<span class="website-count">访问网站列表（{{ pagination.total }}）</span>
				<el-input
					:model-value="keyword"
					placeholder="搜索网站域名或IP"
					prefix-icon="Search"
					clearable
					style="width: 250px"
					@update:model-value="$emit('search', $event)"
				/>
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

<script setup lang="tsx">
import { computed } from "vue"
import { HxTable } from "@whhx/ui"
import type { TableColumn } from "@whhx/ui"
import type { WebsiteItem } from "@/modules/ktc/api/tum/uc/ua"
import { onlineBehaviorDialogConfig as dialogConfig } from "@/modules/ktc/config"

defineOptions({ name: "WebsiteDialog" })

defineProps<{
	visible: boolean
	data: WebsiteItem[]
	loading: boolean
	keyword: string
	pagination: {
		currentPage: number
		pageSize: number
		total: number
	}
}>()

const emit = defineEmits<{
	"update:visible": [value: boolean]
	search: [keyword: string]
	"size-change": [size: number]
	"page-change": [page: number]
	"open-visit-detail": [row: WebsiteItem]
}>()

const columns = computed<TableColumn[]>(() => [
	{ type: "index", label: "序号", width: 60, align: "center" },
	{ prop: "domain", label: "网站域名", width: "auto" },
	{ prop: "ip", label: "IP地址", width: 140 },
	{ prop: "firstFoundTime", label: "首次发现时间", width: 170, align: "center" },
	{ prop: "lastFoundTime", label: "最近发现时间", width: 170, align: "center" },
	{ prop: "imsi", label: "终端IMSI", width: 160 },
	{
		prop: "visitCount",
		label: "访问次数",
		width: 120,
		align: "center",
		sortable: "custom",
		render: (row: WebsiteItem) => {
			return (
				<el-button type="primary" link onClick={() => emit("open-visit-detail", row)}>
					{row.visitCount}
				</el-button>
			)
		}
	}
])
</script>

<style lang="scss" scoped>
.website-dialog-content {
	.website-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--el-border-color-lighter);

		.website-count {
			font-size: 16px;
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
				height: 18px;
				background: var(--el-color-primary);
				border-radius: 2px;
			}
		}
	}
}
</style>
