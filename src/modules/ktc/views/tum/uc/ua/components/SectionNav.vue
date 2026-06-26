<template>
	<div class="ua-nav">
		<div class="nav-title">板块导航</div>
		<div class="nav-list">
			<div
				v-for="section in sections"
				:key="section.key"
				class="nav-item"
				:class="{
					active: activeSection === section.key,
					'nav-item--child': section.level === 2
				}"
				@click="$emit('navigate', section.key)"
			>
				<span class="nav-dot" />
				<span class="nav-text">{{ section.title }}</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
defineOptions({ name: "SectionNav" })

defineProps<{
	sections: { key: string; title: string; level?: number }[]
	activeSection: string
}>()

defineEmits<{
	navigate: [key: string]
}>()
</script>

<style lang="scss" scoped>
.ua-nav {
	width: 180px;
	flex-shrink: 0;
	background: var(--el-bg-color);
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
	padding: 16px 0;
	position: sticky;
	top: 0px;
	height: fit-content;
	max-height: calc(100vh - 120px);
	overflow-y: auto;

	.nav-title {
		padding: 0 20px 12px;
		font-size: 14px;
		font-weight: 600;
		color: var(--el-text-color-primary);
		border-bottom: 1px solid var(--el-border-color-lighter);
		margin-bottom: 8px;
	}

	.nav-list {
		display: flex;
		flex-direction: column;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 20px;
		cursor: pointer;
		transition: all 0.2s;
		position: relative;

		&:hover {
			background: var(--el-fill-color-light);
		}

		&.active {
			background: var(--el-color-primary-light-9);

			.nav-dot {
				background: var(--el-color-primary);
				transform: scale(1.2);
			}

			.nav-text {
				color: var(--el-color-primary);
				font-weight: 500;
			}

			&::before {
				content: "";
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 3px;
				height: 20px;
				background: var(--el-color-primary);
				border-radius: 0 2px 2px 0;
			}
		}

		&--child {
			padding-left: 36px;

			.nav-dot {
				width: 5px;
				height: 5px;
				background: var(--el-text-color-placeholder);
			}

			.nav-text {
				font-size: 12px;
				color: var(--el-text-color-secondary);
			}

			&.active {
				.nav-dot {
					background: var(--el-color-primary);
				}

				.nav-text {
					color: var(--el-color-primary);
				}
			}
		}

		.nav-dot {
			width: 6px;
			height: 6px;
			border-radius: 50%;
			background: var(--el-border-color);
			flex-shrink: 0;
			transition: all 0.2s;
		}

		.nav-text {
			font-size: 13px;
			color: var(--el-text-color-regular);
			transition: all 0.2s;
			white-space: nowrap;
		}
	}
}
</style>
