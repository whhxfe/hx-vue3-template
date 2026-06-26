<template>
	<el-card class="analysis-card" shadow="hover">
		<template #header>
			<div class="card-header">
				<div class="card-header-left">
					<el-icon class="card-icon"><VideoCamera /></el-icon>
					<span class="card-title">多媒体分析</span>
				</div>
				<el-button class="more-btn" text type="primary" @click.stop="handleOpenDialog">
					更多
					<el-icon class="el-icon--right"><ArrowRight /></el-icon>
				</el-button>
			</div>
		</template>
		<div v-loading="loading" class="card-content">
			<div class="stat-item">
				<span class="stat-label">敏感图片数量</span>
				<span class="stat-value danger">{{ data.imageCount || 0 }}</span>
			</div>
			<el-divider />
			<div class="stat-item">
				<span class="stat-label">敏感音频数量</span>
				<span class="stat-value warning">{{ data.audioCount || 0 }}</span>
			</div>
			<el-divider />
			<div class="stat-item">
				<span class="stat-label">敏感视频数量</span>
				<span class="stat-value info">{{ data.videoCount || 0 }}</span>
			</div>
		</div>
	</el-card>

	<!-- 详情弹窗 -->
	<el-dialog v-model="dialogVisible" title="多媒体分析详情" :width="dialogConfig.width" :top="dialogConfig.top" destroy-on-close append-to-body>
		<div class="media-dialog-content">
			<div class="list-header">
				<span class="list-title">敏感多媒体文件列表</span>
			</div>
			<el-tabs v-model="activeTab" class="media-tabs" @tab-change="handleTabChange">
				<el-tab-pane label="图片" name="image" />
				<el-tab-pane label="音频" name="audio" />
				<el-tab-pane label="视频" name="video" />
			</el-tabs>
			<div class="tab-content">
				<HxTable
					v-loading="detailLoading"
					height="450px"
					:columns="columns"
					:data="detailData"
					:show-pagination="true"
					:current-page="pagination.currentPage"
					:page-size="pagination.pageSize"
					:total="pagination.total"
					border
					@size-change="handleSizeChange"
					@current-change="handlePageChange"
				>
					<template #preview="{ row }">
						<HxFilePreview
							v-if="row.url"
							:url="row.url"
							preview-width="120px"
							preview-height="80px"
						/>
					</template>
				</HxTable>
			</div>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, h } from "vue"
import { useAsyncState } from "@vueuse/core"
import { VideoCamera, ArrowRight } from "@element-plus/icons-vue"
import { HxTable, HxFilePreview } from "@whhx/ui"
import type { TableColumn } from "@whhx/ui"
import { ua } from "@/modules/ktc/api"
import type { MediaOverview, MediaDetailItem, MediaType } from "@/modules/ktc/api/tum/uc/ua"
import { onlineBehaviorDialogConfig as dialogConfig } from "@/modules/ktc/config"

defineOptions({ name: "MediaAnalysisCard" })

const props = defineProps<{
	unitId: number
	dateRange?: [string, string] | null
}>()

// 卡片概览（使用 useAsyncState 统一管理 loading）
const { state: data, isLoading: loading, execute: loadData } = useAsyncState<MediaOverview>(
	async () => {
		if (!props.unitId) return { imageCount: 0, audioCount: 0, videoCount: 0 }
		const res = await ua.getMediaOverview({
			unitId: props.unitId,
			startDate: props.dateRange?.[0],
			endDate: props.dateRange?.[1]
		})
		return res.data || { imageCount: 0, audioCount: 0, videoCount: 0 }
	},
	{ imageCount: 0, audioCount: 0, videoCount: 0 },
	{ immediate: false, resetOnExecute: false }
)

const dialogVisible = ref(false)
const activeTab = ref<MediaType>("image")

const pagination = ref({
	currentPage: 1,
	pageSize: 10,
	total: 0
})

const columns: TableColumn[] = [
	{ type: "index", label: "序号", width: 60, align: "center" },
	{
		label: "预览",
		width: 150,
		align: "center",
		slot: "preview"
	},
	{ prop: "source", label: "附件来源", minWidth: 180, showOverflowTooltip: true },
	{
		prop: "url",
		label: "URL",
		minWidth: 260,
		showOverflowTooltip: true,
		render: (row: MediaDetailItem) =>
			h(
				"a",
				{
					href: row.url,
					target: "_blank",
					rel: "noopener noreferrer",
					style: {
						color: "var(--el-color-primary)",
						textDecoration: "none",
						wordBreak: "break-all"
					}
				},
				row.url
			)
	},
	{ prop: "account", label: "账号", width: 140 },
	{ prop: "interceptTime", label: "截获时间", minWidth: 170, align: "center", sortable: true }
]

const { state: detailData, isLoading: detailLoading, execute: loadDetail } = useAsyncState<MediaDetailItem[]>(
	async () => {
		if (!props.unitId) return []
		const res = await ua.getMediaDetail({
			unitId: props.unitId,
			type: activeTab.value,
			page: pagination.value.currentPage,
			pageSize: pagination.value.pageSize
		})
		pagination.value.total = res.data?.total || 0
		return res.data?.list || []
	},
	[],
	{ immediate: false, resetOnExecute: false }
)

const handleOpenDialog = () => {
	pagination.value.currentPage = 1
	pagination.value.pageSize = 10
	loadDetail(0)
	dialogVisible.value = true
}

const handleTabChange = () => {
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
				font-size: 16px;
				font-weight: 600;
				&.danger { color: var(--el-color-danger); }
				&.warning { color: var(--el-color-warning); }
				&.info { color: var(--el-color-info); }
			}
		}
		.el-divider { margin: 8px 0; }
	}
}

.media-dialog-content {
	.list-header {
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

	.media-tabs {
		:deep(.el-tabs__header) {
			margin-bottom: 16px;
		}
	}

	.tab-content {
		min-height: 300px;
	}
}
</style>