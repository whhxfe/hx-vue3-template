export const getDataTimestamps = (num: number) => {
	const now = Date.now()
	const end = now - num * 24 * 60 * 60 * 1000
	return [end, now]
}
export const getMonthTimestamps = (num: number) => {
	const now = new Date()
	const end = new Date()
	end.setMonth(now.getMonth() - num)
	return [end.getTime(), now.getTime()]
}
