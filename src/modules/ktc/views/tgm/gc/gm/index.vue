<template>
	<div class="gm-container">
		<!-- 标题栏 -->
		<div class="page-header">
			<h2 class="page-title">{{ groupName }}群组</h2>
		</div>

		<!-- 筛选表单 -->
		<div class="filter-section">
			<div class="filter-row">
				<div class="filter-item">
					<span class="filter-label">关键词：</span>
					<el-input v-model="formData.keyword" placeholder="请输入" clearable style="width: 180px" @keyup.enter="handleSearch" />
				</div>
				<div class="filter-item">
					<span class="filter-label">群组类型：</span>
					<el-checkbox-group v-model="formData.types">
						<el-checkbox value="QQ群">QQ群</el-checkbox>
						<el-checkbox value="微信群">微信群</el-checkbox>
					</el-checkbox-group>
				</div>
				<div class="filter-item">
					<span class="filter-label">录入时间：</span>
					<el-date-picker
						v-model="formData.entryTime"
						type="daterange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						value-format="YYYY-MM-DD"
						style="width: 260px"
					/>
				</div>
				<div class="filter-actions">
					<el-button type="primary" @click="handleSearch">查询</el-button>
					<el-button @click="handleReset">重置</el-button>
				</div>
			</div>
		</div>

		<!-- 操作栏 -->
		<div class="action-bar">
			<el-button type="primary" @click="handleAdd">
				<el-icon><Plus /></el-icon>
				录入
			</el-button>
		</div>

		<!-- 表格 -->
		<div class="table-section">
			<el-table
				v-loading="tableLoading"
				:data="tableData"
				border
				style="width: 100%"
				:header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
			>
				<el-table-column prop="name" label="群名称" min-width="140" show-overflow-tooltip />
				<el-table-column prop="number" label="群号" width="120" />
				<el-table-column prop="type" label="群组类型" width="100" align="center" />
				<el-table-column prop="memberCount" label="群成员" width="90" align="center" />
				<el-table-column prop="activeCount" label="活跃成员" width="100" align="center" />
				<el-table-column prop="description" label="描述" min-width="180" show-overflow-tooltip>
					<template #default="{ row }">
						{{ row.description || '--' }}
					</template>
				</el-table-column>
				<el-table-column prop="entryTime" label="录入时间" width="170" sortable />
				<el-table-column label="操作" width="180" fixed="right" align="center">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
						<el-button type="default" link @click="handleControl(row)">布控</el-button>
						<el-button type="danger" link @click="handleDelete(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!-- 分页 -->
		<div class="pagination-wrapper">
			<span class="page-info">
				当前显示{{ pageStart }}-{{ pageEnd }}条，共{{ pagination.total }}条
			</span>
			<div class="page-size-wrap">
				<el-select v-model="pagination.pageSize" size="small" @change="handleSizeChange">
					<el-option :value="10" label="10条/页" />
					<el-option :value="20" label="20条/页" />
					<el-option :value="50" label="50条/页" />
				</el-select>
			</div>
			<el-pagination
				v-model:current-page="pagination.currentPage"
				v-model:page-size="pagination.pageSize"
				:total="pagination.total"
				:page-sizes="[10, 20, 50]"
				layout="prev, pager, next, jumper"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</div>

		<!-- 录入/编辑弹窗 -->
		<el-dialog
			v-model="dialogVisible"
			:title="dialogMode === 'add' ? '群组录入' : '群组编辑'"
			width="600px"
			:close-on-click-modal="false"
		>
			<el-form ref="formRef" :model="formData2" :rules="formRules" label-width="90px">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="群名称" prop="name">
							<el-input v-model="formData2.name" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="群号" prop="number">
							<el-input v-model="formData2.number" placeholder="请输入" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="群组类型" prop="type">
							<el-select v-model="formData2.type" placeholder="请选择" style="width: 100%">
								<el-option label="QQ群" value="QQ群" />
								<el-option label="微信群" value="微信群" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="群成员" prop="memberCount">
							<el-input-number v-model="formData2.memberCount" :min="0" style="width: 100%" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item label="描述" prop="description">
							<el-input v-model="formData2.description" type="textarea" :rows="3" placeholder="请输入" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="submitLoading" @click="handleSubmit">提交</el-button>
			</template>
		</el-dialog>

		<!-- 布控弹窗 -->
		<el-dialog
			v-model="controlDialogVisible"
			title="再次布控"
			width="520px"
			:close-on-click-modal="false"
			class="control-dialog"
		>
			<el-form ref="controlFormRef" :model="controlFormData" :rules="controlFormRules" label-width="100px">
				<el-form-item label="布控说明" prop="reason">
					<el-input
						v-model="controlFormData.reason"
						type="textarea"
						:rows="6"
						maxlength="100"
						show-word-limit
						placeholder="请输入再次布控说明"
					/>
				</el-form-item>
				<el-form-item label="指定审批人" prop="approver">
					<el-select v-model="controlFormData.approver" placeholder="请选择" filterable style="width: 100%">
						<el-option v-for="item in approverOptions" :key="item" :label="item" :value="item" />
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="controlDialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="controlSubmitLoading" @click="handleControlSubmit">提交审批</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { ElMessage, ElMessageBox } from "element-plus"
import { Plus } from "@element-plus/icons-vue"
import { gm } from "@/modules/ktc/api/tgm/gc"
import type { GmGroup } from "@/modules/ktc/api/tgm/gc/gm"

