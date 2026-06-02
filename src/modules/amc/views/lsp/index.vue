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
				:columns="tableColumns"
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
					<el-button type="primary" link :disabled="editLoading" @click="handleEdit(row)">编辑</el-button>
					<el-button type="danger" link :disabled="deleteLoading" @click="handleDelete(row)">删除</el-button>
				</template>
			</HxTable>
		</div>

		<!-- 新增/编辑表单弹窗 -->
		<el-dialog
			v-model="dialogVisible"
			:title="dialogTitle"
			width="600px"
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
import { HxForm, HxTable } from "@hx/ui"
import type { FormField, TableColumn } from "@hx/ui"
import { lsp, type LspItem, type LspForm } from "@/modules/amc/api"

// ==================== Refs ====================
const tableRef = ref()
const tableContainerRef = ref()
const dialogFormRef = ref()

void tableRef

// ==================== 表格容器动态高度 ====================
const { height: tableContainerHeight } = useElementSize(tableContainerRef)
const tableHeight = computed(() => tableContainerHeight.value - 44)

// ==================== 筛选表单数据 ====================
const filterData = ref<{
	sourceSystem: string
	transformStatus: string
	processor: string
	startTime: string
	endTime: string
	dateRange: string
}>({
	sourceSystem: "",
	transformStatus: "",
	processor: "",
	startTime: "",
	endTime: "",
	dateRange: ""
})

const filterFields = computed<FormField[]>(() => [
	{
		prop: "sourceSystem",
		label: "来源系统",
		type: "select",
		placeholder: "请选择来源系统",
		options: sourceSystemOptions
	},
	{
		prop: "transformStatus",
		label: "处理状态",
		type: "select",
		placeholder: "请选择处理状态",
		options: [
			{ label: "待处理", value: "pending" },
			{ label: "处理中", value: "processing" },
			{ label: "已完成", value: "completed" },
			{ label: "处理失败", value: "failed" }
		]
	},
	{
		prop: "processor",
		label: "处理人",
		type: "input",
		placeholder: "请输入处理人"
	},
	{
		prop: "dateRange",
		label: "创建时间",
		type: "input",
		placeholder: "请选择日期范围"
	}
])

const sourceSystemOptions = [
	{ label: "网关系统", value: "gateway" },
	{ label: "认证中心", value: "auth" },
	{ label: "订单服务", value: "order" },
	{ label: "支付系统", value: "payment" },
	{ label: "存储服务", value: "storage" }
]

// ==================== 分页配置 ====================
const pagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0
})

// ==================== 表格数据 ====================
const addLoading = ref(false)
const editLoading = ref(false)
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
			sourceSystem: filterData.value.sourceSystem || undefined,
			transformStatus: filterData.value.transformStatus || undefined,
			processor: filterData.value.processor || undefined,
			startTime: startTime?.trim() || undefined,
			endTime: endTime?.trim() || undefined
		}
	}
	return {
		page: pagination.currentPage,
		pageSize: pagination.pageSize,
		sourceSystem: filterData.value.sourceSystem || undefined,
		transformStatus: filterData.value.transformStatus || undefined,
		processor: filterData.value.processor || undefined
	}
}

