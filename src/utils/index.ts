import dayjs from "dayjs"
/**
 * 获取文件类型
 */
export function getFileType(extension: string) {
	let _extension = typeof extension == "string" ? extension.toLowerCase() : ""
	if (!extension) return

	const fileTypes = [
		{ extension: "txt", type: "document" },
		{ extension: "doc", type: "document" },
		{ extension: "docx", type: "document" },
		{ extension: "xls", type: "document" },
		{ extension: "xlsx", type: "document" },
		{ extension: "pdf", type: "document" },
		{ extension: "ppt", type: "document" },
		{ extension: "pptx", type: "document" },

		{ extension: "png", type: "image" },
		{ extension: "jpg", type: "image" },
		{ extension: "jpeg", type: "image" },
		{ extension: "webp", type: "image" },
		{ extension: "gif", type: "image" },
		{ extension: "bmp", type: "image" },
		{ extension: "svg", type: "image" },
		{ extension: "tif", type: "image" },
		{ extension: "tiff", type: "image" },

		{ extension: "mp3", type: "audio" },
		{ extension: "wav", type: "audio" },
		{ extension: "ogg", type: "audio" },
		// { extension: "aac", type: "audio" },
		// { extension: "flag", type: "audio" },

		{ extension: "mp4", type: "video" },
		{ extension: "webm", type: "video" },
		{ extension: "flv", type: "video" }, // 使用 flv.js 插件可以实现播放flv视频
		// { extension: "avi", type: "video" },
		// { extension: "mkv", type: "video" },
		// { extension: "wmv", type: "video" },

		{ extension: "zip", type: "archive" },
		{ extension: "rar", type: "archive" },
		{ extension: "tar", type: "archive" },
		{ extension: "gz", type: "archive" },
		{ extension: "7z", type: "archive" },
		{ extension: "eml", type: "email" }
	]

	const matchedType = fileTypes.find(item => item.extension == _extension)

	return matchedType ? matchedType.type : "other"
}

/**
 * 文本关键字匹配高亮
 */
export function highlightText(text: string, keywords: string[], className: string = "text-red"): string {
	if (!text || !keywords.length) return text

	let result = text

	const validKeywords = Array.from(new Set(keywords.filter(key => key.trim())))

	validKeywords.forEach(keyword => {
		const trimedKey = keyword.trim()
		if (!trimedKey) return

		const escapedKey = trimedKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

		const reg = new RegExp(escapedKey, "g")
		result = result.replace(reg, `<span class="${className}" >${trimedKey}</span>`)
	})

	return result
}

/**
 * 文本数字高亮匹配
 * @param text
 * @param className
 * @param includeDecimal
 * @returns
 */
export function highlightTextNumbers(
	text: string,
	className: string = "text-red",
	includeDecimal: boolean = true
): string {
	if (!text || typeof text !== "string") return text

	const reg = includeDecimal ? /\d+(\.\d+)?/g : /\d+/g

	let result = text
	return result.replace(reg, match => {
		return `<span class="${className}" >${match}</span>`
	})

	return result
}

/**
 * 生成日期时间范围
 * @param days number
 * @returns
 */
export function generateDatetimerangeByDays(days: number) {
	const end = dayjs().subtract(1, "day").endOf("day").valueOf()
	const start = dayjs().subtract(days, "day").startOf("day").valueOf()
	return [start, end]
}
