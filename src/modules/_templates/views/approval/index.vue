<template>
	<div class="approval-list">
		<div class="header">
			<h2>审批流程</h2>
			<el-button type="primary" @click="handleApply">
				<el-icon><Plus /></el-icon>
				提交申请
			</el-button>
		</div>

		<div class="filter-bar">
			<el-tabs v-model="activeTab" @tab-change="handleTabChange">
				<el-tab-pane label="全部" name="all" />
				<el-tab-pane :label="`待审批(${pendingCount})`" name="pending" />
				<el-tab-pane :label="`已通过(${approvedCount})`" name="approved" />
				<el-tab-pane :label="`已驳回(${rejectedCount})`" name="rejected" />
			</el-tabs>
		</div>

		<div v-loading="loading" class="content">
			<el-empty v-if="!filteredList.length && !loading" description="暂无数据" />
			<div v-else class="approval-cards">
				<el-card
					v-for="item in filteredList"
					:key="item.id"
					class="approval-card"
					:class="`status-${item.status}`"
				>
					<template #header>
						<div class="card-header">
							<div class="title-row">
								<span class="title">{{ item.title }}</span>
								<el-tag :type="getStatusType(item.status)" size="small">
									{{ getStatusText(item.status) }}
								</el-tag>
							</div>
						</div>
					</template>

					<div class="card-body">
						<div class="info-row">
							<span class="label">申请人：</span>
							<span class="value">{{ item.applicant }}</span>
						</div>
						<div class="info-row">
							<span class="label">部门：</span>
							<span class="value">{{ item.department }}</span>
						</div>
						<div class="info-row">
							<span class="label">类型：</span>
							<el-tag size="small">{{ getTypeText(item.type) }}</el-tag>
						</div>
						<div v-if="item.days" class="info-row">
							<span class="label">天数：</span>
							<span class="value">{{ item.days }}天</span>
						</div>
						<div v-if="item.amount" class="info-row">
							<span class="label">金额：</span>
							<span class="value">¥{{ item.amount.toLocaleString() }}</span>
						</div>
						<div v-if="item.remark" class="info-row">
							<span class="label">备注：</span>
							<span class="value">{{ item.remark }}</span>
						</div>
						<div class="info-row">
							<span class="label">申请时间：</span>
							<span class="value">{{ item.createTime }}</span>
						</div>
					</div>

					<!-- 审批历史时间线 -->
					<div v-if="item.history?.length" class="history-section">
						<div class="history-title">审批历史</div>
						<el-timeline>
							<el-timeline-item
								v-for="(h, index) in item.history"
								:key="index"
								:color="getHistoryColor(h.action)"
							>
								<div class="history-item">
									<span class="operator">{{ h.operator }}</span>
									<span class="action" :class="`action-${h.action}`">
										{{ getActionText(h.action) }}
									</span>
									<span class="time">{{ h.time }}</span>
								</div>
								<div v-if="h.comment" class="comment">{{ h.comment }}</div>
							</el-timeline-item>
						</el-timeline>
					</div>

					<template #footer>
						<div class="card-footer">
							<template v-if="item.status === 'pending'">
								<el-button type="success" @click="handleApprove(item)">
									<el-icon><Check /></el-icon>
									通过
								</el-button>
								<el-button type="danger" plain @click="handleReject(item)">
									<el-icon><Close /></el-icon>
									驳回
								</el-button>
							</template>
							<el-button text @click="handleViewDetail(item)">
								查看详情
							</el-button>
						</div>
					</template>
				</el-card>
			</div>
		</div>

		<!-- 申请表单弹窗 -->
		<el-dialog v-model="applyDialogVisible" title="提交申请" width="500px">
			<el-form ref="applyFormRef" :model="applyForm" :rules="applyRules" label-width="100px">
				<el-form-item label="申请标题" prop="title">
					<el-input v-model="applyForm.title" placeholder="请输入申请标题" />
				</el-form-item>
				<el-form-item label="申请类型" prop="type">
					<el-select v-model="applyForm.type" placeholder="请选择类型" style="width: 100%">
						<el-option label="请假申请" value="leave" />
						<el-option label="加班申请" value="overtime" />
						<el-option label="报销申请" value="reimburse" />
						<el-option label="采购申请" value="purchase" />
					</el-select>
				</el-form-item>
				<el-form-item v-if="applyForm.type === 'leave' || applyForm.type === 'overtime'" label="天数" prop="days">
					<el-input-number v-model="applyForm.days" :min="1" :max="30" />
				</el-form-item>
				<el-form-item v-if="applyForm.type === 'reimburse' || applyForm.type === 'purchase'" label="金额" prop="amount">
					<el-input-number v-model="applyForm.amount" :min="0" :precision="2" />
				</el-form-item>
				<el-form-item label="备注说明">
					<el-input v-model="applyForm.remark" type="textarea" :rows="3" placeholder="请输入备注说明" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="applyDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="handleSubmitApply">提交</el-button>
			</template>
		</el-dialog>

		<!-- 审批意见弹窗 -->
		<el-dialog v-model="commentDialogVisible" :title="commentDialogType === 'approve' ? '通过审批' : '驳回申请'" width="400px">
			<el-form :model="commentForm" label-width="80px">
				<el-form-item label="审批意见">
					<el-input v-model="commentForm.comment" type="textarea" :rows="3" placeholder="请输入审批意见（选填）" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="commentDialogVisible = false">取消</el-button>
				<el-button :type="commentDialogType === 'approve' ? 'success' : 'danger'" @click="handleConfirmAction">
					确认{{ commentDialogType === 'approve' ? '通过' : '驳回' }}
				</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Check, Close } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useApprovalStore } from '../../store/approval'
