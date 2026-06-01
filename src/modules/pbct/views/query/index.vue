<template>
	<div class="pbct-container">
		<!-- 筛选表单区域 -->
		<div class="filter-section">
			<HxForm
				ref="formRef"
				v-model="formData"
				:fields="[]"
				:cols="4"
				:show-action="true"
				@search="handleSearch"
				@reset="handleReset"
			>
				<!-- 自定义表单渲染插槽 -->
				<template #search>
					<el-form-item label="身份证" required>
						<el-input
							v-model="formData.idCard"
							placeholder="请输入身份证号"
							@input="handleIdCardInput"
							@blur="handleIdCardInput(formData.idCard)"
						/>
						<div v-if="idCardError" class="id-card-error">{{ idCardError }}</div>
					</el-form-item>
					<el-form-item label="姓名">
						<el-input v-model="formData.name" placeholder="请输入姓名" clearable />
					</el-form-item>
					<el-form-item label="联系电话">
						<el-input v-model="formData.phone" placeholder="请输入联系电话" clearable />
					</el-form-item>
					<el-form-item label="处理时间排序">
						<el-select v-model="formData.sortOrder" placeholder="默认不排序" clearable style="width: 100%">
							<el-option label="从早到晚" value="asc" />
							<el-option label="从晚到早" value="desc" />
						</el-select>
					</el-form-item>
				</template>

				<template #action-buttons>
					<el-button type="primary" :disabled="!!idCardError || !formData.idCard" @click="handleSearch">查询</el-button>
					<el-button @click="handleReset">重置</el-button>
					<!-- <HxExporter
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
				/> -->
				</template>
			</HxForm>
		</div>

		<!-- 操作按钮区域 -->
		<!-- <div class="action-bar">
			<div class="action-left">
				<HxExporter
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
			</div>
		</div> -->

		<!-- 表格区域 -->
		<div class="table-container">
			<HxTable
				ref="tableRef"
				border
				height="calc(100vh - 350px)"
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
				<!-- 未搜索时的空状态 -->
				<template #empty>
					<div v-if="!hasSearched" class="empty-init">
						<div class="empty-icon">
							<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="32" cy="32" r="30" stroke="#DCDFE6" stroke-width="2" stroke-dasharray="4 4"/>
								<path d="M32 20v16M32 42v2" stroke="#909399" stroke-width="2.5" stroke-linecap="round"/>
							</svg>
						</div>
						<div class="empty-title">请输入身份证号进行查询</div>
						<div class="empty-desc">为保护个人隐私，请输入正确的身份证号码以查询相关信息</div>
					</div>
					<div v-else class="empty-no-data">
						<div class="empty-icon">
							<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
								<circle cx="32" cy="32" r="30" stroke="#DCDFE6" stroke-width="2"/>
								<path d="M22 32h20M32 22v20" stroke="#909399" stroke-width="2" stroke-linecap="round" transform="rotate(45 32 32)"/>
							</svg>
						</div>
						<div class="empty-title">暂无匹配数据</div>
						<div class="empty-desc">未查询到相关信息，请检查输入条件是否正确</div>
					</div>
				</template>
				<template #action="{ row }">
					<el-button type="primary" link @click="handleView(row)">查看</el-button>
				</template>
			</HxTable>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue"
import { ElMessage } from "element-plus"
import { HxForm, HxTable, HxExporter } from "@hx/ui"
import type { TableColumn } from "@hx/ui"
import { pbct, type ListItem } from "@/modules/pbct/api"

/**
 * 校验身份证号码格式
 */
const validateIdCard = (idCard: string): boolean => {
	if (!idCard) return false
	// 15位或18位身份证号正则
	const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
	return reg.test(idCard)
}

// ==================== Refs ====================
const tableRef = ref()

// ==================== 搜索状态 ====================
const hasSearched = ref(false)

// ==================== 表单数据 ====================
const formData = ref({
	name: "",
	idCard: "",
	phone: "",
	district: "",
	gender: "",
	ethnicity: "",
	sortOrder: "" // 排序：不排序/asc/desc
})

// ==================== 身份证号错误提示 ====================
const idCardError = ref("")

/**
 * 身份证号输入校验
 */
const handleIdCardInput = (value: string) => {
	if (value && !validateIdCard(value)) {
		idCardError.value = "请输入正确的身份证号"
	} else {
		idCardError.value = ""
	}
}

// ==================== 表单配置 ====================

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
		width: 120
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
	}
])

// ==================== 方法 ====================

/**
 * 构建查询参数
 */
const buildListQuery = () => {
	return {
		page: pagination.currentPage,
		pageSize: pagination.pageSize,
		name: formData.value.name || undefined,
		idCard: formData.value.idCard || undefined,
		phone: formData.value.phone || undefined,
		district: formData.value.district || undefined,
		gender: formData.value.gender || undefined,
		ethnicity: formData.value.ethnicity || undefined,
		sortOrder: formData.value.sortOrder || undefined
	}
}

/**
 * 获取查询参数（用于导出）
 */
const getSearchParams = () => {
	return buildListQuery()
}

/**
 * 加载表格数据
 */
const loadTableData = async () => {
	tableLoading.value = true
	try {
		const query = buildListQuery()
		const res = await pbct.getList(query)
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
 * 搜索
 */
const handleSearch = () => {
	// 校验身份证号格式
	if (!formData.value.idCard) {
		ElMessage.warning("请输入身份证号")
		return
	}
	if (!validateIdCard(formData.value.idCard)) {
		idCardError.value = "请输入正确的身份证号"
		return
	}
	idCardError.value = ""
	pagination.currentPage = 1
	loadTableData()
	hasSearched.value = true
}

/**
 * 重置
 */
const handleReset = () => {
	formData.value = {
		name: "",
		idCard: "",
		phone: "",
		district: "",
		gender: "",
		ethnicity: "",
		sortOrder: ""
	}
	idCardError.value = ""
	pagination.currentPage = 1
	hasSearched.value = false
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
 * 查看详情
 */
const handleView = (row: ListItem) => {
	ElMessage.info(`查看 ${row.name} 的详情`)
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

// ==================== 生命周期 ====================
// 默认不查询，等待用户输入正确的身份证号后手动查询
</script>

<style lang="scss" scoped>
@use "../pbct.scss" as *;

.id-card-error {
	font-size: 12px;
	color: var(--el-color-danger);
	line-height: 1.4;
	margin-top: 4px;
}

.empty-init,
.empty-no-data {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 40px 20px;
	text-align: center;

	.empty-icon {
		margin-bottom: 16px;
	}

	.empty-title {
		font-size: 16px;
		font-weight: 500;
		color: #303133;
		margin-bottom: 8px;
	}

	.empty-desc {
		font-size: 14px;
		color: #909399;
		line-height: 1.6;
		max-width: 300px;
	}
}
</style>
