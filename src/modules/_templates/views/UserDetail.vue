<template>
	<div class="user-detail">
		<el-page-header @back="handleBack">
			<template #title>
				<el-button text>
					<el-icon><ArrowLeft /></el-icon>
					返回
				</el-button>
			</template>
			<template #content>
				<span class="title">用户详情</span>
			</template>
		</el-page-header>

		<div v-loading="loading" class="detail-content">
			<el-card v-if="user" class="user-info-card">
				<template #header>
					<div class="card-header">
						<span>基本信息</span>
						<el-button type="primary" text @click="handleEdit">
							<el-icon><Edit /></el-icon>
							编辑
						</el-button>
					</div>
				</template>

				<el-descriptions :column="2" border>
					<el-descriptions-item label="用户名">
						{{ user.username }}
					</el-descriptions-item>
					<el-descriptions-item label="昵称">
						{{ user.nickname }}
					</el-descriptions-item>
					<el-descriptions-item label="邮箱">
						{{ user.email }}
					</el-descriptions-item>
					<el-descriptions-item label="手机号">
						{{ user.phone || '-' }}
					</el-descriptions-item>
					<el-descriptions-item label="状态">
						<el-tag :type="getStatusType(user.status)">
							{{ getStatusText(user.status) }}
						</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="角色">
						<el-tag v-for="role in user.roles" :key="role" size="small" style="margin-right: 4px">
							{{ role }}
						</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="创建时间">
						{{ user.createTime }}
					</el-descriptions-item>
					<el-descriptions-item label="更新时间">
						{{ user.updateTime }}
					</el-descriptions-item>
				</el-descriptions>
			</el-card>

			<el-empty v-else description="用户不存在" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Edit } from '@element-plus/icons-vue'
import { getUserById } from '../api'
import type { User } from '../api/user.types'

const route = useRoute()
const router = useRouter()

const user = ref<User | null>(null)
const loading = ref(false)

const getStatusType = (status: User['status']) => {
	const typeMap = {
		active: 'success',
		inactive: 'warning',
		banned: 'danger'
	}
	return typeMap[status]
}

const getStatusText = (status: User['status']) => {
	const textMap = {
		active: '启用',
		inactive: '禁用',
		banned: '封禁'
	}
	return textMap[status]
}

const handleBack = () => {
	router.back()
}

const handleEdit = () => {
	// 编辑逻辑
}

const fetchUserDetail = async () => {
	const id = route.params.id as string
	if (!id) return

	loading.value = true
	try {
		// 实际项目中调用 API
		// user.value = await getUserById(id)

		// 模拟数据
		user.value = {
			id: Number(id),
			username: 'admin',
			nickname: '管理员',
			email: 'admin@example.com',
			avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
			phone: '138****8888',
			status: 'active',
			roles: ['admin', 'editor'],
			createTime: '2024-01-01 10:00:00',
			updateTime: '2024-01-15 14:30:00'
		}
	} finally {
		loading.value = false
	}
}

onMounted(() => {
	fetchUserDetail()
})
</script>

<style lang="scss" scoped>
.user-detail {
	padding: 20px;

	.title {
		font-size: 16px;
		font-weight: 500;
	}

	.detail-content {
		margin-top: 20px;
	}

	.user-info-card {
		max-width: 800px;

		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
}
</style>
