/**
 * 日期范围选择快捷配置
 */
export const dateRangeShortcuts = [
	{
		text: "近一周",
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 7 * 24 * 3600 * 1000)
			return [start, end]
		}
	},
	{
		text: "近一月",
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 30 * 24 * 3600 * 1000)
			return [start, end]
		}
	},
	{
		text: "近三月",
		value: () => {
			const end = new Date()
			const start = new Date()
			start.setTime(start.getTime() - 90 * 24 * 3600 * 1000)
			return [start, end]
		}
	}
]