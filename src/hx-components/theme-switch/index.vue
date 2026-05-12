<template>
	<button
		class="theme-switch"
		:class="{ 'theme-switch--dark': isDark }"
		:aria-label="isDark ? '切换到亮色模式' : '切换到暗色模式'"
		@click="toggleDark"
	>
		<span class="theme-switch__track">
			<span class="theme-switch__thumb">
				<HxIcon
					:key="isDark ? 'moon' : 'sunny'"
					type="iconify"
					:name="isDark ? 'ep:moon' : 'ep:sunny'"
					size="14"
					class="theme-switch__icon"
				/>
			</span>
		</span>
	</button>
</template>

<script setup lang="ts">
import { useTheme } from "@/hooks/useTheme"

const { isDark, toggleDark } = useTheme()
</script>

<style lang="scss" scoped>
// ---- Variables ----
$track-width: 48px;
$track-height: 24px;
$thumb-size: 18px;
$thumb-gap: 3px;

// ---- Theme Switch ----
.theme-switch {
	position: relative;
	display: inline-flex;
	align-items: center;
	border: none;
	padding: 0;
	cursor: pointer;
	outline: none;
	background: transparent;

	// ---- Track ----
	&__track {
		position: relative;
		width: $track-width;
		height: $track-height;
		border-radius: calc($track-height / 2);
		background: rgba(255, 255, 255, 0.2);
		transition: background-color 0.3s ease;
	}

	// ---- Thumb ----
	&__thumb {
		position: absolute;
		top: $thumb-gap;
		left: $thumb-gap;
		width: $thumb-size;
		height: $thumb-size;
		border-radius: 50%;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
			background-color 0.3s ease;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
	}

	// ---- Icon ----
	&__icon {
		color: #1a3c61;
		transition: color 0.3s ease;
	}

	// ---- Hover ----
	&:hover &__track {
		background: rgba(255, 255, 255, 0.3);
	}

	&:hover &__thumb {
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.15),
			0 0 8px rgba(255, 255, 255, 0.4);
	}

	// ---- Focus ----
	&:focus-visible &__track {
		box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
	}

	// ---- Dark Mode ----
	&--dark &__track {
		background: rgba(255, 255, 255, 0.25);
	}

	&--dark &__thumb {
		transform: translateX($track-width - $thumb-size - $thumb-gap * 2);
	}

	&--dark &__icon {
		color: #1a3c61;
	}
}
</style>