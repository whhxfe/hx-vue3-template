/**
 * 正则表达式常量
 */
export const REGEX = {
	EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	PHONE: /^1[3-9]\d{9}$/,
	ID_CARD: /^\d{17}[\dXx]$/,
	URL: /^https?:\/\/.+/,
	IP_ADDRESS: /^(\d{1,3}\.){3}\d{1,3}$/,
	POSTAL_CODE: /^\d{6}$/,
	PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/
} as const
