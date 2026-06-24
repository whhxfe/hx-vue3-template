<template>
	<div class="sgm-container">
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
			<div class="data-header">
				<div class="header-left">
					<el-dropdown trigger="click" @command="handleSortChange">
						<el-button>
							{{ sortLabelMap[sortField] || '排序方式' }}
							<el-icon class="el-icon--right"><ArrowDown /></el-icon>
						</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item command="entryTime">录入时间</el-dropdown-item>
								<el-dropdown-item command="memberCount">群体人员</el-dropdown-item>
								<el-dropdown-item command="activeCount">活跃人员</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
					<el-button link type="primary" @click="toggleSortOrder">
						<el-icon>
							<SortUp v-if="sortOrder === 'asc'" />
							<SortDown v-else />
						</el-icon>
					</el-button>
				</div>
				<div class="header-right">
					<el-button type="primary" @click="handleAdd">
						<el-icon><Plus /></el-icon>
						录入
					</el-button>
					<HxImporter
						ref="importerRef"
						:upload-action="'/ktc/tgm/gc/sgm/import'"
						:method="'post'"
						template-file-name="子群体导入模板.xlsx"
						:template-url="'/ktc/tgm/gc/sgm/template'"
						:max-size="10"
						button-text="导入"
						dialog-title="导入子群体数据"
						@success="handleImportSuccess"
						@error="handleImportError"
					/>
					<HxExporter
						ref="exporterRef"
						:export-action="'/ktc/tgm/gc/sgm/export'"
						:method="'post'"
						:current-page="pagination.currentPage"
						:page-size="pagination.pageSize"
						:total-count="pagination.total"
						:max-export-count="10000"
						button-text="导出"
						dialog-title="导出子群体数据"
						:get-search-params="getSearchParams"
						@success="handleExportSuccess"
						@error="handleExportError"
					/>
				</div>
			</div>

			<!-- 卡片列表 -->
			<div class="card-list" v-loading="tableLoading">
				<div v-for="item in tableData" :key="item.id" class="gc-card">
					<div class="card-header">
						<div class="card-info">
							<el-avatar :size="48">
								<el-icon :size="24"><User /></el-icon>
							</el-avatar>
							<div class="card-title-area">
								<div class="card-title-row">
									<span class="card-name">{{ item.name }}</span>
									<el-tag v-for="tag in (item.tagsName || [])" :key="tag" size="small" type="info" class="card-tag">
										{{ tag }}
									</el-tag>
									<el-tag v-if="item.categoryTypeName" size="small" type="warning" class="card-tag">
										{{ item.categoryTypeName }}
									</el-tag>
									<el-tag v-if="item.status === 1" size="small" type="info" effect="dark" class="card-tag">已办结</el-tag>
								</div>
							</div>
						</div>
						<div class="card-actions">
							<el-button type="primary" link @click="handlePersonManage(item)">人员管理</el-button>
							<el-button type="primary" link @click="handleGroupManage(item)">群组管理</el-button>
							<el-button type="primary" link @click="handleEdit(item)">编辑</el-button>
							<el-button type="danger" link @click="handleDelete(item)">删除</el-button>
							<el-button v-if="item.status !== 1" type="primary" link @click="handleClose(item)">办结</el-button>
						</div>
					</div>
					<div class="card-body">
						<div class="info-row">
							<HxLabelText label="群体人员" :text="String(item.memberCount ?? '—')" />
							<HxLabelText label="群体属地" :text="item.territory || '—'" />
							<HxLabelText label="关注民警" :text="item.policeName || '—'" />
							<HxLabelText label="关注单位" :text="item.unitName || '—'" />
						</div>
						<div class="info-row">
							<HxLabelText label="关注原因" :text="item.reason || '—'" class="reason-field" />
							<HxLabelText label="活跃人员" :text="String(item.activeCount ?? '—')" />
							<HxLabelText label="推荐人员" :text="String(item.recommendCount ?? '—')" />
						</div>
						<div class="info-row">
							<HxLabelText label="群组数量" :text="String(item.groupCount ?? '—')" />
							<div class="info-field">
								<span class="info-label">预警类型：</span>
								<div class="info-value warning-tags">
									<el-tag
										v-for="(wType, idx) in (item.warningTypeNames || item.warningTypes || [])"
										:key="idx"
										size="small"
										type="danger"
										effect="plain"
										class="warning-tag"
									>
										{{ wType }}
									</el-tag>
									<span v-if="!item.warningTypeNames?.length && !item.warningTypes?.length">—</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div v-if="!tableLoading && tableData.length === 0" class="empty-state">
					<el-icon :size="48" color="#dcdfe6"><User /></el-icon>
					<p class="empty-text">暂无子群体数据</p>
				</div>
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
		</div>

		<!-- 新增/编辑弹窗 -->
		<el-dialog
			v-model="addDialogVisible"
			:title="dialogMode === 'add' ? '子群体录入' : '子群体编辑'"
			width="900px"
			:close-on-click-modal="false"
			@close="handleAddDialogClose"
		>
			<div class="dialog-section">
				<div class="section-title">
					<el-icon><Document /></el-icon>
					<span>群体信息</span>
				</div>
				<el-form ref="addFormRef" :model="addFormData" :rules="addFormRules" label-width="90px">
					<el-row :gutter="20">
						<el-col :span="8">
							<el-form-item label="群体名称" prop="name">
								<el-input v-model="addFormData.name" placeholder="请输入" />
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="群体类型" prop="categoryType">
								<el-select v-model="addFormData.categoryType" placeholder="请选择" style="width: 100%">
									<el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="群体属地" prop="territory">
								<el-select v-model="addFormData.territory" placeholder="请选择" filterable style="width: 100%">
									<el-option v-for="item in territoryOptions" :key="item" :label="item" :value="item" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="8">
							<el-form-item label="关注民警" prop="policeName">
								<el-select v-model="addFormData.policeName" placeholder="请选择" filterable style="width: 100%">
									<el-option v-for="item in policeOptions" :key="item" :label="item" :value="item" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="关注单位" prop="unitName">
								<el-select v-model="addFormData.unitName" placeholder="请选择" filterable style="width: 100%">
									<el-option v-for="item in unitOptions" :key="item" :label="item" :value="item" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="24">
							<el-form-item label="关注原因" prop="reason">
								<el-input v-model="addFormData.reason" placeholder="请输入" />
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>

			<div class="dialog-section">
				<div class="section-title">
					<el-icon><Document /></el-icon>
					<span>人员信息</span>
				</div>
				<div class="member-list">
					<div v-for="(member, idx) in addFormData.members" :key="idx" class="member-item">
						<div class="member-info">
							<div class="member-row">
								<span class="member-field"><span class="field-label">姓名：</span>{{ member.name }}</span>
								<span class="member-field"><span class="field-label">身份证号：</span>{{ member.idCard }}</span>
								<span class="member-field"><span class="field-label">性别：</span>{{ member.gender }}</span>
							</div>
							<div class="member-row">
								<span class="member-field"><span class="field-label">手机号：</span>{{ member.phone }}</span>
								<span class="member-field"><span class="field-label">民族：</span>{{ member.nation }}</span>
								<span class="member-field"><span class="field-label">户籍地址：</span>{{ member.address }}</span>
							</div>
						</div>
						<div class="member-actions">
							<el-button type="primary" link @click="handleEditMember(idx)">编辑</el-button>
							<el-button type="danger" link @click="handleRemoveMember(idx)">删除</el-button>
						</div>
					</div>
					<div class="add-member-btn" @click="handleAddMember">
						<el-icon><Plus /></el-icon>
						<span>添加人员</span>
					</div>
				</div>
			</div>

			<template #footer>
				<div class="dialog-footer">
					<el-button @click="addDialogVisible = false">取消</el-button>
					<el-button type="primary" :loading="addSubmitLoading" @click="handleAddSubmit">提交</el-button>
				</div>
			</template>
		</el-dialog>

		<!-- 人员子弹窗 -->
		<el-dialog
			v-model="memberDialogVisible"
			:title="memberDialogMode === 'add' ? '添加人员' : '编辑人员'"
			width="600px"
			:close-on-click-modal="false"
		>
			<el-form ref="memberFormRef" :model="memberFormData" :rules="memberFormRules" label-width="90px">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="姓名" prop="name">
							<el-input v-model="memberFormData.name" placeholder="请输入姓名" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="性别" prop="gender">
							<el-select v-model="memberFormData.gender" placeholder="请选择" style="width: 100%">
								<el-option label="男" value="男" />
								<el-option label="女" value="女" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="身份证号" prop="idCard">
							<el-input v-model="memberFormData.idCard" placeholder="请输入身份证号" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="手机号" prop="phone">
							<el-input v-model="memberFormData.phone" placeholder="请输入手机号" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="民族" prop="nation">
							<el-select v-model="memberFormData.nation" placeholder="请选择" filterable style="width: 100%">
								<el-option v-for="item in nationOptions" :key="item" :label="item" :value="item" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="户籍地址" prop="address">
							<el-input v-model="memberFormData.address" placeholder="请输入户籍地址" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="memberDialogVisible = false">取消</el-button>
					<el-button type="primary" @click="handleMemberSubmit">确定</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { ElMessage, ElMessageBox } from "element-plus"
