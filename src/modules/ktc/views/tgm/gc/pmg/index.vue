<template>
	<div class="pmg-container">
		<!-- 标题栏 -->
		<div class="page-header">
			<h2 class="page-title">{{ groupName }}人员</h2>
			<el-button link @click="toggleCollapsed">
				{{ collapsed ? '展开' : '收起' }}
				<el-icon>
					<ArrowUp v-if="!collapsed" />
					<ArrowDown v-else />
				</el-icon>
			</el-button>
		</div>

		<!-- 户籍地址筛选 -->
		<div v-show="!collapsed" class="address-filter">
			<span class="filter-label">户籍地址：</span>
			<div class="address-tags">
				<el-check-tag
					v-for="item in addressCounts"
					:key="item.value"
					:checked="selectedAddresses.includes(item.value)"
					@change="toggleAddress(item.value)"
				>
					{{ item.label }}({{ item.count }})
				</el-check-tag>
			</div>
		</div>

		<!-- 操作栏 -->
		<div class="action-bar">
			<div class="action-left">
				<el-button type="primary" @click="handleAdd">
					<el-icon><Plus /></el-icon>
					录入
				</el-button>
				<HxImporter
					ref="importerRef"
					:upload-action="'/ktc/tgm/gc/pmg/import'"
					:method="'post'"
					template-file-name="群体人员导入模板.xlsx"
					:template-url="'/ktc/tgm/gc/pmg/template'"
					:max-size="10"
					button-text="导入"
					dialog-title="导入群体人员"
					@success="handleImportSuccess"
					@error="handleImportError"
				/>
				<HxExporter
					ref="exporterRef"
					:export-action="'/ktc/tgm/gc/pmg/export'"
					:method="'post'"
					:current-page="pagination.currentPage"
					:page-size="pagination.pageSize"
					:total-count="pagination.total"
					:max-export-count="10000"
					button-text="导出"
					dialog-title="导出群体人员"
					:get-search-params="getSearchParams"
					@success="handleExportSuccess"
					@error="handleExportError"
				/>
			</div>
			<div class="action-right">
				<el-checkbox v-model="filterFollowed">已关注</el-checkbox>
				<el-checkbox v-model="filterStopped">已布控</el-checkbox>
				<el-input
					v-model="keyword"
					placeholder="请输入姓名、身份证号"
					clearable
					style="width: 200px"
					@keyup.enter="handleSearch"
				>
					<template #append>
						<el-button @click="handleSearch">
							<el-icon><Search /></el-icon>
						</el-button>
					</template>
				</el-input>
			</div>
		</div>

		<!-- 排序栏 -->
		<div class="sort-bar">
			<div class="sort-left">
				<el-dropdown trigger="click" @command="handleSortChange">
					<el-button>
						{{ sortLabelMap[sortField] || '排序方式' }}
						<el-icon class="el-icon--right"><ArrowDown /></el-icon>
					</el-button>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item command="entryTime">录入时间</el-dropdown-item>
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
		</div>

		<!-- 卡片列表 -->
		<div class="card-grid" v-loading="tableLoading">
			<div v-for="item in tableData" :key="item.id" class="person-card">
				<div class="card-content">
					<div class="card-top">
						<el-avatar v-if="item.avatar" :size="52" :src="item.avatar" class="card-avatar" />
						<el-avatar v-else :size="52" class="card-avatar">
							<el-icon :size="26"><User /></el-icon>
						</el-avatar>
						<div class="card-info">
							<div class="card-name-row">
								<span class="card-name">{{ item.name }}</span>
								<span class="card-meta">{{ item.gender }} {{ item.age }}岁</span>
							</div>
							<div class="card-idcard">{{ item.idCard }}</div>
							<div class="card-detail">手机号：{{ item.phone }}</div>
							<div class="card-detail">户籍地址：{{ item.addressName || item.address }}</div>
							<div v-if="item.warningTypes?.length" class="card-tags">
								<el-tag
									v-for="tag in item.warningTypes"
									:key="tag"
									size="small"
									type="danger"
									effect="plain"
								>
									{{ tag }}
								</el-tag>
							</div>
						</div>
					</div>
					<div class="card-footer">
						<el-button type="primary" link @click="handleEdit(item)">编辑</el-button>
						<el-button type="default" link @click="handleControl(item)">布控</el-button>
						<el-button type="danger" link @click="handleDelete(item)">删除</el-button>
					</div>
				</div>
			</div>

			<el-empty v-if="!tableLoading && tableData.length === 0" description="暂无数据" />
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
			:title="dialogMode === 'add' ? '人员录入' : '人员编辑'"
			width="650px"
			:close-on-click-modal="false"
			@close="handleDialogClose"
		>
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="90px">
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="姓名" prop="name">
							<el-input v-model="formData.name" placeholder="请输入" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="身份证号" prop="idCard">
							<el-input v-model="formData.idCard" placeholder="请输入" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="性别" prop="gender">
							<el-radio-group v-model="formData.gender">
								<el-radio value="男">男</el-radio>
								<el-radio value="女">女</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="手机号" prop="phone">
							<el-input v-model="formData.phone" placeholder="请输入" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="民族" prop="nation">
							<el-select v-model="formData.nation" placeholder="请选择" filterable style="width: 100%">
								<el-option v-for="item in nationOptions" :key="item" :label="item" :value="item" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="户籍地址" prop="address">
							<el-select v-model="formData.address" placeholder="请选择" filterable style="width: 100%">
								<el-option v-for="item in addressOptions" :key="item" :label="item" :value="item" />
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" :loading="submitLoading" @click="handleSubmit">提交</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import { ElMessage, ElMessageBox } from "element-plus"
import { Plus, Search, ArrowUp, ArrowDown, SortUp, SortDown, User } from "@element-plus/icons-vue"
import { HxImporter, HxExporter } from "@whhx/ui"
import { pmg } from "@/modules/ktc/api/tgm/gc"
import type { PmgPerson, PmgAddressCount } from "@/modules/ktc/api/tgm/gc/pmg"

