<template>
	<div class="uc-container">
		<!-- 筛选表单 -->
		<div class="filter-section">
			<HxForm
				ref="formRef"
				v-model="formData"
				:fields="formColumns"
				:cols="4"
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
						<HxIcon type="iconify" name="ep:plus" />
						录入
					</el-button>
					<HxImporter
						ref="importerRef"
						:upload-action="'/ktc/tum/uc/import'"
						:method="'post'"
						template-file-name="单元管控导入模板.xlsx"
						:template-url="'/ktc/tum/uc/template'"
						:max-size="10"
						button-text="导入"
						dialog-title="导入单元管控信息"
						@success="handleImportSuccess"
						@error="handleImportError"
					/>
					<HxExporter
						ref="exporterRef"
						:export-action="'/ktc/tum/uc/export'"
						:method="'post'"
						:current-page="pagination.currentPage"
						:page-size="pagination.pageSize"
						:total-count="pagination.total"
						:max-export-count="10000"
						:selected-rows="selectedRows"
						button-text="导出"
						dialog-title="导出单元管控信息"
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

			<!-- 表格 -->
			<div class="table-container">
				<div ref="tableWrapperRef" class="table-wrapper">
					<HxTable
						ref="tableRef"
						border
						v-loading="tableLoading"
						:height="tableHeight"
						:columns="tableColumns"
						:data="tableData"
						:show-pagination="true"
						:current-page="pagination.currentPage"
						:page-size="pagination.pageSize"
						:total="pagination.total"
						:page-sizes="[10, 20, 50, 100]"
						pagination-layout="total, sizes, prev, pager, next, jumper"
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						@selection-change="handleSelectionChange"
					>
						<template #action="{ row }">
							<el-button type="primary" link @click="handleJudge(row)">研判</el-button>
							<el-button type="default" link @click="handleEdit(row)">编辑</el-button>
							<el-button type="warning" link @click="handleControl(row)">布控</el-button>
							<el-button type="success" link @click="handleOpenArchive(row)">档案</el-button>
							<el-button type="danger" link @click="handleDelete(row)">删除</el-button>
						</template>
					</HxTable>
				</div>
			</div>
		</div>

		<!-- 新增/编辑弹窗 -->
		<el-dialog
			v-model="addDialogVisible"
			:title="dialogMode === 'add' ? '录入单元信息' : '编辑单元信息'"
			width="600px"
			:close-on-click-modal="false"
			@close="handleAddDialogClose"
		>
			<el-form ref="addFormRef" :model="addFormData" :rules="addFormRules" label-width="100px">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="IP地址" prop="ip">
							<el-input v-model="addFormData.ip" placeholder="请输入IP地址" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="ADSL号" prop="adsl">
							<el-input v-model="addFormData.adsl" placeholder="请输入ADSL号" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="单元类型" prop="unitType">
							<el-select v-model="addFormData.unitType" placeholder="请选择单元类型" style="width: 100%">
								<el-option label="固定IP" value="fixed_ip" />
								<el-option label="ADSL" value="adsl" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="管控类别" prop="controlCategory">
							<el-select v-model="addFormData.controlCategory" placeholder="请选择管控类别" style="width: 100%">
								<el-option label="重点关注" value="focus" />
								<el-option label="一级" value="level1" />
								<el-option label="二级" value="level2" />
								<el-option label="三级" value="level3" />
								<el-option label="其他" value="other" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="端口数量" prop="portCount">
							<el-input-number v-model="addFormData.portCount" :min="0" style="width: 100%" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="终端数量" prop="terminalCount">
							<el-input-number v-model="addFormData.terminalCount" :min="0" style="width: 100%" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="IP属地" prop="ipLocation">
							<el-input v-model="addFormData.ipLocation" placeholder="请输入IP属地" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="预警类型" prop="warningType">
							<el-select v-model="addFormData.warningType" placeholder="请选择预警类型" style="width: 100%">
								<el-option label="红色预警" value="red" />
								<el-option label="橙色预警" value="orange" />
								<el-option label="黄色预警" value="yellow" />
								<el-option label="蓝色预警" value="blue" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item label="关注人员" prop="focusPerson">
							<el-input v-model="addFormData.focusPerson" placeholder="请输入关注人员" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item label="关注单位" prop="focusUnit">
							<el-input v-model="addFormData.focusUnit" placeholder="请输入关注单位" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item label="关注原因" prop="focusReason">
							<el-input v-model="addFormData.focusReason" type="textarea" :rows="3" placeholder="请输入关注原因" />
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

		<!-- 研判弹窗 -->
		<el-dialog
			v-model="judgeDialogVisible"
			title="研判"
			width="500px"
			:close-on-click-modal="false"
		>
			<el-form ref="judgeFormRef" :model="judgeFormData" :rules="judgeFormRules" label-width="100px">
				<el-form-item label="当前IP">
					<span>{{ currentJudgeRow?.ip }}</span>
				</el-form-item>
				<el-form-item label="管控类别" prop="controlCategory">
					<el-select v-model="judgeFormData.controlCategory" placeholder="请选择管控类别" style="width: 100%">
						<el-option label="重点关注" value="focus" />
						<el-option label="一级" value="level1" />
						<el-option label="二级" value="level2" />
						<el-option label="三级" value="level3" />
						<el-option label="其他" value="other" />
					</el-select>
				</el-form-item>
				<el-form-item label="研判依据" prop="judgeReason">
					<el-input v-model="judgeFormData.judgeReason" type="textarea" :rows="4" placeholder="请输入研判依据" />
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="judgeDialogVisible = false">取消</el-button>
					<el-button type="primary" :loading="judgeSubmitLoading" @click="handleJudgeSubmit">确定</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 布控弹窗 -->
		<el-dialog
			v-model="controlDialogVisible"
			title="布控"
			width="500px"
			:close-on-click-modal="false"
		>
			<el-form ref="controlFormRef" :model="controlFormData" :rules="controlFormRules" label-width="100px">
				<el-form-item label="当前IP">
					<span>{{ currentControlRow?.ip }}</span>
				</el-form-item>
				<el-form-item label="布控资源" prop="controlResource">
					<el-select v-model="controlFormData.controlResource" placeholder="请选择布控资源" style="width: 100%">
						<el-option label="视频监控" value="video" />
						<el-option label="网络监测" value="network" />
						<el-option label="人员巡查" value="patrol" />
						<el-option label="技术侦查" value="tech" />
					</el-select>
				</el-form-item>
				<el-form-item label="监测时段" prop="monitorTime">
					<el-select v-model="controlFormData.monitorTime" placeholder="请选择监测时段" style="width: 100%">
						<el-option label="全天（00:00-23:59）" value="all_day" />
						<el-option label="上午（06:00-11:59）" value="morning" />
						<el-option label="中午（12:00-13:59）" value="noon" />
						<el-option label="下午（14:00-17:59）" value="afternoon" />
						<el-option label="晚上（18:00-21:59）" value="evening" />
						<el-option label="夜间（22:00-05:59）" value="night" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="controlDialogVisible = false">取消</el-button>
					<el-button type="primary" :loading="controlSubmitLoading" @click="handleControlSubmit">确定</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="tsx">
