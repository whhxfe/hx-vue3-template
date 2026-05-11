import { ref, computed } from 'vue'
import type { User } from '../api/user.types'

// 模拟用户数据
const mockUsers: User[] = [
	{
		id: 1,
		username: 'admin',
		nickname: '管理员',
		email: 'admin@example.com',
		avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
		phone: '138****8888',
		status: 'active',
		roles: ['admin'],
		createTime: '2024-01-01 10:00:00',
		updateTime: '2024-01-15 14:30:00'
	},
	{
		id: 2,
		username: 'editor',
		nickname: '编辑人员',
		email: 'editor@example.com',
		avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=editor',
		phone: '139****6666',
		status: 'active',
		roles: ['editor'],
		createTime: '2024-02-01 09:00:00',
		updateTime: '2024-02-10 16:00:00'
	},
	{
		id: 3,
		username: 'viewer',
		nickname: '访客用户',
		email: 'viewer@example.com',
		status: 'inactive',
		roles: ['viewer'],
		createTime: '2024-03-01 11:00:00',
		updateTime: '2024-03-05 12:00:00'
	}
]

// 模块状态
const users = ref<User[]>([])
const loading = ref(false)
const currentUser = ref<User | null>(null)

// 计算属性
const activeUsers = computed(() => users.value.filter(u => u.status === 'active'))
const inactiveUsers = computed(() => users.value.filter(u => u.status !== 'active'))

// Actions
const setUsers = (list: User[]) => {
	users.value = list
}

const setLoading = (value: boolean) => {
	loading.value = value
}

const setCurrentUser = (user: User | null) => {
	currentUser.value = user
}

const addUser = (user: User) => {
	users.value.push(user)
}

const updateUserById = (id: string | number, data: Partial<User>) => {
	const index = users.value.findIndex(u => u.id === id)
	if (index !== -1) {
		users.value[index] = { ...users.value[index], ...data }
	}
}

const removeUser = (id: string | number) => {
	const index = users.value.findIndex(u => u.id === id)
	if (index !== -1) {
		users.value.splice(index, 1)
	}
}

// 导出 store
export const useUserStore = () => {
	return {
		users,
		loading,
		currentUser,
		activeUsers,
		inactiveUsers,
		setUsers,
		setLoading,
		setCurrentUser,
		addUser,
		updateUserById,
		removeUser,
		// 模拟初始化数据
		initMockData: () => {
			users.value = [...mockUsers]
		}
	}
}

export type UserStore = ReturnType<typeof useUserStore>
