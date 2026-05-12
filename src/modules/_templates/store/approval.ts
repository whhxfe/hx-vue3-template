import { ref, computed } from 'vue'
import type { ApprovalItem, ApprovalHistory } from '../api/approval/types'

// 模拟数据
const mockApprovalList: ApprovalItem[] = [
	{
		id: 1,
		title: '年假申请 - 5天',
		applicant: '张三',
		department: '技术部',
		type: 'leave',
		days: 5,
		status: 'pending',
		createTime: '2024-04-10 09:30:00',
		updateTime: '2024-04-10 09:30:00',
		remark: '请批准',
		history: [
			{ operator: '张三', action: 'submit', time: '2024-04-10 09:30:00', comment: '提交申请' }
		]
	},
	{
		id: 2,
		title: '加班申请 - 3天',
		applicant: '李四',
		department: '产品部',
		type: 'overtime',
		days: 3,
		status: 'approved',
		createTime: '2024-04-08 14:20:00',
		updateTime: '2024-04-09 10:00:00',
		remark: '项目赶进度',
		history: [
			{ operator: '李四', action: 'submit', time: '2024-04-08 14:20:00' },
			{ operator: '王经理', action: 'approve', time: '2024-04-09 10:00:00', comment: '同意加班' }
		]
	},
	{
		id: 3,
		title: '差旅报销 - ¥3500',
		applicant: '赵五',
		department: '市场部',
		type: 'reimburse',
		amount: 3500,
		status: 'rejected',
		createTime: '2024-04-05 11:00:00',
		updateTime: '2024-04-07 16:30:00',
		remark: '北京出差',
		history: [
			{ operator: '赵五', action: 'submit', time: '2024-04-05 11:00:00' },
			{ operator: '财务', action: 'reject', time: '2024-04-07 16:30:00', comment: '发票不合规' }
		]
	},
	{
		id: 4,
		title: '采购办公设备',
		applicant: '孙六',
		department: '行政部',
		type: 'purchase',
		amount: 12000,
		status: 'pending',
		createTime: '2024-04-11 10:15:00',
		updateTime: '2024-04-11 10:15:00',
		remark: '采购新电脑'
	}
]

// 模块状态
const approvalList = ref<ApprovalItem[]>([])
const loading = ref(false)
const total = ref(0)

// 计算属性
const pendingList = computed(() => approvalList.value.filter(item => item.status === 'pending'))
const approvedList = computed(() => approvalList.value.filter(item => item.status === 'approved'))
const rejectedList = computed(() => approvalList.value.filter(item => item.status === 'rejected'))

// Actions
const setApprovalList = (list: ApprovalItem[]) => {
	approvalList.value = list
}

const setLoading = (value: boolean) => {
	loading.value = value
}

const setTotal = (value: number) => {
	total.value = value
}

const addItem = (item: ApprovalItem) => {
	approvalList.value.unshift(item)
	total.value++
}

const updateItemStatus = (id: number, status: ApprovalItem['status'], comment?: string) => {
	const index = approvalList.value.findIndex(item => item.id === id)
	if (index !== -1) {
		const operator = status === 'approved' ? '审批人' : '审批人'
		approvalList.value[index] = {
			...approvalList.value[index],
			status,
			updateTime: new Date().toLocaleString(),
			history: [
				...(approvalList.value[index].history || []),
				{ operator, action: status, time: new Date().toLocaleString(), comment }
			]
		}
	}
}

const removeItem = (id: number) => {
	const index = approvalList.value.findIndex(item => item.id === id)
	if (index !== -1) {
		approvalList.value.splice(index, 1)
		total.value--
	}
}

// 导出 store
export const useApprovalStore = () => {
	return {
		approvalList,
		loading,
		total,
		pendingList,
		approvedList,
		rejectedList,
		setApprovalList,
		setLoading,
		setTotal,
		addItem,
		updateItemStatus,
		removeItem,
		// 模拟初始化数据
		initMockData: () => {
			approvalList.value = [...mockApprovalList]
			total.value = mockApprovalList.length
		}
	}
}

export type ApprovalStore = ReturnType<typeof useApprovalStore>