import { ref, reactive, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { ElMessage, ElMessageBox, ElTag, ElLink } from "element-plus"
import { HxForm, HxTable, HxIcon, HxImporter, HxExporter } from "@whhx/ui"
import type { FormField, TableColumn } from "@whhx/ui"
import { useElementSize, useDebounceFn } from "@vueuse/core"
import { uc } from "@/modules/ktc/api"
import type { ListItem } from "@/modules/ktc/api/tum/uc"

defineOptions({ name: 'UnitControl' })

// ==================== 表格高度自适应 ====================
const tableWrapperRef = ref<HTMLElement | null>(null)
const { height: tableWrapperHeight } = useElementSize(tableWrapperRef)
const tableHeight = computed(() => {
	return tableWrapperHeight.value > 0 ? `${tableWrapperHeight.value}px` : "400px"
})

type ImporterExpose = {
	open: () => void
	close: () => void
}

type ExporterExpose = {
	open: () => void
	close: () => void
}

interface UnitItem {
	id: number
	ip: string
	adsl: string
	unitType: string
	unitTypeName: string
	controlCategory: string
	controlCategoryName: string
	unitTag: string
	categoryTag: string
	portCount: number
	terminalCount: number
	ipLocation: string
	focusPerson: string
	focusUnit: string
	focusReason: string
	warningType: string
	warningTypeName: string
	isJudged: boolean
	isControlled: boolean
	entryTime: string
}

// ==================== 新增/编辑弹窗 ====================
const addDialogVisible = ref(false)
const dialogMode = ref<"add" | "edit">("add")
const addSubmitLoading = ref(false)
const addFormRef = ref()
const editingRow = ref<UnitItem | null>(null)

const addFormData = reactive({
	ip: "",
	adsl: "",
	unitType: "",
	controlCategory: "",
	portCount: 0,
	terminalCount: 0,
	ipLocation: "",
	warningType: "",
	focusPerson: "",
	focusUnit: "",
	focusReason: ""
})

const addFormRules = {
	ip: [{ required: true, message: "请输入IP地址", trigger: "blur" }],
	unitType: [{ required: true, message: "请选择单元类型", trigger: "change" }],
	controlCategory: [{ required: true, message: "请选择管控类别", trigger: "change" }]
}

// ==================== 研判弹窗 ====================
const judgeDialogVisible = ref(false)
const judgeSubmitLoading = ref(false)
const judgeFormRef = ref()
const currentJudgeRow = ref<UnitItem | null>(null)

const judgeFormData = reactive({
	controlCategory: "",
	judgeReason: ""
})

const judgeFormRules = {
	controlCategory: [{ required: true, message: "请选择管控类别", trigger: "change" }],
	judgeReason: [{ required: true, message: "请输入研判依据", trigger: "blur" }]
}

// ==================== 布控弹窗 ====================
const controlDialogVisible = ref(false)
const controlSubmitLoading = ref(false)
const controlFormRef = ref()
const currentControlRow = ref<UnitItem | null>(null)

const controlFormData = reactive({
	controlResource: "",
	monitorTime: ""
})

const controlFormRules = {
	controlResource: [{ required: true, message: "请选择布控资源", trigger: "change" }],
	monitorTime: [{ required: true, message: "请选择监测时段", trigger: "change" }]
}

// ==================== 类别筛选 ====================
const categoryFilter = ref<string[]>([])

// ==================== 表单配置 ====================
const formData = ref({
	keyword: "",
	unitType: "",
	entryTime: [],
	controlCategory: "",
	categoryFilter: []
})

const formColumns = computed<FormField[]>(() => [
	{
		prop: "keyword",
		label: "关键字",
		type: "input",
		placeholder: "请输入IP,ADSL号等等",
		colSpan: 1
	},
	{
		prop: "unitType",
		label: "单元类型",
		type: "select",
		placeholder: "请选择单元类型",
		options: [
			{ label: "全部", value: "" },
			{ label: "固定IP", value: "fixed_ip" },
			{ label: "ADSL", value: "adsl" }
		],
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
		prop: "controlCategory",
		label: "管控类别",
		type: "select",
		placeholder: "请选择管控类别",
		options: [
			{ label: "全部", value: "" },
			{ label: "重点关注", value: "focus" },
			{ label: "一级", value: "level1" },
			{ label: "二级", value: "level2" },
			{ label: "三级", value: "level3" },
			{ label: "其他", value: "other" }
		],
		colSpan: 1
	},
	{
		prop: "categoryFilter",
		label: "类别筛选",
		type: "checkbox",
		options: [
			{ label: "已研判", value: "judged" },
			{ label: "已布控", value: "controlled" }
		],
		colSpan: 1
	}
])

// ==================== 表格列配置 ====================
const tableColumns = computed<TableColumn[]>(() => [
	{
		type: "selection",
		width: 50,
		align: "center"
	},
	{
		type: "index",
		label: "序号",
		width: 60,
		align: "center"
	},
	{
		prop: "ip",
		label: "IP/ADSL",
		width: 150,
		render: (row: UnitItem) => (
			<ElLink
				type="primary"
				underline={false}
				onClick={() => router.push({ path: '/ktc/tum/uc/ua', query: { id: String(row.id) } })}
			>
				{row.ip || row.adsl || '—'}
			</ElLink>
		)
	},
	{
		prop: "unitTypeName",
		label: "单元类型",
		width: 100,
		align: "center",
		render: (row: UnitItem) => {
			const typeMap: Record<string, "primary" | "success" | "warning" | "danger" | "info"> = {
				"固定IP": "primary",
				"ADSL": "success"
			}
			return <ElTag type={typeMap[row.unitTypeName] || "info"}>{row.unitTypeName}</ElTag>
		}
	},
	{
		prop: "controlCategoryName",
		label: "管控类别",
		width: 100,
		align: "center",
		render: (row: UnitItem) => {
			const typeMap: Record<string, "primary" | "success" | "warning" | "danger" | "info"> = {
				"重点关注": "danger",
				"一级": "warning",
				"二级": "info",
				"三级": "info",
				"其他": "info"
			}
			return <ElTag type={typeMap[row.controlCategoryName] || "info"}>{row.controlCategoryName}</ElTag>
		}
	},
	{
		prop: "portCount",
		label: "端口数量",
		width: 100,
		align: "center"
	},
	{
		prop: "terminalCount",
		label: "终端数量",
		width: 100,
		align: "center"
	},
	{
		prop: "ipLocation",
		label: "IP属地",
		width: 120
	},
	{
		prop: "focusPerson",
		label: "关注人员",
		width: 120
	},
	{
		prop: "focusUnit",
		label: "关注单位",
		width: 120
	},
	{
		prop: "focusReason",
		label: "关注原因",
		minWidth: 150,
		showOverflowTooltip: true
	},
	{
		prop: "warningTypeName",
		label: "预警类型",
		width: 100,
		align: "center"
	},
	{
		label: "操作",
		width: 250,
		fixed: "right",
		slot: "action"
	}
])

// ==================== 分页配置 ====================
const pagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0
})

