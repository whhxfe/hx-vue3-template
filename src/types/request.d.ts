interface ApiResponse<T = any> {
	state: number
	message: string
	data: T
}

interface ApiResList<T = any> {
	state: number
	message: string
	data: {
		list: T[]
		totalNumbers: number
	}
}

interface PageParams {
	page: number
	limit: number
}
