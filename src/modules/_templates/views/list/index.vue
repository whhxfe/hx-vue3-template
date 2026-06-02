<template>
	<div class="list-page-container">
		<!-- 筛选表单区域 -->
		<div class="filter-section">
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
		<div ref="tableContainerRef" class="table-container">
			<div class="table-header">
				<el-button type="primary" :disabled="addLoading" @click="handleAdd">
					<el-icon><Plus /></el-icon>
					新增
				</el-button>
				<HxImporter
					ref="importerRef"
					type="default"
					:upload-action="importConfig.uploadAction"
					:method="importConfig.method"
					:template-file-name="importConfig.templateFileName"
					:template-url="importConfig.templateUrl"
					:max-size="importConfig.maxSize"
					button-text="导入"
					dialog-title="导入数据"
					@success="handleImportSuccess"
					@error="handleImportError"
				/>
				<HxExporter
					ref="exporterRef"
					:export-action="exportConfig.exportAction"
					:method="exportConfig.method"
					:current-page="pagination.currentPage"
					:page-size="pagination.pageSize"
					:total-count="pagination.total"
					:max-export-count="exportConfig.maxExportCount"
					button-text="导出"
					dialog-title="导出数据"
					:get-search-params="getSearchParams"
					@success="handleExportSuccess"
					@error="handleExportError"
				/>
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
			width="800px"
			:close-on-click-modal="false"
			destroy-on-close
		>
			<HxForm
				ref="dialogFormRef"
				v-model="dialogFormData"
				:fields="dialogFields"
				label-width="100px"
				:cols="2"
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
import { HxForm, HxTable, HxImporter, HxExporter } from "@hx/ui"
import type { FormField, TableColumn } from "@hx/ui"
import { demo, type ListItem, type ListForm } from "@/modules/_templates/api/list"

// ==================== Refs ====================
const tableRef = ref()
const tableContainerRef = ref()
const dialogFormRef = ref()
const importerRef = ref()
const exporterRef = ref()

void tableRef
void importerRef
void exporterRef

// ==================== 表格容器动态高度 ====================
const { height: tableContainerHeight } = useElementSize(tableContainerRef)
const tableHeight = computed(() => tableContainerHeight.value - 44)

// ==================== 导入/导出配置 ====================
const importConfig = {
	uploadAction: "/templates/list/import",
	method: "post" as const,
	templateFileName: "导入模板.xlsx",
	templateUrl: "/templates/list/import-template",
	maxSize: 10
}

const exportConfig = {
	exportAction: "/templates/list/export",
	method: "post" as const,
	maxExportCount: 10000
}

// ==================== 筛选表单数据 ====================
const filterData = ref({
	name: "",
	phone: "",
	gender: "",
	status: ""
})

