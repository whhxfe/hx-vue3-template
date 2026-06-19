<template>
	<div class="pbct-container">
		<!-- 操作按钮区域 -->
		<div class="action-bar">
			<div class="action-left">
				<el-button type="primary" @click="handleAdd">
					<el-icon><Plus /></el-icon>
					新增
				</el-button>
				<HxImporter
					ref="importerRef"
					type="primary"
					:upload-action="'/pbct/import'"
					:method="'post'"
					template-file-name="导入模板.xlsx"
					template-url="/pbct/import-template"
					:max-size="10"
					button-text="导入"
					dialog-title="导入数据"
					@success="handleImportSuccess"
					@error="handleImportError"
				/>
				<HxExporter
					ref="exporterRef"
					:export-action="'/pbct/export'"
					:method="'post'"
					:current-page="pagination.currentPage"
					:page-size="pagination.pageSize"
					:total-count="pagination.total"
					:max-export-count="10000"
					button-text="导出"
					dialog-title="导出数据"
					:get-search-params="getSearchParams"
					@success="handleExportSuccess"
					@error="handleExportError"
				/>
				<el-button @click="handleRefresh">
					<el-icon><Refresh /></el-icon>
					刷新
				</el-button>
			</div>
		</div>

		<!-- 新增表单弹窗 -->
		<el-dialog v-model="dialogVisible" title="新增数据" width="1000px" :close-on-click-modal="false">
			<HxForm
				ref="addFormRef"
				v-model="addFormData"
				:fields="formFields"
				label-width="100px"
				:cols="2"
				:show-action="false"
			/>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="dialogLoading" @click="handleSubmit">确认</el-button>
			</template>
		</el-dialog>

		<!-- 表格区域 -->
		<div class="table-container">
			<HxTable
				ref="tableRef"
				border
				height="calc(100vh - 200px)"
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
					<el-button type="primary" link @click="handleDelete(row)">删除</el-button>
				</template>
			</HxTable>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeMount } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { Refresh, Plus } from "@element-plus/icons-vue"
import { HxForm, HxTable, HxImporter, HxExporter } from "@whhx/ui"
import type { FormField, TableColumn } from "@whhx/ui"
import { pbct, type ListItem } from "@/modules/pbct/api"
import { useSysStore } from "@/store"
import router from "@/router"

// ==================== Refs ====================
const tableRef = ref()
const addFormRef = ref()

// 标记为已使用
void tableRef
void addFormRef

// ==================== 新增表单弹窗 ====================
const dialogVisible = ref(false)
const dialogLoading = ref(false)
const addFormData = ref({
	handleTime: "",
	name: "",
	idCard: "",
	phone: "",
	gender: "",
	ethnicity: "",
	virtualAccount: "",
	handleReason: "",
	handleResult: "",
	district: "",
	householdAddress: "",
	residenceAddress: ""
})

// ==================== 表单字段配置 ====================
const formFields = computed<FormField[]>(() => [
	{
		prop: "handleTime",
		label: "处理时间",
		type: "date",
		placeholder: "选择日期",
		valueFormat: "YYYY-MM-DD",
		colSpan: 1,
		rules: [{ required: true, message: "请选择处理时间", trigger: "change" }]
	},
	{
		prop: "name",
		label: "姓名",
		type: "input",
		placeholder: "请输入姓名",
		colSpan: 1,
		rules: [{ required: true, message: "请输入姓名", trigger: "blur" }]
	},
	{
		prop: "idCard",
		label: "身份证号",
		type: "input",
		placeholder: "请输入身份证号",
		maxlength: 18,
		colSpan: 1
		// rules: [
		// 	{ required: true, message: "请输入身份证号", trigger: "blur" },
		// 	{ pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: "身份证号格式不正确", trigger: "blur" }
		// ]
	},
	{
		prop: "phone",
		label: "联系电话",
		type: "input",
		placeholder: "请输入手机号",
		maxlength: 11,
		colSpan: 1
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
		colSpan: 1
	},
	{
		prop: "ethnicity",
		label: "民族",
		type: "select",
		placeholder: "请选择民族",
		remote: {
			url: "/public/dict/ethnicity",
			labelKey: "label",
			valueKey: "value"
		},
		colSpan: 1
	},
	{
		prop: "virtualAccount",
		label: "虚拟账号",
		type: "textarea",
		placeholder: "请输入虚拟账号",
		colSpan: 2
	},
	{
		prop: "handleReason",
		label: "处理原因",
		type: "textarea",
		placeholder: "请输入处理原因",
		colSpan: 2
	},
	{
		prop: "handleResult",
		label: "处理结果",
		type: "textarea",
		placeholder: "请输入处理结果",
		colSpan: 2
	},
	{
		prop: "district",
		label: "所属区县",
		type: "cascader",
		placeholder: "请选择所属区县",
		remote: {
			// /public/dict/china-region?
			url: "/public/dict/china-region",
			params: {
				// parentCode: 5404,
				depth: 3,
				format: "tree"
			},
			labelKey: "name",
			valueKey: "name",
			childrenKey: "children"
		},
		cascaderProps: {
			showAllLevels: true,
			checkStrictly: true,
			emitPath: false
		},
		// componentProps: {},
		colSpan: 1
	},
	{
		prop: "householdAddress",
		label: "户籍地址",
		type: "input",
		placeholder: "请输入户籍地址",
		colSpan: 2
	},
	{
		prop: "residenceAddress",
		label: "现居地址",
		type: "input",
		placeholder: "请输入现居地址",
		colSpan: 2
	}
])

