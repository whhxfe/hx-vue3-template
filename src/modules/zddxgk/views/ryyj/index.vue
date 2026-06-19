<template>
	<div class="ryyj-container">
		<!-- 筛选表单 -->
		<div class="filter-section">
			<HxForm
				ref="formRef"
				v-model="formData"
				:fields="formColumns"
				:cols="5"
				:show-action="true"
				@search="handleSearch"
				@reset="handleReset"
			/>
		</div>

		<!-- 数据展示区域 -->
		<div class="data-section">
			<!-- 操作栏 -->
			<div class="action-bar">
				<div class="action-left">
					<el-button type="primary" @click="handleAdd">
						<el-icon><Plus /></el-icon>
						新增
					</el-button>
				<HxImporter
					ref="importerRef"
					:upload-action="'/zddxgk/ryyj/import'"
					:method="'post'"
					template-file-name="人员预警导入模板.xlsx"
					:template-url="ryyj.getImportTemplate()"
					:max-size="10"
					button-text="导入"
					dialog-title="导入人员预警信息"
					@success="handleImportSuccess"
					@error="handleImportError"
				/>
					<HxExporter
						ref="exporterRef"
						:export-action="'/zddxgk/ryyj/export'"
						:method="'post'"
						:current-page="pagination.currentPage"
						:page-size="pagination.pageSize"
						:total-count="pagination.total"
						:max-export-count="10000"
						button-text="导出"
						dialog-title="导出人员预警信息"
						:get-search-params="getSearchParams"
						@success="handleExportSuccess"
						@error="handleExportError"
					/>
				</div>
				<div class="action-right">
					<span class="selected-count" v-if="selectedRows.length > 0">
						已选择 {{ selectedRows.length }} 项
					</span>
				</div>
			</div>

			<!-- 表格视图 -->
			<div class="table-container">
				<el-table
					v-loading="tableLoading"
					v-model:selected="selectedRows"
					:data="tableData"
					border
					@selection-change="handleSelectionChange"
					style="width: 100%"
				>
					<el-table-column type="selection" width="50" align="center" />
					<el-table-column min-width="100%">
						<template #header>
							<div class="table-header">
								<span class="header-title">人员预警信息</span>
								<div class="header-actions">
									<el-button
										link
										:type="sortField === 'personScore' ? 'primary' : 'default'"
										@click="handleSort('personScore')"
									>
										按分值
										<el-icon v-if="sortField === 'personScore'">
											<SortUp v-if="sortOrder === 'asc'" />
											<SortDown v-else />
										</el-icon>
										<el-icon v-else><Sort /></el-icon>
									</el-button>
									<el-button
										link
										:type="sortField === 'entryTime' ? 'primary' : 'default'"
										@click="handleSort('entryTime')"
									>
										按录入时间
										<el-icon v-if="sortField === 'entryTime'">
											<SortUp v-if="sortOrder === 'asc'" />
											<el-icon v-else><SortDown /></el-icon>
										</el-icon>
										<el-icon v-else><Sort /></el-icon>
									</el-button>
								</div>
							</div>
						</template>
						<template #default="{ row }">
							<div class="person-info-block">
								<!-- 左侧：证件照 -->
								<div class="info-photo">
									<el-image
										v-if="row.avatar"
										:src="row.avatar"
										fit="cover"
										class="photo-img"
									/>
									<div v-else class="photo-placeholder">
										<span>{{ row.name?.charAt(0) || "无" }}</span>
									</div>
								</div>

								<!-- 右侧：信息区域 -->
								<div class="info-content">
									<!-- 上部：基本信息单行 -->
									<div class="info-header">
										<span class="name">{{ row.name }}</span>
										<span class="separator">/</span>
										<span class="gender-age">{{ row.gender }} {{ row.age }}岁</span>
										<span class="separator">|</span>
										<span class="idcard">{{ row.idCard }}</span>
										<span class="separator">|</span>
										<span class="education">{{ row.education || "—" }}</span>
										<span class="separator">|</span>
										<span class="occupation">{{ row.occupationType || "—" }}</span>
										<span class="separator">|</span>
										<el-tag v-if="row.warningType" size="small" :type="getWarningType(row.warningType)">
											{{ row.warningTypeName || "预警" }}
										</el-tag>
										<el-tag size="small" :class="getScoreClass(row.personScore)" effect="light">
											分值: {{ row.personScore ?? "—" }}
										</el-tag>
										<div class="header-right">
											<el-dropdown trigger="click" @command="(cmd: string) => handleCommand(cmd, row)">
												<el-button link>
													<el-icon><MoreFilled /></el-icon>
												</el-button>
												<template #dropdown>
													<el-dropdown-menu>
														<el-dropdown-item command="edit">
															<el-icon><Edit /></el-icon>
															编辑
														</el-dropdown-item>
														<el-dropdown-item command="delete" divided>
															<el-icon><Delete /></el-icon>
															删除
														</el-dropdown-item>
													</el-dropdown-menu>
												</template>
											</el-dropdown>
										</div>
									</div>

									<!-- 下部：详细信息（多列） -->
									<div class="info-body" :style="{ gridTemplateColumns: `repeat(${infoBodyColumns}, 1fr)` }">
										<HxLabelText label="人员类别" :text="row.personCategoryName || '—'" />
										<HxLabelText label="管理类别" :text="row.manageCategoryName || '—'" />
										<HxLabelText label="数据来源" :text="row.dataSourceName || '—'" />
										<HxLabelText label="录入时间" :text="row.entryTime || '—'" />
										<HxLabelText label="居住地址" :text="row.residenceAddress || '—'" />
									</div>
								</div>
							</div>
						</template>
					</el-table-column>
				</el-table>

				<!-- 分页 -->
				<div class="pagination-wrapper">
					<el-pagination
						v-model:current-page="pagination.currentPage"
						v-model:page-size="pagination.pageSize"
						:total="pagination.total"
						:page-sizes="[10, 20, 50, 100]"
						:layout="'total, sizes, prev, pager, next, jumper'"
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
					/>
				</div>
			</div>
		</div>

		<!-- 新增/编辑弹窗 -->
		<el-dialog
			v-model="addDialogVisible"
			:title="dialogMode === 'add' ? '新增人员预警' : '编辑人员预警'"
			width="600px"
			:close-on-click-modal="false"
			@close="handleAddDialogClose"
		>
			<el-form ref="addFormRef" :model="addFormData" :rules="addFormRules" label-width="100px">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="姓名" prop="name">
							<el-input v-model="addFormData.name" placeholder="请输入姓名" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="性别" prop="gender">
							<el-select v-model="addFormData.gender" placeholder="请选择性别" style="width: 100%">
								<el-option label="男" value="男" />
								<el-option label="女" value="女" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="年龄" prop="age">
							<el-input-number v-model="addFormData.age" :min="0" :max="150" style="width: 100%" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="身份证号" prop="idCard">
							<el-input v-model="addFormData.idCard" placeholder="请输入身份证号" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="手机号" prop="phone">
							<el-input v-model="addFormData.phone" placeholder="请输入手机号" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="人员分值" prop="personScore">
							<el-input-number v-model="addFormData.personScore" :min="0" :max="100" style="width: 100%" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="预警类型" prop="warningType">
							<el-select v-model="addFormData.warningType" placeholder="请选择预警类型" style="width: 100%">
								<el-option label="红色预警" value="1" />
								<el-option label="橙色预警" value="2" />
								<el-option label="黄色预警" value="3" />
								<el-option label="蓝色预警" value="4" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="业务类别" prop="businessCategory">
							<el-select v-model="addFormData.businessCategory" placeholder="请选择业务类别" style="width: 100%">
								<el-option label="刑满释放" value="1" />
								<el-option label="社区矫正" value="2" />
								<el-option label="吸毒人员" value="3" />
								<el-option label="精神障碍" value="4" />
								<el-option label="重点青少年" value="5" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="数据来源" prop="dataSource">
							<el-select v-model="addFormData.dataSource" placeholder="请选择数据来源" style="width: 100%">
								<el-option label="社区采集" value="community" />
								<el-option label="医院录入" value="hospital" />
								<el-option label="公安推送" value="police" />
								<el-option label="网格员上报" value="grid" />
								<el-option label="自主申报" value="self" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="管理类别" prop="manageCategory">
							<el-select v-model="addFormData.manageCategory" placeholder="请选择管理类别" style="width: 100%">
								<el-option label="重点关注" value="important" />
								<el-option label="一般管控" value="normal" />
								<el-option label="关注对象" value="concern" />
								<el-option label="帮扶对象" value="assist" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="学历" prop="education">
							<el-input v-model="addFormData.education" placeholder="请输入学历" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="职业类型" prop="occupationType">
							<el-input v-model="addFormData.occupationType" placeholder="请输入职业类型" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item label="居住地址" prop="residenceAddress">
							<el-input v-model="addFormData.residenceAddress" placeholder="请输入居住地址" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="addDialogVisible = false">取消</el-button>
					<el-button type="primary" :loading="addSubmitLoading" @click="handleAddSubmit">确定</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="tsx">
