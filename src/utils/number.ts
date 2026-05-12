/**
 * 数字格式化工具
 */

/**
 * 格式化货币（人民币）
 */
export const formatCurrency = (value: number, decimals = 2) => {
	if (value === null || value === undefined || isNaN(value)) {
		return '¥0.00'
	}
	return new Intl.NumberFormat('zh-CN', {
		style: 'currency',
		currency: 'CNY',
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	}).format(value)
}

/**
 * 格式化千分位数字
 */
export const formatThousands = (value: number, decimals = 0) => {
	if (value === null || value === undefined || isNaN(value)) {
		return '0'
	}
	return new Intl.NumberFormat('zh-CN', {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals
	}).format(value)
}

/**
 * 格式化百分比
 */
export const formatPercent = (value: number, decimals = 1) => {
	if (value === null || value === undefined || isNaN(value)) {
		return '0%'
	}
	return `${(value * 100).toFixed(decimals)}%`
}

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return '0 B'
	if (!bytes) return '-'

	const k = 1024
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * 保留小数位（四舍五入）
 */
export const round = (value: number, decimals = 2) => {
	return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

/**
 * 补零
 */
export const padZero = (num: number, length = 2) => {
	return String(num).padStart(length, '0')
}