// ==================== 分页配置 ====================
const pagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0
})

// ==================== 表格数据 ====================
const tableData = ref<ListItem[]>([])
const tableLoading = ref(false)

// ==================== 表格列配置 ====================
const tableColumns = computed<TableColumn[]>(() => [
	{
		type: "index",
		label: "序号",
		width: 60,
		align: "center"
	},
	{
		prop: "handleTime",
		label: "处理时间",
		width: 120,
		sortable: true
	},
	{
		prop: "name",
		label: "姓名",
		width: 100
	},
	{
		prop: "idCard",
		label: "身份证",
		width: 180,
		showOverflowTooltip: true
	},
	{
		prop: "phone",
		label: "联系电话",
		width: 130
	},
	{
		prop: "gender",
		label: "性别",
		width: 60,
		align: "center"
	},
	{
		prop: "ethnicity",
		label: "民族",
		width: 80
	},
	{
		prop: "virtualAccount",
		label: "虚拟账号",
		width: 120,
		showOverflowTooltip: true
	},
	{
		prop: "handleReason",
		label: "处理原因",
		width: 120,
		showOverflowTooltip: true
	},
	{
		prop: "handleResult",
		label: "处理结果",
		width: 120,
		showOverflowTooltip: true
	},
	{
		prop: "householdAddress",
		label: "户籍地址",
		minWidth: 180,
		showOverflowTooltip: true
	},
	{
		prop: "residenceAddress",
		label: "现居地址",
		minWidth: 180,
		showOverflowTooltip: true
	},
	{
		prop: "district",
		label: "所属区县",
		width: 100
	},
	{
		label: "操作",
		slot: "action",
		fixed: "right",
		width: 160
	}
])

// ==================== 方法 ====================

/**
 * 打开新增弹窗
 */
const handleAdd = () => {
	addFormData.value = {
		handleTime: "",
		name: "",
		idCard: "",
		phone: "",
		gender: "",
		ethnicity: "",
		virtualAccount: "",
		handleReason: "",
		handleResult: "",
		district: "",
		householdAddress: "",
		residenceAddress: ""
	}
	dialogVisible.value = true
}

/**
 * 提交新增表单
 */
const handleSubmit = async () => {
	const valid = await addFormRef.value?.validate()
	if (!valid) return

	dialogLoading.value = true
	try {
		const res = await pbct.add(addFormData.value as any)
		if (res.state === 2000) {
			ElMessage.success("新增成功")
			dialogVisible.value = false
			loadTableData()
		} else {
			ElMessage.error(res.message || "新增失败")
		}
	} catch (error) {
		console.error("新增数据失败:", error)
		ElMessage.error("新增失败")
	} finally {
		dialogLoading.value = false
	}
}

/**
 * 加载表格数据
 */
const loadTableData = async () => {
	tableLoading.value = true
	try {
		const res = await pbct.getList({
			page: pagination.currentPage,
			pageSize: pagination.pageSize
		})
		tableData.value = res.data.list || []
		pagination.total = res.data.total || 0
	} catch (error) {
		console.error("加载列表数据失败:", error)
		tableData.value = []
		pagination.total = 0
	} finally {
		tableLoading.value = false
	}
}

/**
 * 搜索参数（用于导出）
 */
const getSearchParams = () => {
	return {
		page: pagination.currentPage,
		pageSize: pagination.pageSize
	}
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
 * 刷新
 */
const handleRefresh = () => {
	loadTableData()
	ElMessage.success("操作成功")
}

/**
 * 删除
 */
const handleDelete = (row: ListItem) => {
	ElMessageBox.confirm(`确认删除 "${row.name}" 的数据吗？`, "提示", {
		confirmButtonText: "确认",
		cancelButtonText: "取消",
		type: "warning"
	})
		.then(async () => {
			try {
				const res = await pbct.delete(row.id)
				if (res.state === 2000) {
					ElMessage.success("删除成功")
					loadTableData()
				} else {
					ElMessage.error(res.message || "删除失败")
				}
			} catch (error) {
				console.error("删除数据失败:", error)
				ElMessage.error("删除失败")
			}
		})
		.catch(() => {})
}

/**
 * 导入成功回调
 */
const handleImportSuccess = (response: any) => {
	ElMessage.success(response.message || "导入成功")
	loadTableData()
}

/**
 * 导入失败回调
 */
const handleImportError = (error: any) => {
	ElMessage.error(error.message || "导入失败")
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
	ElMessage.error(error.message || "导出失败")
}

// ==================== 权限检查 ====================

/** 仅 super(0) 和 admin(1) 可访问此页面，普通用户自动跳转 */
onBeforeMount(() => {
	const sysStore = useSysStore()
	const roleLevel = Number(sysStore.userInfo?.roleLevel ?? -1)
	if (roleLevel > 1) {
		router.replace("/pbct/query")
	}
})

// ==================== 生命周期 ====================
onMounted(() => {
	loadTableData()
})
</script>

<style lang="scss" scoped>
@use "../pbct.scss" as *;
</style>