import { Plus, SortUp, SortDown, ArrowDown, User, Document } from "@element-plus/icons-vue"
import { HxForm, HxLabelText, HxImporter, HxExporter } from "@whhx/ui"
import type { FormField } from "@whhx/ui"
import { sgm } from "@/modules/ktc/api/tgm/gc"
import type { SgmGroup } from "@/modules/ktc/api/tgm/gc/sgm"

defineOptions({ name: 'SubGroupManage' })

const route = useRoute()
const router = useRouter()
const parentGroupId = computed(() => Number(route.query.parentGroupId) || 0)

type ImporterExpose = { open: () => void; close: () => void }
type ExporterExpose = { open: () => void; close: () => void }

const importerRef = ref<ImporterExpose>()
const exporterRef = ref<ExporterExpose>()

// ==================== 下拉选项 ====================
const categoryOptions = [
	{ label: "上访群体", value: "上访群体" },
	{ label: "涉稳群体", value: "涉稳群体" },
	{ label: "维权群体", value: "维权群体" },
	{ label: "利益诉求", value: "利益诉求" },
	{ label: "重点关注", value: "重点关注" }
]
const territoryOptions = ["林芝市墨脱县", "林芝市巴宜区", "林芝市米林县", "林芝市工布江达县", "林芝市朗县", "林芝市察隅县", "林芝市波密县"]
const policeOptions = ["张林芝", "李国安", "王建军", "刘志远", "陈卫民", "赵永强", "周明辉", "吴晓东"]
const unitOptions = ["林芝市公安局网安支队", "林芝市公安局国保支队", "巴宜区公安分局", "林芝市公安局治安支队", "米林县公安局", "波密县公安局"]
const nationOptions = ["汉", "藏", "回", "维吾尔", "苗", "彝", "壮", "满", "土家"]