const { state: tableData, isLoading: tableLoading, execute: loadTableData } = useAsyncState(
	async () => {
		const res = await lsp.getList(buildQueryParams())
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
const tableColumns = computed<TableColumn[]>(() => [
	{
		type: "index",
		label: "序号",
		width: 60,
		align: "center"
	},
	{
		prop: "sourceSystem",
		label: "来源系统",
		width: 120,
		align: "center"
	},
	{
		prop: "originalFormat",
		label: "原始格式",
		minWidth: 160,
		showOverflowTooltip: true
	},
	{
		prop: "formatVersion",
		label: "标准版本",
		width: 100,
		align: "center"
	},
	{
		prop: "transformStatus",
		label: "处理状态",
		width: 100,
		align: "center",
		render: (row: LspItem) => {
			const map: Record<string, { label: string; type: string }> = {
				pending: { label: "待处理", type: "info" },
				processing: { label: "处理中", type: "warning" },
				completed: { label: "已完成", type: "success" },
				failed: { label: "失败", type: "danger" }
			}
			const item = map[row.transformStatus] || { label: row.transformStatus, type: "info" }
			return h(elTag, { type: item.type as any, size: "small" }, { default: () => item.label })
		}
	},
	{
		prop: "processDuration",
		label: "耗时(ms)",
		width: 100,
		align: "right"
	},
	{
		prop: "processor",
		label: "处理人",
		width: 100,
		align: "center"
	},
	{
		prop: "createTime",
		label: "创建时间",
		width: 180
	},
	{
		prop: "updateTime",
		label: "更新时间",
		width: 180
	},
	{
		label: "操作",
		slot: "action",
		fixed: "right",
		width: 150
	}
])

// ==================== 新增/编辑弹窗 ====================
const dialogVisible = ref(false)
const dialogLoading = ref(false)
const dialogMode = ref<"add" | "edit">("add")
const editingId = ref<number | null>(null)

const dialogTitle = computed(() => (dialogMode.value === "add" ? "新增标准化记录" : "编辑标准化记录"))

const dialogFormData = ref<LspForm>({
	sourceSystem: "",
	originalFormat: "",
	formatVersion: "",
	transformStatus: "pending",
	processor: ""
})

const dialogFields = computed<FormField[]>(() => [
	{
		prop: "sourceSystem",
		label: "来源系统",
		type: "select",
		placeholder: "请选择来源系统",
		options: sourceSystemOptions,
		rules: [{ required: true, message: "请选择来源系统", trigger: "change" }]
	},
	{
		prop: "originalFormat",
		label: "原始日志格式",
		type: "textarea",
		placeholder: "请输入原始日志格式",
		rules: [{ required: true, message: "请输入原始日志格式", trigger: "blur" }]
	},
	{
		prop: "formatVersion",
		label: "标准格式版本",
		type: "input",
		placeholder: "如: v1.0.0",
		rules: [{ required: true, message: "请输入格式版本", trigger: "blur" }]
	},
	{
		prop: "transformStatus",
		label: "处理状态",
		type: "select",
		placeholder: "请选择处理状态",
		options: [
			{ label: "待处理", value: "pending" },
			{ label: "处理中", value: "processing" },
			{ label: "已完成", value: "completed" },
			{ label: "处理失败", value: "failed" }
		]
	},
	{
		prop: "processor",
		label: "处理人",
		type: "input",
		placeholder: "请输入处理人",
		rules: [{ required: true, message: "请输入处理人", trigger: "blur" }]
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
		sourceSystem: "",
		transformStatus: "",
		processor: "",
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
	dialogMode.value = "add"
	editingId.value = null
	dialogFormData.value = {
		sourceSystem: "",
		originalFormat: "",
		formatVersion: "",
		transformStatus: "pending",
		processor: ""
	}
	dialogVisible.value = true
}

/**
 * 打开编辑弹窗（防抖）
 */
const handleEdit = useDebounceFn((row: LspItem) => {
	editLoading.value = true
	setTimeout(() => {
		editLoading.value = false
	}, 200)
	dialogMode.value = "edit"
	editingId.value = row.id
	dialogFormData.value = {
		sourceSystem: row.sourceSystem,
		originalFormat: row.originalFormat,
		formatVersion: row.formatVersion,
		transformStatus: row.transformStatus,
		processor: row.processor
	}
	dialogVisible.value = true
}, 300)

/**
 * 提交表单
 */
const handleSubmit = async () => {
	const valid = await dialogFormRef.value?.validate()
	if (!valid) return

	dialogLoading.value = true
	try {
		if (dialogMode.value === "add") {
			const res = await lsp.add(dialogFormData.value)
			if (res.state === 2000 || res.state === 200) {
				ElMessage.success("新增成功")
				dialogVisible.value = false
				loadTableData()
			} else {
				ElMessage.error(res.message || "新增失败")
			}
		} else {
			const res = await lsp.update({ id: editingId.value!, ...dialogFormData.value })
			if (res.state === 2000 || res.state === 200) {
				ElMessage.success("编辑成功")
				dialogVisible.value = false
				loadTableData()
			} else {
				ElMessage.error(res.message || "编辑失败")
			}
		}
	} catch (error) {
		console.error("提交数据失败:", error)
		ElMessage.error("提交失败")
	} finally {
		dialogLoading.value = false
	}
}

/**
 * 删除（防抖 + 节流）
 */
const handleDelete = useThrottleFn(async (row: LspItem) => {
	const confirmed = await ElMessageBox.confirm(
		`确认删除来源系统「${row.sourceSystem}」的这条标准化记录吗？`,
		"提示",
		{
			confirmButtonText: "确认",
			cancelButtonText: "取消",
			type: "warning"
		}
	).catch(() => false)
	if (!confirmed) return

	try {
		const res = await lsp.delete(row.id)
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

// ==================== 生命周期 ====================
onMounted(() => {
	loadTableData()
})
</script>
