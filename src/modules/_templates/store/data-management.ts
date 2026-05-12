import { ref, computed } from 'vue'
import type { DataItem, DataFormData } from '../api/data-management/types'

// 模拟数据
const mockDataList: DataItem[] = [
	{
		id: 1,
		name: '数据源A',
		code: 'DS_A',
		category: '数据源',
		status: 'active',
		createTime: '2024-01-15 10:30:00',
		updateTime: '2024-03-20 14:20:00',
		description: '主数据源配置'
	},
	{
		id: 2,
		name: '数据源B',
		code: 'DS_B',
		category: '数据源',
		status: 'active',
		createTime: '2024-02-10 09:00:00',
		updateTime: '2024-02-28 16:45:00',
		description: '备用数据源'
	},
	{
		id: 3,
		name: '配置项X',
		code: 'CFG_X',
		category: '配置项',
		status: 'inactive',
		createTime: '2024-03-05 11:15:00',
		updateTime: '2024-03-25 10:00:00',
		description: '系统配置参数'
	},
	{
		id: 4,
		name: '配置项Y',
		code: 'CFG_Y',
		category: '配置项',
		status: 'active',
		createTime: '2024-03-12 08:30:00',
		updateTime: '2024-04-01 17:00:00',
		description: '业务配置参数'
	},
	{
		id: 5,
		name: '规则模板1',
		code: 'RULE_001',
		category: '规则模板',
		status: 'active',
		createTime: '2024-04-01 14:00:00',
		updateTime: '2024-04-15 09:30:00',
		description: '数据校验规则'
	}
]

// 模块状态
const dataList = ref<DataItem[]>([])
const loading = ref(false)
const total = ref(0)

// 计算属性
const activeDataList = computed(() => dataList.value.filter(item => item.status === 'active'))
const inactiveDataList = computed(() => dataList.value.filter(item => item.status === 'inactive'))

// Actions
const setDataList = (list: DataItem[]) => {
	dataList.value = list
}

const setLoading = (value: boolean) => {
	loading.value = value
}

const setTotal = (value: number) => {
	total.value = value
}

const addItem = (item: DataItem) => {
	dataList.value.unshift(item)
	total.value++
}

const updateItem = (id: number, data: Partial<DataItem>) => {
	const index = dataList.value.findIndex(item => item.id === id)
	if (index !== -1) {
		dataList.value[index] = { ...dataList.value[index], ...data }
	}
}

const updateItemStatus = (id: number, status: 'active' | 'inactive') => {
	updateItem(id, { status })
}

const removeItem = (id: number) => {
	const index = dataList.value.findIndex(item => item.id === id)
	if (index !== -1) {
		dataList.value.splice(index, 1)
		total.value--
	}
}

// 导出 store
export const useDataManagementStore = () => {
	return {
		dataList,
		loading,
		total,
		activeDataList,
		inactiveDataList,
		setDataList,
		setLoading,
		setTotal,
		addItem,
		updateItem,
		updateItemStatus,
		removeItem,
		// 模拟初始化数据
		initMockData: () => {
			dataList.value = [...mockDataList]
			total.value = mockDataList.length
		}
	}
}

export type DataManagementStore = ReturnType<typeof useDataManagementStore>