defineOptions({ name: 'GroupGroupManage' })

const route = useRoute()
const groupId = computed(() => Number(route.query.groupId) || 0)
const groupName = ref(String(route.query.groupName || '群体'))

// ==================== 筛选 ====================
const formData = ref({
	keyword: "",
	types: [] as string[],
	entryTime: [] as string[]
})

// ==================== 分页 ====================
const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const pageStart = computed(() => pagination.total === 0 ? 0 : (pagination.currentPage - 1) * pagination.pageSize + 1)
const pageEnd = computed(() => Math.min(pagination.currentPage * pagination.pageSize, pagination.total))

// ==================== 数据 ====================
const tableData = ref<GmGroup[]>([])
const tableLoading = ref(false)

// ==================== 弹窗 ====================
const dialogVisible = ref(false)
const dialogMode = ref<"add" | "edit">("add")
const submitLoading = ref(false)
const formRef = ref()
const editingId = ref<number | null>(null)

const formData2 = reactive({
	name: "",
	number: "",
	type: "QQ群",
	memberCount: 0,
	description: ""
})

const formRules = {
	name: [{ required: true, message: "请输入群名称", trigger: "blur" }],
	number: [{ required: true, message: "请输入群号", trigger: "blur" }],
	type: [{ required: true, message: "请选择群组类型", trigger: "change" }]
}

// ==================== 布控弹窗 ====================
const controlDialogVisible = ref(false)
const controlSubmitLoading = ref(false)
const controlFormRef = ref()
const controlRow = ref<GmGroup | null>(null)
const approverOptions = ["张林芝", "李国安", "王建军", "刘志远", "陈卫民", "赵永强"]

const controlFormData = reactive({
	reason: "",
	approver: ""
})

const controlFormRules = {
	reason: [{ required: true, message: "请输入布控说明", trigger: "blur" }],
	approver: [{ required: true, message: "请选择指定审批人", trigger: "change" }]
}

// ==================== 方法 ====================
const buildQuery = () => {
	const query: Record<string, unknown> = {
		page: pagination.currentPage,
		pageSize: pagination.pageSize,
		groupId: groupId.value
	}
	if (formData.value.keyword) query.keyword = formData.value.keyword
	if (formData.value.types.length === 1) query.type = formData.value.types[0]
	if (formData.value.entryTime?.length === 2) {
		query.entryTimeStart = formData.value.entryTime[0]
		query.entryTimeEnd = formData.value.entryTime[1]
	}
	return query
}

