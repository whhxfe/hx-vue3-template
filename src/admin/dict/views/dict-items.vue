<template>
	<div class="dict-items">
		<el-card class="filter-card">
			<el-form :inline="true" :model="queryForm">
				<el-form-item label="字典类型">
					<el-select v-model="queryForm.type" placeholder="请选择类型" clearable style="width: 200px">
						<el-option
							v-for="item in dictTypes"
							:key="item.type"
							:label="item.name"
							:value="item.type"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="标签/值">
					<el-input v-model="queryForm.label" placeholder="请输入标签或值" clearable />
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="queryForm.status" placeholder="请选择状态" clearable style="width: 120px">
						<el-option label="全部" :value="undefined" />
						<el-option label="启用" :value="1" />
						<el-option label="禁用" :value="0" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleQuery">查询</el-button>
					<el-button @click="handleReset">重置</el-button>
					<el-button type="primary" @click="handleAdd">新增字典项</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<el-card>
			<el-table :data="tableData" v-loading="loading" stripe>
				<el-table-column prop="id" label="ID" width="80" />
				<el-table-column prop="type" label="类型" width="120">
					<template #default="{ row }">
						<el-tag type="primary" size="small">{{ row.type }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="label" label="标签" width="150" />
				<el-table-column prop="value" label="值" width="150">
					<template #default="{ row }">
						<el-tag type="info" size="small">{{ row.value }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="sort_order" label="排序" width="80" />
				<el-table-column prop="status" label="状态" width="80">
					<template #default="{ row }">
						<el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
							{{ row.status === 1 ? '启用' : '禁用' }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip />
				<el-table-column prop="created_at" label="创建时间" width="180" />
				<el-table-column label="操作" width="150" fixed="right">
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
					:page-sizes="[20, 50, 100]"
					layout="total, sizes, prev, pager, next"
					@size-change="fetchData"
					@current-change="fetchData"
				/>
			</div>
		</el-card>

		<!-- 新增/编辑弹窗 -->
		<el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
			<el-form :model="formData" label-width="100px" ref="formRef">
				<el-form-item label="字典类型" prop="type">
					<el-select v-model="formData.type" placeholder="请选择字典类型" :disabled="!!formData.id" style="width: 100%">
						<el-option
							v-for="item in dictTypes"
							:key="item.type"
							:label="`${item.name} (${item.type})`"
							:value="item.type"
						/>
					</el-select>
				</el-form-item>
				<el-form-item label="标签" prop="label">
					<el-input v-model="formData.label" placeholder="如: 男、启用、是" />
				</el-form-item>
				<el-form-item label="值" prop="value">
					<el-input v-model="formData.value" placeholder="如: 1、active、true" />
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
				<el-form-item label="备注" prop="remark">
					<el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="备注信息" />
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
import {
	getDictItemList,
	getAllDictTypes,
	createDictItem,
	updateDictItem,
	deleteDictItem,
	type DictItem,
	type DictType
} from '../api'

const loading = ref(false)
const tableData = ref<DictItem[]>([])
const dictTypes = ref<Array<{ type: string; name: string }>>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增字典项')
const submitting = ref(false)

const queryForm = reactive({
	type: '',
	label: '',
	status: undefined as number | undefined
})

const formData = reactive({
	id: undefined as number | undefined,
	type: '',
	label: '',
	value: '',
	sort_order: 0,
	status: 1,
	remark: ''
})

const pagination = reactive({
	page: 1,
	pageSize: 50,
	total: 0
})

const fetchDictTypes = async () => {
	try {
		const res = await getAllDictTypes()
		if (res.state === 2000) {
			dictTypes.value = res.data.data
		}
	} catch {
		console.error('获取字典类型失败')
	}
}

const fetchData = async () => {
	loading.value = true
	try {
		const res = await getDictItemList({
			page: pagination.page,
			pageSize: pagination.pageSize,
			...queryForm
		})
		if (res.state === 2000) {
			tableData.value = res.data.list
			pagination.total = res.data.total
		}
	} catch {
		ElMessage.error('获取字典项列表失败')
	} finally {
		loading.value = false
	}
}

const handleQuery = () => {
	pagination.page = 1
	fetchData()
}

const handleReset = () => {
	queryForm.type = ''
	queryForm.label = ''
	queryForm.status = undefined
	handleQuery()
}

const handleAdd = () => {
	if (!formData.type && dictTypes.value.length > 0) {
		formData.type = dictTypes.value[0].type
	}
	dialogTitle.value = '新增字典项'
	Object.assign(formData, {
		id: undefined,
		type: queryForm.type || dictTypes.value[0]?.type || '',
		label: '',
		value: '',
		sort_order: 0,
		status: 1,
		remark: ''
	})
	dialogVisible.value = true
}

const handleEdit = (row: DictItem) => {
	dialogTitle.value = '编辑字典项'
	Object.assign(formData, {
		id: row.id,
		type: row.type,
		label: row.label,
		value: row.value,
		sort_order: row.sort_order,
		status: row.status,
		remark: row.remark || ''
	})
	dialogVisible.value = true
}

const handleSubmit = async () => {
	if (!formData.type || !formData.label || !formData.value) {
		ElMessage.warning('类型、标签、值不能为空')
		return
	}

	submitting.value = true
	try {
		let res
		if (formData.id) {
			res = await updateDictItem(formData.id, {
				label: formData.label,
				value: formData.value,
				sort_order: formData.sort_order,
				status: formData.status,
				remark: formData.remark
			})
		} else {
			res = await createDictItem({
				type: formData.type,
				label: formData.label,
				value: formData.value,
				sort_order: formData.sort_order,
				status: formData.status,
				remark: formData.remark
			})
		}

		if (res.state === 2000) {
			ElMessage.success('保存成功')
			dialogVisible.value = false
			fetchData()
		} else {
			ElMessage.error(res.message || '保存失败')
		}
	} catch (err: any) {
		ElMessage.error(err.message || '保存失败')
	} finally {
		submitting.value = false
	}
}

const handleDelete = (row: DictItem) => {
	ElMessageBox.confirm(
		`确定要删除字典项「${row.label}」吗？`,
		'确认删除',
		{ type: 'warning' }
	).then(async () => {
		try {
			const res = await deleteDictItem(row.id)
			if (res.state === 2000) {
				ElMessage.success('删除成功')
				fetchData()
			} else {
				ElMessage.error(res.message || '删除失败')
			}
		} catch {
			ElMessage.error('删除失败')
		}
	}).catch(() => {})
}

onMounted(() => {
	fetchDictTypes()
	fetchData()
})
</script>

<style lang="scss" scoped>
.dict-items {
	padding: 16px;
}

.filter-card {
	margin-bottom: 16px;
}

.pagination {
	margin-top: 16px;
	display: flex;
	justify-content: flex-end;
}
</style>