// ==================== 排序 ====================
const sortField = ref("entryTime")
const sortOrder = ref<"asc" | "desc">("desc")
const sortLabelMap: Record<string, string> = { entryTime: "录入时间", memberCount: "群体人员", activeCount: "活跃人员" }

const handleSortChange = (command: string) => {
	sortField.value = command
	pagination.currentPage = 1
	loadTableData()
}

const toggleSortOrder = () => {
	sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc"
	pagination.currentPage = 1
	loadTableData()
}

// ==================== 表单 ====================
const formData = ref({ keyword: "", categoryType: "", entryTime: [] as string[] })

const formColumns = computed<FormField[]>(() => [
	{ prop: "keyword", label: "关键字", type: "input", placeholder: "请输入群体名称", colSpan: 1 },
	{ prop: "categoryType", label: "管控类别", type: "select", placeholder: "请选择管控类别", options: categoryOptions, colSpan: 1 },
	{ prop: "entryTime", label: "录入时间", type: "daterange", placeholder: "请选择时间范围", colSpan: 2, valueFormat: "YYYY-MM-DD", componentProps: { rangeSeparator: "至", startPlaceholder: "开始日期", endPlaceholder: "结束日期" } }
])

// ==================== 分页 ====================
const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const pageStart = computed(() => pagination.total === 0 ? 0 : (pagination.currentPage - 1) * pagination.pageSize + 1)
const pageEnd = computed(() => Math.min(pagination.currentPage * pagination.pageSize, pagination.total))