const loadTableData = async () => {
	tableLoading.value = true
	try {
		const res = await gm.getList(buildQuery())
		tableData.value = res.data?.list || []
		pagination.total = res.data?.total || 0
	} catch {
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
	formData.value = { keyword: "", types: [], entryTime: [] }
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

const handleAdd = () => {
	dialogMode.value = "add"
	editingId.value = null
	formRef.value?.resetFields()
	Object.assign(formData2, { name: "", number: "", type: "QQ群", memberCount: 0, description: "" })
	dialogVisible.value = true
}

const handleEdit = (row: GmGroup) => {
	dialogMode.value = "edit"
	editingId.value = row.id
	Object.assign(formData2, {
		name: row.name,
		number: row.number,
		type: row.type,
		memberCount: row.memberCount,
		description: row.description
	})
	dialogVisible.value = true
}

const handleSubmit = async () => {
	const valid = await formRef.value?.validate()
	if (!valid) return

	submitLoading.value = true
	try {
		const data = { ...formData2, groupId: groupId.value }
		let res
		if (dialogMode.value === "add") {
			res = await gm.create(data)
		} else {
			res = await gm.update({ ...data, id: editingId.value! })
		}
		if ((res as any)?.state === 2000) {
			ElMessage.success((res as any).message || (dialogMode.value === "add" ? "录入成功" : "更新成功"))
			dialogVisible.value = false
			loadTableData()
		}
	} catch {
		ElMessage.error("操作失败")
	} finally {
		submitLoading.value = false
	}
}

const handleControl = (row: GmGroup) => {
	controlRow.value = row
	controlFormRef.value?.resetFields()
	Object.assign(controlFormData, { reason: "", approver: "" })
	controlDialogVisible.value = true
}

const handleControlSubmit = async () => {
	const valid = await controlFormRef.value?.validate()
	if (!valid) return

	controlSubmitLoading.value = true
	try {
		ElMessage.success("布控审批已提交")
		controlDialogVisible.value = false
	} catch {
		ElMessage.error("操作失败")
	} finally {
		controlSubmitLoading.value = false
	}
}

const handleDelete = (row: GmGroup) => {
	ElMessageBox.confirm(`确认删除群组「${row.name}」吗？`, "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning"
	}).then(async () => {
		try {
			const res = await gm.delete(row.id)
			if ((res as any)?.state === 2000) {
				ElMessage.success("删除成功")
				loadTableData()
			}
		} catch {
			ElMessage.error("删除失败")
		}
	}).catch(() => {})
}

// ==================== 生命周期 ====================
onMounted(() => {
	if (groupId.value) loadTableData()
})
</script>

<style lang="scss" scoped>
.gm-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 16px;
	background: var(--el-bg-color-page, #f5f7fa);
	gap: 12px;
	overflow: hidden;

	.page-header {
		background: var(--el-bg-color, #fff);
		padding: 12px 16px;
		border-radius: 8px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

		.page-title {
			font-size: 16px;
			font-weight: 600;
			margin: 0;
		}
	}

	.filter-section {
		background: var(--el-bg-color, #fff);
		padding: 16px;
		border-radius: 8px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

		.filter-row {
			display: flex;
			align-items: center;
			gap: 20px;
			flex-wrap: wrap;

			.filter-item {
				display: flex;
				align-items: center;
				gap: 8px;

				.filter-label {
					color: var(--el-text-color-secondary);
					font-size: 14px;
					white-space: nowrap;
				}
			}

			.filter-actions {
				display: flex;
				gap: 8px;
				margin-left: auto;
			}
		}
	}

	.action-bar {
		background: var(--el-bg-color, #fff);
		padding: 12px 16px;
		border-radius: 8px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
	}

	.table-section {
		flex: 1;
		background: var(--el-bg-color, #fff);
		border-radius: 8px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
		overflow: auto;

		:deep(.el-table) {
			width: 100%;
		}
	}

	.pagination-wrapper {
		display: flex;
		align-items: center;
		gap: 12px;
		background: var(--el-bg-color, #fff);
		padding: 12px 16px;
		border-radius: 8px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

		.page-info {
			font-size: 13px;
			color: var(--el-text-color-secondary);
		}

		.page-size-wrap {
			:deep(.el-select) {
				width: 110px;
			}
		}

		:deep(.el-pagination) {
			margin-left: auto;
		}
	}
}
</style>
