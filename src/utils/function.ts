/**
 * 函数工具
 */

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
	fn: T,
	delay = 300
): ((...args: Parameters<T>) => void) => {
	let timer: ReturnType<typeof setTimeout> | null = null

	return (...args: Parameters<T>) => {
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(() => {
			fn(...args)
			timer = null
		}, delay)
	}
}

/**
 * 节流函数（定时器版本，最后一次不一定会执行）
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
	fn: T,
	delay = 300
): ((...args: Parameters<T>) => void) => {
	let last = 0
	let timer: ReturnType<typeof setTimeout> | null = null

	return (...args: Parameters<T>) => {
		const now = Date.now()

		if (now - last >= delay) {
			last = now
			fn(...args)
		} else {
			if (timer) clearTimeout(timer)
			timer = setTimeout(() => {
				last = Date.now()
				fn(...args)
			}, delay - (now - last))
		}
	}
}

/**
 * 延迟执行
 */
export const delay = (ms: number): Promise<void> => {
	return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * sleep 函数别名
 */
export const sleep = delay

/**
 * 只执行一次
 */
export const once = <T extends (...args: unknown[]) => unknown>(
	fn: T
): ((...args: Parameters<T>) => ReturnType<T> | undefined) => {
	let called = false
	let result: ReturnType<T>

	return (...args: Parameters<T>) => {
		if (!called) {
			called = true
			result = fn(...args) as ReturnType<T>
			return result
		}
		return result
	}
}

/**
 * 立即执行，后续调用返回 undefined
 */
export const memoize = <T extends (...args: unknown[]) => unknown>(
	fn: T
): T => {
	const cache = new Map<string, ReturnType<T>>()

	return ((...args: Parameters<T>) => {
		const key = JSON.stringify(args)
		if (cache.has(key)) {
			return cache.get(key)
		}
		const result = fn(...args) as ReturnType<T>
		cache.set(key, result)
		return result
	}) as T
}

/**
 * 重试函数
 */
export const retry = async <T>(
	fn: () => Promise<T>,
	options: {
		retries?: number
		delay?: number
		onRetry?: (error: Error, attempt: number) => void
	} = {}
): Promise<T> => {
	const { retries = 3, delay: delayMs = 1000, onRetry } = options
	let lastError: Error

	for (let i = 0; i <= retries; i++) {
		try {
			return await fn()
		} catch (e) {
			lastError = e as Error
			if (i < retries) {
				onRetry?.(lastError, i + 1)
				await delay(delayMs)
			}
		}
	}

	throw lastError!
}
