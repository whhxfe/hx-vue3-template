/**
 * 表单验证工具
 */
import { REGEX } from '@/constants'

/**
 * 验证邮箱
 */
export const validateEmail = (value: string): boolean => {
	return REGEX.EMAIL.test(value)
}

/**
 * 验证手机号
 */
export const validatePhone = (value: string): boolean => {
	return REGEX.PHONE.test(value)
}

/**
 * 验证身份证号
 */
export const validateIdCard = (value: string): boolean => {
	return REGEX.ID_CARD.test(value)
}

/**
 * 验证 URL
 */
export const validateUrl = (value: string): boolean => {
	return REGEX.URL.test(value)
}

/**
 * 验证 IP 地址
 */
export const validateIpAddress = (value: string): boolean => {
	return REGEX.IP_ADDRESS.test(value)
}

/**
 * 验证邮政编码
 */
export const validatePostalCode = (value: string): boolean => {
	return REGEX.POSTAL_CODE.test(value)
}

/**
 * 验证强密码（至少8位，包含大小写字母和数字）
 */
export const validateStrongPassword = (value: string): boolean => {
	return REGEX.PASSWORD_STRONG.test(value)
}

/**
 * 验证非空
 */
export const validateRequired = (value: unknown): boolean => {
	if (typeof value === 'string') {
		return value.trim().length > 0
	}
	return value !== null && value !== undefined
}

/**
 * 验证最小长度
 */
export const validateMinLength = (value: string, min: number): boolean => {
	return value.length >= min
}

/**
 * 验证最大长度
 */
export const validateMaxLength = (value: string, max: number): boolean => {
	return value.length <= max
}

/**
 * 验证数字范围
 */
export const validateRange = (value: number, min: number, max: number): boolean => {
	return value >= min && value <= max
}

/**
 * 验证两次输入是否一致
 */
export const validateConfirm = (value: string, confirmValue: string): boolean => {
	return value === confirmValue
}
