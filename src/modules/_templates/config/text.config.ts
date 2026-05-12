import { ref } from 'vue'
import textA from './text/text.a'
import textB from './text/text.b'
import type { TextConfig } from './text/types'

const textConfigMap: Record<string, TextConfig> = {
	'a': textA,
	'b': textB
}

const currentAlias = ref<string>('b')

/**
 * 获取当前文本配置
 */
export const useTextAlias = (): TextConfig => {
	return textConfigMap[currentAlias.value] ?? textB
}

/**
 * 设置文本配置别名
 */
export const setTextAlias = (alias: string) => {
	currentAlias.value = alias
}

/**
 * 获取当前别名
 */
export const getCurrentAlias = () => currentAlias.value