// ==================== 数据 ====================
const tableData = ref<SgmGroup[]>([])
const tableLoading = ref(false)

// ==================== 新增/编辑弹窗 ====================
const addDialogVisible = ref(false)
const dialogMode = ref<"add" | "edit">("add")
const addSubmitLoading = ref(false)
const addFormRef = ref()
const editingRow = ref<SgmGroup | null>(null)

const addFormData = reactive({
	name: "", categoryType: "", territory: "", policeName: "", unitName: "", reason: "",
	members: [] as { name: string; gender: string; idCard: string; phone: string; nation: string; address: string }[]
})

const addFormRules = {
	name: [{ required: true, message: "请输入群体名称", trigger: "blur" }],
	categoryType: [{ required: true, message: "请选择群体类型", trigger: "change" }],
	territory: [{ required: true, message: "请选择群体属地", trigger: "change" }],
	reason: [{ required: true, message: "请输入关注原因", trigger: "blur" }]
}

// ==================== 人员子弹窗 ====================
const memberDialogVisible = ref(false)
const memberDialogMode = ref<"add" | "edit">("add")
const memberEditIndex = ref(-1)
const memberFormRef = ref()

const memberFormData = reactive({ name: "", gender: "" as "男" | "女" | "", idCard: "", phone: "", nation: "汉", address: "" })
const memberFormRules = {
	name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
	gender: [{ required: true, message: "请选择性别", trigger: "change" }],
	idCard: [{ required: true, message: "请输入身份证号", trigger: "blur" }],
	phone: [{ required: true, message: "请输入手机号", trigger: "blur" }]
}

// ==================== 方法 ====================
const buildListQuery = () => {
	const query: Record<string, unknown> = {
		page: pagination.currentPage, pageSize: pagination.pageSize,
		sortField: sortField.value, sortOrder: sortOrder.value
	}
	if (parentGroupId.value) query.parentGroupId = parentGroupId.value
	if (formData.value.keyword) query.keyword = formData.value.keyword
	if (formData.value.categoryType) query.categoryType = formData.value.categoryType
	if (formData.value.entryTime?.length === 2) {
		query.entryTimeStart = formData.value.entryTime[0]
		query.entryTimeEnd = formData.value.entryTime[1]
	}
	return query
}

const getSearchParams = () => buildListQuery()

const loadTableData = async () => {
	tableLoading.value = true
	try {
		const res = await sgm.getList(buildListQuery())
		tableData.value = res.data?.list || []
		pagination.total = (res.data as any)?.total || 0
	} catch {
		tableData.value = []
		pagination.total = 0
	} finally {
		tableLoading.value = false
	}
}

const handleSearch = () => { pagination.currentPage = 1; loadTableData() }
const handleReset = () => {
	formData.value = { keyword: "", categoryType: "", entryTime: [] }
	pagination.currentPage = 1
	loadTableData()
}
const handleSizeChange = (size: number) => { pagination.pageSize = size; pagination.currentPage = 1; loadTableData() }
const handleCurrentChange = (page: number) => { pagination.currentPage = page; loadTableData() }