import { ref, reactive, computed, onMounted } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import { Plus, Sort, SortUp, SortDown, MoreFilled, Edit, Delete } from "@element-plus/icons-vue"
import { HxForm, HxImporter, HxExporter, HxLabelText } from "@whhx/ui"
import type { FormField } from "@whhx/ui"
import { ryyj } from "@/modules/zddxgk/api"
import type { ListItem } from "@/modules/zddxgk/api/ryyj/types"

type ImporterExpose = {
	open: () => void
	close: () => void
}

type ExporterExpose = {
	open: () => void
	close: () => void
}

// ==================== 新增/编辑弹窗 ====================
const addDialogVisible = ref(false)
const dialogMode = ref<"add" | "edit">("add")
const addSubmitLoading = ref(false)
const addFormRef = ref()
const editingRow = ref<ListItem | null>(null)

const addFormData = reactive({
	name: "",
	gender: "" as "男" | "女" | "",
	age: 18,
	idCard: "",
	phone: "",
	personScore: 0,
	warningType: "",
	businessCategory: "",
	dataSource: "",
	manageCategory: "",
	education: "",
	occupationType: "",
	residenceAddress: ""
})

const addFormRules = {
	name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
	gender: [{ required: true, message: "请选择性别", trigger: "change" }],
	age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
	idCard: [
		{ required: true, message: "请输入身份证号", trigger: "blur" },
		{ pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: "身份证号格式不正确", trigger: "blur" }
	]
}

