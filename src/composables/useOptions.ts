import { ref, watch, type Ref } from "vue"
import axios from "axios"

export interface OptionItem {
	label: string
	value: string | number
}

const optionsCache = new Map<string, OptionItem[]>()

const pendingRequests = new Map<string, Promise<OptionItem[]>>()

watch(optionsCache, () => {
	console.log("optionsCache", optionsCache)
})

export function useOptions(url: string): {
	options: Ref<OptionItem[]>
	loading: Ref<boolean>
} {
	const options = ref<OptionItem[]>([])
	const loading = ref(false)

	if (optionsCache.has(url)) {
		options.value = optionsCache.get(url)!
		return { options, loading }
	}

	if (pendingRequests.has(url)) {
		pendingRequests.get(url)!.then(data => {
			options.value = data
		})
	}

	const fetchPromise = axios
		.get<{ state?: number; data: OptionItem[] }>(url)
		.then(res => {
			const result = res.data?.data || []

			optionsCache.set(url, result)
			pendingRequests.delete(url)
			return result
		})
		.catch(error => {
			console.error("error", error)
			pendingRequests.delete(url)
			return [] as OptionItem[]
		})

	pendingRequests.set(url, fetchPromise)

	loading.value = true
	fetchPromise.then(data => {
		options.value = data
		loading.value = false
	})
	return {
		options,
		loading
	}
}
