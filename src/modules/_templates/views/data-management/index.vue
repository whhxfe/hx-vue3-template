<template>
	<div class="data-management-list">
		<div class="header">
			<h2>数据管理</h2>
			<el-button type="primary" @click="handleAdd">
				<el-icon><Plus /></el-icon>
				新增数据
			</el-button>
		</div>

		<div class="filter-bar">
			<el-input
				v-model="searchKeyword"
				placeholder="搜索名称、编码..."
				clearable
				style="width: 240px"
				@clear="handleSearch"
				@keyup.enter="handleSearch"
			>
				<template #prefix>
					<el-icon><Search /></el-icon>
				</template>
			</el-input>
			<el-select v-model="filterCategory" placeholder="分类筛选" clearable style="width: 140px">
				<el-option label="全部" value="" />
				<el-option label="数据源" value="数据源" />
				<el-option label="配置项" value="配置项" />
				<el-option label="规则模板" value="规则模板" />
			</el-select>
			<el-select v-model="filterStatus" placeholder="状态筛选" clearable style="width: 120px">
				<el-option label="全部" value="" />
				<el-option label="启用" value="active" />
				<el-option label="禁用" value="inactive" />
			</el-select>
			<el-button type="primary" @click="handleSearch">搜索</el-button>
		</div>

		<div v-loading="loading" class="content">
			<el-table :data="filteredList" stripe style="width: 100%">
				<el-table-column prop="id" label="ID" width="80" />
				<el-table-column prop="name" label="名称" min-width="150" />
				<el-table-column prop="code" label="编码" width="120" />
				<el-table-column prop="category" label="分类" width="100">
					<template #default="{ row }">
						<el-tag size="small">{{ row.category }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态" width="100">
					<template #default="{ row }">
						<el-switch
							v-model="row.status"
							active-value="active"
							inactive-value="inactive"
							@change="handleStatusChange(row)"
						/>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间" width="180" />
				<el-table-column prop="description" label="描述" min-width="150" show-overflow-tooltip />
				<el-table-column label="操作" width="180" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" text size="small" @click="handleEdit(row)">
							<el-icon><Edit /></el-icon>
							编辑
						</el-button>
						<el-button type="danger" text size="small" @click="handleDelete(row)">
							<el-icon><Delete /></el-icon>
							删除
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
			:title="isEdit ? '编辑数据' : '新增数据'"
			width="500px"
			@closed="handleDialogClosed"
		>
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
				<el-form-item label="名称" prop="name">
					<el-input v-model="formData.name" placeholder="请输入名称" />
				</el-form-item>
				<el-form-item label="编码" prop="code">
					<el-input v-model="formData.code" placeholder="请输入编码" :disabled="isEdit" />
				</el-form-item>
				<el-form-item label="分类" prop="category">
					<el-select v-model="formData.category" placeholder="请选择分类" style="width: 100%">
						<el-option label="数据源" value="数据源" />
						<el-option label="配置项" value="配置项" />
						<el-option label="规则模板" value="规则模板" />
					</el-select>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-radio-group v-model="formData.status">
						<el-radio value="active">启用</el-radio>
						<el-radio value="inactive">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入描述" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSubmit">确定</el-button>
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
	name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
	code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
	category: [{ required: true, message: '请选择分类', trigger: 'change' }],
	status: [{ required: true, message: '请选择状态', trigger: 'change' }]
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
		await ElMessageBox.confirm(`确定要删除「${row.name}」吗？`, '提示', {
			type: 'warning'
		})
		removeItem(row.id)
		ElMessage.success('删除成功')
	} catch {
		// 用户取消
	}
}

const handleStatusChange = (row: DataItem) => {
	updateItemStatus(row.id, row.status)
	ElMessage.success(`已${row.status === 'active' ? '启用' : '禁用'}`)
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
				ElMessage.success('更新成功')
			} else {
				const newItem: DataItem = {
					id: Date.now(),
					...formData.value,
					createTime: new Date().toLocaleString(),
					updateTime: new Date().toLocaleString()
				}
				addItem(newItem)
				ElMessage.success('新增成功')
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
