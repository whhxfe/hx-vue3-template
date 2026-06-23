<template>
	<div class="rygk-container">
		<!-- 左侧区域 -->
		<div class="left-panel">
			<!-- Tab 切换 -->
			<div class="tab-header">
				<div
					v-for="tab in tabs"
					:key="tab.key"
					:class="['tab-item', { active: activeTab === tab.key }]"
					@click="handleTabChange(tab.key)"
				>
					<HxIcon v-if="tab.icon" :name="tab.icon" class="tab-icon" />
					<span>{{ tab.label }}</span>
				</div>
			</div>

			<!-- 树结构 -->
			<div class="tree-container">
				<el-tree
					v-loading="treeLoading"
					ref="treeRef"
					:data="treeData"
					:props="treeProps"
					node-key="id"
					:default-expand-all="false"
					:expand-on-click-node="false"
					highlight-current
					@node-click="handleTreeNodeClick"
				>
					<template #default="{ data }">
						<span class="tree-node">
							<HxIcon v-if="data.icon" :name="data.icon" class="node-icon" />
							<span class="node-label">{{ data.label }}</span>
							<span v-if="data.count" class="node-count">({{ data.count }})</span>
						</span>
					</template>
				</el-tree>
			</div>
		</div>

		<!-- 右侧区域 -->
		<div class="right-panel">
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

			<!-- 视图切换和数据展示 -->
			<div class="data-section">
				<!-- 视图切换和操作栏 -->
				<div class="data-header">
					<div class="view-toggle">
						<el-radio-group v-model="viewMode" size="default">
							<el-radio-button value="table">
								<HxIcon type="iconify" name="mingcute:table-line" />
								表格视图
							</el-radio-button>
							<el-radio-button value="card">
								<HxIcon type="iconify" name="ep:document" />
								卡片视图
							</el-radio-button>
						</el-radio-group>
					</div>
					<div class="action-buttons">
						<el-button type="primary" @click="handleAdd">
							<HxIcon type="iconify" name="ep:plus" />
							新增
						</el-button>
				<HxImporter
					ref="importerRef"
					:upload-action="'/zddxgk/rygk/import'"
					:method="'post'"
					template-file-name="人员信息导入模板.xlsx"
					:template-url="'/zddxgk/rygk/template'"
					:max-size="10"
					button-text="导入"
					dialog-title="导入人员信息"
					@success="handleImportSuccess"
					@error="handleImportError"
				/>
						<HxExporter
							ref="exporterRef"
							:export-action="'/zddxgk/rygk/export'"
							:method="'post'"
							:current-page="pagination.currentPage"
							:page-size="pagination.pageSize"
							:total-count="pagination.total"
							:max-export-count="10000"
							button-text="导出"
							dialog-title="导出人员信息"
							:get-search-params="getSearchParams"
							@success="handleExportSuccess"
							@error="handleExportError"
						/>
					</div>
				</div>

				<!-- 表格视图 -->
				<div v-show="viewMode === 'table'" class="table-container">
					<HxTable
						ref="tableRef"
						border
						height="596px"
						v-loading="tableLoading"
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
					>
						<template #action="{ row }">
							<el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
							<el-button type="default" link @click="handleSetFollow(row)">关注设置</el-button>
							<el-button type="default" link @click="handleSetCategory(row)">类别设置</el-button>
							<el-button type="danger" link @click="handleDelete(row)">删除</el-button>
						</template>
					</HxTable>
				</div>

				<!-- 卡片视图 -->
				<div v-show="viewMode === 'card'" class="card-container">
					<HxCardList
						v-loading="tableLoading"
						:data="tableData"
						:columns="3"
						:row-gap="16"
						:column-gap="16"
						:show-pagination="true"
						:current-page="pagination.currentPage"
						:page-size="pagination.pageSize"
						:total="pagination.total"
						:page-sizes="[10, 20, 50, 100]"
						pagination-layout="total, sizes, prev, pager, next, jumper"
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
					>
						<template #default="{ item }">
							<div class="data-card">
								<div class="card-header">
									<div class="card-avatar">
										<el-avatar v-if="item.avatar" :src="item.avatar" :size="50" />
										<el-avatar v-else :size="50">
											{{ item.name?.charAt(0) }}
										</el-avatar>
									</div>
									<div class="card-title-wrap">
										<span class="card-title">{{ item.name }}</span>
										<span class="card-info">{{ item.gender }} / {{ item.age }}岁</span>
									</div>
									<el-tag :type="item.followStatus === '1' ? 'success' : 'info'">
										{{ item.followStatusName }}
									</el-tag>
								</div>
								<div class="card-body">
									<div class="card-item">
										<span class="label">手机号：</span>
										<span class="value">{{ item.phone }}</span>
									</div>
									<div class="card-item">
										<span class="label">身份证号：</span>
										<span class="value text-ellipsis-1">{{ item.idCard }}</span>
									</div>
									<div class="card-item">
										<span class="label">居住地址：</span>
										<span class="value text-ellipsis-1">{{ item.residenceAddressName }}</span>
									</div>
									<div class="card-item">
										<span class="label">类别：</span>
										<span class="value">{{ item.categoryName }}</span>
									</div>
									<div v-if="item.tagsName?.length" class="card-tags">
										<el-tag v-for="tag in item.tagsName" :key="tag" size="small" type="warning" class="card-tag">
											{{ tag }}
										</el-tag>
									</div>
								</div>
								<div class="card-footer">
									<el-button type="primary" link @click="handleEdit(item)">编辑</el-button>
									<el-button type="default" link @click="handleSetFollow(item)">关注设置</el-button>
									<el-button type="default" link @click="handleSetCategory(item)">类别设置</el-button>
									<el-button type="danger" link @click="handleDelete(item)">删除</el-button>
								</div>
							</div>
						</template>
					</HxCardList>
				</div>
			</div>
		</div>

		<!-- 新增/编辑弹窗 -->
		<el-dialog
			v-model="addDialogVisible"
			:title="dialogMode === 'add' ? '新增人员信息' : '编辑人员信息'"
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
							<el-input-number
								v-model="addFormData.age"
								:min="0"
								:max="150"
								placeholder="请输入年龄"
								style="width: 100%"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="手机号" prop="phone">
							<el-input v-model="addFormData.phone" placeholder="请输入手机号" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item label="身份证号" prop="idCard">
							<el-input v-model="addFormData.idCard" placeholder="请输入身份证号" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="居住地址" prop="residenceAddress">
							<el-select
								v-model="addFormData.residenceAddress"
								placeholder="请选择居住地址"
								filterable
								style="width: 100%"
							>
								<el-option v-for="item in addressOptions" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="类别" prop="category">
							<el-select v-model="addFormData.category" placeholder="请选择类别" style="width: 100%">
								<el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="数据来源" prop="dataSource">
							<el-select v-model="addFormData.dataSource" placeholder="请选择数据来源" style="width: 100%">
								<el-option
									v-for="item in dataSourceOptions"
									:key="item.value"
									:label="item.label"
									:value="item.value"
								/>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="标签" prop="tags">
							<el-select v-model="addFormData.tags" multiple placeholder="请选择标签" style="width: 100%">
								<el-option label="独居老人" value="独居老人" />
								<el-option label="低保户" value="低保户" />
								<el-option label="残疾人" value="残疾人" />
								<el-option label="留守儿童" value="留守儿童" />
								<el-option label="退役军人" value="退役军人" />
								<el-option label="党员" value="党员" />
								<el-option label="志愿者" value="志愿者" />
								<el-option label="困难家庭" value="困难家庭" />
								<el-option label="慢性病患者" value="慢性病患者" />
								<el-option label="孕妇" value="孕妇" />
							</el-select>
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

		<!-- 类别设置弹窗 -->
		<el-dialog v-model="categoryDialogVisible" title="类别设置" width="500px" :close-on-click-modal="false">
			<el-form ref="categoryFormRef" :model="categoryFormData" label-width="80px">
				<el-form-item label="当前人员">
					<span class="current-person">{{ currentCategoryRow?.name }}</span>
				</el-form-item>
				<el-form-item label="当前类别">
					<el-tag>{{ currentCategoryRow?.categoryName }}</el-tag>
				</el-form-item>
				<el-form-item label="新类别" prop="category">
					<el-select v-model="categoryFormData.category" placeholder="请选择新类别" style="width: 100%">
						<el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="categoryDialogVisible = false">取消</el-button>
					<el-button type="primary" :loading="categorySubmitLoading" @click="handleCategorySubmit">确定</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 关注设置弹窗 -->
		<el-dialog v-model="followDialogVisible" title="关注设置" width="500px" :close-on-click-modal="false">
			<el-form :model="followFormData" label-width="80px">
				<el-form-item label="当前人员">
					<span class="current-person">{{ currentFollowRow?.name }}</span>
				</el-form-item>
				<el-form-item label="当前级别">
					<el-tag :type="getFollowTagType(currentFollowRow?.followStatus)">
						{{ currentFollowRow?.followStatusName }}
					</el-tag>
				</el-form-item>
				<el-form-item label="关注级别" prop="followStatus">
					<el-radio-group v-model="followFormData.followStatus">
						<el-radio
							v-for="item in FOLLOW_LEVEL_OPTIONS"
							:key="item.value"
							:value="item.value"
						>
							{{ item.label }}
						</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="followDialogVisible = false">取消</el-button>
					<el-button type="primary" :loading="followSubmitLoading" @click="handleFollowSubmit">确定</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="tsx">
