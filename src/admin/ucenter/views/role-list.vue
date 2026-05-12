<template>
	<div class="role-list">
		<div class="header">
			<h2>角色管理</h2>
			<div class="actions">
				<el-button type="primary" @click="handleAdd">
					<el-icon><Plus /></el-icon>
					新增角色
				</el-button>
			</div>
		</div>

		<el-table v-loading="loading" :data="list" border stripe style="width: 100%">
			<el-table-column prop="id" label="ID" width="60" />
			<el-table-column prop="name" label="角色名称" width="160" />
			<el-table-column prop="code" label="角色编码" width="140" />
			<el-table-column prop="sort_order" label="排序" width="70" />
			<el-table-column prop="description" label="描述" min-width="200" />
			<el-table-column prop="created_at" label="创建时间" width="170" />
			<el-table-column label="操作" width="260" fixed="right">
				<template #default="{ row }">
					<el-button size="small" @click="handleEdit(row)">编辑</el-button>
					<el-button size="small" @click="handlePermission(row)">权限分配</el-button>
					<el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="pagination-wrapper">
			<el-pagination
				v-model:current-page="query.page"
				v-model:page-size="query.pageSize"
				:total="total"
				:page-sizes="[10, 20, 50]"
				layout="total, sizes, prev, pager, next"
				@change="fetchList"
			/>
		</div>

		<!-- 角色表单弹窗 -->
		<el-dialog
			v-model="dialogVisible"
			:title="editingId ? '编辑角色' : '新增角色'"
			width="500px"
			:close-on-click-modal="false"
		>
			<el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="form.name" />
				</el-form-item>
				<el-form-item label="角色编码" prop="code">
					<el-input v-model="form.code" :disabled="!!editingId" />
				</el-form-item>
				<el-form-item label="排序" prop="sort_order">
					<el-input-number v-model="form.sort_order" :min="0" />
				</el-form-item>
				<el-form-item label="描述" prop="description">
					<el-input v-model="form.description" type="textarea" :rows="3" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
			</template>
		</el-dialog>

		<!-- 权限分配弹窗 -->
		<el-dialog
			v-model="permDialogVisible"
			title="权限分配"
			width="500px"
			:close-on-click-modal="false"
		>
			<div v-loading="permLoading" class="perm-tree">
				<el-checkbox
					v-model="checkAll"
					:indeterminate="isIndeterminate"
					@change="handleCheckAllChange"
				>
					全选/取消
				</el-checkbox>
				<el-divider />
				<el-checkbox-group v-model="checkedModules" class="perm-group">
					<el-checkbox v-for="m in allModules" :key="m.key" :label="m.key" :value="m.key">
						{{ m.name || m.key }}
					</el-checkbox>
				</el-checkbox-group>
			</div>
			<template #footer>
				<el-button @click="permDialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="permSubmitting" @click="handlePermSubmit">保存</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getRoleList, createRole, updateRole, deleteRole, getRoleMenus, updateRoleMenus, getAllModules } from '../api/role'

const loading = ref(false)
const list = ref<any[]>([])
const total = ref(0)
const query = ref({ page: 1, pageSize: 20 })

const dialogVisible = ref(false)
const submitting = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<any>(null)
const form = ref({
	name: '',
	code: '',
	sort_order: 0,
	description: ''
})

const rules = {
	name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
	code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }]
}

// 权限分配
const permDialogVisible = ref(false)
const permLoading = ref(false)
const permSubmitting = ref(false)
const permRoleId = ref<number | null>(null)
const allModules = ref<any[]>([])
const checkedModules = ref<string[]>([])

const checkAll = computed(() => allModules.value.length > 0 && checkedModules.value.length === allModules.value.length)
const isIndeterminate = computed(() => {
	const len = checkedModules.value.length
	return len > 0 && len < allModules.value.length
})

function handleCheckAllChange(val: boolean) {
	checkedModules.value = val ? allModules.value.map(m => m.key) : []
}

async function fetchList() {
	loading.value = true
	try {
		const res = await getRoleList(query.value)
		list.value = res.data.list
		total.value = res.data.total
	} catch {
		ElMessage.error('获取角色列表失败')
	} finally {
		loading.value = false
	}
}

function handleAdd() {
	editingId.value = null
	form.value = { name: '', code: '', sort_order: 0, description: '' }
	dialogVisible.value = true
}

function handleEdit(row: any) {
	editingId.value = row.id
	form.value = {
		name: row.name,
		code: row.code,
		sort_order: row.sort_order ?? 0,
		description: row.description || ''
	}
	dialogVisible.value = true
}

async function handleSubmit() {
	const valid = await formRef.value?.validate().catch(() => false)
	if (!valid) return

	submitting.value = true
	try {
		if (editingId.value) {
			await updateRole(editingId.value, form.value)
			ElMessage.success('更新成功')
		} else {
			await createRole(form.value)
			ElMessage.success('创建成功')
		}
		dialogVisible.value = false
		await fetchList()
	} catch {
		ElMessage.error('操作失败')
	} finally {
		submitting.value = false
	}
}

async function handleDelete(row: any) {
	try {
		await ElMessageBox.confirm(`确定要删除角色「${row.name}」吗？`, '提示', { type: 'warning' })
		await deleteRole(row.id)
		ElMessage.success('删除成功')
		await fetchList()
	} catch {
		// 用户取消
	}
}

async function handlePermission(row: any) {
	permRoleId.value = row.id
	permDialogVisible.value = true
	permLoading.value = true
	try {
		const [modulesRes, menusRes] = await Promise.all([
			getAllModules(),
			getRoleMenus(row.id)
		])
		allModules.value = modulesRes.data
		checkedModules.value = menusRes.data
	} catch {
		ElMessage.error('获取权限数据失败')
	} finally {
		permLoading.value = false
	}
}

async function handlePermSubmit() {
	if (!permRoleId.value) return
	permSubmitting.value = true
	try {
		await updateRoleMenus(permRoleId.value, checkedModules.value)
		ElMessage.success('权限分配成功')
		permDialogVisible.value = false
	} catch {
		ElMessage.error('权限分配失败')
	} finally {
		permSubmitting.value = false
	}
}

onMounted(() => {
	fetchList()
})
</script>

<style lang="scss" scoped>
.role-list {
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

	.pagination-wrapper {
		margin-top: 20px;
		display: flex;
		justify-content: flex-end;
	}
}

.perm-tree {
	padding: 0 10px;
}

.perm-group {
	display: flex;
	flex-direction: column;
	gap: 12px;
}
</style>
