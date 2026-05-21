<template>
	<div class="notice-list">
		<el-card class="filter-card">
			<el-form :inline="true" :model="queryForm">
				<el-form-item label="标题">
					<el-input v-model="queryForm.title" placeholder="请输入标题" clearable />
				</el-form-item>
				<el-form-item label="类型">
					<el-select v-model="queryForm.type" placeholder="请选择类型" clearable style="width: 120px">
						<el-option label="通知" value="info" />
						<el-option label="公告" value="warning" />
						<el-option label="动态" value="success" />
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="queryForm.status" placeholder="请选择状态" clearable style="width: 120px">
						<el-option label="全部" :value="undefined" />
						<el-option label="已发布" :value="1" />
						<el-option label="未发布" :value="0" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleQuery">查询</el-button>
					<el-button @click="handleReset">重置</el-button>
					<el-button type="primary" @click="handleAdd">新增公告</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<el-card>
			<el-table :data="tableData" v-loading="loading" stripe>
				<el-table-column prop="id" label="ID" width="80" />
				<el-table-column prop="title" label="标题" min-width="250" show-overflow-tooltip>
					<template #default="{ row }">
						<div class="title-cell">
							<el-tag v-if="row.is_top" type="danger" size="small" effect="plain">置顶</el-tag>
							<span>{{ row.title }}</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="type" label="类型" width="100">
					<template #default="{ row }">
						<el-tag :type="getTypeColor(row.type)" size="small">
							{{ getTypeLabel(row.type) }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="priority" label="优先级" width="100">
					<template #default="{ row }">
						<el-tag :type="getPriorityColor(row.priority)" size="small">
							{{ getPriorityLabel(row.priority) }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态" width="100">
					<template #default="{ row }">
						<el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
							{{ row.status === 1 ? '已发布' : '草稿' }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="author" label="作者" width="100" />
				<el-table-column prop="views" label="浏览" width="80" />
				<el-table-column prop="created_at" label="创建时间" width="180" />
				<el-table-column label="操作" width="200" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
						<el-button
							v-if="row.status === 0"
							type="success"
							link
							@click="handlePublish(row)"
						>
							发布
						</el-button>
						<el-button
							v-else
							type="warning"
							link
							@click="handleUnpublish(row)"
						>
							撤回
						</el-button>
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
		<el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
			<el-form :model="formData" label-width="100px" class="notice-form">
				<el-form-item label="标题" prop="title">
					<el-input v-model="formData.title" placeholder="请输入公告标题" />
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-select v-model="formData.type" style="width: 150px">
						<el-option label="通知" value="info" />
						<el-option label="公告" value="warning" />
						<el-option label="动态" value="success" />
					</el-select>
				</el-form-item>
				<el-form-item label="优先级" prop="priority">
					<el-select v-model="formData.priority" style="width: 150px">
						<el-option label="普通" value="normal" />
						<el-option label="重要" value="important" />
						<el-option label="紧急" value="urgent" />
					</el-select>
				</el-form-item>
				<el-form-item label="置顶" prop="is_top">
					<el-switch v-model="formData.is_top" :active-value="1" :inactive-value="0" />
				</el-form-item>
				<el-form-item label="内容" prop="content">
					<el-input
						v-model="formData.content"
						type="textarea"
						:rows="8"
						placeholder="请输入公告内容"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button @click="handleSaveDraft">保存草稿</el-button>
				<el-button type="primary" @click="handleSubmit" :loading="submitting">
					保存并发布
				</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
	getNoticeList,
	createNotice,
	updateNotice,
	deleteNotice,
	publishNotice,
	unpublishNotice,
	type Notice
} from '../api'

const loading = ref(false)
const tableData = ref<Notice[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增公告')
const submitting = ref(false)

const queryForm = reactive({
	title: '',
	type: '',
	status: undefined as number | undefined
})

const formData = reactive({
	id: undefined as number | undefined,
	title: '',
	content: '',
	type: 'info',
	priority: 'normal',
	is_top: 0,
	status: 0,
	author: '管理员'
})

const pagination = reactive({
	page: 1,
	pageSize: 20,
	total: 0
})

const getTypeColor = (type: string) => {
	const map: Record<string, string> = {
		info: 'primary',
		warning: 'warning',
		success: 'success'
	}
	return map[type] || 'info'
}

const getTypeLabel = (type: string) => {
	const map: Record<string, string> = {
		info: '通知',
		warning: '公告',
		success: '动态'
	}
	return map[type] || '通知'
}

const getPriorityColor = (priority: string) => {
	const map: Record<string, string> = {
		normal: 'info',
		important: 'warning',
		urgent: 'danger'
	}
	return map[priority] || 'info'
}

const getPriorityLabel = (priority: string) => {
	const map: Record<string, string> = {
		normal: '普通',
		important: '重要',
		urgent: '紧急'
	}
	return map[priority] || '普通'
}

const fetchData = async () => {
	loading.value = true
	try {
		const res = await getNoticeList({
			page: pagination.page,
			pageSize: pagination.pageSize,
			...queryForm
		})
		if (res.state === 2000) {
			tableData.value = res.data.list
			pagination.total = res.data.total
		}
	} catch {
		ElMessage.error('获取公告列表失败')
	} finally {
		loading.value = false
	}
}

const handleQuery = () => {
	pagination.page = 1
	fetchData()
}

const handleReset = () => {
	queryForm.title = ''
	queryForm.type = ''
	queryForm.status = undefined
	handleQuery()
}

const handleAdd = () => {
	dialogTitle.value = '新增公告'
	Object.assign(formData, {
		id: undefined,
		title: '',
		content: '',
		type: 'info',
		priority: 'normal',
		is_top: 0,
		status: 0,
		author: '管理员'
	})
	dialogVisible.value = true
}

const handleEdit = (row: Notice) => {
	dialogTitle.value = '编辑公告'
	Object.assign(formData, {
		id: row.id,
		title: row.title,
		content: row.content,
		type: row.type,
		priority: row.priority,
		is_top: row.is_top,
		status: row.status,
		author: row.author
	})
	dialogVisible.value = true
}

const handleSubmit = async () => {
	if (!formData.title || !formData.content) {
		ElMessage.warning('标题和内容不能为空')
		return
	}

	submitting.value = true
	try {
		let res
		const data = {
			...formData,
			status: 1
		}

		if (formData.id) {
			res = await updateNotice(formData.id, data)
		} else {
			res = await createNotice(data)
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

const handleSaveDraft = async () => {
	if (!formData.title) {
		ElMessage.warning('标题不能为空')
		return
	}

	submitting.value = true
	try {
		let res

		if (formData.id) {
			res = await updateNotice(formData.id, { ...formData, status: 0 })
		} else {
			res = await createNotice({ ...formData, status: 0 })
		}

		if (res.state === 2000) {
			ElMessage.success('草稿保存成功')
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

const handlePublish = async (row: Notice) => {
	try {
		const res = await publishNotice(row.id)
		if (res.state === 2000) {
			ElMessage.success('发布成功')
			fetchData()
		} else {
			ElMessage.error(res.message || '发布失败')
		}
	} catch {
		ElMessage.error('发布失败')
	}
}

const handleUnpublish = async (row: Notice) => {
	try {
		const res = await unpublishNotice(row.id)
		if (res.state === 2000) {
			ElMessage.success('撤回成功')
			fetchData()
		} else {
			ElMessage.error(res.message || '撤回失败')
		}
	} catch {
		ElMessage.error('撤回失败')
	}
}

const handleDelete = (row: Notice) => {
	ElMessageBox.confirm(
		`确定要删除公告「${row.title}」吗？`,
		'确认删除',
		{ type: 'warning' }
	).then(async () => {
		try {
			const res = await deleteNotice(row.id)
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
	fetchData()
})
</script>

<style lang="scss" scoped>
.notice-list {
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

.title-cell {
	display: flex;
	align-items: center;
	gap: 8px;
}

.notice-form {
	.el-input,
	.el-select {
		width: 100%;
	}
}
</style>
