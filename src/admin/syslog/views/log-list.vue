<template>
	<div class="log-list">
		<!-- 统计卡片 -->
		<el-row :gutter="16" class="stats-row">
			<el-col :span="6">
				<el-card shadow="hover" class="stat-card">
					<div class="stat-value">{{ stats.total }}</div>
					<div class="stat-label">总日志数</div>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card shadow="hover" class="stat-card">
					<div class="stat-value">{{ stats.todayTotal }}</div>
					<div class="stat-label">今日日志</div>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card shadow="hover" class="stat-card">
					<div class="hot-actions">
						<span class="stat-label">热门操作：</span>
						<el-tag
							v-for="item in stats.hotActions.slice(0, 5)"
							:key="item.action"
							size="small"
							style="margin-right: 8px"
						>
							{{ item.action }} ({{ item.count }})
						</el-tag>
					</div>
				</el-card>
			</el-col>
		</el-row>

		<!-- 筛选表单 -->
		<el-card class="filter-card">
			<el-form :inline="true" :model="queryForm">
				<el-form-item label="用户名">
					<el-input v-model="queryForm.username" placeholder="请输入用户名" clearable />
				</el-form-item>
				<el-form-item label="操作">
					<el-input v-model="queryForm.action" placeholder="请输入操作描述" clearable />
				</el-form-item>
				<el-form-item label="路径">
					<el-input v-model="queryForm.path" placeholder="请输入路径" clearable />
				</el-form-item>
				<el-form-item label="时间范围">
					<el-date-picker
						v-model="dateRange"
						type="daterange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						value-format="YYYY-MM-DD"
						@change="handleDateChange"
					/>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleQuery">查询</el-button>
					<el-button @click="handleReset">重置</el-button>
				</el-form-item>
			</el-form>
		</el-card>

		<!-- 日志列表 -->
		<el-card>
			<el-table :data="tableData" v-loading="loading" stripe>
				<el-table-column prop="id" label="ID" width="80" />
				<el-table-column prop="username" label="用户名" width="120" />
				<el-table-column prop="action" label="操作" min-width="150" />
				<el-table-column prop="method" label="方法" width="80">
					<template #default="{ row }">
						<el-tag :type="getMethodType(row.method)" size="small">
							{{ row.method }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="path" label="路径" min-width="200" show-overflow-tooltip />
				<el-table-column prop="ip" label="IP地址" width="140" />
				<el-table-column prop="status_code" label="状态" width="80">
					<template #default="{ row }">
						<el-tag :type="row.status_code >= 400 ? 'danger' : 'success'" size="small">
							{{ row.status_code }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="duration" label="耗时(ms)" width="100" />
				<el-table-column prop="created_at" label="时间" width="180" />
				<el-table-column label="操作" width="80" fixed="right">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleViewDetail(row)">详情</el-button>
					</template>
				</el-table-column>
			</el-table>

			<div class="pagination">
				<el-pagination
					v-model:current-page="pagination.page"
					v-model:page-size="pagination.pageSize"
					:total="pagination.total"
					:page-sizes="[10, 20, 50, 100]"
					layout="total, sizes, prev, pager, next, jumper"
					@size-change="fetchData"
					@current-change="fetchData"
				/>
			</div>
		</el-card>

		<!-- 详情弹窗 -->
		<el-dialog v-model="detailVisible" title="日志详情" width="700px">
			<el-descriptions :column="2" border v-if="currentLog">
				<el-descriptions-item label="ID">{{ currentLog.id }}</el-descriptions-item>
				<el-descriptions-item label="用户名">{{ currentLog.username }}</el-descriptions-item>
				<el-descriptions-item label="操作">{{ currentLog.action }}</el-descriptions-item>
				<el-descriptions-item label="方法">{{ currentLog.method }}</el-descriptions-item>
				<el-descriptions-item label="路径" :span="2">{{ currentLog.path }}</el-descriptions-item>
				<el-descriptions-item label="IP地址">{{ currentLog.ip }}</el-descriptions-item>
				<el-descriptions-item label="状态码">{{ currentLog.status_code }}</el-descriptions-item>
				<el-descriptions-item label="耗时">{{ currentLog.duration }} ms</el-descriptions-item>
				<el-descriptions-item label="时间">{{ currentLog.created_at }}</el-descriptions-item>
				<el-descriptions-item label="User-Agent" :span="2">
					<div class="user-agent">{{ currentLog.user_agent }}</div>
				</el-descriptions-item>
				<el-descriptions-item v-if="currentLog.error_message" label="错误信息" :span="2">
					<el-alert type="error" :closable="false">{{ currentLog.error_message }}</el-alert>
				</el-descriptions-item>
				<el-descriptions-item v-if="currentLog.request_body" label="请求体" :span="2">
					<pre class="json-content">{{ formatJson(currentLog.request_body) }}</pre>
				</el-descriptions-item>
			</el-descriptions>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getLogList, getLogStats, type OperationLog, type LogStats } from '../api'

const loading = ref(false)
const tableData = ref<OperationLog[]>([])
const detailVisible = ref(false)
const currentLog = ref<OperationLog | null>(null)

const stats = reactive<LogStats>({
	total: 0,
	todayTotal: 0,
	weekStats: [],
	hotActions: []
})

const queryForm = reactive({
	username: '',
	action: '',
	path: ''
})

const dateRange = ref<string[]>([])

const pagination = reactive({
	page: 1,
	pageSize: 20,
	total: 0
})

const fetchData = async () => {
	loading.value = true
	try {
		const res = await getLogList({
			page: pagination.page,
			pageSize: pagination.pageSize,
			...queryForm,
			start_date: dateRange.value?.[0],
			end_date: dateRange.value?.[1]
		})
		if (res.state === 2000) {
			tableData.value = res.data.list
			pagination.total = res.data.total
		}
	} catch (err) {
		ElMessage.error('获取日志列表失败')
	} finally {
		loading.value = false
	}
}

const fetchStats = async () => {
	try {
		const res = await getLogStats()
		if (res.state === 2000) {
			Object.assign(stats, res.data.data)
		}
	} catch (err) {
		console.error('获取统计数据失败', err)
	}
}

const handleQuery = () => {
	pagination.page = 1
	fetchData()
}

const handleReset = () => {
	queryForm.username = ''
	queryForm.action = ''
	queryForm.path = ''
	dateRange.value = []
	handleQuery()
}

const handleDateChange = () => {
	handleQuery()
}

const handleViewDetail = (row: OperationLog) => {
	currentLog.value = row
	detailVisible.value = true
}

const getMethodType = (method: string) => {
	const map: Record<string, any> = {
		GET: '',
		POST: 'success',
		PUT: 'warning',
		DELETE: 'danger',
		PATCH: 'info'
	}
	return map[method] || ''
}

const formatJson = (str: string) => {
	try {
		return JSON.stringify(JSON.parse(str), null, 2)
	} catch {
		return str
	}
}

onMounted(() => {
	fetchData()
	fetchStats()
})
</script>

<style lang="scss" scoped>
.log-list {
	padding: 16px;
}

.stats-row {
	margin-bottom: 16px;
}

.stat-card {
	text-align: center;

	.stat-value {
		font-size: 28px;
		font-weight: 700;
		color: var(--el-color-primary);
	}

	.stat-label {
		font-size: 14px;
		color: var(--el-text-color-secondary);
		margin-top: 8px;
	}
}

.hot-actions {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 8px;
}

.filter-card {
	margin-bottom: 16px;
}

.pagination {
	margin-top: 16px;
	display: flex;
	justify-content: flex-end;
}

.user-agent {
	font-size: 12px;
	word-break: break-all;
}

.json-content {
	background: var(--el-fill-color-light);
	padding: 8px;
	border-radius: 4px;
	font-size: 12px;
	max-height: 200px;
	overflow: auto;
	white-space: pre-wrap;
	word-break: break-all;
}
</style>
