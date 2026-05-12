/**
 * 通用请求组合式函数
 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/api/request'

export interface RequestOptions<T> {
	immediate?: boolean
	defaultValue?: T
	successMessage?: string
	errorMessage?: string
	onSuccess?: (data: T) => void
	onError?: (error: Error) => void
}

export interface RequestResult<T> {
	data: typeof requestData
	loading: typeof requestLoading
	error: typeof requestError
	execute: (...args: unknown[]) => Promise<T | undefined>
	reset: () => void
}

const requestData = ref<unknown>(null)
const requestLoading = ref(false)
const requestError = ref<Error | null>(null)

export const useRequest = <T = unknown>(
	api: (...args: unknown[]) => Promise<API.Response<T>>,
	options: RequestOptions<T> = {}
): RequestResult<T> => {
	const {
		immediate = false,
		defaultValue,
		successMessage,
		errorMessage = '请求失败',
		onSuccess,
		onError
	} = options

	if (defaultValue !== undefined) {
		requestData.value = defaultValue
	}

	const execute = async (...args: unknown[]): Promise<T | undefined> => {
		requestLoading.value = true
		requestError.value = null

		try {
			const res = await api(...args)
			if (res.code === 200 || res.code === 0) {
				requestData.value = res.data
				successMessage && ElMessage.success(successMessage)
				onSuccess?.(res.data)
				return res.data
			} else {
				const error = new Error(res.message || errorMessage)
				requestError.value = error
				ElMessage.error(res.message || errorMessage)
				onError?.(error)
			}
		} catch (e) {
			const error = e instanceof Error ? e : new Error(String(e))
			requestError.value = error
			ElMessage.error(error.message || errorMessage)
			onError?.(error)
		} finally {
			requestLoading.value = false
		}
	}

	const reset = () => {
		requestData.value = defaultValue ?? null
		requestError.value = null
	}

	if (immediate) {
		execute()
	}

	return {
		data: requestData as typeof requestData,
		loading: requestLoading,
		error: requestError,
		execute,
		reset
	}
}

/**
 * 独立的请求状态（多个请求独立使用时）
 */
export const useRequestState = <T = unknown>() => {
	const data = ref<T | null>(null)
	const loading = ref(false)
	const error = ref<Error | null>(null)

	const execute = async (
		api: () => Promise<API.Response<T>>,
		options: { successMessage?: string; errorMessage?: string } = {}
	): Promise<T | null> => {
		const { successMessage, errorMessage = '请求失败' } = options

		loading.value = true
		error.value = null

		try {
			const res = await api()
			if (res.code === 200 || res.code === 0) {
				data.value = res.data
				successMessage && ElMessage.success(successMessage)
				return res.data
			} else {
				const err = new Error(res.message || errorMessage)
				error.value = err
				ElMessage.error(res.message || errorMessage)
			}
		} catch (e) {
			const err = e instanceof Error ? e : new Error(String(e))
			error.value = err
			ElMessage.error(err.message || errorMessage)
		} finally {
			loading.value = false
		}

		return null
	}

	const reset = () => {
		data.value = null
		error.value = null
	}

	return {
		data,
		loading,
		error,
		execute,
		reset
	}
}