import { ref, reactive, computed, onMounted } from "vue"
import { ElMessage, ElMessageBox, ElTag } from "element-plus"
import { HxForm, HxTable, HxIcon, HxImporter, HxExporter, HxCardList } from "@whhx/ui"
import type { FormField, TableColumn } from "@whhx/ui"
import { rygk, type TreeNode, type ListItem, type DictItem, FOLLOW_LEVEL_OPTIONS } from "@/modules/zddxgk/api"

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
	phone: "",
	idCard: "",
	residenceAddress: "",
	category: "",
	dataSource: "",
	tags: [] as string[]
})

const addFormRules = {
	name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
	gender: [{ required: true, message: "请选择性别", trigger: "change" }],
	age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
	phone: [
		{ required: true, message: "请输入手机号", trigger: "blur" },
		{ pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确", trigger: "blur" }
	],
	idCard: [
		{ required: true, message: "请输入身份证号", trigger: "blur" },
		{ pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: "身份证号格式不正确", trigger: "blur" }
	],
	residenceAddress: [{ required: true, message: "请选择居住地址", trigger: "change" }],
	category: [{ required: true, message: "请选择类别", trigger: "change" }],
	dataSource: [{ required: true, message: "请选择数据来源", trigger: "change" }]
}

// 下拉选项数据
const dataSourceOptions = ref<DictItem[]>([])
const categoryOptions = ref<DictItem[]>([])
const addressOptions = ref<DictItem[]>([])

// ==================== 类别设置弹窗 ====================
const categoryDialogVisible = ref(false)
const categorySubmitLoading = ref(false)
const currentCategoryRow = ref<ListItem | null>(null)

const categoryFormData = reactive({
	category: ""
})

// ==================== 关注设置弹窗 ====================
const followDialogVisible = ref(false)
const followSubmitLoading = ref(false)
const currentFollowRow = ref<ListItem | null>(null)

const followFormData = reactive({
	followStatus: "0"
})

/**
 * 获取关注状态的 Tag 类型
 */
const getFollowTagType = (status?: string) => {
	const option = FOLLOW_LEVEL_OPTIONS.find(item => item.value === status)
	return option?.type || "info"
}

/**
 * FOLLOW_LEVEL_OPTIONS 项类型
 */
type FollowLevelOption = typeof FOLLOW_LEVEL_OPTIONS[number]

// ==================== Tab 配置 ====================
const tabs = [
	{ key: "yhgl", label: "业务管理", icon: "folder" },
	{ key: "gxjg", label: "关系机构", icon: "building" }
]

const activeTab = ref("yhgl")

// ==================== 树形数据 ====================
const treeData = ref<TreeNode[]>([])
const treeLoading = ref(false)
const selectedTreeNode = ref<TreeNode | null>(null)

const treeProps = {
	children: "children",
	label: "label"
}

// ==================== 表单配置 ====================
const formData = ref({
	keyword: "",
	dataSource: "",
	entryTime: [],
	category: "",
	residenceAddress: "",
	followStatus: ""
})

const formColumns = computed<FormField[]>(() => [
	{
		prop: "keyword",
		label: "关键词",
		type: "input",
		placeholder: "请输入手机号、姓名",
		colSpan: 1
	},
	{
		prop: "dataSource",
		label: "数据来源",
		type: "select",
		placeholder: "请选择数据来源",
		remote: {
			url: "/zddxgk/rygk/dict/source",
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
		prop: "category",
		label: "类别",
		type: "select",
		placeholder: "请选择类别",
		remote: {
			url: "/zddxgk/rygk/dict/category",
			labelKey: "label",
			valueKey: "value"
		},
		colSpan: 1
	},
	{
		prop: "residenceAddress",
		label: "居住地址",
		type: "select",
		placeholder: "请选择居住地址",
		remote: {
			url: "/zddxgk/rygk/dict/address",
			labelKey: "label",
			valueKey: "value"
		},
		colSpan: 1
	},
	{
		prop: "followStatus",
		label: "关注状态",
		type: "select",
		options: [
			{ label: "全部", value: "" },
			...FOLLOW_LEVEL_OPTIONS.slice(1).map((item: FollowLevelOption) => ({ label: item.label, value: item.value }))
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
		prop: "name",
		label: "姓名",
		width: 100
	},
	{
		prop: "gender",
		label: "性别",
		width: 60,
		align: "center"
	},
	{
		prop: "age",
		label: "年龄",
		width: 60,
		align: "center"
	},
	{
		prop: "phone",
		label: "手机号",
		width: 130
	},
	{
		prop: "idCard",
		label: "身份证号",
		width: 180,
		showOverflowTooltip: true
	},
	{
		prop: "residenceAddressName",
		label: "居住地址",
		minWidth: 120,
		showOverflowTooltip: true
	},
	{
		prop: "categoryName",
		label: "类别",
		width: 100
	},
	{
		prop: "followStatusName",
		label: "关注状态",
		width: 100,
		align: "center",
		render: (row: ListItem) => {
			const option = FOLLOW_LEVEL_OPTIONS.find((item: FollowLevelOption) => item.value === row.followStatus)
			const statusType = option?.type || "info"
			const text = row.followStatusName || option?.label || "未知"
			return <ElTag type={statusType as any}>{text}</ElTag>
		}
	},
	{
		label: "操作",
		width: 260,
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

// ==================== 视图模式 ====================
const viewMode = ref<"table" | "card">("table")

// ==================== 表格数据 ====================
const tableData = ref<ListItem[]>([])
const tableLoading = ref(false)

// ==================== Refs ====================
const formRef = ref()
const tableRef = ref()
const treeRef = ref()
const importerRef = ref<ImporterExpose>()
const exporterRef = ref<ExporterExpose>()

// 标记为已使用
void formRef
void tableRef
void treeRef
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
		keyword: formData.value.keyword || undefined,
		dataSource: formData.value.dataSource || undefined,
		category: formData.value.category || undefined,
		residenceAddress: formData.value.residenceAddress || undefined,
		followStatus: formData.value.followStatus || undefined,
		treeType: activeTab.value
	}

	// 录入时间范围
	if (formData.value.entryTime && formData.value.entryTime.length === 2) {
		query.entryTimeStart = formData.value.entryTime[0]
		query.entryTimeEnd = formData.value.entryTime[1]
	}

	// 树节点筛选
	if (selectedTreeNode.value) {
		query.treeId = selectedTreeNode.value.id
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
 * 加载树形数据
 */
const loadTreeData = async (type: string) => {
	treeLoading.value = true
	try {
		let res
		if (type === "yhgl") {
			res = await rygk.getYhglTree()
		} else {
			res = await rygk.getGxjgTree()
		}
		treeData.value = res.data || []
	} catch (error) {
		console.error("加载树数据失败:", error)
		treeData.value = []
	} finally {
		treeLoading.value = false
	}
}

/**
 * Tab 切换
 */
const handleTabChange = (key: string) => {
	activeTab.value = key
	selectedTreeNode.value = null
	pagination.currentPage = 1
	loadTreeData(key)
}

/**
 * 树节点点击
 */
const handleTreeNodeClick = (data: TreeNode) => {
	selectedTreeNode.value = data
	pagination.currentPage = 1
	loadTableData()
}

/**
 * 加载表格数据
 */
const loadTableData = async () => {
	tableLoading.value = true
	try {
		const query = buildListQuery()
		const res = await rygk.getList(query)
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
		keyword: "",
		dataSource: "",
		entryTime: [],
		category: "",
		residenceAddress: "",
		followStatus: ""
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
 * 新增 - 打开弹窗
 */
const handleAdd = async () => {
	dialogMode.value = "add"
	editingRow.value = null
	// 重置表单
	addFormRef.value?.resetFields()
	Object.assign(addFormData, {
		name: "",
		gender: "",
		age: 18,
		phone: "",
		idCard: "",
		residenceAddress: "",
		category: "",
		dataSource: "",
		tags: []
	})
	// 加载下拉选项数据
	await Promise.all([loadDataSourceOptions(), loadCategoryOptions(), loadAddressOptions()])
	addDialogVisible.value = true
}

/**
 * 编辑 - 打开弹窗
 */
const handleEdit = async (row: ListItem) => {
	dialogMode.value = "edit"
	editingRow.value = row
	// 加载下拉选项数据
	await Promise.all([loadDataSourceOptions(), loadCategoryOptions(), loadAddressOptions()])
	// 填充表单数据
	Object.assign(addFormData, {
		name: row.name,
		gender: row.gender,
		age: row.age,
		phone: row.phone,
		idCard: row.idCard,
		residenceAddress: row.residenceAddress,
		category: row.category,
		dataSource: row.dataSource,
		tags: row.tags || []
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
			phone: addFormData.phone,
			idCard: addFormData.idCard,
			residenceAddress: addFormData.residenceAddress,
			category: addFormData.category,
			dataSource: addFormData.dataSource,
			tags: addFormData.tags
		}

		let res
		if (dialogMode.value === "add") {
			res = await rygk.create(submitData)
		} else {
			res = await rygk.update({
				id: editingRow.value!.id,
				...submitData
			})
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
				const res = await rygk.delete(row.id)
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
 * 类别设置 - 打开弹窗
 */
const handleSetCategory = async (row: ListItem) => {
	currentCategoryRow.value = row
	categoryFormData.category = ""
	// 加载类别选项
	await loadCategoryOptions()
	categoryDialogVisible.value = true
}

/**
 * 提交类别设置
 */
const handleCategorySubmit = async () => {
	if (!categoryFormData.category) {
		ElMessage.warning("请选择新类别")
		return
	}

	if (!currentCategoryRow.value) {
		ElMessage.error("未选择人员")
		return
	}

	// 如果选择了相同的类别，给予提示
	if (categoryFormData.category === currentCategoryRow.value.category) {
		ElMessage.warning("新类别与当前类别相同，无需修改")
		return
	}

	try {
		categorySubmitLoading.value = true
		const res = await rygk.assignCategory({
			personIds: [currentCategoryRow.value.id],
			categoryCode: categoryFormData.category
		})
		if ((res as any)?.state === 2000) {
			ElMessage.success((res as any)?.message || "类别设置成功")
			categoryDialogVisible.value = false
			loadTableData()
		} else {
			ElMessage.error((res as any)?.message || "设置失败")
		}
	} catch (error: any) {
		ElMessage.error(error.message || "设置失败")
	} finally {
		categorySubmitLoading.value = false
	}
}

/**
 * 关注设置 - 打开弹窗
 */
const handleSetFollow = (row: ListItem) => {
	currentFollowRow.value = row
	followFormData.followStatus = row.followStatus
	followDialogVisible.value = true
}

/**
 * 提交关注设置
 */
const handleFollowSubmit = async () => {
	if (!currentFollowRow.value) {
		ElMessage.error("未选择人员")
		return
	}

	// 如果选择了相同的状态，给予提示
	if (followFormData.followStatus === currentFollowRow.value.followStatus) {
		ElMessage.warning("关注级别未变化，无需修改")
		return
	}

	try {
		followSubmitLoading.value = true
		const res = await rygk.updateStatus({
			ids: [currentFollowRow.value.id],
			followStatus: followFormData.followStatus as any
		})
		if ((res as any)?.state === 2000) {
			ElMessage.success((res as any)?.message || "关注设置成功")
			followDialogVisible.value = false
			loadTableData()
		} else {
			ElMessage.error((res as any)?.message || "设置失败")
		}
	} catch (error: any) {
		ElMessage.error(error.message || "设置失败")
	} finally {
		followSubmitLoading.value = false
	}
}

/**
 * 加载数据来源选项
 */
const loadDataSourceOptions = async () => {
	try {
		const res = await rygk.getSourceOptions()
		dataSourceOptions.value = res.data || []
	} catch (error) {
		console.error("加载数据来源选项失败:", error)
	}
}

/**
 * 加载类别选项
 */
const loadCategoryOptions = async () => {
	try {
		const res = await rygk.getCategoryOptions()
		categoryOptions.value = res.data || []
	} catch (error) {
		console.error("加载类别选项失败:", error)
	}
}

/**
 * 加载居住地址选项
 */
const loadAddressOptions = async () => {
	try {
		const res = await rygk.getAddressOptions()
		addressOptions.value = res.data || []
	} catch (error) {
		console.error("加载居住地址选项失败:", error)
	}
}

/**
 * 关闭新增弹窗
 */
const handleAddDialogClose = () => {
	addFormRef.value?.resetFields()
}

// ==================== 生命周期 ====================
onMounted(() => {
	loadTreeData(activeTab.value)
	loadTableData()
})
</script>

<style lang="scss" scoped>
@use "./index.scss" as *;
</style>
