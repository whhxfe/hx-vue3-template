import { defineStore } from "pinia"
import { ref, watch } from "vue"

export interface UserPreferences {
	theme: string
	layout: string
}

const STORAGE_KEY = "user_preferences"

const defaultPreferences: UserPreferences = {
	theme: "default",
	layout: "vertical"
}

const loadPreferences = (): UserPreferences => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY)
		if (stored) {
			return { ...defaultPreferences, ...JSON.parse(stored) }
		}
	} catch (error) {
		console.error("Failed to load user preferences:", error)
	}
	return { ...defaultPreferences }
}

const useSettingsStore = defineStore("settings", () => {
	const preferences = ref<UserPreferences>(loadPreferences())

	const setTheme = (theme: string) => {
		preferences.value.theme = theme
	}

	const setLayout = (layout: string) => {
		preferences.value.layout = layout
	}

	const resetPreferences = () => {
		preferences.value = { ...defaultPreferences }
	}

	watch(
		preferences,
		(newVal) => {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
			} catch (error) {
				console.error("Failed to save user preferences:", error)
			}
		},
		{ deep: true }
	)

	return {
		preferences,
		setTheme,
		setLayout,
		resetPreferences
	}
})

export default useSettingsStore
