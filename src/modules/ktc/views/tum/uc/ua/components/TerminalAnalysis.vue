<template>
	<section id="section-terminal" class="ua-section">
		<div class="section-header">
			<h3 class="section-title">终端分析</h3>
		</div>
		<div class="section-body">
			<HxTable
				v-loading="loading"
				:columns="columns"
				:data="terminalData"
				:show-pagination="true"
				:current-page="pagination.currentPage"
				:page-size="pagination.pageSize"
				:total="pagination.total"
				border
				@size-change="handleSizeChange"
				@current-change="handlePageChange"
				@sort-change="handleSortChange"
			/>
		</div>
	</section>

	<!-- 访问网站分析弹窗 -->
	<WebsiteDialog
		v-model:visible="websiteDialogVisible"
		:data="websiteData"
		:loading="websiteLoading"
		:keyword="websiteKeyword"
		:pagination="websitePagination"
		@search="handleWebsiteSearch"
		@size-change="handleWebsiteSizeChange"
		@page-change="handleWebsitePageChange"
		@open-visit-detail="handleOpenVisitDetail"
	/>

	<!-- 网站访问次数弹窗 -->
	<VisitDetailDialog
		v-model:visible="visitDetailDialogVisible"
		:website="currentWebsite"
		:data="visitDetailData"
		:loading="visitDetailLoading"
		:pagination="visitDetailPagination"
		@size-change="handleVisitDetailSizeChange"
		@page-change="handleVisitDetailPageChange"
	/>
</template>

<script setup lang="tsx">
import { ref, reactive, computed, watch } from "vue"
import { useAsyncState, useDebounceFn } from "@vueuse/core"
import { HxTable } from "@whhx/ui"
import type { TableColumn } from "@whhx/ui"
import { ua } from "@/modules/ktc/api"
import type { TerminalItem, WebsiteItem, WebsiteVisitDetail } from "@/modules/ktc/api/tum/uc/ua"
import WebsiteDialog from "./WebsiteDialog.vue"
import VisitDetailDialog from "./VisitDetailDialog.vue"

defineOptions({ name: "TerminalAnalysis" })

const props = defineProps<{
	unitId: number
}>()

const pagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0
})

const sort = reactive({
	field: "lastActiveTime",
	order: "desc" as "asc" | "desc"
})

// ==================== 终端数据 ====================
const { state: terminalData, isLoading: loading, execute: loadTerminalData } = useAsyncState<TerminalItem[]>(
	async () => {
		if (!props.unitId) return []
		const res = await ua.getTerminals({
			unitId: props.unitId,
			page: pagination.currentPage,
			pageSize: pagination.pageSize,
			sortField: sort.field,
			sortOrder: sort.order
		})
		pagination.total = res.data?.total || 0
		return res.data?.list || []
	},
	[],
	{ immediate: false, resetOnExecute: false }
)

watch(() => props.unitId, (id) => {
	if (id) {
		loadTerminalData(0)
	}
}, { immediate: true })

const handleSizeChange = (size: number) => {
	pagination.pageSize = size
	pagination.currentPage = 1
	loadTerminalData(0)
}

const handlePageChange = (page: number) => {
	pagination.currentPage = page
	loadTerminalData(0)
}

const handleSortChange = ({ prop, order }: { prop: string; order: string | null }) => {
	if (prop === "lastActiveTime" && order) {
		sort.order = order === "ascending" ? "asc" : "desc"
		pagination.currentPage = 1
		loadTerminalData(0)
	}
}

// ==================== 访问网站弹窗 ====================
const websiteDialogVisible = ref(false)
const currentTerminal = ref<TerminalItem | null>(null)
const websiteKeyword = ref("")
const websitePagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0
})

const { state: websiteData, isLoading: websiteLoading, execute: loadWebsiteData } = useAsyncState<WebsiteItem[]>(
	async () => {
		if (!currentTerminal.value) return []
		const res = await ua.getWebsites({
			terminalId: currentTerminal.value.id,
			page: websitePagination.currentPage,
			pageSize: websitePagination.pageSize,
			keyword: websiteKeyword.value || undefined
		})
		websitePagination.total = res.data?.total || 0
		return res.data?.list || []
	},
	[],
	{ immediate: false, resetOnExecute: false }
)

const handleOpenWebsite = (row: TerminalItem) => {
	currentTerminal.value = row
	websiteKeyword.value = ""
	websitePagination.currentPage = 1
	websiteDialogVisible.value = true
	loadWebsiteData(0)
}

const handleWebsiteSearch = (value: string) => {
	websiteKeyword.value = value
	runDebouncedSearch()
}

// 300ms 防抖：用户连续输入时只触发一次请求
const runDebouncedSearch = useDebounceFn(() => {
	websitePagination.currentPage = 1
	loadWebsiteData(0)
}, 300)

const handleWebsiteSizeChange = (size: number) => {
	websitePagination.pageSize = size
	websitePagination.currentPage = 1
	loadWebsiteData(0)
}

const handleWebsitePageChange = (page: number) => {
	websitePagination.currentPage = page
	loadWebsiteData(0)
}

// ==================== 网站访问详情弹窗 ====================
const visitDetailDialogVisible = ref(false)
const currentWebsite = ref<WebsiteItem | null>(null)
const visitDetailPagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0
})

const { state: visitDetailData, isLoading: visitDetailLoading, execute: loadVisitDetailData } = useAsyncState<WebsiteVisitDetail[]>(
	async () => {
		if (!currentWebsite.value) return []
		const res = await ua.getWebsiteVisitDetails({
			websiteId: currentWebsite.value.id,
			page: visitDetailPagination.currentPage,
			pageSize: visitDetailPagination.pageSize
		})
		visitDetailPagination.total = res.data?.total || 0
		return res.data?.list || []
	},
	[],
	{ immediate: false, resetOnExecute: false }
)

const handleOpenVisitDetail = (row: WebsiteItem) => {
	currentWebsite.value = row
	visitDetailPagination.currentPage = 1
	visitDetailDialogVisible.value = true
	loadVisitDetailData(0)
}

const handleVisitDetailSizeChange = (size: number) => {
	visitDetailPagination.pageSize = size
	visitDetailPagination.currentPage = 1
	loadVisitDetailData(0)
}

const handleVisitDetailPageChange = (page: number) => {
	visitDetailPagination.currentPage = page
	loadVisitDetailData(0)
}

// ==================== 表格列配置 ====================
const columns = computed<TableColumn[]>(() => [
	{ type: "index", label: "序号", width: 60, align: "center" },
	{ prop: "imei", label: "终端IMEI", minWidth: 150 },
	{ prop: "imsi", label: "终端IMSI", minWidth: 150 },
	{ prop: "mac", label: "终端MAC", minWidth: 140 },
	{
		prop: "visitSites",
		label: "访问网站",
		width: 120,
		align: "center",
		render: (row: TerminalItem) => {
			const sites = row.visitSites ? row.visitSites.split(",").length : 0
			return (
				<el-button type="primary" link onClick={() => handleOpenWebsite(row)}>
					{sites}
				</el-button>
			)
		}
	},
	{ prop: "usedApps", label: "使用APP", minWidth: 180, showOverflowTooltip: true },
	{
		prop: "lastActiveTime",
		label: "最近活跃时间",
		width: 180,
		sortable: "custom",
		align: "center"
	}
])
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
</style>
