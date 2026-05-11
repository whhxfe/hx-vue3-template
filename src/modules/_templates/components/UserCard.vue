<template>
	<div class="user-card" @click="handleClick">
		<div class="card-header">
			<el-avatar :size="48" :src="user.avatar">
				{{ user.nickname.charAt(0) }}
			</el-avatar>
			<div class="user-info">
				<div class="nickname">{{ user.nickname }}</div>
				<div class="username">@{{ user.username }}</div>
			</div>
			<el-tag :type="statusType" size="small">{{ statusText }}</el-tag>
		</div>

		<div class="card-body">
			<div class="info-item">
				<el-icon><Message /></el-icon>
				<span>{{ user.email }}</span>
			</div>
			<div v-if="user.phone" class="info-item">
				<el-icon><Phone /></el-icon>
				<span>{{ user.phone }}</span>
			</div>
			<div class="info-item">
				<el-icon><Clock /></el-icon>
				<span>{{ user.createTime }}</span>
			</div>
		</div>

		<div class="card-footer">
			<el-button size="small" @click.stop="handleEdit">
				<el-icon><Edit /></el-icon>
				编辑
			</el-button>
			<el-button type="danger" size="small" plain @click.stop="handleDelete">
				<el-icon><Delete /></el-icon>
				删除
			</el-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Message, Phone, Clock, Edit, Delete } from '@element-plus/icons-vue'
import type { User } from '../api/user.types'

const props = defineProps<{
	user: User
}>()

const emit = defineEmits<{
	edit: [user: User]
	delete: [user: User]
}>()

const statusType = computed(() => {
	const typeMap: Record<User['status'], string> = {
		active: 'success',
		inactive: 'warning',
		banned: 'danger'
	}
	return typeMap[props.user.status]
})

const statusText = computed(() => {
	const textMap: Record<User['status'], string> = {
		active: '启用',
		inactive: '禁用',
		banned: '封禁'
	}
	return textMap[props.user.status]
})

const handleClick = () => {
	// 跳转详情
}

const handleEdit = () => {
	emit('edit', props.user)
}

const handleDelete = () => {
	emit('delete', props.user)
}
</script>

<style lang="scss" scoped>
.user-card {
	background: #fff;
	border-radius: 8px;
	padding: 16px;
	cursor: pointer;
	transition: all 0.3s;

	&:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 16px;

		.user-info {
			flex: 1;

			.nickname {
				font-weight: 600;
				font-size: 16px;
			}

			.username {
				color: #999;
				font-size: 13px;
			}
		}
	}

	.card-body {
		.info-item {
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 6px 0;
			color: #666;
			font-size: 14px;

			.el-icon {
				color: #999;
			}
		}
	}

	.card-footer {
		display: flex;
		justify-content: flex-end;
		gap: 8px;
		margin-top: 12px;
		padding-top: 12px;
		border-top: 1px solid #f0f0f0;
	}
}
</style>
