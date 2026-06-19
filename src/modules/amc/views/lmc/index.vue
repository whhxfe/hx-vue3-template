<template>
	<div class="flex flex-col h-full p-4 bg-bg-base gap-4">
		<!-- 筛选表单区域 -->
		<div class="bg-bg-elevated rounded-md p-4">
			<HxForm
				v-model="filterData"
				:fields="filterFields"
				:cols="4"
				:show-action="true"
				@search="handleSearch"
				@reset="handleReset"
			/>
		</div>

		<!-- 表格区域 -->
		<div ref="tableContainerRef" class="flex-1 bg-bg-elevated rounded-md p-4 flex flex-col min-h-0 overflow-hidden">
			<div class="flex gap-2 mb-3">
				<el-button type="primary" :disabled="addLoading" @click="handleAdd">
					<el-icon><Plus /></el-icon>
					新增
				</el-button>
				<el-button :loading="refreshLoading" @click="debouncedRefresh">
					<el-icon><Refresh /></el-icon>
					刷新
				</el-button>
			</div>

			<HxTable
				ref="tableRef"
				border
				:height="tableHeight"
				:columns="(tableColumns as any)"
				:data="tableData"
				:loading="tableLoading"
				:show-pagination="true"
				:current-page="pagination.currentPage"
				:page-size="pagination.pageSize"
				:total="pagination.total"
				:page-sizes="[10, 20, 50, 100]"
				pagination-layout="total, sizes, prev, pager, next, jumper"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			>
				<template #action="{ row }">
					<el-button type="danger" link :disabled="deleteLoading" @click="handleDelete(row)">删除</el-button>
				</template>
			</HxTable>
		</div>

		<!-- 新增弹窗 -->
		<el-dialog
			v-model="dialogVisible"
			title="新增日志"
			width="700px"
			:close-on-click-modal="false"
			destroy-on-close
		>
			<HxForm
				ref="dialogFormRef"
				v-model="dialogFormData"
				:fields="dialogFields"
				label-width="120px"
				:cols="1"
				:show-action="false"
			/>
			<template #footer>
				<el-button @click="dialogVisible = false" :disabled="dialogLoading">取消</el-button>
				<el-button type="primary" :loading="dialogLoading" @click="handleSubmit">确认</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, h } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { ElTag as elTag } from "element-plus"
import { Plus, Refresh } from "@element-plus/icons-vue"
import { useDebounceFn, useThrottleFn, useElementSize, useAsyncState } from "@vueuse/core"
import { HxForm, HxTable } from "@whhx/ui"
import type { FormField } from "@whhx/ui"
import { lmc, type LmcItem, type LmcForm } from "@/modules/amc/api"

// ==================== Refs ====================
const tableRef = ref()
const tableContainerRef = ref()
const dialogFormRef = ref()

void tableRef

// ==================== 表格容器动态高度 ====================
const { height: tableContainerHeight } = useElementSize(tableContainerRef)
const tableHeight = computed(() => tableContainerHeight.value - 44)

// ==================== 筛选表单数据 ====================
const filterData = ref({
	logCode: "",
	logType: "",
	logLevel: "",
	sourceSystem: "",
	operator: "",
	startTime: "",
	endTime: "",
	dateRange: ""
})

const filterFields = computed<FormField[]>(() => [
	{
		prop: "logCode",
		label: "日志编号",
		type: "input",
		placeholder: "请输入日志编号"
	},
	{
		prop: "logType",
		label: "日志类型",
		type: "select",
		placeholder: "请选择日志类型",
		options: [
			{ label: "业务日志", value: "business" },
			{ label: "系统日志", value: "system" },
			{ label: "安全日志", value: "security" },
			{ label: "性能日志", value: "performance" },
			{ label: "审计日志", value: "audit" }
		]
	},
	{
		prop: "logLevel",
		label: "日志级别",
		type: "select",
		placeholder: "请选择日志级别",
		options: [
			{ label: "DEBUG", value: "debug" },
			{ label: "INFO", value: "info" },
			{ label: "WARN", value: "warn" },
			{ label: "ERROR", value: "error" }
		]
	},
	{
		prop: "sourceSystem",
		label: "来源系统",
		type: "input",
		placeholder: "请输入来源系统"
	},
	{
		prop: "operator",
		label: "操作人",
		type: "input",
		placeholder: "请输入操作人"
	},
	{
		prop: "dateRange",
		label: "创建时间",
		type: "input",
		placeholder: "请选择日期范围"
	}
])

// ==================== 分页配置 ====================
const pagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0
})

// ==================== 表格数据 ====================
const addLoading = ref(false)
const deleteLoading = ref(false)
const refreshLoading = ref(false)