// ==================== 排序配置 ====================
type SortField = "personScore" | "entryTime"
type SortOrder = "asc" | "desc"

const sortField = ref<SortField>("personScore")
const sortOrder = ref<SortOrder>("desc")

// ==================== 信息列数配置 ====================
const infoBodyColumns = 4

// ==================== 分值阈值配置 ====================
const SCORE_THRESHOLDS = {
	high: 80,
	medium: 60
} as const

// ==================== 表单配置 ====================
const formData = ref({
	businessCategory: "",
	personScore: "",
	warningType: "",
	dataSource: "",
	manageCategory: "",
	householdAddress: "",
	entryTime: [] as string[],
	manageDept: ""
})

const formColumns = computed<FormField[]>(() => [
	{
		prop: "businessCategory",
		label: "业务类别",
		type: "select",
		placeholder: "请选择业务类别",
		remote: {
			url: "/zddxgk/ryyj/dict/business-category",
			labelKey: "label",
			valueKey: "value"
		},
		colSpan: 1
	},
	{
		prop: "personScore",
		label: "人员分值",
		type: "select",
		placeholder: "请选择人员分值",
		remote: {
			url: "/zddxgk/ryyj/dict/person-score",
			labelKey: "label",
			valueKey: "value"
		},
		colSpan: 1
	},
	{
		prop: "warningType",
		label: "预警类型",
		type: "select",
		placeholder: "请选择预警类型",
		remote: {
			url: "/zddxgk/ryyj/dict/warning-type",
			labelKey: "label",
			valueKey: "value"
		},
		colSpan: 1
	},
	{
		prop: "dataSource",
		label: "数据来源",
		type: "select",
		placeholder: "请选择数据来源",
		remote: {
			url: "/zddxgk/ryyj/dict/data-source",
			labelKey: "label",
			valueKey: "value"
		},
		colSpan: 1
	},
	{
		prop: "manageCategory",
		label: "管理类别",
		type: "select",
		placeholder: "请选择管理类别",
		remote: {
			url: "/zddxgk/ryyj/dict/manage-category",
			labelKey: "label",
			valueKey: "value"
		},
		colSpan: 1
	},
	{
		prop: "householdAddress",
		label: "户籍地址",
		type: "select",
		placeholder: "请选择户籍地址",
		remote: {
			url: "/zddxgk/ryyj/dict/household-address",
			labelKey: "label",
			valueKey: "value"
		},
		colSpan: 1
	},
	{
		prop: "entryTime",
		label: "录入时间",
		type: "daterange",
		placeholder: "请选择时间范围",
		colSpan: 1,
		valueFormat: "YYYY-MM-DD",
		componentProps: {
			rangeSeparator: "至",
			startPlaceholder: "开始日期",
			endPlaceholder: "结束日期"
		}
	},
	{
		prop: "manageDept",
		label: "管理部门",
		type: "select",
		placeholder: "请选择管理部门",
		remote: {
			url: "/zddxgk/ryyj/dict/manage-dept",
			labelKey: "label",
			valueKey: "value"
		},
		colSpan: 1
	}
])

