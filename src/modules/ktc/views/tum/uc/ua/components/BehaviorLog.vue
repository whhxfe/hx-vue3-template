<template>
	<div id="section-log" class="behavior-log-container">
		<h4 class="sub-section-title">行为日志</h4>

		<!-- 筛选表单 -->
		<div class="filter-container">
			<el-form :inline="true" :model="filterParams">
				<el-form-item label="数据来源">
					<el-input
						v-model="filterParams.dataSource"
						placeholder="请输入数据来源"
						clearable
						style="width: 160px"
					/>
				</el-form-item>
				<el-form-item label="资源类型">
					<el-input
						v-model="filterParams.resourceType"
						placeholder="请输入资源类型"
						clearable
						style="width: 160px"
					/>
				</el-form-item>
				<el-form-item label="动作">
					<el-input
						v-model="filterParams.action"
						placeholder="请输入动作"
						clearable
						style="width: 160px"
					/>
				</el-form-item>
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
			v-loading="loading"
			:data="tableData"
			border
			@sort-change="handleSortChange"
		>
			<el-table-column type="index" label="序号" width="60" align="center" />
			<el-table-column prop="sourceIp" label="源IP" min-width="130" />
			<el-table-column prop="sourcePort" label="源端口" width="90" align="center" />
			<el-table-column prop="destIp" label="目的IP" min-width="130" />
			<el-table-column prop="destPort" label="目的端口" width="90" align="center" />
			<el-table-column prop="protocol" label="协议类型" width="90" align="center" />
			<el-table-column prop="action" label="动作" width="80" align="center">
				<template #default="{ row }">
					<el-tag :type="actionTagType(row.action)" size="small">
						{{ row.action }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="dataSource" label="数据来源" min-width="120" show-overflow-tooltip />
			<el-table-column prop="resourceType" label="资源类型" min-width="110" show-overflow-tooltip />
			<el-table-column
				prop="interceptTime"
				label="截获时间"
				width="170"
				sortable="custom"
			/>
			<el-table-column prop="relatedPhone" label="关联手机号" width="130" />
		</el-table>

		<!-- 分页 -->
		<div class="pagination-container">
			<el-pagination
				v-model:current-page="pagination.currentPage"
				v-model:page-size="pagination.pageSize"
				:page-sizes="[10, 20, 50, 100]"
				:total="pagination.total"
				layout="total, sizes, prev, pager, next, jumper"
				@size-change="handleSizeChange"
				@current-change="handlePageChange"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue"
import { useAsyncState } from "@vueuse/core"
import { Search, RefreshRight } from "@element-plus/icons-vue"
import { dateRangeShortcuts } from "@/modules/ktc/config/dateShortcuts"
import { ua } from "@/modules/ktc/api"
import type { BehaviorLogItem } from "@/modules/ktc/api/tum/uc/ua"

defineOptions({ name: "BehaviorLog" })

const props = defineProps<{
	unitId: number
}>()

const filterParams = reactive({
	dataSource: "",
	resourceType: "",
	action: "",
	dateRange: null as [string, string] | null
})

const sortParams = reactive({
	field: "",
	order: "" as "asc" | "desc" | ""
})

const pagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0
})

const actionTagType = (action: string): "" | "success" | "warning" | "danger" | "info" => {
	const map: Record<string, "" | "success" | "warning" | "danger" | "info"> = {
		允许: "success",
		阻断: "danger",
		告警: "warning",
		记录: "info",
		重定向: "",
		隔离: "danger"
	}
	return map[action] ?? "info"
}

const { state: tableData, isLoading: loading, execute: loadData } = useAsyncState<BehaviorLogItem[]>(
	async () => {
		if (!props.unitId) return []
		const res = await ua.getBehaviorLog({
			unitId: props.unitId,
			page: pagination.currentPage,
			pageSize: pagination.pageSize,
			dataSource: filterParams.dataSource || undefined,
			resourceType: filterParams.resourceType || undefined,
			action: filterParams.action || undefined,
			startDate: filterParams.dateRange?.[0],
			endDate: filterParams.dateRange?.[1],
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
	loadData(0)
}

const handleReset = () => {
	filterParams.dataSource = ""
	filterParams.resourceType = ""
	filterParams.action = ""
	filterParams.dateRange = null
	sortParams.field = ""
	sortParams.order = ""
	pagination.currentPage = 1
	loadData(0)
}

const handleSortChange = ({ prop, order }: { prop: string; order: string | null }) => {
	sortParams.field = prop || ""
	sortParams.order = order === "ascending"
		? "asc"
		: order === "descending"
			? "desc"
			: ""
	loadData(0)
}

const handleSizeChange = (size: number) => {
	pagination.pageSize = size
	pagination.currentPage = 1
	loadData(0)
}

const handlePageChange = (page: number) => {
	pagination.currentPage = page
	loadData(0)
}

watch(() => props.unitId, (id) => {
	if (id) {
		handleReset()
	}
}, { immediate: true })
</script>

<style lang="scss" scoped>
.behavior-log-container {
	padding: 16px;
	background: var(--el-fill-color-lighter);
	border-radius: 6px;
	border: 1px solid var(--el-border-color-extra-light);

	.sub-section-title {
		margin: 0 0 16px 0;
		font-size: 14px;
		font-weight: 600;
		color: var(--el-text-color-primary);
		position: relative;
		padding-left: 10px;

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
