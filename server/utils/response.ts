/**
 * 统一 API 响应体工具
 *
 * 状态码约定:
 *   2000 - 成功
 *   6000 - 失败（业务错误）
 *   10000 - token 过期
 *
 * 后续可扩展新状态码，需兼容现有定义
 */

/** 成功响应 */
export function success<T = any>(data?: T, message = "操作成功") {
	return { state: 2000, message, data }
}

/** 失败响应（业务错误） */
export function fail(message = "请求失败") {
	return { state: 6000, message }
}

/** token 过期响应 */
export function tokenExpired(message = "token 已失效") {
	return { state: 10000, message }
}

/** 分页列表响应：将 list/total/page/pageSize 包装到 data 中 */
export function pagedList<T = any>(list: T[], total: number, page: number, pageSize: number) {
	return {
		state: 2000,
		message: "获取成功",
		data: { list, total, page, pageSize }
	}
}