const filterFields = computed<FormField[]>(() => [
	{
		prop: "name",
		label: "姓名",
		type: "input",
		placeholder: "请输入姓名"
	},
	{
		prop: "phone",
		label: "联系电话",
		type: "input",
		placeholder: "请输入联系电话"
	},
	{
		prop: "gender",
		label: "性别",
		type: "select",
		placeholder: "请选择性别",
		options: [
			{ label: "男", value: "男" },
			{ label: "女", value: "女" }
		]
	},
	{
		prop: "status",
		label: "状态",
		type: "select",
		placeholder: "请选择状态",
		options: [
			{ label: "启用", value: "1" },
			{ label: "禁用", value: "0" }
		]
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
const editLoading = ref(false)
const deleteLoading = ref(false)
const refreshLoading = ref(false)

/**
 * 构造查询参数
 */
const buildQueryParams = () => ({
	page: pagination.currentPage,
	pageSize: pagination.pageSize,
	name: filterData.value.name || undefined,
	phone: filterData.value.phone || undefined,
	gender: filterData.value.gender || undefined,
	status: filterData.value.status || undefined
})

/**
 * 获取查询参数（用于导出）
 */
const getSearchParams = () => buildQueryParams()

/**
 * 加载表格数据
 */
const { state: tableData, isLoading: tableLoading, execute: loadTableData } = useAsyncState(
	async () => {
		const res = await demo.getList(buildQueryParams())
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
		prop: "name",
		label: "姓名",
		width: 120
	},
	{
		prop: "gender",
		label: "性别",
		width: 80,
		align: "center"
	},
	{
		prop: "phone",
		label: "联系电话",
		width: 140
	},
	{
		prop: "email",
		label: "邮箱",
		minWidth: 180,
		showOverflowTooltip: true
	},
	{
		prop: "status",
		label: "状态",
		width: 100,
		align: "center",
		render: (row: ListItem) => {
			const isActive = row.status === "1"
			return h(
				elTag,
				{ type: isActive ? "success" : "info", size: "small" },
				{ default: () => (isActive ? "启用" : "禁用") }
			)
		}
	},
	{
		prop: "createTime",
		label: "创建时间",
		width: 180
	},
	{
		prop: "description",
		label: "描述",
		minWidth: 150,
		showOverflowTooltip: true
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

const dialogTitle = computed(() => (dialogMode.value === "add" ? "新增数据" : "编辑数据"))

const dialogFormData = ref<ListForm>({
	name: "",
	phone: "",
	email: "",
	gender: "",
	status: "1",
	description: ""
})

const dialogFields = computed<FormField[]>(() => [
	{
		prop: "name",
		label: "姓名",
		type: "input",
		placeholder: "请输入姓名",
		colSpan: 1,
		rules: [{ required: true, message: "请输入姓名", trigger: "blur" }]
	},
	{
		prop: "gender",
		label: "性别",
		type: "select",
		placeholder: "请选择性别",
		options: [
			{ label: "男", value: "男" },
			{ label: "女", value: "女" }
		],
		colSpan: 1,
		rules: [{ required: true, message: "请选择性别", trigger: "change" }]
	},
	{
		prop: "phone",
		label: "联系电话",
		type: "input",
		placeholder: "请输入联系电话",
		maxlength: 11,
		colSpan: 1
	},
	{
		prop: "email",
		label: "邮箱",
		type: "input",
		placeholder: "请输入邮箱",
		colSpan: 1,
		rules: [
			{
				pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
				message: "邮箱格式不正确",
				trigger: "blur"
			}
		]
	},
	{
		prop: "status",
		label: "状态",
		type: "select",
		placeholder: "请选择状态",
		options: [
			{ label: "启用", value: "1" },
			{ label: "禁用", value: "0" }
		],
		colSpan: 1
	},
	{
		prop: "description",
		label: "描述",
		type: "textarea",
		placeholder: "请输入描述",
		colSpan: 2
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
		name: "",
		phone: "",
		gender: "",
		status: ""
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
		name: "",
		phone: "",
		email: "",
		gender: "",
		status: "1",
		description: ""
	}
	dialogVisible.value = true
}

/**
 * 打开编辑弹窗（防抖）
 */
const handleEdit = useDebounceFn((row: ListItem) => {
	editLoading.value = true
	setTimeout(() => {
		editLoading.value = false
	}, 200)
	dialogMode.value = "edit"
	editingId.value = row.id
	dialogFormData.value = {
		name: row.name,
		phone: row.phone,
		email: row.email,
		gender: row.gender,
		status: row.status,
		description: row.description
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
			const res = await demo.add(dialogFormData.value)
			if (res.state === 2000 || res.state === 200) {
				ElMessage.success("新增成功")
				dialogVisible.value = false
				loadTableData()
			} else {
				ElMessage.error(res.message || "新增失败")
			}
		} else {
			const res = await demo.update({ id: editingId.value!, ...dialogFormData.value })
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
const handleDelete = useThrottleFn(async (row: ListItem) => {
	const confirmed = await ElMessageBox.confirm(`确认删除 "${row.name}" 的数据吗？`, "提示", {
		confirmButtonText: "确认",
		cancelButtonText: "取消",
		type: "warning"
	}).catch(() => false)
	if (!confirmed) return

	try {
		const res = await demo.delete(row.id)
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
 * 导入成功回调
 */
const handleImportSuccess = (response: any) => {
	ElMessage.success(response?.message || "导入成功")
	loadTableData()
}

/**
 * 导入失败回调
 */
const handleImportError = (error: any) => {
	ElMessage.error(error?.message || "导入失败")
}

/**
 * 导出成功回调
 */
const handleExportSuccess = () => {
	ElMessage.success("导出成功")
}

/**
 * 导出失败回调
 */
const handleExportError = (error: any) => {
	ElMessage.error(error?.message || "导出失败")
}

// ==================== 生命周期 ====================
onMounted(() => {
	loadTableData()
})
</script>

<style lang="scss" scoped>
.list-page-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 16px;
	background: var(--el-bg-color-page);
	gap: 16px;

	.filter-section {
		background: var(--el-bg-color);
		border-radius: 8px;
		padding: 16px;
	}

	.table-container {
		flex: 1;
		background: var(--el-bg-color);
		border-radius: 8px;
		padding: 16px;
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow: hidden;

		.table-header {
			display: flex;
			gap: 8px;
			margin-bottom: 12px;
		}

		:deep(.el-table) {
			width: 100%;
		}
	}
}
</style>
