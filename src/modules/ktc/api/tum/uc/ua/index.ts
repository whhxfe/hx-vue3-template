import request from '@/api/request'
import type { ApiResponse } from '@/modules/ktc/api/types'
import type { JudgeRecord } from '@/modules/ktc/api/tum/uc'
import type {
	TerminalItem,
	TerminalQuery,
	WebsiteItem,
	WebsiteQuery,
	WebsiteVisitDetail,
	WebsiteVisitQuery,
	CommonQuery,
	WebsiteCommonItem,
	AppCommonItem,
	KeywordCommonItem,
	MediaCommonItem,
	BehaviorLogItem,
	BehaviorLogQuery,
	DateRangeQuery,
	NetHabitOverview,
	NetHabitChartPoint,
	NetHabitListItem,
	NetHabitListQuery,
	PacketOverview,
	PacketItem,
	PacketDetailQuery,
	AppUsageOverview,
	AppUsageItem,
	WebsiteVisitOverview,
	WebsiteVisitTopItem,
	ContentOverview,
	ContentDetailItem,
	ContentDetailQuery,
	MediaOverview,
	MediaDetailItem,
	MediaDetailQuery,
	LargeFileOverview,
	LargeFileItem,
	KeyPortOverview,
	KeyPortItem
} from './types'

/**
 * ua 模块 API（单元档案）
 * 所有路径均位于 `/ktc/tum/uc/...` 下，前端按业务域拆分命名空间
 */

// ==================== 工具函数 ====================

/**
 * 将对象序列化为 URLSearchParams 字符串，跳过 undefined 与空字符串
 */
function buildQuery(params: object): string {
	const usp = new URLSearchParams()
	for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
		if (value === undefined || value === null || value === "") continue
		usp.set(key, String(value))
	}
	return usp.toString()
}

// ==================== 命名空间 ====================

