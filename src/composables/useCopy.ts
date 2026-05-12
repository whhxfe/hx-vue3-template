/**
 * 复制文本组合式函数
 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

export interface CopyResult {
	copied: typeof copied
	copy: (text: string, message?: string) => Promise<boolean>
}

const copied = ref(false)

export const useCopy = (): CopyResult => {
	const copy = async (text: string, message = '复制成功'): Promise<boolean> => {
		// 优先使用现代 Clipboard API
		if (navigator.clipboard && navigator.clipboard.writeText) {
			try {
				await navigator.clipboard.writeText(text)
				copied.value = true
				ElMessage.success(message)
				setTimeout(() => {
					copied.value = false
				}, 2000)
				return true
			} catch (err) {
				// 降级到传统方法
				return fallbackCopy(text, message)
			}
		}
		return fallbackCopy(text, message)
	}

	// 降级方案：使用 textarea + execCommand
	const fallbackCopy = (text: string, message: string): boolean => {
		const textarea = document.createElement('textarea')
		textarea.value = text
		textarea.style.position = 'fixed'
		textarea.style.left = '-9999px'
		textarea.style.top = '-9999px'
		document.body.appendChild(textarea)
		textarea.focus()
		textarea.select()

		try {
			document.execCommand('copy')
			copied.value = true
			ElMessage.success(message)
			setTimeout(() => {
				copied.value = false
			}, 2000)
			return true
		} catch (err) {
			ElMessage.error('复制失败')
			return false
		} finally {
			document.body.removeChild(textarea)
		}
	}

	return {
		copied,
		copy
	}
}

/**
 * 独立的复制状态（多个复制按钮独立使用时）
 */
export const useCopyState = () => {
	const copied = ref(false)

	const copy = async (text: string, message = '复制成功'): Promise<boolean> => {
		try {
			if (navigator.clipboard && navigator.clipboard.writeText) {
				await navigator.clipboard.writeText(text)
			} else {
				const textarea = document.createElement('textarea')
				textarea.value = text
				textarea.style.position = 'fixed'
				textarea.style.left = '-9999px'
				document.body.appendChild(textarea)
				textarea.select()
				document.execCommand('copy')
				document.body.removeChild(textarea)
			}
			copied.value = true
			ElMessage.success(message)
			setTimeout(() => {
				copied.value = false
			}, 2000)
			return true
		} catch {
			ElMessage.error('复制失败')
			return false
		}
	}

	return {
		copied,
		copy
	}
}