const handleAdd = () => {
	dialogMode.value = "add"; editingRow.value = null
	addFormRef.value?.resetFields()
	Object.assign(addFormData, { name: "", categoryType: "", territory: "", policeName: "", unitName: "", reason: "", members: [] })
	addDialogVisible.value = true
}

const handleEdit = (row: SgmGroup) => {
	dialogMode.value = "edit"; editingRow.value = row
	Object.assign(addFormData, {
		name: row.name, categoryType: row.categoryType, territory: row.territory,
		policeName: row.policeName, unitName: row.unitName, reason: row.reason, members: (row as any).members || []
	})
	addDialogVisible.value = true
}

const handleAddMember = () => {
	memberDialogMode.value = "add"; memberEditIndex.value = -1
	memberFormRef.value?.resetFields()
	Object.assign(memberFormData, { name: "", gender: "", idCard: "", phone: "", nation: "汉", address: "" })
	memberDialogVisible.value = true
}

const handleEditMember = (idx: number) => {
	memberDialogMode.value = "edit"; memberEditIndex.value = idx
	const m = addFormData.members[idx]
	Object.assign(memberFormData, { name: m.name, gender: m.gender, idCard: m.idCard, phone: m.phone, nation: m.nation, address: m.address })
	memberDialogVisible.value = true
}

const handleRemoveMember = (idx: number) => { addFormData.members.splice(idx, 1) }

const handleMemberSubmit = async () => {
	const valid = await memberFormRef.value?.validate()
	if (!valid) return
	const memberData = { name: memberFormData.name, gender: memberFormData.gender, idCard: memberFormData.idCard, phone: memberFormData.phone, nation: memberFormData.nation, address: memberFormData.address }
	if (memberDialogMode.value === "add") addFormData.members.push(memberData)
	else addFormData.members[memberEditIndex.value] = memberData
	memberDialogVisible.value = false
}

const handleAddSubmit = async () => {
	const valid = await addFormRef.value?.validate()
	if (!valid) return
	addSubmitLoading.value = true
	try {
		const data = { ...addFormData, parentGroupId: parentGroupId.value }
		let res
		if (dialogMode.value === "add") res = await sgm.create(data)
		else res = await sgm.update({ ...data, id: editingRow.value!.id! })
		if ((res as any)?.state === 2000) {
			ElMessage.success((res as any).message || (dialogMode.value === "add" ? "录入成功" : "更新成功"))
			addDialogVisible.value = false; loadTableData()
		}
	} catch { ElMessage.error("操作失败") } finally { addSubmitLoading.value = false }
}

const handleAddDialogClose = () => { addFormRef.value?.resetFields() }

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

const handlePersonManage = (row: SgmGroup) => {
	const r = router.resolve({ path: '/ktc/tgm/gc/pmg', query: { groupId: String(row.id), groupName: row.name } })
	window.open(r.href, '_blank')
}

const handleGroupManage = (row: SgmGroup) => {
	const r = router.resolve({ path: '/ktc/tgm/gc/gm', query: { groupId: String(row.id), groupName: row.name } })
	window.open(r.href, '_blank')
}

