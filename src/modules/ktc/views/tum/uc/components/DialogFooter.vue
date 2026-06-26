<template>
	<div class="dialog-footer">
		<el-button @click="$emit('cancel')">{{ cancelText }}</el-button>
		<el-button type="primary" :loading="loading" @click="$emit('confirm')">
			{{ confirmText }}
		</el-button>
	</div>
</template>

<script setup lang="ts">
defineOptions({ name: "DialogFooter" })

withDefaults(
	defineProps<{
		loading?: boolean
		confirmText?: string
		cancelText?: string
	}>(),
	{
		loading: false,
		confirmText: "确定",
		cancelText: "取消"
	}
)

defineEmits<{
	cancel: []
	confirm: []
}>()
</script>

<style lang="scss" scoped>
.dialog-footer {
	display: flex;
	justify-content: flex-end;
	gap: 8px;
}
</style>