// ==================== 辅助函数 ====================
/**
 * 获取预警类型标签样式
 */
const getWarningType = (type?: string) => {
	const typeMap: Record<string, string> = {
		"1": "danger",
		"2": "warning",
		"3": "info",
		"4": "success"
	}
	return typeMap[type || ""] || "info"
}

/**
 * 获取分值样式
 */
const getScoreClass = (score?: number | string) => {
	const num = Number(score)
	if (isNaN(num)) return ""
	if (num >= SCORE_THRESHOLDS.high) return "score-high"
	if (num >= SCORE_THRESHOLDS.medium) return "score-medium"
	if (num >= 0) return "score-low"
	return ""
}

/**
 * 排序处理
 */
const handleSort = (field: SortField) => {
	if (sortField.value === field) {
		// 同一字段，切换排序方向
		sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc"
	} else {
		// 不同字段，默认降序
		sortField.value = field
		sortOrder.value = "desc"
	}
	pagination.currentPage = 1
	loadTableData()
}

/**
 * 下拉菜单命令处理
 */
const handleCommand = (command: string, row: ListItem) => {
	if (command === "edit") {
		handleEdit(row)
	} else if (command === "delete") {
		handleDelete(row)
	}
}

// ==================== 分页配置 ====================
const pagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0
})

// ==================== 表格数据 ====================
const tableData = ref<ListItem[]>([])
const tableLoading = ref(false)
const selectedRows = ref<ListItem[]>([])

// ==================== Refs ====================
const formRef = ref()
const importerRef = ref<ImporterExpose>()
const exporterRef = ref<ExporterExpose>()

// 标记为已使用
void formRef
void importerRef
void exporterRef

// ==================== 筛选条件 ====================
/**
 * 构建列表查询参数
 */
const buildListQuery = () => {
	const query: Record<string, unknown> = {
		page: pagination.currentPage,
		pageSize: pagination.pageSize,
		sortField: sortField.value,
		sortOrder: sortOrder.value,
		businessCategory: formData.value.businessCategory || undefined,
		personScore: formData.value.personScore || undefined,
		warningType: formData.value.warningType || undefined,
		dataSource: formData.value.dataSource || undefined,
		manageCategory: formData.value.manageCategory || undefined,
		householdAddress: formData.value.householdAddress || undefined,
		manageDept: formData.value.manageDept || undefined
	}

	// 录入时间范围
	if (formData.value.entryTime && formData.value.entryTime.length === 2) {
		query.entryTimeStart = formData.value.entryTime[0]
		query.entryTimeEnd = formData.value.entryTime[1]
	}

	return query
}

/**
 * 获取当前筛选条件（用于导出）
 */
const getSearchParams = () => {
	return buildListQuery()
}

// ==================== 方法 ====================

/**
 * 加载表格数据
 */