import type { ApprovalItem } from '../../api/approval/types'

const {
	approvalList,
	loading,
	pendingList,
	approvedList,
	rejectedList,
	initMockData,
	addItem,
	updateItemStatus
} = useApprovalStore()

const activeTab = ref('all')
const applyDialogVisible = ref(false)
const commentDialogVisible = ref(false)
const commentDialogType = ref<'approve' | 'reject'>('approve')
const currentApprovalItem = ref<ApprovalItem | null>(null)
const applyFormRef = ref<FormInstance>()

const applyForm = ref({
	title: '',
	type: 'leave' as ApprovalItem['type'],
	days: 1,
	amount: 0,
	remark: ''
})

const commentForm = ref({
	comment: ''
})

const applyRules: FormRules = {
	title: [{ required: true, message: '请输入申请标题', trigger: 'blur' }],
	type: [{ required: true, message: '请选择申请类型', trigger: 'change' }],
	days: [{ required: true, message: '请输入天数', trigger: 'blur' }]
}

const pendingCount = computed(() => pendingList.value.length)
const approvedCount = computed(() => approvedList.value.length)
const rejectedCount = computed(() => rejectedList.value.length)

const filteredList = computed(() => {
	switch (activeTab.value) {
		case 'pending':
			return pendingList.value
		case 'approved':
			return approvedList.value
		case 'rejected':
			return rejectedList.value
		default:
			return approvalList.value
	}
})

const getStatusType = (status: ApprovalItem['status']) => {
	const typeMap = {
		pending: 'warning',
		approved: 'success',
		rejected: 'danger'
	}
	return typeMap[status]
}

const getStatusText = (status: ApprovalItem['status']) => {
	const textMap = {
		pending: '待审批',
		approved: '已通过',
		rejected: '已驳回'
	}
	return textMap[status]
}

const getTypeText = (type: ApprovalItem['type']) => {
	const textMap = {
		leave: '请假',
		overtime: '加班',
		reimburse: '报销',
		purchase: '采购'
	}
	return textMap[type]
}

const getHistoryColor = (action: ApprovalItem['history'][0]['action']) => {
	const colorMap = {
		submit: '#409eff',
		approve: '#67c23a',
		reject: '#f56c6c'
	}
	return colorMap[action]
}

const getActionText = (action: ApprovalItem['history'][0]['action']) => {
	const textMap = {
		submit: '提交申请',
		approve: '审批通过',
		reject: '审批驳回'
	}
	return textMap[action]
}

const handleTabChange = () => {
	// tab 切换逻辑
}

const handleApply = () => {
	applyForm.value = {
		title: '',
		type: 'leave',
		days: 1,
		amount: 0,
		remark: ''
	}
	applyDialogVisible.value = true
}