export const ua = {
	// ==================== 终端分析 ====================

	/**
	 * 获取终端列表
	 */
	getTerminals(query: TerminalQuery) {
		return request.post<ApiResponse<{
			list: TerminalItem[]
			total: number
		}>>('/ktc/tum/uc/ua/terminals', query)
	},

	// ==================== 访问网站分析 ====================

	/**
	 * 获取访问网站列表
	 */
	getWebsites(query: WebsiteQuery) {
		return request.post<ApiResponse<{
			list: WebsiteItem[]
			total: number
		}>>('/ktc/tum/uc/ua/websites', query)
	},

	/**
	 * 获取网站访问详情
	 */
	getWebsiteVisitDetails(query: WebsiteVisitQuery) {
		return request.post<ApiResponse<{
			list: WebsiteVisitDetail[]
			total: number
		}>>('/ktc/tum/uc/ua/website-visits', query)
	},

	// ==================== 研判历史 ====================

	/**
	 * 获取某单元的研判历史记录
	 */
	getJudgeList(unitId: number) {
		return request.get<ApiResponse<{ list: JudgeRecord[]; total: number }>>(
			`/ktc/tum/uc/ua/judge/list?unitId=${unitId}`
		)
	},

	// ==================== 共性分析 ====================

	/**
	 * 获取访问同网站终端列表
	 */
	getWebsiteCommonList(query: CommonQuery) {
		return request.post<ApiResponse<{
			list: WebsiteCommonItem[]
			total: number
			page: number
			pageSize: number
		}>>('/ktc/tum/uc/ua/common/website', query)
	},

	/**
	 * 获取使用同APP终端列表
	 */
	getAppCommonList(query: CommonQuery) {
		return request.post<ApiResponse<{
			list: AppCommonItem[]
			total: number
			page: number
			pageSize: number
		}>>('/ktc/tum/uc/ua/common/app', query)
	},

	/**
	 * 获取发布同关键词的终端列表
	 */
	getKeywordCommonList(query: CommonQuery) {
		return request.post<ApiResponse<{
			list: KeywordCommonItem[]
			total: number
			page: number
			pageSize: number
		}>>('/ktc/tum/uc/ua/common/keyword', query)
	},

	/**
	 * 获取发布同多媒体内容的终端列表
	 */
	getMediaCommonList(query: CommonQuery) {
		return request.post<ApiResponse<{
			list: MediaCommonItem[]
			total: number
			page: number
			pageSize: number
		}>>('/ktc/tum/uc/ua/common/media', query)
	},

	// ==================== 行为日志 ====================

	/**
	 * 获取行为日志列表
	 */
	getBehaviorLog(query: BehaviorLogQuery) {
		return request.get<ApiResponse<{
			list: BehaviorLogItem[]
			total: number
			page: number
			pageSize: number
		}>>(`/ktc/tum/uc/ua/behavior-log?${buildQuery(query)}`)
	},

	// ==================== 线上行为分析 ====================

	/** 上网习惯 - 概览 */
	getNetHabitOverview(query: DateRangeQuery) {
		return request.get<ApiResponse<NetHabitOverview>>(
			`/ktc/tum/uc/ua/online/net-habit/overview?${buildQuery(query)}`
		)
	},

	/** 上网习惯 - 图表 */
	getNetHabitChart(query: DateRangeQuery) {
		return request.get<ApiResponse<NetHabitChartPoint[]>>(
			`/ktc/tum/uc/ua/online/net-habit/chart?${buildQuery(query)}`
		)
	},

	/** 上网习惯 - 列表 */
	getNetHabitList(query: NetHabitListQuery) {
		return request.get<ApiResponse<{
			list: NetHabitListItem[]
			total: number
			page: number
			pageSize: number
		}>>(`/ktc/tum/uc/ua/online/net-habit/list?${buildQuery(query)}`)
	},

	/** 报文分析 - 概览 */
	getPacketOverview(query: DateRangeQuery) {
		return request.get<ApiResponse<PacketOverview>>(
			`/ktc/tum/uc/ua/online/packet/overview?${buildQuery(query)}`
		)
	},

	/** 报文分析 - 列表 */
	getPacketDetail(query: PacketDetailQuery) {
		return request.get<ApiResponse<{
			list: PacketItem[]
			total: number
			page: number
			pageSize: number
		}>>(`/ktc/tum/uc/ua/online/packet/detail?${buildQuery(query)}`)
	},

	/** APP 使用 - 概览 */
	getAppUsageOverview(query: DateRangeQuery) {
		return request.get<ApiResponse<AppUsageOverview>>(
			`/ktc/tum/uc/ua/online/app-usage/overview?${buildQuery(query)}`
		)
	},

	/** APP 使用 - 详情 */
	getAppUsageDetail(query: DateRangeQuery) {
		return request.get<ApiResponse<{
			list: AppUsageItem[]
			total: number
		}>>(`/ktc/tum/uc/ua/online/app-usage/detail?${buildQuery(query)}`)
	},

	/** 访问网站 - 概览 */
	getWebsiteVisitOverview(query: DateRangeQuery) {
		return request.get<ApiResponse<WebsiteVisitOverview>>(
			`/ktc/tum/uc/ua/online/website-visit/overview?${buildQuery(query)}`
		)
	},

	/** 访问网站 - 详情 */
	getWebsiteVisitDetail(query: DateRangeQuery) {
		return request.get<ApiResponse<{
			list: WebsiteVisitTopItem[]
			total: number
		}>>(`/ktc/tum/uc/ua/online/website-visit/detail?${buildQuery(query)}`)
	},

	/** 内容分析 - 概览 */
	getContentOverview(query: DateRangeQuery) {
		return request.get<ApiResponse<ContentOverview>>(
			`/ktc/tum/uc/ua/online/content/overview?${buildQuery(query)}`
		)
	},

	/** 内容分析 - 详情 */
	getContentDetail(query: ContentDetailQuery) {
		return request.get<ApiResponse<{
			list: ContentDetailItem[]
			total: number
			page: number
			pageSize: number
		}>>(`/ktc/tum/uc/ua/online/content/detail?${buildQuery(query)}`)
	},

	/** 多媒体分析 - 概览 */
	getMediaOverview(query: DateRangeQuery) {
		return request.get<ApiResponse<MediaOverview>>(
			`/ktc/tum/uc/ua/online/media/overview?${buildQuery(query)}`
		)
	},

	/** 多媒体分析 - 详情 */
	getMediaDetail(query: MediaDetailQuery) {
		return request.get<ApiResponse<{
			list: MediaDetailItem[]
			total: number
			page: number
			pageSize: number
		}>>(`/ktc/tum/uc/ua/online/media/detail?${buildQuery(query)}`)
	},

	/** 大文件分析 - 概览 */
	getLargeFileOverview(query: DateRangeQuery) {
		return request.get<ApiResponse<LargeFileOverview>>(
			`/ktc/tum/uc/ua/online/large-file/overview?${buildQuery(query)}`
		)
	},

	/** 大文件分析 - 详情 */
	getLargeFileDetail(query: DateRangeQuery) {
		return request.get<ApiResponse<{
			list: LargeFileItem[]
			total: number
		}>>(`/ktc/tum/uc/ua/online/large-file/detail?${buildQuery(query)}`)
	},

	/** 重点端口分析 - 概览 */
	getKeyPortOverview(query: DateRangeQuery) {
		return request.get<ApiResponse<KeyPortOverview>>(
			`/ktc/tum/uc/ua/online/key-port/overview?${buildQuery(query)}`
		)
	},

	/** 重点端口分析 - 详情 */
	getKeyPortDetail(query: DateRangeQuery) {
		return request.get<ApiResponse<{
			list: KeyPortItem[]
			total: number
		}>>(`/ktc/tum/uc/ua/online/key-port/detail?${buildQuery(query)}`)
	}
}

// 集中 re-export 类型，方便 api/index.ts 一次性聚合
export type * from './types'
export type { JudgeRecord } from '@/modules/ktc/api/tum/uc'
