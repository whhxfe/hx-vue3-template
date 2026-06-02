import dayjs from "dayjs"

function generateShortcuts() {
	const list = [
		{
			text: "近一天",
			days: 1
		},
		{
			text: "近三天",
			days: 3
		},
		{
			text: "近一周",
			days: 7
		},
		{
			text: "近一月",
			days: 30
		},
		{
			text: "近三月",
			days: 90
		},
		{
			text: "近半年",
			days: 180
		},
		{
			text: "近一年",
			days: 365
		}
	]
	return list.map(item => ({
		text: item.text,
		value: () => [
			dayjs().subtract(item.days, "day").startOf("day").toDate(),
			dayjs().subtract(1, "day").endOf("day").toDate()
		]
	}))
	// return list.map((item, index) => {
	// 	return {
	// 		text: item.text,
	// 		value: () => {
	// 			// const end = new Date()
	// 			// end.setDate(end.getDate() - 1)
	// 			// end.setHours(23, 59, 59, 999)
	// 			// const start = new Date()
	// 			// start.setDate(start.getDate() - item.days)
	// 			// start.setHours(0, 0, 0, 0)
	// 			// return [start.valueOf(), end.valueOf()]
	// 			const end = dayjs().subtract(1, "day").endOf("day").toDate()
	// 			const start = dayjs().subtract(item.days, "day").startOf("day").toDate()
	// 			return [start,end]
	// 		}
	// 	}
	// })
}

export const shortcuts = generateShortcuts()
