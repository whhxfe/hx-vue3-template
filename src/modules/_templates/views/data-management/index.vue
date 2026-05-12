<template>
	<div class="data-management-list">
		<div class="header">
			<h2>{{ text.dataManagement.title }}</h2>
			<el-button type="primary" @click="handleAdd">
				<el-icon><Plus /></el-icon>
				{{ text.dataManagement.addData }}
			</el-button>
		</div>

		<div class="filter-bar">
			<el-input
				v-model="searchKeyword"
				:placeholder="text.dataManagement.searchPlaceholder"
				clearable
				style="width: 240px"
				@clear="handleSearch"
				@keyup.enter="handleSearch"
			>
				<template #prefix>
					<el-icon><Search /></el-icon>
				</template>
			</el-input>
			<el-select v-model="filterCategory" :placeholder="text.dataManagement.categoryFilter" clearable style="width: 140px">
				<el-option :label="text.common.all" value="" />
				<el-option :label="text.dataManagement.categoryDataSource" value="数据源" />
				<el-option :label="text.dataManagement.categoryConfig" value="配置项" />
				<el-option :label="text.dataManagement.categoryRuleTemplate" value="规则模板" />
			</el-select>
			<el-select v-model="filterStatus" :placeholder="text.dataManagement.statusFilter" clearable style="width: 120px">
				<el-option :label="text.common.all" value="" />
				<el-option :label="text.common.enabled" value="active" />
				<el-option :label="text.common.disabled" value="inactive" />
			</el-select>
			<el-button type="primary" @click="handleSearch">{{ text.common.search }}</el-button>
		</div>

		<div v-loading="loading" class="content">
			<el-table :data="filteredList" stripe style="width: 100%">
				<el-table-column prop="id" :label="text.dataManagement.id" width="80" />
				<el-table-column prop="name" :label="text.dataManagement.name" min-width="150" />
				<el-table-column prop="code" :label="text.dataManagement.code" width="120" />
				<el-table-column prop="category" :label="text.dataManagement.category" width="100">
					<template #default="{ row }">
						<el-tag size="small">{{ row.category }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="status" :label="text.dataManagement.status" width="100">
					<template #default="{ row }">
						<el-switch
							v-model="row.status"
							active-value="active"
							inactive-value="inactive"
							@change="handleStatusChange(row)"
						/>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" :label="text.dataManagement.createTime" width="180" />
				<el-table-column prop="description" :label="text.dataManagement.description" min-width="150" show-overflow-tooltip />
				<el-table-column :label="text.dataManagement.action" width="180" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" text size="small" @click="handleEdit(row)">
							<el-icon><Edit /></el-icon>
							{{ text.common.edit }}
						</el-button>
						<el-button type="danger" text size="small" @click="handleDelete(row)">
							<el-icon><Delete /></el-icon>
							{{ text.common.delete }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<div class="pagination-wrapper">
				<el-pagination
					v-model:current-page="currentPage"
					v-model:page-size="pageSize"
					:total="total"
					:page-sizes="[10, 20, 50, 100]"
					layout="total, sizes, prev, pager, next, jumper"
					@size-change="handleSizeChange"
					@current-change="handlePageChange"
				/>
			</div>
		</div>

		<!-- 新增/编辑弹窗 -->
		<el-dialog
			v-model="dialogVisible"
			:title="isEdit ? text.dataManagement.editData : text.dataManagement.addData"
			width="500px"
			@closed="handleDialogClosed"
		>
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
				<el-form-item :label="text.dataManagement.name" prop="name">
					<el-input v-model="formData.name" :placeholder="text.dataManagement.placeholder.name" />
				</el-form-item>
				<el-form-item :label="text.dataManagement.code" prop="code">
					<el-input v-model="formData.code" :placeholder="text.dataManagement.placeholder.code" :disabled="isEdit" />
				</el-form-item>
				<el-form-item :label="text.dataManagement.category" prop="category">
					<el-select v-model="formData.category" :placeholder="text.dataManagement.placeholder.category" style="width: 100%">
						<el-option :label="text.dataManagement.categoryDataSource" value="数据源" />
						<el-option :label="text.dataManagement.categoryConfig" value="配置项" />
						<el-option :label="text.dataManagement.categoryRuleTemplate" value="规则模板" />
					</el-select>
				</el-form-item>
				<el-form-item :label="text.dataManagement.status" prop="status">
					<el-radio-group v-model="formData.status">
						<el-radio value="active">{{ text.common.enabled }}</el-radio>
						<el-radio value="inactive">{{ text.common.disabled }}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item :label="text.dataManagement.description" prop="description">
					<el-input v-model="formData.description" type="textarea" :rows="3" :placeholder="text.dataManagement.placeholder.description" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">{{ text.common.cancel }}</el-button>
				<el-button type="primary" @click="handleSubmit">{{ text.common.ok }}</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useDataManagementStore } from '../../store/data-management'
import type { DataItem, DataFormData } from '../../api/data-management/types'
import { useTextAlias } from '@/modules/_templates/config'

const text = useTextAlias()

const {
	dataList,
	loading,
	total,
	initMockData,
	addItem,
	updateItem,
	updateItemStatus,
	removeItem
} = useDataManagementStore()

const searchKeyword = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const dialogVisible = ref(false)
const isEdit = ref(false)
const currentId = ref<number | null>(null)
const formRef = ref<FormInstance>()

const formData = ref<DataFormData>({
	name: '',
	code: '',
	category: '',
	status: 'active',
	description: ''
})

const formRules: FormRules = {
	name: [{ required: true, message: text.dataManagement.placeholder.name, trigger: 'blur' }],
	code: [{ required: true, message: text.dataManagement.placeholder.code, trigger: 'blur' }],
	category: [{ required: true, message: text.dataManagement.placeholder.category, trigger: 'change' }],
	status: [{ required: true, message: text.dataManagement.placeholder.status, trigger: 'change' }]
}

const filteredList = computed(() => {
	let result = dataList.value

	if (searchKeyword.value) {
		const keyword = searchKeyword.value.toLowerCase()
		result = result.filter(
			item =>
				item.name.toLowerCase().includes(keyword) ||
				item.code.toLowerCase().includes(keyword)
		)
	}

	if (filterCategory.value) {
		result = result.filter(item => item.category === filterCategory.value)
	}

	if (filterStatus.value) {
		result = result.filter(item => item.status === filterStatus.value)
	}

	return result
})

const handleSearch = () => {
	currentPage.value = 1
}

const handleAdd = () => {
	isEdit.value = false
	dialogVisible.value = true
}

const handleEdit = (row: DataItem) => {
	isEdit.value = true
	currentId.value = row.id
	formData.value = {
		name: row.name,
		code: row.code,
		category: row.category,
		status: row.status,
		description: row.description || ''
	}
	dialogVisible.value = true
}

const handleDelete = async (row: DataItem) => {
	try {
		await ElMessageBox.confirm(text.common.deleteConfirm.replace('{name}', row.name), text.common.tip, {
			type: 'warning'
		})
		removeItem(row.id)
		ElMessage.success(text.dataManagement.deleteSuccess)
	} catch {
		// 用户取消
	}
}

const handleStatusChange = (row: DataItem) => {
	updateItemStatus(row.id, row.status)
	ElMessage.success(`${row.status === 'active' ? text.common.enabled : text.common.disabled}`)
}

const handleSubmit = async () => {
	if (!formRef.value) return

	await formRef.value.validate(valid => {
		if (valid) {
			if (isEdit.value && currentId.value) {
				updateItem(currentId.value, {
					...formData.value,
					updateTime: new Date().toLocaleString()
				})
				ElMessage.success(text.dataManagement.updateSuccess)
			} else {
				const newItem: DataItem = {
					id: Date.now(),
					...formData.value,
					createTime: new Date().toLocaleString(),
					updateTime: new Date().toLocaleString()
				}
				addItem(newItem)
				ElMessage.success(text.dataManagement.addSuccess)
			}
			dialogVisible.value = false
		}
	})
}

const handleDialogClosed = () => {
	formRef.value?.resetFields()
	currentId.value = null
}

const handleSizeChange = (val: number) => {
	pageSize.value = val
	currentPage.value = 1
}

const handlePageChange = (val: number) => {
	currentPage.value = val
}

onMounted(() => {
	initMockData()
})
</script>

<style lang="scss" scoped>
.data-management-list {
	padding: 20px;

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;

		h2 {
			margin: 0;
			font-size: 18px;
			font-weight: 600;
		}
	}

	.filter-bar {
		display: flex;
		gap: 12px;
		margin-bottom: 20px;
		align-items: center;
	}

	.content {
		background: #fff;
		border-radius: 8px;
		padding: 20px;
	}

	.pagination-wrapper {
		margin-top: 20px;
		display: flex;
		justify-content: flex-end;
	}
}
</style>
