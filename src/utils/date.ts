/**
 * 日期处理工具
 */
import dayjs from 'dayjs'

/**
 * 格式化日期
 */
export const formatDate = (date: dayjs.ConfigType, format = 'YYYY-MM-DD') => {
	return dayjs(date).format(format)
}

/**
 * 格式化日期时间
 */
export const formatDateTime = (date: dayjs.ConfigType) => {
	return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

/**
 * 格式化时间（仅时分秒）
 */
export const formatTime = (date: dayjs.ConfigType) => {
	return dayjs(date).format('HH:mm:ss')
}

/**
 * 格式化相对时间
 */
export const formatRelativeTime = (date: dayjs.ConfigType) => {
	const now = dayjs()
	const target = dayjs(date)
	const diffMs = now.valueOf() - target.valueOf()
	const diffSeconds = Math.floor(diffMs / 1000)
	const diffMinutes = Math.floor(diffSeconds / 60)
	const diffHours = Math.floor(diffMinutes / 60)
	const diffDays = Math.floor(diffHours / 24)

	if (diffSeconds < 60) return '刚刚'
	if (diffMinutes < 60) return `${diffMinutes}分钟前`
	if (diffHours < 24) return `${diffHours}小时前`
	if (diffDays < 7) return `${diffDays}天前`

	return formatDate(date)
}

/**
 * 获取日期范围（今天/昨天/近N天）
 */
export const getDateRangeByDays = (days: number): [number, number] => {
	const end = dayjs().endOf('day').valueOf()
	const start = dayjs().subtract(days, 'day').startOf('day').valueOf()
	return [start, end]
}

/**
 * 获取本月日期范围
 */
export const getCurrentMonthRange = (): [number, number] => {
	const start = dayjs().startOf('month').valueOf()
	const end = dayjs().endOf('month').valueOf()
	return [start, end]
}

/**
 * 获取指定月份的日期范围
 */
export const getMonthRange = (date: dayjs.ConfigType): [number, number] => {
	const d = dayjs(date)
	const start = d.startOf('month').valueOf()
	const end = d.endOf('month').valueOf()
	return [start, end]
}

/**
 * 判断是否为同一天
 */
export const isSameDay = (date1: dayjs.ConfigType, date2: dayjs.ConfigType) => {
	return dayjs(date1).isSame(dayjs(date2), 'day')
}

/**
 * 判断是否为今天
 */
export const isToday = (date: dayjs.ConfigType) => {
	return dayjs(date).isSame(dayjs(), 'day')
}
