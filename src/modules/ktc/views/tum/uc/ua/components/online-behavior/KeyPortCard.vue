<template>
	<el-card class="analysis-card" shadow="hover">
		<template #header>
			<div class="card-header">
				<div class="card-header-left">
					<el-icon class="card-icon"><Monitor /></el-icon>
					<span class="card-title">重点端口分析</span>
				</div>
				<el-button class="more-btn" text type="primary" @click.stop="handleOpenDialog">
					更多
					<el-icon class="el-icon--right"><ArrowRight /></el-icon>
				</el-button>
			</div>
		</template>
		<div v-loading="loading" class="card-content">
			<div class="stat-item">
				<span class="stat-label">重点端口数量</span>
				<span class="stat-value highlight">{{ data.portCount || 0 }}</span>
			</div>
			<el-divider />
			<div class="stat-item">
				<span class="stat-label">访问总次数</span>
				<span class="stat-value">{{ data.totalVisits || 0 }}</span>
			</div>
			<el-divider />
			<div class="stat-item">
				<span class="stat-label">最常访问重点端口</span>
				<span class="stat-value">{{ data.topPort || '-' }}</span>
			</div>
		</div>
	</el-card>

	<!-- 详情弹窗 -->
	<el-dialog v-model="dialogVisible" title="重点端口分析" :width="dialogConfig.width" :top="dialogConfig.top" destroy-on-close append-to-body>
		<div class="key-port-dialog-content">
			<div class="port-header">
				<span class="port-count">重点端口列表（{{ pagination.total }}）</span>
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
import { Monitor, ArrowRight } from "@element-plus/icons-vue"
import { HxTable } from "@whhx/ui"
import type { TableColumn } from "@whhx/ui"
import { ua } from "@/modules/ktc/api"
import type { KeyPortOverview, KeyPortItem } from "@/modules/ktc/api/tum/uc/ua"
import { onlineBehaviorDialogConfig as dialogConfig } from "@/modules/ktc/config"

defineOptions({ name: "KeyPortCard" })

const props = defineProps<{
	unitId: number
	dateRange?: [string, string] | null
}>()

// 卡片概览（使用 useAsyncState 统一管理 loading）
const { state: data, isLoading: loading, execute: loadData } = useAsyncState<KeyPortOverview>(
	async () => {
		if (!props.unitId) return { portCount: 0, totalVisits: 0, topPort: "" }
		const res = await ua.getKeyPortOverview({
			unitId: props.unitId,
			startDate: props.dateRange?.[0],
			endDate: props.dateRange?.[1]
		})
		return res.data || { portCount: 0, totalVisits: 0, topPort: "" }
	},
	{ portCount: 0, totalVisits: 0, topPort: "" },
	{ immediate: false, resetOnExecute: false }
)

const dialogVisible = ref(false)
const pagination = ref({
	currentPage: 1,
	pageSize: 10,
	total: 0
})

const columns: TableColumn[] = [
	{ type: "index", label: "序号", width: 60, align: "center" },
	{ prop: "port", label: "端口", width: 100 },
	{ prop: "protocol", label: "协议", width: 100, align: "center" },
	{ prop: "targetIp", label: "对应IP", width: "auto" },
	{ prop: "lastVisitTime", label: "最近访问时间", width: 180, align: "center", sortable: true },
	{ prop: "visitCount", label: "访问次数", width: 120, align: "center" }
]

const { state: detailData, isLoading: detailLoading, execute: loadDetail } = useAsyncState<KeyPortItem[]>(
	async () => {
		if (!props.unitId) return []
		const res = await ua.getKeyPortDetail({
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
	pagination.value.currentPage = 1
	pagination.value.pageSize = 10
	loadDetail(0)
	dialogVisible.value = true
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

.key-port-dialog-content {
	.port-header {
		margin-bottom: 16px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--el-border-color-lighter);

		.port-count {
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