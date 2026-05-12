/**
 * 系统级常量
 */

// 业务状态
export const STATUS = {
	ENABLED: 1,
	DISABLED: 0,
	PENDING: 2,
	REJECTED: 3,
	APPROVED: 4
} as const

// 订单状态
export const ORDER_STATUS = {
	PENDING: 1,
	PROCESSING: 2,
	COMPLETED: 3,
	CANCELLED: 4,
	REFUNDED: 5
} as const

// API 响应状态码
export const RESPONSE_CODE = {
	SUCCESS: 200,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	SERVER_ERROR: 500
} as const
