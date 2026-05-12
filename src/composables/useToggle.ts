/**
 * 开关状态组合式函数
 */
import { ref, computed } from 'vue'

export interface ToggleResult {
	value: typeof toggleValue
	active: ReturnType<typeof computed>
	inactive: ReturnType<typeof computed>
	toggle: () => void
	set: (val: boolean) => void
	on: () => void
	off: () => void
	reset: () => void
}

const toggleValue = ref(false)

export const useToggle = (initialValue = false): ToggleResult => {
	toggleValue.value = initialValue

	const active = computed(() => toggleValue.value)
	const inactive = computed(() => !toggleValue.value)

	const toggle = () => {
		toggleValue.value = !toggleValue.value
	}

	const set = (val: boolean) => {
		toggleValue.value = val
	}

	const on = () => {
		toggleValue.value = true
	}

	const off = () => {
		toggleValue.value = false
	}

	const reset = () => {
		toggleValue.value = initialValue
	}

	return {
		value: toggleValue,
		active,
		inactive,
		toggle,
		set,
		on,
		off,
		reset
	}
}

/**
 * 独立的开关状态（多个开关独立使用时）
 */
export const useToggleState = (initialValue = false) => {
	const value = ref(initialValue)

	const active = computed(() => value.value)
	const inactive = computed(() => !value.value)

	const toggle = () => {
		value.value = !value.value
	}

	const set = (val: boolean) => {
		value.value = val
	}

	const on = () => {
		value.value = true
	}

	const off = () => {
		value.value = false
	}

	const reset = () => {
		value.value = initialValue
	}

	return {
		value,
		active,
		inactive,
		toggle,
		set,
		on,
		off,
		reset
	}
}
