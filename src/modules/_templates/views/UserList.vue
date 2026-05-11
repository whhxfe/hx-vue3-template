<template>
	<div class="user-list">
		<div class="header">
			<h2>用户列表</h2>
			<div class="actions">
				<el-button type="primary" @click="handleAdd">
					<el-icon><Plus /></el-icon>
					新增用户
				</el-button>
			</div>
		</div>

		<div class="filter-bar">
			<el-input
				v-model="searchKeyword"
				placeholder="搜索用户名、昵称、邮箱..."
				clearable
				style="width: 240px"
				@clear="handleSearch"
			>
				<template #prefix>
					<el-icon><Search /></el-icon>
				</template>
			</el-input>
			<el-select v-model="filterStatus" placeholder="状态筛选" clearable style="width: 120px">
				<el-option label="全部" value="" />
				<el-option label="启用" value="active" />
				<el-option label="禁用" value="inactive" />
				<el-option label="封禁" value="banned" />
			</el-select>
		</div>

		<div v-loading="loading" class="content">
			<el-empty v-if="!filteredUsers.length && !loading" description="暂无数据" />
			<div v-else class="user-grid">
				<UserCard
					v-for="user in filteredUsers"
					:key="user.id"
					:user="user"
					@edit="handleEdit"
					@delete="handleDelete"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { getUserList, deleteUser } from '../api'
import { useUserStore } from '../store/user'
import UserCard from '../components/UserCard.vue'
import type { User } from '../api/user.types'

const router = useRouter()

const userStore = useUserStore()
const { users, loading, initMockData, removeUser } = userStore

const searchKeyword = ref('')
const filterStatus = ref<User['status'] | ''>('')

const filteredUsers = computed(() => {
	let result = users.value

	if (searchKeyword.value) {
		const keyword = searchKeyword.value.toLowerCase()
		result = result.filter(
			u =>
				u.username.toLowerCase().includes(keyword) ||
				u.nickname.toLowerCase().includes(keyword) ||
				u.email.toLowerCase().includes(keyword)
		)
	}

	if (filterStatus.value) {
		result = result.filter(u => u.status === filterStatus.value)
	}

	return result
})

const handleSearch = () => {
	// 实际项目中这里会调用 API
}

const handleAdd = () => {
	ElMessage.info('点击了新增用户')
}

const handleEdit = (user: User) => {
	router.push(`/templates/user-detail/${user.id}`)
}

const handleDelete = async (user: User) => {
	try {
		await ElMessageBox.confirm(`确定要删除用户「${user.nickname}」吗？`, '提示', {
			type: 'warning'
		})
		// await deleteUser(user.id)
		removeUser(user.id)
		ElMessage.success('删除成功')
	} catch {
		// 用户取消
	}
}

onMounted(() => {
	// 初始化模拟数据
	initMockData()
})
</script>

<style lang="scss" scoped>
.user-list {
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

	.content {
		min-height: 300px;
	}

	.user-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 16px;
	}
}
</style>
