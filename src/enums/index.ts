/**
 * 通用枚举定义
 */

/**
 * 分页枚举
 */
export enum PaginationEnum {
	PAGE_SIZE = 10,
	PAGE_SIZES = 10,
	PAGE_SIZES_ARRAY = 10
}

// 转换为数组方便下拉框使用
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]
export const DEFAULT_PAGE_SIZE = 10

/**
 * 状态枚举
 */
export enum StatusEnum {
	DISABLED = 0,
	ENABLED = 1
}

/**
 * 是/否枚举
 */
export enum YesNoEnum {
	NO = 0,
	YES = 1
}

/**
 * 性别枚举
 */
export enum GenderEnum {
	UNKNOWN = 0,
	MALE = 1,
	FEMALE = 2
}

/**
 * 日期范围快捷选项
 */
export enum DateRangeEnum {
	TODAY = 0,
	YESTERDAY = 1,
	LAST_7_DAYS = 7,
	LAST_30_DAYS = 30,
	THIS_MONTH = -1,
	LAST_MONTH = -2
}