defineOptions({ name: 'GroupPersonManage' })

const route = useRoute()

const groupId = computed(() => Number(route.query.groupId) || 0)
const groupName = ref(String(route.query.groupName || '群体'))

type ImporterExpose = { open: () => void; close: () => void }
type ExporterExpose = { open: () => void; close: () => void }

const importerRef = ref<ImporterExpose>()
const exporterRef = ref<ExporterExpose>()

// ==================== 下拉选项 ====================
const nationOptions = ["汉", "藏", "回", "维吾尔", "苗", "彝", "壮", "满", "土家", "侗", "瑶", "白", "哈尼", "傣", "黎"]
const addressOptions = ["林芝市墨脱县", "林芝市巴宜区", "林芝市米林县", "林芝市工布江达县", "林芝市朗县", "林芝市察隅县", "林芝市波密县"]

// ==================== 弹窗 ====================
const dialogVisible = ref(false)
const dialogMode = ref<"add" | "edit">("add")
const submitLoading = ref(false)
const formRef = ref()
const editingId = ref<number | null>(null)

const formData = reactive({
	name: "",
	gender: "男" as "男" | "女",
	idCard: "",
	phone: "",
	nation: "汉",
	address: ""
})

const formRules = {
	name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
	idCard: [{ required: true, message: "请输入身份证号", trigger: "blur" }]
}

const getSearchParams = () => {
	return buildQuery()
}

// ==================== 折叠 ====================
const collapsed = ref(false)
const toggleCollapsed = () => { collapsed.value = !collapsed.value }

// ==================== 地址筛选 ====================
const addressCounts = ref<PmgAddressCount[]>([])
const selectedAddresses = ref<string[]>([])

