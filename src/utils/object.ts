/**
 * 对象操作工具
 */

/**
 * 深拷贝（JSON 方式，简单场景适用）
 */
export const deepClone = <T>(obj: T): T => {
	if (obj === null || typeof obj !== 'object') {
		return obj
	}

	if (obj instanceof Date) {
		return new Date(obj.getTime()) as unknown as T
	}

	if (obj instanceof Array) {
		return obj.map(item => deepClone(item)) as unknown as T
	}

	if (obj instanceof Object) {
		const clonedObj = {} as T
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				clonedObj[key] = deepClone(obj[key])
			}
		}
		return clonedObj
	}

	return obj
}

/**
 * 浅拷贝
 */
export const shallowClone = <T>(obj: T): T => {
	if (obj === null || typeof obj !== 'object') {
		return obj
	}
	if (obj instanceof Array) {
		return [...obj] as unknown as T
	}
	return { ...obj } as T
}

/**
 * 对象合并
 */
export const merge = <T extends object>(target: T, ...sources: Partial<T>[]): T => {
	for (const source of sources) {
		for (const key in source) {
			if (Object.prototype.hasOwnProperty.call(source, key)) {
				const targetValue = target[key]
				const sourceValue = source[key]
				target[key] = isObject(targetValue) && isObject(sourceValue)
					? merge(targetValue as any, sourceValue as any)
					: (sourceValue as any)
			}
		}
	}
	return target
}

/**
 * 判断是否为对象
 */
export const isObject = (value: unknown): value is Record<string, unknown> => {
	return value !== null && typeof value === 'object'
}

/**
 * 对象清空（置空）
 */
export const clearObject = <T extends Record<string, unknown>>(obj: T): T => {
	const keys = Object.keys(obj) as (keyof T)[]
	keys.forEach(key => {
		obj[key] = undefined as T[keyof T]
	})
	return obj
}

/**
 * 从对象中提取指定键
 */
export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
	const result = {} as Pick<T, K>
	keys.forEach(key => {
		if (key in obj) {
			result[key] = obj[key]
		}
	})
	return result
}

/**
 * 从对象中排除指定键
 */
export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
	const result = { ...obj } as Omit<T, K>
	keys.forEach(key => {
		delete result[key]
	})
	return result
}

/**
 * 对象转 URL 查询参数
 */
export const objectToQueryString = (obj: Record<string, unknown>): string => {
	return Object.entries(obj)
		.filter(([_, value]) => value !== null && value !== undefined)
		.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
		.join('&')
}

/**
 * URL 查询参数转对象
 */
export const queryStringToObject = (query: string): Record<string, string> => {
	const params = new URLSearchParams(query)
	const result: Record<string, string> = {}
	params.forEach((value, key) => {
		result[key] = value
	})
	return result
}
