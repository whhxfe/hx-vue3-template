export const handleNumber = (num: number) => {
	if (num > 100000000) {
		num = Number((num / 100000000).toFixed(1))
		return num + "亿"
	} else if (num > 10000) {
		num = Number((num / 10000).toFixed(1))
		return num + "万"
	} else {
		return num
	}
}
