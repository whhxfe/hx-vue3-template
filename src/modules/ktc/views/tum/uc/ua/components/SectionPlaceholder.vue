<template>
	<div class="section-placeholder">
		<HxIcon type="iconify" name="ep:document" class="placeholder-icon" />
		<span>{{ title }}内容待实现</span>
	</div>
</template>

<script setup lang="ts">
import { HxIcon } from "@whhx/ui"

defineOptions({ name: "SectionPlaceholder" })

defineProps<{
	title: string
}>()
</script>

<style lang="scss" scoped>
.section-placeholder {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	min-height: 80px;
	color: var(--el-text-color-placeholder);
	gap: 8px;

	.placeholder-icon {
		font-size: 32px;
		opacity: 0.4;
	}
}
</style>
