/**
 * 分页组合式函数
 */
import { ref, computed, reactive } from 'vue'
import { PAGE_SIZE_OPTIONS, DEFAULT_PAGE_SIZE } from '@/enums'

export interface PaginationOptions {
	page?: number
	pageSize?: number
	total?: number
	pageSizes?: number[]
}

export interface PaginationResult {
	currentPage: typeof page
	pageSize: typeof pageSize
	total: typeof total
	totalPages: ReturnType<typeof computed>
	pageSizes: number[]
	handlePageChange: (page: number) => void
	handleSizeChange: (size: number) => void
	reset: () => void
}

const page = ref(1)
const pageSize = ref(DEFAULT_PAGE_SIZE)
const total = ref(0)

export const usePagination = (options: PaginationOptions = {}): PaginationResult => {
	// 使用外部传入的值或默认值
	if (options.page !== undefined) page.value = options.page
	if (options.pageSize !== undefined) pageSize.value = options.pageSize
	if (options.total !== undefined) total.value = options.total

	const pageSizes = options.pageSizes ?? PAGE_SIZE_OPTIONS

	const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

	const handlePageChange = (p: number) => {
		page.value = p
	}

	const handleSizeChange = (size: number) => {
		pageSize.value = size
		page.value = 1
	}

	const reset = () => {
		page.value = 1
		pageSize.value = DEFAULT_PAGE_SIZE
		total.value = 0
	}

	return {
		currentPage: page,
		pageSize,
		total,
		totalPages,
		pageSizes,
		handlePageChange,
		handleSizeChange,
		reset
	}
}

/**
 * 独立的分页状态（多个表格独立分页时使用）
 */
export const usePaginationState = () => {
	const currentPage = ref(1)
	const pageSize = ref(DEFAULT_PAGE_SIZE)
	const total = ref(0)

	const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

	const handlePageChange = (p: number) => {
		currentPage.value = p
	}

	const handleSizeChange = (size: number) => {
		pageSize.value = size
		currentPage.value = 1
	}

	const reset = () => {
		currentPage.value = 1
		pageSize.value = DEFAULT_PAGE_SIZE
		total.value = 0
	}

	return {
		currentPage,
		pageSize,
		total,
		totalPages,
		pageSizes: PAGE_SIZE_OPTIONS,
		handlePageChange,
		handleSizeChange,
		reset
	}
}