/**
 * 构造查询参数
 */
const buildQueryParams = () => {
	const range = filterData.value.dateRange as string
	if (range && range.includes("至")) {
		const [startTime, endTime] = range.split("至")
		return {
			page: pagination.currentPage,
			pageSize: pagination.pageSize,
			logCode: filterData.value.logCode || undefined,
			logType: filterData.value.logType || undefined,
			logLevel: filterData.value.logLevel || undefined,
			sourceSystem: filterData.value.sourceSystem || undefined,
			operator: filterData.value.operator || undefined,
			startTime: startTime?.trim() || undefined,
			endTime: endTime?.trim() || undefined
		}
	}
	return {
		page: pagination.currentPage,
		pageSize: pagination.pageSize,
		logCode: filterData.value.logCode || undefined,
		logType: filterData.value.logType || undefined,
		logLevel: filterData.value.logLevel || undefined,
		sourceSystem: filterData.value.sourceSystem || undefined,
		operator: filterData.value.operator || undefined
	}
}

const { state: tableData, isLoading: tableLoading, execute: loadTableData } = useAsyncState(
	async () => {
		const res = await lmc.getList(buildQueryParams())
		if (res.state === 2000 || res.state === 200) {
			pagination.total = res.data?.total || 0
			return res.data?.list || []
		}
		return []
	},
	[],
	{ immediate: false }
)

// ==================== 表格列配置 ====================
const tableColumns = computed(() => [
	{
		type: "index",
		label: "序号",
		width: 60,
		align: "center"
	},
	{
		prop: "logCode",
		label: "日志编号",
		width: 140,
		showOverflowTooltip: true
	},
	{
		prop: "logType",
		label: "日志类型",
		width: 100,
		align: "center",
		render: (row: LmcItem) => {
			const map: Record<string, string> = {
				business: "业务日志",
				system: "系统日志",
				security: "安全日志",
				performance: "性能日志",
				audit: "审计日志"
			}
			return map[row.logType] || row.logType
		}
	},
	{
		prop: "logLevel",
		label: "级别",
		width: 90,
		align: "center",
		render: (row: LmcItem) => {
			const map: Record<string, { label: string; type: string }> = {
				debug: { label: "DEBUG", type: "info" },
				info: { label: "INFO", type: "" },
				warn: { label: "WARN", type: "warning" },
				error: { label: "ERROR", type: "danger" }
			}
			const item = map[row.logLevel] || { label: row.logLevel, type: "info" }
			return h(elTag, { type: item.type as any, size: "small" }, { default: () => item.label })
		}
	},
	{
		prop: "sourceSystem",
		label: "来源系统",
		width: 110,
		align: "center"
	},
	{
		prop: "operator",
		label: "操作人",
		width: 100,
		align: "center"
	},
	{
		prop: "operatorIp",
		label: "操作IP",
		width: 130
	},
	{
		prop: "requestMethod",
		label: "请求方法",
		width: 90,
		align: "center",
		render: (row: LmcItem) => {
			if (!row.requestMethod) return "-"
			const typeMap: Record<string, string> = { GET: "primary", POST: "success", PUT: "warning", DELETE: "danger" }
			const tagType = typeMap[row.requestMethod] || "info"
			return h(elTag, { type: tagType as any, size: "small" }, { default: () => row.requestMethod })
		}
	},
	{
		prop: "requestPath",
		label: "请求路径",
		minWidth: 160,
		showOverflowTooltip: true
	},
	{
		prop: "responseStatus",
		label: "响应码",
		width: 80,
		align: "center",
		render: (row: LmcItem) => {
			if (!row.responseStatus) return "-"
			const type = row.responseStatus >= 400 ? "danger" : row.responseStatus >= 300 ? "warning" : "success"
			return h(elTag, { type, size: "small" }, { default: () => row.responseStatus })
		}
	},
	{
		prop: "executionDuration",
		label: "耗时(ms)",
		width: 100,
		align: "right"
	},
	{
		prop: "createTime",
		label: "创建时间",
		width: 180,
		sortable: true
	},
	{
		label: "操作",
		slot: "action",
		fixed: "right",
		width: 120
	}
])

// ==================== 新增弹窗 ====================
const dialogVisible = ref(false)
const dialogLoading = ref(false)
const dialogFormData = ref<LmcForm>({
	logType: "",
	logLevel: "info",
	sourceSystem: "",
	operator: "",
	operatorIp: "",
	requestMethod: "",
	requestPath: "",
	responseStatus: 200,
	errorMessage: ""
})