const loadAddressCounts = async () => {
	if (!groupId.value) return
	try {
		const res = await pmg.getAddressCounts(groupId.value)
		addressCounts.value = res.data || []
	} catch {
		addressCounts.value = []
	}
}

const toggleAddress = (value: string) => {
	const idx = selectedAddresses.value.indexOf(value)
	if (idx >= 0) {
		selectedAddresses.value.splice(idx, 1)
	} else {
		selectedAddresses.value.push(value)
	}
	pagination.currentPage = 1
	loadTableData()
}

// ==================== 筛选 ====================
const keyword = ref("")
const filterFollowed = ref(false)
const filterStopped = ref(false)

// ==================== 排序 ====================
const sortField = ref("entryTime")
const sortOrder = ref<"asc" | "desc">("desc")
const sortLabelMap: Record<string, string> = { entryTime: "录入时间" }

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

// ==================== 分页 ====================
const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const pageStart = computed(() => pagination.total === 0 ? 0 : (pagination.currentPage - 1) * pagination.pageSize + 1)
const pageEnd = computed(() => Math.min(pagination.currentPage * pagination.pageSize, pagination.total))

// ==================== 数据 ====================
const tableData = ref<PmgPerson[]>([])
const tableLoading = ref(false)

// ==================== 方法 ====================
const buildQuery = () => {
	const query: Record<string, unknown> = {
		page: pagination.currentPage,
		pageSize: pagination.pageSize,
		groupId: groupId.value,
		sortField: sortField.value,
		sortOrder: sortOrder.value
	}
	if (keyword.value) query.keyword = keyword.value
	if (selectedAddresses.value.length > 0) query.address = selectedAddresses.value.join(",")
	if (filterFollowed.value) query.followStatus = "1"
	return query
}

const loadTableData = async () => {
	tableLoading.value = true
	try {
		const res = await pmg.getList(buildQuery())
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
	Object.assign(formData, { name: "", gender: "男", idCard: "", phone: "", nation: "汉", address: "" })
	dialogVisible.value = true
}

const handleEdit = (row: PmgPerson) => {
	dialogMode.value = "edit"
	editingId.value = row.id
	Object.assign(formData, {
		name: row.name,
		gender: row.gender,
		idCard: row.idCard,
		phone: row.phone,
		nation: row.nation,
		address: row.address
	})
	dialogVisible.value = true
}

const handleSubmit = async () => {
	const valid = await formRef.value?.validate()
	if (!valid) return

	submitLoading.value = true
	try {
		const data = {
			...formData,
			groupId: groupId.value,
			age: getAgeFromIdCard(formData.idCard)
		}
		let res
		if (dialogMode.value === "add") {
			res = await pmg.create(data)
		} else {
			res = await pmg.update({ ...data, id: editingId.value! })
		}
		if ((res as any)?.state === 2000) {
			ElMessage.success((res as any).message || (dialogMode.value === "add" ? "录入成功" : "更新成功"))
			dialogVisible.value = false
			loadTableData()
			loadAddressCounts()
		}
	} catch {
		ElMessage.error("操作失败")
	} finally {
		submitLoading.value = false
	}
}

const getAgeFromIdCard = (idCard: string): number => {
	if (!idCard || idCard.length < 14) return 0
	const birth = idCard.substring(6, 14)
	const year = Number(birth.substring(0, 4))
	const month = Number(birth.substring(4, 6))
	const day = Number(birth.substring(6, 8))
	const now = new Date()
	let age = now.getFullYear() - year
	if (now.getMonth() + 1 < month || (now.getMonth() + 1 === month && now.getDate() < day)) age--
	return age
}

const handleDialogClose = () => {
	formRef.value?.resetFields()
}

const handleControl = (row: PmgPerson) => { ElMessage.info(`布控：${row.name}`) }

const handleDelete = (row: PmgPerson) => {
	ElMessageBox.confirm(`确认删除人员「${row.name}」吗？`, "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning"
	}).then(async () => {
		try {
			const res = await pmg.delete(row.id)
			if ((res as any)?.state === 2000) {
				ElMessage.success("删除成功")
				loadTableData()
				loadAddressCounts()
			}
		} catch {
			ElMessage.error("删除失败")
		}
	}).catch(() => {})
}

