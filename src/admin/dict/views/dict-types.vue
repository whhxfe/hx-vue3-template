<template>
	<div class="dict-types">
		<el-card>
			<template #header>
				<div class="card-header">
					<span>字典类型列表</span>
					<el-button type="primary" @click="handleAdd">新增类型</el-button>
				</div>
			</template>

			<el-table :data="tableData" v-loading="loading" stripe>
				<el-table-column prop="id" label="ID" width="80" />
				<el-table-column prop="type" label="类型编码" width="150">
					<template #default="{ row }">
						<el-tag type="primary">{{ row.type }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="name" label="类型名称" width="150" />
				<el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
				<el-table-column prop="sort_order" label="排序" width="80" />
				<el-table-column prop="status" label="状态" width="80">
					<template #default="{ row }">
						<el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
							{{ row.status === 1 ? '启用' : '禁用' }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="created_at" label="创建时间" width="180" />
				<el-table-column label="操作" width="200" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
						<el-button type="danger" link @click="handleDelete(row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<div class="pagination">
				<el-pagination
					v-model:current-page="pagination.page"
					v-model:page-size="pagination.pageSize"
					:total="pagination.total"
					:page-sizes="[10, 20, 50]"
					layout="total, sizes, prev, pager, next"
					@size-change="fetchData"
					@current-change="fetchData"
				/>
			</div>
		</el-card>

		<!-- 新增/编辑弹窗 -->
		<el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
			<el-form :model="formData" label-width="100px" ref="formRef">
				<el-form-item label="类型编码" prop="type">
					<el-input v-model="formData.type" :disabled="!!formData.id" placeholder="如: gender, status" />
				</el-form-item>
				<el-form-item label="类型名称" prop="name">
					<el-input v-model="formData.name" placeholder="如: 性别、状态" />
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input v-model="formData.description" type="textarea" :rows="2" placeholder="字典类型的描述信息" />
				</el-form-item>
				<el-form-item label="排序" prop="sort_order">
					<el-input-number v-model="formData.sort_order" :min="0" :max="9999" />
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-radio-group v-model="formData.status">
						<el-radio :value="1">启用</el-radio>
						<el-radio :value="0">禁用</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getDictTypeList, createDictType, updateDictType, deleteDictType, type DictType } from '../api'

const loading = ref(false)
const tableData = ref<DictType[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增类型')
const submitting = ref(false)

const formData = reactive({
	id: undefined as number | undefined,
	type: '',
	name: '',
	description: '',
	sort_order: 0,
	status: 1
})

const pagination = reactive({
	page: 1,
	pageSize: 20,
	total: 0
})

const fetchData = async () => {
	loading.value = true
	try {
		const res = await getDictTypeList({
			page: pagination.page,
			pageSize: pagination.pageSize
		})
		if (res.data.state === 1) {
			tableData.value = res.data.data.list
			pagination.total = res.data.data.total
		}
	} catch {
		ElMessage.error('获取字典类型列表失败')
	} finally {
		loading.value = false
	}
}

const handleAdd = () => {
	dialogTitle.value = '新增类型'
	Object.assign(formData, {
		id: undefined,
		type: '',
		name: '',
		description: '',
		sort_order: 0,
		status: 1
	})
	dialogVisible.value = true
}

const handleEdit = (row: DictType) => {
	dialogTitle.value = '编辑类型'
	Object.assign(formData, {
		id: row.id,
		type: row.type,
		name: row.name,
		description: row.description || '',
		sort_order: row.sort_order,
		status: row.status
	})
	dialogVisible.value = true
}

const handleSubmit = async () => {
	if (!formData.type || !formData.name) {
		ElMessage.warning('类型编码和名称不能为空')
		return
	}

	submitting.value = true
	try {
		let res
		if (formData.id) {
			res = await updateDictType(formData.id, {
				name: formData.name,
				description: formData.description,
				sort_order: formData.sort_order,
				status: formData.status
			})
		} else {
			res = await createDictType({
				type: formData.type,
				name: formData.name,
				description: formData.description,
				sort_order: formData.sort_order
			})
		}

		if (res.data.state === 1) {
			ElMessage.success('保存成功')
			dialogVisible.value = false
			fetchData()
		} else {
			ElMessage.error(res.data.message || '保存失败')
		}
	} catch (err: any) {
		ElMessage.error(err.message || '保存失败')
	} finally {
		submitting.value = false
	}
}

const handleDelete = (row: DictType) => {
	ElMessageBox.confirm(
		`确定要删除字典类型「${row.name}」吗？删除后会同时删除该类型下的所有字典项。`,
		'确认删除',
		{ type: 'warning' }
	).then(async () => {
		try {
			const res = await deleteDictType(row.id)
			if (res.data.state === 1) {
				ElMessage.success('删除成功')
				fetchData()
			} else {
				ElMessage.error(res.data.message || '删除失败')
			}
		} catch {
			ElMessage.error('删除失败')
		}
	}).catch(() => {})
}

onMounted(() => {
	fetchData()
})
</script>

<style lang="scss" scoped>
.dict-types {
	padding: 16px;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.pagination {
	margin-top: 16px;
	display: flex;
	justify-content: flex-end;
}
</style>
