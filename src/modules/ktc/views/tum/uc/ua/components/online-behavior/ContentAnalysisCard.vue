<template>
	<el-card class="analysis-card" shadow="hover">
		<template #header>
			<div class="card-header">
				<div class="card-header-left">
					<el-icon class="card-icon"><Document /></el-icon>
					<span class="card-title">内容分析</span>
				</div>
				<el-button class="more-btn" text type="primary" @click.stop="handleOpenDialog">
					更多
					<el-icon class="el-icon--right"><ArrowRight /></el-icon>
				</el-button>
			</div>
		</template>
		<div v-loading="loading" class="card-content">
			<div class="stat-item">
				<span class="stat-label">命中敏感信息</span>
			</div>
			<div class="keyword-list">
				<el-tag
					v-for="(keyword, index) in data.keywords"
					:key="index"
					class="keyword-tag"
					:type="getTagType(index)"
				>
					{{ keyword }}
				</el-tag>
				<span v-if="!data.keywords?.length" class="empty-text">暂无数据</span>
			</div>
		</div>
	</el-card>

	<!-- 详情弹窗 -->
	<el-dialog
		v-model="dialogVisible"
		title="内容分析详情"
		:width="dialogConfig.width"
		:top="dialogConfig.top"
		destroy-on-close
		append-to-body
	>
		<div class="content-dialog-content">
			<div class="list-header">
				<span class="list-title">命中敏感信息</span>
			</div>

			<el-tabs v-model="activeTab" class="content-tabs" @tab-change="handleTabChange">
				<el-tab-pane label="命中关键词" name="keyword" />
				<el-tab-pane label="涉及重点人" name="person" />
				<el-tab-pane label="命中藏语" name="tibetan" />
			</el-tabs>

			<div class="tab-content">
				<HxTable
					v-loading="detailLoading"
					height="400px"
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
					<template #content="{ row }">
						<span v-html="row.highlightedContent || row.content" />
					</template>
					<template #action="{ row }">
						<el-button type="primary" link @click="handleViewDetail(row)">
							详情
						</el-button>
					</template>
				</HxTable>
			</div>
		</div>
	</el-dialog>

	<!-- 详情弹窗 -->
	<el-dialog
		v-model="detailVisible"
		title="命中信息详情"
		:width="dialogConfig.width"
		:top="dialogConfig.top"
		destroy-on-close
		append-to-body
	>
		<div v-loading="detailVisible && !currentDetail" class="detail-info">
			<HxLabelText label="截获时间" :text="currentDetail?.interceptTime || '—'" />
			<HxLabelText label="IMSI" :text="currentDetail?.imsi || '—'" />
			<HxLabelText label="上网认证账号" :text="currentDetail?.netAccount || '—'" />
			<HxLabelText label="基站号" :text="currentDetail?.baseStation || '—'" />
			<HxLabelText label="应用名称" :text="currentDetail?.appName || '—'" />
			<HxLabelText label="应用账号" :text="currentDetail?.appAccount || '—'" />
			<HxLabelText label="URL" :text="currentDetail?.url || '—'" />
			<div class="detail-content-row">
				<HxLabelText label="文本内容" text-wrap>
					<span v-html="currentDetail?.highlightedContent || currentDetail?.content || '—'" />
				</HxLabelText>
			</div>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useAsyncState } from "@vueuse/core"
import { Document, ArrowRight } from "@element-plus/icons-vue"
import { HxTable, HxLabelText } from "@whhx/ui"
import type { TableColumn } from "@whhx/ui"
import { ua } from "@/modules/ktc/api"
import type { ContentOverview as ContentOverviewType, ContentDetailItem, ContentType } from "@/modules/ktc/api/tum/uc/ua"
import { onlineBehaviorDialogConfig as dialogConfig } from "@/modules/ktc/config"

defineOptions({ name: "ContentAnalysisCard" })

const props = defineProps<{
	unitId: number
	dateRange?: [string, string] | null
}>()

interface ContentOverviewView {
	keywords: string[]
	keywordCount: number
	personCount: number
	tibetanCount: number
}

// 卡片概览（使用 useAsyncState 统一管理 loading）
const { state: data, isLoading: loading, execute: loadData } = useAsyncState<ContentOverviewView>(
	async () => {
		if (!props.unitId) {
			return { keywords: [], keywordCount: 0, personCount: 0, tibetanCount: 0 }
		}
		const res = await ua.getContentOverview({
			unitId: props.unitId,
			startDate: props.dateRange?.[0],
			endDate: props.dateRange?.[1]
		})
		const payload: ContentOverviewType | undefined = res.data
		return {
			keywords: payload?.keywords || [],
			keywordCount: payload?.keywordCount || 0,
			personCount: payload?.personCount || 0,
			tibetanCount: payload?.tibetanCount || 0
		}
	},
	{ keywords: [], keywordCount: 0, personCount: 0, tibetanCount: 0 },
	{ immediate: false, resetOnExecute: false }
)

const dialogVisible = ref(false)
const detailVisible = ref(false)
const detailLoading = ref(false)
const activeTab = ref<ContentType>("keyword")
const currentDetail = ref<ContentDetailItem | null>(null)

const pagination = ref({
	currentPage: 1,
	pageSize: 10,
	total: 0
})

const columns: TableColumn[] = [
	{ type: "index", label: "序号", width: 60, align: "center" },
	{
		prop: "content",
		label: "内容",
		minWidth: 320,
		showOverflowTooltip: false,
		slot: "content"
	},
	{ prop: "interceptTime", label: "截获时间", width: 170, align: "center", sortable: true },
	{ prop: "url", label: "URL", minWidth: 200, showOverflowTooltip: true },
	{ prop: "appName", label: "应用名称", width: 120 },
	{ prop: "appAccount", label: "应用账号", width: 130 },
	{
		label: "详情",
		width: 80,
		align: "center",
		slot: "action"
	}
]

const getTagType = (index: number) => {
	const types: Array<"primary" | "success" | "warning" | "danger" | "info"> = ["primary", "success", "warning", "danger", "info"]
	return types[index % types.length]
}

const { state: detailData, execute: loadDetail } = useAsyncState<ContentDetailItem[]>(
	async () => {
		if (!props.unitId) return []
		const res = await ua.getContentDetail({
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

const handleViewDetail = (row: ContentDetailItem) => {
	currentDetail.value = row
	detailVisible.value = true
}

watch(() => [props.unitId, props.dateRange], () => loadData(0), { immediate: true })
watch(dialogVisible, (val) => { if (val && props.unitId) loadDetail(0) })
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
		.stat-item { padding: 0 0 12px; .stat-label { font-size: 13px; color: var(--el-text-color-secondary); } }
		.keyword-list {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
			.keyword-tag { margin: 0; }
			.empty-text { font-size: 13px; color: var(--el-text-color-placeholder); }
		}
	}
}

.content-dialog-content {
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

	.content-tabs {
		:deep(.el-tabs__header) {
			margin-bottom: 16px;
		}
	}

	.tab-content {
		min-height: 300px;
	}
}

.detail-info {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 16px;
	padding: 8px 0;
}
.detail-content-row {
	grid-column: 1 / -1;
}
</style>