const loadTableData = async () => {
	tableLoading.value = true
	try {
		const query = buildListQuery()
		const res = await ryyj.getList(query)
		tableData.value = res.data?.list || []
		pagination.total = res.data?.total || 0
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
	pagination.currentPage = 1
	loadTableData()
}

/**
 * 重置
 */
const handleReset = () => {
	formData.value = {
		businessCategory: "",
		personScore: "",
		warningType: "",
		dataSource: "",
		manageCategory: "",
		householdAddress: "",
		entryTime: [],
		manageDept: ""
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
 * 选中行变化
 */
const handleSelectionChange = (selection: ListItem[]) => {
	selectedRows.value = selection
}

/**
 * 新增 - 打开弹窗
 */
const handleAdd = () => {
	dialogMode.value = "add"
	editingRow.value = null
	addFormRef.value?.resetFields()
	Object.assign(addFormData, {
		name: "",
		gender: "",
		age: 18,
		idCard: "",
		phone: "",
		personScore: 0,
		warningType: "",
		businessCategory: "",
		dataSource: "",
		manageCategory: "",
		education: "",
		occupationType: "",
		residenceAddress: ""
	})
	addDialogVisible.value = true
}

/**
 * 编辑 - 打开弹窗
 */
const handleEdit = (row: ListItem) => {
	dialogMode.value = "edit"
	editingRow.value = row
	Object.assign(addFormData, {
		name: row.name,
		gender: row.gender,
		age: row.age,
		idCard: row.idCard,
		phone: row.phone || "",
		personScore: Number(row.personScore) || 0,
		warningType: row.warningType || "",
		businessCategory: row.businessCategory || "",
		dataSource: row.dataSource || "",
		manageCategory: row.manageCategory || "",
		education: row.education || "",
		occupationType: row.occupationType || "",
		residenceAddress: row.residenceAddress || ""
	})
	addDialogVisible.value = true
}

/**
 * 提交表单（新增或编辑）
 */
const handleAddSubmit = async () => {
	try {
		const valid = await addFormRef.value?.validate()
		if (!valid) return

		addSubmitLoading.value = true

		const submitData = {
			name: addFormData.name,
			gender: addFormData.gender as "男" | "女",
			age: addFormData.age,
			idCard: addFormData.idCard,
			phone: addFormData.phone,
			personScore: addFormData.personScore,
			warningType: addFormData.warningType,
			businessCategory: addFormData.businessCategory,
			dataSource: addFormData.dataSource,
			manageCategory: addFormData.manageCategory,
			education: addFormData.education,
			occupationType: addFormData.occupationType,
			residenceAddress: addFormData.residenceAddress
		}

		let res
		if (dialogMode.value === "add") {
			res = await ryyj.create(submitData)
		} else {
			res = await ryyj.update({ id: editingRow.value!.id, ...submitData })
		}

		if (res?.state === 2000) {
			ElMessage.success(res.message || (dialogMode.value === "add" ? "新增成功" : "更新成功"))
			addDialogVisible.value = false
			loadTableData()
		} else {
			ElMessage.error(res.message || "操作失败")
		}
	} catch (error: any) {
		ElMessage.error(error.message || "操作失败")
	} finally {
		addSubmitLoading.value = false
	}
}

/**
 * 删除
 */
const handleDelete = (row: ListItem) => {
	ElMessageBox.confirm(`确认删除 "${row.name}" 吗？`, "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning"
	})
		.then(async () => {
			try {
				const res = await ryyj.delete(row.id)
				if ((res as any)?.state === 2000) {
					ElMessage.success("删除成功")
					loadTableData()
				} else {
					ElMessage.error((res as any)?.message || "删除失败")
				}
			} catch (error: any) {
				ElMessage.error(error.message || "删除失败")
			}
		})
		.catch(() => {
			ElMessage.info("已取消")
		})
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

/**
 * 关闭新增弹窗
 */
const handleAddDialogClose = () => {
	addFormRef.value?.resetFields()
}

// ==================== 生命周期 ====================
onMounted(() => {
	loadTableData()
})
</script>

<style lang="scss" scoped>
@use "./index.scss" as *;
</style>
