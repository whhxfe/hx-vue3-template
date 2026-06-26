<template>
	<el-card class="analysis-card" shadow="hover">
		<template #header>
			<div class="card-header">
				<div class="card-header-left">
					<el-icon class="card-icon"><FolderOpened /></el-icon>
					<span class="card-title">大文件分析</span>
				</div>
				<el-button class="more-btn" text type="primary" @click.stop="handleOpenDialog">
					更多
					<el-icon class="el-icon--right"><ArrowRight /></el-icon>
				</el-button>
			</div>
		</template>
		<div v-loading="loading" class="card-content">
			<div class="stat-item">
				<span class="stat-label">大文件数量</span>
				<span class="stat-value highlight">{{ data.fileCount || 0 }}</span>
			</div>
			<el-divider />
			<div class="stat-item">
				<span class="stat-label">最常产生大文件应用</span>
				<span class="stat-value">{{ data.topApp || '-' }}</span>
			</div>
			<el-divider />
			<div class="stat-item">
				<span class="stat-label">最常使用大文件类型</span>
				<span class="stat-value">{{ data.topFileType || '-' }}</span>
			</div>
		</div>
	</el-card>

	<!-- 详情弹窗 -->
	<el-dialog v-model="dialogVisible" title="大文件分析" :width="dialogConfig.width" :top="dialogConfig.top" destroy-on-close append-to-body>
		<div class="large-file-dialog-content">
			<div class="list-header">
				<span class="list-title">大文件列表（{{ pagination.total }}）</span>
				<el-input
					v-model="searchKeyword"
					placeholder="搜索关键词"
					clearable
					style="width: 200px"
					@clear="handleSearch"
					@keyup.enter="handleSearch"
				>
					<template #prefix><el-icon><Search /></el-icon></template>
				</el-input>
			</div>
			<HxTable
				v-loading="detailLoading"
				:columns="columns"
				:data="detailData"
				:show-pagination="true"
				:current-page="pagination.currentPage"
				:page-size="pagination.pageSize"
				:total="pagination.total"
				border
				@size-change="handleSizeChange"
				@current-change="handlePageChange"
			/>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useAsyncState } from "@vueuse/core"
import { FolderOpened, ArrowRight, Search } from "@element-plus/icons-vue"
import { HxTable } from "@whhx/ui"
import type { TableColumn } from "@whhx/ui"
import { ua } from "@/modules/ktc/api"
import type { LargeFileOverview, LargeFileItem } from "@/modules/ktc/api/tum/uc/ua"
import { onlineBehaviorDialogConfig as dialogConfig } from "@/modules/ktc/config"

defineOptions({ name: "LargeFileCard" })

const props = defineProps<{
	unitId: number
	dateRange?: [string, string] | null
}>()

// 卡片概览（使用 useAsyncState 统一管理 loading）
const { state: data, isLoading: loading, execute: loadData } = useAsyncState<LargeFileOverview>(
	async () => {
		if (!props.unitId) return { fileCount: 0, topApp: "", topFileType: "" }
		const res = await ua.getLargeFileOverview({
			unitId: props.unitId,
			startDate: props.dateRange?.[0],
			endDate: props.dateRange?.[1]
		})
		return res.data || { fileCount: 0, topApp: "", topFileType: "" }
	},
	{ fileCount: 0, topApp: "", topFileType: "" },
	{ immediate: false, resetOnExecute: false }
)

const dialogVisible = ref(false)
const searchKeyword = ref("")
const pagination = ref({
	currentPage: 1,
	pageSize: 10,
	total: 0
})

const columns: TableColumn[] = [
	{ type: "index", label: "序号", width: 60, align: "center" },
	{ prop: "filename", label: "大文件名称", width: "auto" },
	{ prop: "type", label: "文件类型", width: 120 },
	{ prop: "size", label: "文件大小", width: 140, align: "right" },
	{ prop: "app", label: "所属应用", width: 140 },
	{ prop: "createTime", label: "截获时间", width: 180, align: "center", sortable: true }
]

const { state: detailData, isLoading: detailLoading, execute: loadDetail } = useAsyncState<LargeFileItem[]>(
	async () => {
		if (!props.unitId) return []
		const res = await ua.getLargeFileDetail({
			unitId: props.unitId,
			startDate: props.dateRange?.[0],
			endDate: props.dateRange?.[1]
		})
		pagination.value.total = res.data?.total || 0
		return res.data?.list || []
	},
	[],
	{ immediate: false, resetOnExecute: false }
)

const handleOpenDialog = () => {
	searchKeyword.value = ""
	pagination.value.currentPage = 1
	pagination.value.pageSize = 10
	loadDetail(0)
	dialogVisible.value = true
}

const handleSearch = () => {
	pagination.value.currentPage = 1
	loadDetail(0)
}

const handleSizeChange = (size: number) => {
	pagination.value.pageSize = size
	pagination.value.currentPage = 1
	loadDetail(0)
}

const handlePageChange = (page: number) => {
	pagination.value.currentPage = page
	loadDetail(0)
}

watch(() => [props.unitId, props.dateRange], () => loadData(0), { immediate: true })
</script>

<style lang="scss" scoped>
.analysis-card {
	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.card-header-left {
			display: flex;
			align-items: center;
			gap: 8px;
			.card-icon { font-size: 18px; color: var(--el-color-primary); }
			.card-title { font-size: 14px; font-weight: 600; }
		}
		.more-btn { padding: 0; font-size: 12px; }
	}
	.card-content {
		min-height: 80px;
		.stat-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 8px 0;
			.stat-label { font-size: 13px; color: var(--el-text-color-secondary); }
			.stat-value {
				font-size: 14px;
				font-weight: 600;
				color: var(--el-text-color-primary);
				&.highlight { color: var(--el-color-primary); font-size: 18px; }
			}
		}
		.el-divider { margin: 8px 0; }
	}
}

.large-file-dialog-content {
	.list-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--el-border-color-lighter);

		.list-title {
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