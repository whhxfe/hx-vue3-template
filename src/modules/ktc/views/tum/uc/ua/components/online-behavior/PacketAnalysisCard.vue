<template>
	<el-card class="analysis-card" shadow="hover">
		<template #header>
			<div class="card-header">
				<div class="card-header-left">
					<el-icon class="card-icon"><Connection /></el-icon>
					<span class="card-title">报文分析</span>
				</div>
				<el-button class="more-btn" text type="primary" @click.stop="dialogVisible = true">
					更多
					<el-icon class="el-icon--right"><ArrowRight /></el-icon>
				</el-button>
			</div>
		</template>
		<div v-loading="loading" class="card-content">
			<div class="stat-item">
				<span class="stat-label">最常使用报文类型</span>
				<span class="stat-value">{{ data.commonType || '-' }}</span>
			</div>
			<el-divider />
			<div class="stat-item">
				<span class="stat-label">报文数量</span>
				<span class="stat-value highlight">{{ data.count || 0 }}</span>
			</div>
		</div>
	</el-card>

	<!-- 详情弹窗 -->
	<el-dialog v-model="dialogVisible" title="报文分析详情" :width="dialogConfig.width" :top="dialogConfig.top" destroy-on-close>
		<div class="detail-content">
			<h4 class="section-title">报文列表</h4>

			<!-- 筛选条件 -->
			<div class="filter-container">
				<el-form :inline="true">
					<el-form-item label="截获时间">
						<el-date-picker
							v-model="filterParams.dateRange"
							type="daterange"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							value-format="YYYY-MM-DD"
							:shortcuts="dateRangeShortcuts"
							style="width: 260px"
						/>
					</el-form-item>
					<el-form-item label="关键字">
						<el-input
							v-model="filterParams.keyword"
							placeholder="请输入关键字搜索"
							clearable
							style="width: 200px"
						/>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="handleSearch">
							<el-icon><Search /></el-icon>
							查询
						</el-button>
						<el-button @click="handleReset">
							<el-icon><RefreshRight /></el-icon>
							重置
						</el-button>
					</el-form-item>
				</el-form>
			</div>

			<!-- 数据表格 -->
			<el-table
				v-loading="tableLoadingState"
				:data="tableData"
				border
				@sort-change="handleSortChange"
			>
				<el-table-column type="index" label="序号" width="60" align="center" />
				<el-table-column prop="name" label="报文名称" width="auto" />
				<el-table-column prop="type" label="报文类型" width="100" />
				<el-table-column prop="length" label="报文长度" width="120" sortable="custom" align="right" />
				<el-table-column prop="captureTime" label="截获时间" width="180" sortable="custom" />
				<el-table-column prop="imsi" label="终端IMSI" width="160" />
				<el-table-column label="操作" width="100" align="center" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleDownload(row)">
							下载
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 分页 -->
			<div class="pagination-container">
				<el-pagination
					v-model:current-page="pagination.currentPage"
					v-model:page-size="pagination.pageSize"
					:total="pagination.total"
					:page-sizes="[10, 20, 50]"
					layout="total, sizes, prev, pager, next"
					@size-change="handleSizeChange"
					@current-change="handlePageChange"
				/>
			</div>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue"
import { useAsyncState } from "@vueuse/core"
import { ElMessage } from "element-plus"
import { Connection, ArrowRight, Search, RefreshRight } from "@element-plus/icons-vue"
import { dateRangeShortcuts } from "@/modules/ktc/config/dateShortcuts"
import { onlineBehaviorDialogConfig as dialogConfig } from "@/modules/ktc/config"
import { ua } from "@/modules/ktc/api"
import type { PacketOverview, PacketItem } from "@/modules/ktc/api/tum/uc/ua"

defineOptions({ name: "PacketAnalysisCard" })

const props = defineProps<{
	unitId: number
	dateRange?: [string, string] | null
}>()

// 卡片概览
const { state: data, isLoading: loading, execute: loadData } = useAsyncState<PacketOverview>(
	async () => {
		if (!props.unitId) return { commonType: "", count: 0 }
		const res = await ua.getPacketOverview({
			unitId: props.unitId,
			startDate: props.dateRange?.[0],
			endDate: props.dateRange?.[1]
		})
		return res.data || { commonType: "", count: 0 }
	},
	{ commonType: "", count: 0 },
	{ immediate: false, resetOnExecute: false }
)

const dialogVisible = ref(false)

const filterParams = reactive({
	dateRange: null as [string, string] | null,
	keyword: ""
})

const pagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0
})

const sortParams = reactive({
	field: "",
	order: "" as "asc" | "desc" | ""
})

const { state: tableData, isLoading: tableLoadingState, execute: loadTableData } = useAsyncState<PacketItem[]>(
	async () => {
		if (!props.unitId) return []
		const res = await ua.getPacketDetail({
			unitId: props.unitId,
			page: pagination.currentPage,
			pageSize: pagination.pageSize,
			keyword: filterParams.keyword || undefined,
			sortField: sortParams.field || undefined,
			sortOrder: sortParams.order || undefined
		})
		pagination.total = res.data?.total || 0
		return res.data?.list || []
	},
	[],
	{ immediate: false, resetOnExecute: false }
)

const handleSearch = () => {
	pagination.currentPage = 1
	loadTableData(0)
}

const handleReset = () => {
	filterParams.dateRange = null
	filterParams.keyword = ""
	pagination.currentPage = 1
	loadTableData(0)
}

const handleSortChange = ({ prop, order }: { prop: string; order: string | null }) => {
	sortParams.field = prop || ""
	sortParams.order = order === "ascending" ? "asc" : order === "descending" ? "desc" : ""
	loadTableData(0)
}

const handleSizeChange = (size: number) => {
	pagination.pageSize = size
	pagination.currentPage = 1
	loadTableData(0)
}

const handlePageChange = (page: number) => {
	pagination.currentPage = page
	loadTableData(0)
}

const handleDownload = (row: PacketItem) => {
	ElMessage.info(`下载功能开发中，报文ID: ${row.id}`)
}

watch(() => [props.unitId, props.dateRange], () => loadData(0), { immediate: true })
watch(dialogVisible, (val) => {
	if (val && props.unitId) {
		handleReset()
	}
})
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
	.section-title {
		margin: 0 0 16px;
		font-size: 14px;
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
			height: 14px;
			background: var(--el-color-primary);
			border-radius: 2px;
		}
	}

	.filter-container {
		margin-bottom: 16px;

		:deep(.el-form-item) {
			margin-bottom: 0;
		}
	}

	.pagination-container {
		display: flex;
		justify-content: flex-end;
		margin-top: 16px;
	}
}
</style>