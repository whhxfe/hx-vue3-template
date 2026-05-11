import { ref, computed } from "vue"
import { useSettingsStore } from "@/store"
import { storeToRefs } from "pinia"

export function useLayout() {
	const settingsStore = useSettingsStore()
	const { preferences } = storeToRefs(settingsStore)

	const currentMode = computed(() => preferences.value.layout)
	const backtopTarget = computed(() => (currentMode.value === "horizontal" ? "#main" : "#target"))

	const showSettings = ref(false)
	const openSettings = () => {
		showSettings.value = true
	}

	return {
		currentMode,
		backtopTarget,
		showSettings,
		openSettings,
	}
}