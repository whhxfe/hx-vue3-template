<template>
	<div class="account-list">
		<div class="header">
			<h2>账号管理</h2>
			<div class="actions">
				<el-button type="primary" @click="handleAdd">
					<el-icon><Plus /></el-icon>
					新增账号
				</el-button>
			</div>
		</div>

		<div class="filter-bar">
			<el-input
				v-model="query.username"
				placeholder="搜索账号..."
				clearable
				style="width: 200px"
				@clear="fetchList"
			>
				<template #prefix>
					<el-icon><Search /></el-icon>
				</template>
			</el-input>
			<el-select v-model="query.role_id" placeholder="角色筛选" clearable style="width: 140px" @change="fetchList">
				<el-option label="全部" :value="undefined" />
				<el-option v-for="r in roleOptions" :key="r.id" :label="r.name" :value="r.id" />
			</el-select>
			<el-select v-model="query.status" placeholder="状态筛选" clearable style="width: 120px" @change="fetchList">
				<el-option label="全部" :value="undefined" />
				<el-option label="启用" :value="1" />
				<el-option label="禁用" :value="0" />
			</el-select>
			<el-button @click="fetchList">查询</el-button>
		</div>

		<el-table v-loading="loading" :data="list" border stripe style="width: 100%">
			<el-table-column prop="id" label="ID" width="60" />
			<el-table-column prop="username" label="账号" width="140" />
			<el-table-column prop="display_name" label="显示名称" width="140" />
			<el-table-column prop="email" label="邮箱" width="180" />
			<el-table-column prop="phone" label="手机号" width="130" />
			<el-table-column label="角色" width="120">
				<template #default="{ row }">
					<el-tag>{{ row.role_name || '-' }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="状态" width="80">
				<template #default="{ row }">
					<el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
						{{ row.status === 1 ? '启用' : '禁用' }}
					</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="created_at" label="创建时间" width="170" />
			<el-table-column label="操作" min-width="160" fixed="right">
				<template #default="{ row }">
					<el-button size="small" @click="handleEdit(row)">编辑</el-button>
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

		<!-- 账号表单弹窗 -->
		<el-dialog
			v-model="dialogVisible"
			:title="editingId ? '编辑账号' : '新增账号'"
			width="500px"
			:close-on-click-modal="false"
		>
			<el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
				<el-form-item label="账号" prop="username">
					<el-input v-model="form.username" :disabled="!!editingId" />
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="form.password" type="password" show-password />
				</el-form-item>
				<el-form-item label="显示名称" prop="display_name">
					<el-input v-model="form.display_name" />
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="form.email" />
				</el-form-item>
				<el-form-item label="手机号" prop="phone">
					<el-input v-model="form.phone" />
				</el-form-item>
				<el-form-item label="角色" prop="role_id">
					<el-select v-model="form.role_id" placeholder="请选择角色" style="width: 100%">
						<el-option v-for="r in roleOptions" :key="r.id" :label="r.name" :value="r.id" />
					</el-select>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="submitting" @click="handleSubmit">保存</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { getAccountList, createAccount, updateAccount, deleteAccount } from '../api/account'
import { getRoleList } from '../api/role'
import type { AccountQuery } from '../api/account'

const loading = ref(false)
const list = ref<any[]>([])
const total = ref(0)
const query = ref<AccountQuery>({
	page: 1,
	pageSize: 20
})

const roleOptions = ref<any[]>([])

const dialogVisible = ref(false)
const submitting = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref<any>(null)
const form = ref({
	username: '',
	password: '',
	display_name: '',
	email: '',
	phone: '',
	role_id: undefined as number | undefined,
	status: 1
})

const rules = {
	username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
	display_name: [{ required: true, message: '请输入显示名称', trigger: 'blur' }]
}

async function fetchList() {
	loading.value = true
	try {
		const res = await getAccountList(query.value)
		list.value = res.data.list
		total.value = res.data.total
	} catch (e) {
		ElMessage.error('获取账号列表失败')
	} finally {
		loading.value = false
	}
}

async function fetchRoles() {
	try {
		const res = await getRoleList({ page: 1, pageSize: 999 })
		roleOptions.value = res.data.list
	} catch {
		// ignore
	}
}

function handleAdd() {
	editingId.value = null
	form.value = { username: '', password: '', display_name: '', email: '', phone: '', role_id: undefined, status: 1 }
	dialogVisible.value = true
}

function handleEdit(row: any) {
	editingId.value = row.id
	form.value = {
		username: row.username,
		password: '',
		display_name: row.display_name || '',
		email: row.email || '',
		phone: row.phone || '',
		role_id: row.role_id,
		status: row.status ?? 1
	}
	dialogVisible.value = true
}

async function handleSubmit() {
	const valid = await formRef.value?.validate().catch(() => false)
	if (!valid) return

	submitting.value = true
	try {
		if (editingId.value) {
			const { password, ...rest } = form.value
			const payload = password ? form.value : rest
			await updateAccount(editingId.value, payload)
			ElMessage.success('更新成功')
		} else {
			await createAccount(form.value)
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
		await ElMessageBox.confirm(`确定要删除账号「${row.display_name || row.username}」吗？`, '提示', { type: 'warning' })
		await deleteAccount(row.id)
		ElMessage.success('删除成功')
		await fetchList()
	} catch {
		// 用户取消
	}
}

onMounted(() => {
	fetchRoles()
	fetchList()
})
</script>

<style lang="scss" scoped>
.account-list {
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
	}

	.pagination-wrapper {
		margin-top: 20px;
		display: flex;
		justify-content: flex-end;
	}
}
</style>