const dialogFields = computed<FormField[]>(() => [
	{
		prop: "logType",
		label: "日志类型",
		type: "select",
		placeholder: "请选择日志类型",
		options: [
			{ label: "业务日志", value: "business" },
			{ label: "系统日志", value: "system" },
			{ label: "安全日志", value: "security" },
			{ label: "性能日志", value: "performance" },
			{ label: "审计日志", value: "audit" }
		],
		rules: [{ required: true, message: "请选择日志类型", trigger: "change" }]
	},
	{
		prop: "logLevel",
		label: "日志级别",
		type: "select",
		placeholder: "请选择日志级别",
		options: [
			{ label: "DEBUG", value: "debug" },
			{ label: "INFO", value: "info" },
			{ label: "WARN", value: "warn" },
			{ label: "ERROR", value: "error" }
		],
		rules: [{ required: true, message: "请选择日志级别", trigger: "change" }]
	},
	{
		prop: "sourceSystem",
		label: "来源系统",
		type: "input",
		placeholder: "请输入来源系统",
		rules: [{ required: true, message: "请输入来源系统", trigger: "blur" }]
	},
	{
		prop: "operator",
		label: "操作人",
		type: "input",
		placeholder: "请输入操作人",
		rules: [{ required: true, message: "请输入操作人", trigger: "blur" }]
	},
	{
		prop: "operatorIp",
		label: "操作IP",
		type: "input",
		placeholder: "请输入操作IP"
	},
	{
		prop: "requestMethod",
		label: "请求方法",
		type: "input",
		placeholder: "如: GET / POST"
	},
	{
		prop: "requestPath",
		label: "请求路径",
		type: "input",
		placeholder: "请输入请求路径"
	},
	{
		prop: "responseStatus",
		label: "响应状态码",
		type: "input",
		placeholder: "请输入响应状态码"
	},
	{
		prop: "errorMessage",
		label: "错误信息",
		type: "textarea",
		placeholder: "请输入错误信息（可选）"
	}
])

// ==================== 方法 ====================

/**
 * 搜索
 */
const handleSearch = () => {
	pagination.currentPage = 1
	loadTableData()
}

/**
 * 重置
 */
const handleReset = () => {
	filterData.value = {
		logCode: "",
		logType: "",
		logLevel: "",
		sourceSystem: "",
		operator: "",
		startTime: "",
		endTime: "",
		dateRange: ""
	}
	pagination.currentPage = 1
	loadTableData()
}

/**
 * 分页大小改变
 */
const handleSizeChange = (size: number) => {
	pagination.pageSize = size
	pagination.currentPage = 1
	loadTableData()
}

/**
 * 页码改变
 */
const handleCurrentChange = (page: number) => {
	pagination.currentPage = page
	loadTableData()
}

/**
 * 刷新（防抖）
 */
const debouncedRefresh = useDebounceFn(() => {
	refreshLoading.value = true
	loadTableData().finally(() => {
		refreshLoading.value = false
	})
}, 300)

/**
 * 打开新增弹窗
 */
const handleAdd = () => {
	addLoading.value = true
	setTimeout(() => {
		addLoading.value = false
	}, 200)
	dialogFormData.value = {
		logType: "",
		logLevel: "info",
		sourceSystem: "",
		operator: "",
		operatorIp: "",
		requestMethod: "",
		requestPath: "",
		responseStatus: 200,
		errorMessage: ""
	}
	dialogVisible.value = true
}

/**
 * 删除（防抖 + 节流）
 */
const handleDelete = useThrottleFn(async (row: LmcItem) => {
	const confirmed = await ElMessageBox.confirm(
		`确认删除日志「${row.logCode}」吗？`,
		"提示",
		{
			confirmButtonText: "确认",
			cancelButtonText: "取消",
			type: "warning"
		}
	).catch(() => false)
	if (!confirmed) return

	try {
		const res = await lmc.delete(row.id)
		if (res.state === 2000 || res.state === 200) {
			ElMessage.success("删除成功")
			loadTableData()
		} else {
			ElMessage.error(res.message || "删除失败")
		}
	} catch (error) {
		console.error("删除数据失败:", error)
		ElMessage.error("删除失败")
	}
}, 1000)

/**
 * 提交表单
 */
const handleSubmit = async () => {
	const valid = await dialogFormRef.value?.validate()
	if (!valid) return

	dialogLoading.value = true
	try {
		const res = await lmc.add(dialogFormData.value)
		if (res.state === 2000 || res.state === 200) {
			ElMessage.success("新增成功")
			dialogVisible.value = false
			loadTableData()
		} else {
			ElMessage.error(res.message || "新增失败")
		}
	} catch (error) {
		console.error("提交数据失败:", error)
		ElMessage.error("提交失败")
	} finally {
		dialogLoading.value = false
	}
}

// ==================== 生命周期 ====================
onMounted(() => {
	loadTableData()
})
</script>
