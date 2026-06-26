<template>
	<el-card class="analysis-card" shadow="hover">
		<template #header>
			<div class="card-header">
				<div class="card-header-left">
					<el-icon class="card-icon"><Link /></el-icon>
					<span class="card-title">访问网站分析</span>
				</div>
				<el-button class="more-btn" text type="primary" @click.stop="handleOpenDialog">
					更多
					<el-icon class="el-icon--right"><ArrowRight /></el-icon>
				</el-button>
			</div>
		</template>
		<div v-loading="loading" class="card-content">
			<div class="stat-item">
				<span class="stat-label">最常访问网站</span>
				<span class="stat-value">{{ data.topWebsite || '-' }}</span>
			</div>
			<el-divider />
			<div class="stat-item">
				<span class="stat-label">访问次数</span>
				<span class="stat-value highlight">{{ data.visitCount || 0 }}</span>
			</div>
		</div>
	</el-card>

	<!-- 访问网站列表弹窗 -->
	<WebsiteDialog
		v-model:visible="websiteDialogVisible"
		:data="websiteList"
		:loading="websiteListLoading"
		:keyword="websiteKeyword"
		:pagination="websitePagination"
		@search="handleWebsiteSearch"
		@size-change="handleWebsiteSizeChange"
		@page-change="handleWebsitePageChange"
		@open-visit-detail="handleOpenVisitDetail"
	/>

	<!-- 网站访问次数详情弹窗 -->
	<VisitDetailDialog
		v-model:visible="visitDetailVisible"
		:website="selectedWebsite"
		:data="visitDetailList"
		:loading="visitDetailLoading"
		:pagination="visitDetailPagination"
		@size-change="handleVisitDetailSizeChange"
		@page-change="handleVisitDetailPageChange"
	/>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useAsyncState } from "@vueuse/core"
import { Link, ArrowRight } from "@element-plus/icons-vue"
import { ua } from "@/modules/ktc/api"
import type { WebsiteItem, WebsiteVisitDetail, WebsiteVisitOverview } from "@/modules/ktc/api/tum/uc/ua"
import WebsiteDialog from "../WebsiteDialog.vue"
import VisitDetailDialog from "../VisitDetailDialog.vue"

defineOptions({ name: "WebsiteVisitCard" })

const props = defineProps<{
	unitId: number
	dateRange?: [string, string] | null
}>()

// 卡片概览（使用 useAsyncState 统一管理 loading）
const { state: data, isLoading: loading, execute: loadData } = useAsyncState<WebsiteVisitOverview>(
	async () => {
		if (!props.unitId) return { topWebsite: "", visitCount: 0 }
		const res = await ua.getWebsiteVisitOverview({
			unitId: props.unitId,
			startDate: props.dateRange?.[0],
			endDate: props.dateRange?.[1]
		})
		return res.data || { topWebsite: "", visitCount: 0 }
	},
	{ topWebsite: "", visitCount: 0 },
	{ immediate: false, resetOnExecute: false }
)

// 访问网站列表弹窗相关
const websiteDialogVisible = ref(false)
const websiteListLoading = ref(false)
const websiteList = ref<WebsiteItem[]>([])
const websiteKeyword = ref("")
const websitePagination = ref({
	currentPage: 1,
	pageSize: 10,
	total: 0
})

// 网站访问次数详情弹窗相关
const visitDetailVisible = ref(false)
const visitDetailLoading = ref(false)
const selectedWebsite = ref<WebsiteItem | null>(null)
const visitDetailList = ref<WebsiteVisitDetail[]>([])
const visitDetailPagination = ref({
	currentPage: 1,
	pageSize: 10,
	total: 0
})

// 加载网站列表
const loadWebsiteList = async () => {
	websiteListLoading.value = true
	const res = await ua.getWebsites({
		terminalId: props.unitId, // 当前卡片层级：unit 维度，此处保留原行为，仅通过 uc 调用
		page: websitePagination.value.currentPage,
		pageSize: websitePagination.value.pageSize,
		keyword: websiteKeyword.value || undefined
	})
	if (res.data) {
		websiteList.value = res.data.list || []
		websitePagination.value.total = res.data.total || 0
	}
	websiteListLoading.value = false
}

// 加载网站访问详情
const loadVisitDetails = async () => {
	if (!selectedWebsite.value) return
	visitDetailLoading.value = true
	const res = await ua.getWebsiteVisitDetails({
		websiteId: selectedWebsite.value.id,
		page: visitDetailPagination.value.currentPage,
		pageSize: visitDetailPagination.value.pageSize
	})
	if (res.data) {
		visitDetailList.value = res.data.list || []
		visitDetailPagination.value.total = res.data.total || 0
	}
	visitDetailLoading.value = false
}

const handleOpenDialog = () => {
	websitePagination.value.currentPage = 1
	websitePagination.value.pageSize = 10
	websiteKeyword.value = ""
	loadWebsiteList()
	websiteDialogVisible.value = true
}

const handleWebsiteSearch = (keyword: string) => {
	websiteKeyword.value = keyword
	websitePagination.value.currentPage = 1
	loadWebsiteList()
}

const handleWebsiteSizeChange = (size: number) => {
	websitePagination.value.pageSize = size
	websitePagination.value.currentPage = 1
	loadWebsiteList()
}

const handleWebsitePageChange = (page: number) => {
	websitePagination.value.currentPage = page
	loadWebsiteList()
}

const handleOpenVisitDetail = (row: WebsiteItem) => {
	selectedWebsite.value = row
	visitDetailPagination.value.currentPage = 1
	visitDetailPagination.value.pageSize = 10
	loadVisitDetails()
	visitDetailVisible.value = true
}

const handleVisitDetailSizeChange = (size: number) => {
	visitDetailPagination.value.pageSize = size
	visitDetailPagination.value.currentPage = 1
	loadVisitDetails()
}

const handleVisitDetailPageChange = (page: number) => {
	visitDetailPagination.value.currentPage = page
	loadVisitDetails()
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
.detail-content {
	.section-title { margin: 0 0 12px; font-size: 14px; font-weight: 600; }
}
</style>