const handleSubmitApply = async () => {
	if (!applyFormRef.value) return

	await applyFormRef.value.validate(valid => {
		if (valid) {
			const typeText = getTypeText(applyForm.value.type)
			const titleSuffix = applyForm.value.type === 'leave' || applyForm.value.type === 'overtime'
				? `- ${applyForm.value.days}天`
				: `- ¥${applyForm.value.amount.toLocaleString()}`

			const newItem: ApprovalItem = {
				id: Date.now(),
				title: `${typeText}${titleSuffix}`,
				applicant: '当前用户',
				department: '技术部',
				type: applyForm.value.type,
				days: applyForm.value.type === 'leave' || applyForm.value.type === 'overtime' ? applyForm.value.days : undefined,
				amount: applyForm.value.type === 'reimburse' || applyForm.value.type === 'purchase' ? applyForm.value.amount : undefined,
				status: 'pending',
				createTime: new Date().toLocaleString(),
				updateTime: new Date().toLocaleString(),
				remark: applyForm.value.remark,
				history: [
					{ operator: '当前用户', action: 'submit', time: new Date().toLocaleString(), comment: '提交申请' }
				]
			}
			addItem(newItem)
			applyDialogVisible.value = false
			ElMessage.success('提交成功')
		}
	})
}

const handleApprove = (item: ApprovalItem) => {
	currentApprovalItem.value = item
	commentDialogType.value = 'approve'
	commentForm.value.comment = ''
	commentDialogVisible.value = true
}

const handleReject = (item: ApprovalItem) => {
	currentApprovalItem.value = item
	commentDialogType.value = 'reject'
	commentForm.value.comment = ''
	commentDialogVisible.value = true
}

const handleConfirmAction = () => {
	if (!currentApprovalItem.value) return

	const newStatus = commentDialogType.value === 'approve' ? 'approved' : 'rejected'
	updateItemStatus(currentApprovalItem.value.id, newStatus, commentForm.value.comment || undefined)

	ElMessage.success(commentDialogType.value === 'approve' ? '已通过' : '已驳回')
	commentDialogVisible.value = false
}

const handleViewDetail = (item: ApprovalItem) => {
	ElMessage.info(`查看详情: ${item.title}`)
}

onMounted(() => {
	initMockData()
})
</script>

<style lang="scss" scoped>
.approval-list {
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
		margin-bottom: 20px;
		background: #fff;
		padding: 16px 20px;
		border-radius: 8px;
	}

	.content {
		background: #fff;
		border-radius: 8px;
		padding: 20px;
		min-height: 400px;
	}

	.approval-cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
		gap: 16px;
	}

	.approval-card {
		&.status-pending {
			border-left: 3px solid #e6a23c;
		}

		&.status-approved {
			border-left: 3px solid #67c23a;
		}

		&.status-rejected {
			border-left: 3px solid #f56c6c;
		}

		.card-header {
			.title-row {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.title {
					font-weight: 600;
					font-size: 15px;
				}
			}
		}

		.card-body {
			.info-row {
				display: flex;
				padding: 6px 0;
				font-size: 14px;

				.label {
					color: #909399;
					width: 80px;
					flex-shrink: 0;
				}

				.value {
					color: #303133;
				}
			}
		}

		.history-section {
			margin-top: 16px;
			padding-top: 16px;
			border-top: 1px solid #ebeef5;

			.history-title {
				font-size: 13px;
				color: #909399;
				margin-bottom: 12px;
			}

			.history-item {
				font-size: 13px;
				line-height: 1.5;

				.operator {
					color: #303133;
				}

				.action {
					margin: 0 6px;

					&.action-submit {
						color: #409eff;
					}

					&.action-approve {
						color: #67c23a;
					}

					&.action-reject {
						color: #f56c6c;
					}
				}

				.time {
					color: #909399;
					font-size: 12px;
				}
			}

			.comment {
				margin-top: 4px;
				font-size: 12px;
				color: #606266;
				padding: 4px 8px;
				background: #f5f7fa;
				border-radius: 4px;
			}
		}

		.card-footer {
			display: flex;
			justify-content: flex-end;
			gap: 8px;
		}
	}
}
</style>