const handleImportSuccess = (response: any) => {
	ElMessage.success(response.message || "导入成功")
	loadTableData()
	loadAddressCounts()
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
	if (groupId.value) {
		loadAddressCounts()
		loadTableData()
	}
})
</script>

<style lang="scss" scoped>
.pmg-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 16px;
	background: var(--el-bg-color-page, #f5f7fa);
	gap: 12px;
	overflow: hidden;

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
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

	.address-filter {
		display: flex;
		align-items: center;
		gap: 8px;
		background: var(--el-bg-color, #fff);
		padding: 12px 16px;
		border-radius: 8px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
		flex-wrap: wrap;

		.filter-label {
			color: var(--el-text-color-secondary);
			font-size: 14px;
			white-space: nowrap;
		}

		.address-tags {
			display: flex;
			gap: 8px;
			flex-wrap: wrap;
		}
	}

	.action-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--el-bg-color, #fff);
		padding: 12px 16px;
		border-radius: 8px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

		.action-left {
			display: flex;
			gap: 8px;
		}

		.action-right {
			display: flex;
			align-items: center;
			gap: 12px;
		}
	}

	.sort-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--el-bg-color, #fff);
		padding: 8px 16px;
		border-radius: 8px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

		.sort-left {
			display: flex;
			align-items: center;
			gap: 4px;
		}

		.selected-count {
			color: var(--el-text-color-secondary);
			font-size: 14px;
		}
	}

	.card-grid {
		flex: 1;
		overflow-y: auto;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-auto-rows: 240px;
		gap: 16px;
		padding: 4px 0;

		.person-card {
			background: var(--el-bg-color, #fff);
			border: 1px solid var(--el-border-color-lighter, #ebeef5);
			border-radius: 10px;
			transition: all 0.25s;
			overflow: hidden;

			&:hover {
				border-color: var(--el-color-primary-light-5, #a0cfff);
				box-shadow: 0 4px 16px rgba(64, 158, 255, 0.12);
				transform: translateY(-1px);
			}

			.card-content {
				display: flex;
				flex-direction: column;
				height: 100%;

				.card-top {
					display: flex;
					gap: 14px;
					padding: 16px 16px 12px;
					flex: 1;
					overflow-y: auto;

					.card-avatar {
						flex-shrink: 0;
						border: 2px solid var(--el-border-color-lighter, #ebeef5);
					}

					.card-info {
						flex: 1;
						min-width: 0;

						.card-name-row {
							display: flex;
							align-items: baseline;
							gap: 8px;
							margin-bottom: 6px;

							.card-name {
								font-size: 16px;
								font-weight: 600;
								color: var(--el-text-color-primary);
							}

							.card-meta {
								font-size: 13px;
								color: var(--el-text-color-secondary);
							}
						}

						.card-idcard {
							font-size: 13px;
							color: var(--el-color-primary);
							margin-bottom: 4px;
							font-family: "Courier New", monospace;
							letter-spacing: 0.5px;
						}

						.card-detail {
							font-size: 13px;
							color: var(--el-text-color-secondary);
							margin-bottom: 3px;
							line-height: 1.6;
						}

						.card-tags {
							display: flex;
							gap: 6px;
							margin-top: 8px;
							flex-wrap: wrap;
						}
					}
				}

				.card-footer {
					display: flex;
					gap: 0;
					border-top: 1px solid var(--el-border-color-lighter, #f0f2f5);
					flex-shrink: 0;

					.el-button {
						flex: 1;
						margin: 0;
						padding: 10px 0;
						border-radius: 0;
						font-size: 13px;

						&:not(:last-child) {
							border-right: 1px solid var(--el-border-color-lighter, #f0f2f5);
						}
					}
				}
			}
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