// ==================== 表格数据 ====================
const tableData = ref<UnitItem[]>([])
const tableLoading = ref(false)
const selectedRows = ref<UnitItem[]>([])

// ==================== Refs ====================
const formRef = ref()
const tableRef = ref()
const importerRef = ref<ImporterExpose>()
const exporterRef = ref<ExporterExpose>()

// 标记为已使用
void formRef
void tableRef
void importerRef
void exporterRef

// ==================== 筛选条件 ====================
const buildListQuery = () => {
	const query: Record<string, unknown> = {
		page: pagination.currentPage,
		pageSize: pagination.pageSize,
		keyword: formData.value.keyword || undefined,
		unitType: formData.value.unitType || undefined,
		controlCategory: formData.value.controlCategory || undefined,
		categoryFilter: formData.value.categoryFilter.length > 0 ? formData.value.categoryFilter : undefined
	}

	if (formData.value.entryTime && formData.value.entryTime.length === 2) {
		query.entryTimeStart = formData.value.entryTime[0]
		query.entryTimeEnd = formData.value.entryTime[1]
	}

	return query
}

const getSearchParams = () => {
	return buildListQuery()
}

// ==================== 方法 ====================

const loadTableData = async () => {
	tableLoading.value = true
	try {
		const query = buildListQuery()
		const res = await uc.getList(query)
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

const handleSearch = () => {
	pagination.currentPage = 1
	loadTableData()
}

const handleReset = () => {
	formData.value = {
		keyword: "",
		unitType: "",
		entryTime: [],
		controlCategory: "",
		categoryFilter: []
	}
	pagination.currentPage = 1
	loadTableData()
}

const handleSizeChange = (size: number) => {
	pagination.pageSize = size
	pagination.currentPage = 1
	loadTableData()
}

const handleCurrentChange = (page: number) => {
	pagination.currentPage = page
	loadTableData()
}

const handleSelectionChange = (selection: UnitItem[]) => {
	selectedRows.value = selection
}

// ==================== 新增/编辑 ====================

const handleAdd = useDebounceFn(() => {
	dialogMode.value = "add"
	editingRow.value = null
	addFormRef.value?.resetFields()
	Object.assign(addFormData, {
		ip: "",
		adsl: "",
		unitType: "",
		controlCategory: "",
		portCount: 0,
		terminalCount: 0,
		ipLocation: "",
		warningType: "",
		focusPerson: "",
		focusUnit: "",
		focusReason: ""
	})
	addDialogVisible.value = true
}, 300)

const handleEdit = useDebounceFn((row: UnitItem) => {
	dialogMode.value = "edit"
	editingRow.value = row
	Object.assign(addFormData, {
		ip: row.ip,
		adsl: row.adsl,
		unitType: row.unitType,
		controlCategory: row.controlCategory,
		portCount: row.portCount,
		terminalCount: row.terminalCount,
		ipLocation: row.ipLocation,
		warningType: row.warningType,
		focusPerson: row.focusPerson,
		focusUnit: row.focusUnit,
		focusReason: row.focusReason
	})
	addDialogVisible.value = true
}, 300)

const router = useRouter()
const handleOpenArchive = useDebounceFn((row: ListItem) => {
	router.push({
		path: "/ktc/tum/uc/ua",
		query: { id: String(row.id), ip: row.ip }
	})
}, 300)

const handleAddSubmit = async () => {
	try {
		const valid = await addFormRef.value?.validate()
		if (!valid) return

		addSubmitLoading.value = true

		const submitData = {
			ip: addFormData.ip,
			adsl: addFormData.adsl,
			unitType: addFormData.unitType,
			controlCategory: addFormData.controlCategory,
			portCount: addFormData.portCount,
			terminalCount: addFormData.terminalCount,
			ipLocation: addFormData.ipLocation,
			warningType: addFormData.warningType,
			focusPerson: addFormData.focusPerson,
			focusUnit: addFormData.focusUnit,
			focusReason: addFormData.focusReason
		}

		let res
		if (dialogMode.value === "add") {
			res = await uc.create(submitData)
		} else {
			res = await uc.update({
				id: editingRow.value!.id,
				...submitData
			})
		}

		if (res?.state === 2000) {
			ElMessage.success(res.message || (dialogMode.value === "add" ? "录入成功" : "更新成功"))
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

const handleAddDialogClose = () => {
	addFormRef.value?.resetFields()
}

// ==================== 删除 ====================

const handleDelete = useDebounceFn((row: UnitItem) => {
	ElMessageBox.confirm(`确认删除 "${row.ip}" 吗？`, "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning"
	})
		.then(async () => {
			try {
				const res = await uc.delete(row.id)
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
}, 300)

// ==================== 研判 ====================

const handleJudge = useDebounceFn((row: UnitItem) => {
	currentJudgeRow.value = row
	judgeFormData.controlCategory = row.controlCategory
	judgeFormData.judgeReason = ""
	judgeDialogVisible.value = true
}, 300)

const handleJudgeSubmit = async () => {
	try {
		const valid = await judgeFormRef.value?.validate()
		if (!valid) return

		judgeSubmitLoading.value = true

		const res = await uc.judge({
			id: currentJudgeRow.value!.id,
			controlCategory: judgeFormData.controlCategory,
			judgeReason: judgeFormData.judgeReason
		})

		if ((res as any)?.state === 2000) {
			ElMessage.success("研判成功")
			judgeDialogVisible.value = false
			loadTableData()
		} else {
			ElMessage.error((res as any)?.message || "研判失败")
		}
	} catch (error: any) {
		ElMessage.error(error.message || "研判失败")
	} finally {
		judgeSubmitLoading.value = false
	}
}

// ==================== 布控 ====================

const handleControl = useDebounceFn((row: UnitItem) => {
	currentControlRow.value = row
	controlFormData.controlResource = ""
	controlFormData.monitorTime = ""
	controlDialogVisible.value = true
}, 300)

const handleControlSubmit = async () => {
	try {
		const valid = await controlFormRef.value?.validate()
		if (!valid) return

		controlSubmitLoading.value = true

		const res = await uc.control({
			id: currentControlRow.value!.id,
			controlResource: controlFormData.controlResource,
			monitorTime: controlFormData.monitorTime!
		})

		if ((res as any)?.state === 2000) {
			ElMessage.success("布控成功")
			controlDialogVisible.value = false
			loadTableData()
		} else {
			ElMessage.error((res as any)?.message || "布控失败")
		}
	} catch (error: any) {
		ElMessage.error(error.message || "布控失败")
	} finally {
		controlSubmitLoading.value = false
	}
}

// ==================== 导入导出 ====================

const handleImportSuccess = (response: any) => {
	ElMessage.success(response.message || "导入成功")
	loadTableData()
}

const handleImportError = (error: any) => {
	ElMessage.error(error.message || "导入失败")
}

const handleExportSuccess = () => {
	ElMessage.success("导出成功")
}

const handleExportError = (error: any) => {
	ElMessage.error(error.message || "导出失败")
}

// ==================== 生命周期 ====================
onMounted(() => {
	loadTableData()
})
</script>

<style lang="scss" scoped>
.uc-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 16px;
	gap: 16px;
	background: var(--el-bg-color-page);

	.filter-section {
		flex-shrink: 0;
		background: var(--el-bg-color);
		border-radius: 8px;
		padding: 16px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}

	.data-section {
		flex: 1;
		min-height: 0;
		background: var(--el-bg-color);
		border-radius: 8px;
		padding: 16px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

		.action-bar {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-bottom: 12px;
			border-bottom: 1px solid var(--el-border-color);
			margin-bottom: 12px;

			.action-left {
				display: flex;
				align-items: center;
				gap: 8px;
			}

			.action-right {
				display: flex;
				align-items: center;
				gap: 8px;

				.selected-count {
					font-size: 13px;
					color: var(--el-text-color-secondary);
				}
			}
		}

		.table-container {
			flex: 1;
			min-height: 0;
			overflow: hidden;

			.table-wrapper {
				width: 100%;
				height: 100%;
			}
		}
	}
}

.dialog-footer {
	display: flex;
	justify-content: flex-end;
	gap: 8px;
}
</style>