const handleClose = (row: SgmGroup) => {
	ElMessageBox.confirm(`确认办结群体「${row.name}」吗？`, "提示", { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" })
		.then(async () => {
			try {
				const res = await sgm.close(row.id!)
				if ((res as any)?.state === 2000) { ElMessage.success("办结成功"); loadTableData() }
			} catch { ElMessage.error("办结失败") }
		}).catch(() => {})
}

const handleDelete = (row: SgmGroup) => {
	ElMessageBox.confirm(`确认删除群体「${row.name}」吗？`, "提示", { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" })
		.then(async () => {
			try {
				const res = await sgm.delete(row.id!)
				if ((res as any)?.state === 2000) { ElMessage.success("删除成功"); loadTableData() }
			} catch { ElMessage.error("删除失败") }
		}).catch(() => {})
}

// ==================== 生命周期 ====================
onMounted(() => {
	loadTableData()
})
</script>

<style lang="scss" scoped>
.sgm-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	gap: 16px;
	padding: 16px;
	background: var(--el-bg-color-page, #f5f7fa);
	overflow: hidden;

	.filter-section {
		background: var(--el-bg-color, #fff);
		border-radius: 8px;
		padding: 16px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	}

	.data-section {
		flex: 1;
		background: var(--el-bg-color, #fff);
		border-radius: 8px;
		padding: 16px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

		.data-header {
			flex-shrink: 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 16px;

			.header-left { display: flex; align-items: center; gap: 4px; }
			.header-right { display: flex; gap: 8px; }
		}

		.card-list {
			flex: 1;
			overflow-y: auto;
			display: flex;
			flex-direction: column;
			gap: 16px;

			.gc-card {
				border: 1px solid var(--el-border-color);
				border-radius: 8px;
				padding: 16px;
				transition: all 0.3s;

				&:hover { border-color: var(--el-color-primary); box-shadow: 0 2px 12px rgba(64, 158, 255, 0.1); }

				.card-header {
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					margin-bottom: 12px;

					.card-info { display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1; }

					.card-title-area {
						min-width: 0;
						flex: 1;

						.card-title-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
						.card-name { font-size: 16px; font-weight: 600; color: var(--el-text-color-primary); }
						.card-tag { margin: 0; }
					}

					.card-actions { display: flex; gap: 4px; flex-shrink: 0; margin-left: 16px; }
				}

				.card-body {
					display: flex;
					flex-direction: column;
					gap: 8px;
					padding-left: 60px;

					.info-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; .reason-field { grid-column: 1 / -1; } }

					.info-field {
						display: flex;
						align-items: flex-start;
						font-size: 14px;
						.info-label { color: var(--el-text-color-secondary); white-space: nowrap; }
						.info-value { color: var(--el-text-color-regular); flex: 1; min-width: 0; }
						.warning-tags { display: flex; flex-wrap: wrap; gap: 4px; .warning-tag { margin: 0; } }
					}
				}
			}

			.empty-state {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 60px 0;
				color: var(--el-text-color-secondary);
				.empty-text { font-size: 15px; margin: 16px 0 0; color: var(--el-text-color-regular); }
			}
		}

		.pagination-wrapper {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			gap: 12px;
			padding-top: 16px;
			border-top: 1px solid var(--el-border-color);
			margin-top: 16px;

			.page-info { font-size: 13px; color: var(--el-text-color-secondary); }
			.page-size-wrap { :deep(.el-select) { width: 110px; } }
			:deep(.el-pagination) { margin-left: auto; }
		}
	}
}

.dialog-section {
	margin-bottom: 24px;

	.section-title {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 15px;
		font-weight: 600;
		color: var(--el-text-color-primary);
		margin-bottom: 16px;
		padding-bottom: 8px;
		border-bottom: 1px solid var(--el-border-color);
	}
}

.member-list {
	.member-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 16px;
		background: var(--el-fill-color-blank, #f5f7fa);
		border-radius: 6px;
		margin-bottom: 8px;

		.member-info {
			flex: 1;
			min-width: 0;
			.member-row { display: flex; gap: 24px; margin-bottom: 4px; font-size: 14px; &:last-child { margin-bottom: 0; } }
			.member-field { color: var(--el-text-color-regular); .field-label { color: var(--el-text-color-secondary); } }
		}

		.member-actions { flex-shrink: 0; margin-left: 16px; display: flex; gap: 8px; }
	}

	.add-member-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		padding: 10px;
		border: 1px dashed var(--el-border-color);
		border-radius: 6px;
		cursor: pointer;
		color: var(--el-text-color-secondary);
		font-size: 14px;
		transition: all 0.2s;

		&:hover { color: var(--el-color-primary); border-color: var(--el-color-primary); background: var(--el-color-primary-light-9); }
	}
}
</style>
