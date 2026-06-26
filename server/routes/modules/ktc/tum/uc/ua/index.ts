/**
 * tum/uc/ua 单元档案模块路由
 *
 * 层级路由: /wzsys/ktc/tum/uc/ua/...
 *
 * 全部接口与前端 src/modules/ktc/api/tum/uc/ua/index.ts 保持一致
 * 数据由 service.ts 根据 unitId 程序化生成（内存 mock）
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success, fail, pagedList } from "@utils/response"
import * as service from "./service"
import type {
	TerminalQuery,
	WebsiteQuery,
	WebsiteVisitQuery,
	CommonQuery,
	BehaviorLogQuery,
	DateRangeQuery,
	NetHabitListQuery,
	PacketDetailQuery,
	ContentDetailQuery,
	MediaDetailQuery
} from "./types"

export const uaRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// ========== 兼容占位 ==========

	// GET /list 兼容（前端暂未使用）
	app.get("/list", async () => {
		return success([])
	})

	// ========== 终端分析 ==========

	// POST /terminals - 终端列表
	app.post<{ Body: TerminalQuery }>("/terminals", async request => {
		const { unitId, page = 1, pageSize = 10, sortField, sortOrder } = request.body || ({} as TerminalQuery)
		if (!unitId) return fail("缺少 unitId")
		const result = service.getTerminals({ unitId, page, pageSize, sortField, sortOrder })
		return pagedList(result.list, result.total, page, pageSize)
	})

	// ========== 访问网站分析 ==========

	// POST /websites - 访问网站列表
	app.post<{ Body: WebsiteQuery }>("/websites", async request => {
		const { terminalId, page = 1, pageSize = 10, keyword, sortField, sortOrder } = request.body || ({} as WebsiteQuery)
		if (!terminalId) return fail("缺少 terminalId")
		const result = service.getWebsites({ terminalId, page, pageSize, keyword, sortField, sortOrder })
		return pagedList(result.list, result.total, page, pageSize)
	})

	// POST /website-visits - 网站访问详情
	app.post<{ Body: WebsiteVisitQuery }>("/website-visits", async request => {
		const { websiteId, page = 1, pageSize = 10 } = request.body || ({} as WebsiteVisitQuery)
		if (!websiteId) return fail("缺少 websiteId")
		const result = service.getWebsiteVisitDetails({ websiteId, page, pageSize })
		return pagedList(result.list, result.total, page, pageSize)
	})

	// ========== 研判历史 ==========

	// GET /judge/list?unitId=xx - 研判历史
	app.get<{ Querystring: { unitId: string } }>("/judge/list", async request => {
		const unitId = Number(request.query?.unitId)
		if (!unitId) return fail("缺少 unitId")
		const result = service.getJudgeList(unitId)
		return pagedList(result.list, result.total, 1, result.total || 10)
	})

	// ========== 共性分析 ==========

	// POST /common/website
	app.post<{ Body: CommonQuery }>("/common/website", async request => {
		const { unitId, page = 1, pageSize = 10 } = request.body || ({} as CommonQuery)
		if (!unitId) return fail("缺少 unitId")
		const result = service.getWebsiteCommonList({ unitId, page, pageSize })
		return success(result)
	})

	// POST /common/app
	app.post<{ Body: CommonQuery }>("/common/app", async request => {
		const { unitId, page = 1, pageSize = 10 } = request.body || ({} as CommonQuery)
		if (!unitId) return fail("缺少 unitId")
		const result = service.getAppCommonList({ unitId, page, pageSize })
		return success(result)
	})

	// POST /common/keyword
	app.post<{ Body: CommonQuery }>("/common/keyword", async request => {
		const { unitId, page = 1, pageSize = 10 } = request.body || ({} as CommonQuery)
		if (!unitId) return fail("缺少 unitId")
		const result = service.getKeywordCommonList({ unitId, page, pageSize })
		return success(result)
	})

	// POST /common/media
	app.post<{ Body: CommonQuery }>("/common/media", async request => {
		const { unitId, page = 1, pageSize = 10 } = request.body || ({} as CommonQuery)
		if (!unitId) return fail("缺少 unitId")
		const result = service.getMediaCommonList({ unitId, page, pageSize })
		return success(result)
	})

	// ========== 行为日志 ==========

	// GET /behavior-log?unitId=xx&...
	app.get("/behavior-log", async request => {
		const q = request.query as BehaviorLogQuery
		if (!q.unitId) return fail("缺少 unitId")
		const result = service.getBehaviorLog(q)
		return success(result)
	})

	// ========== 线上行为分析 - 上网习惯 ==========

	// GET /online/net-habit/overview?unitId=xx
	app.get<{ Querystring: DateRangeQuery }>("/online/net-habit/overview", async request => {
		const unitId = Number(request.query?.unitId)
		if (!unitId) return fail("缺少 unitId")
		return success(service.getNetHabitOverview(unitId))
	})

	// GET /online/net-habit/chart?unitId=xx
	app.get<{ Querystring: DateRangeQuery }>("/online/net-habit/chart", async request => {
		const unitId = Number(request.query?.unitId)
		if (!unitId) return fail("缺少 unitId")
		return success(service.getNetHabitChart(unitId))
	})

	// GET /online/net-habit/list?unitId=xx
	app.get<{ Querystring: NetHabitListQuery }>("/online/net-habit/list", async request => {
		const unitId = Number(request.query?.unitId)
		if (!unitId) return fail("缺少 unitId")
		const { page = 1, pageSize = 10 } = request.query || {}
		const result = service.getNetHabitList({ unitId, page, pageSize })
		return success(result)
	})

	// ========== 线上行为分析 - 报文分析 ==========

	// GET /online/packet/overview?unitId=xx
	app.get<{ Querystring: DateRangeQuery }>("/online/packet/overview", async request => {
		const unitId = Number(request.query?.unitId)
		if (!unitId) return fail("缺少 unitId")
		return success(service.getPacketOverview(unitId))
	})

	// GET /online/packet/detail?unitId=xx
	app.get<{ Querystring: PacketDetailQuery }>("/online/packet/detail", async request => {
		const unitId = Number(request.query?.unitId)
		if (!unitId) return fail("缺少 unitId")
		const { page = 1, pageSize = 10, keyword, sortField, sortOrder } = request.query || {}
		const result = service.getPacketDetail({ unitId, page, pageSize, keyword, sortField, sortOrder })
		return success(result)
	})

	// ========== 线上行为分析 - APP 使用 ==========

	// GET /online/app-usage/overview?unitId=xx
	app.get<{ Querystring: DateRangeQuery }>("/online/app-usage/overview", async request => {
		const unitId = Number(request.query?.unitId)
		if (!unitId) return fail("缺少 unitId")
		return success(service.getAppUsageOverview(unitId))
	})

	// GET /online/app-usage/detail?unitId=xx
	app.get<{ Querystring: DateRangeQuery }>("/online/app-usage/detail", async request => {
		const unitId = Number(request.query?.unitId)
		if (!unitId) return fail("缺少 unitId")
		const { page = 1, pageSize = 10 } = request.query || {}
		const result = service.getAppUsageDetail({ unitId, page, pageSize })
		return success(result)
	})

	// ========== 线上行为分析 - 访问网站 ==========

	// GET /online/website-visit/overview?unitId=xx
	app.get<{ Querystring: DateRangeQuery }>("/online/website-visit/overview", async request => {
		const unitId = Number(request.query?.unitId)
		if (!unitId) return fail("缺少 unitId")
		return success(service.getWebsiteVisitOverview(unitId))
	})

	// GET /online/website-visit/detail?unitId=xx
	app.get<{ Querystring: DateRangeQuery }>("/online/website-visit/detail", async request => {
		const unitId = Number(request.query?.unitId)
		if (!unitId) return fail("缺少 unitId")
		const { page = 1, pageSize = 10 } = request.query || {}
		const result = service.getWebsiteVisitDetail({ unitId, page, pageSize })
		return success(result)
	})

	// ========== 线上行为分析 - 内容分析 ==========

	// GET /online/content/overview?unitId=xx
	app.get<{ Querystring: DateRangeQuery }>("/online/content/overview", async request => {
		const unitId = Number(request.query?.unitId)
		if (!unitId) return fail("缺少 unitId")
		return success(service.getContentOverview(unitId))
	})

	// GET /online/content/detail?unitId=xx&type=keyword|person|tibetan
	app.get<{ Querystring: ContentDetailQuery }>("/online/content/detail", async request => {
		const unitId = Number(request.query?.unitId)
		if (!unitId) return fail("缺少 unitId")
		const { type, page = 1, pageSize = 10 } = request.query || {}
		const result = service.getContentDetail({ unitId, type, page, pageSize })
		return success(result)
	})

	// ========== 线上行为分析 - 多媒体分析 ==========

	// GET /online/media/overview?unitId=xx
	app.get<{ Querystring: DateRangeQuery }>("/online/media/overview", async request => {
		const unitId = Number(request.query?.unitId)
		if (!unitId) return fail("缺少 unitId")
		return success(service.getMediaOverview(unitId))
	})

	// GET /online/media/detail?unitId=xx&type=image|audio|video
	app.get<{ Querystring: MediaDetailQuery }>("/online/media/detail", async request => {
		const unitId = Number(request.query?.unitId)
		if (!unitId) return fail("缺少 unitId")
		const { type, page = 1, pageSize = 10 } = request.query || {}
		const result = service.getMediaDetail({ unitId, type, page, pageSize })
		return success(result)
	})

	// ========== 线上行为分析 - 大文件分析 ==========

	// GET /online/large-file/overview?unitId=xx
	app.get<{ Querystring: DateRangeQuery }>("/online/large-file/overview", async request => {
		const unitId = Number(request.query?.unitId)
		if (!unitId) return fail("缺少 unitId")
		return success(service.getLargeFileOverview(unitId))
	})

	// GET /online/large-file/detail?unitId=xx
	app.get<{ Querystring: DateRangeQuery }>("/online/large-file/detail", async request => {
		const unitId = Number(request.query?.unitId)
		if (!unitId) return fail("缺少 unitId")
		const { page = 1, pageSize = 10 } = request.query || {}
		const result = service.getLargeFileDetail({ unitId, page, pageSize })
		return success(result)
	})

	// ========== 线上行为分析 - 重点端口分析 ==========

	// GET /online/key-port/overview?unitId=xx
	app.get<{ Querystring: DateRangeQuery }>("/online/key-port/overview", async request => {
		const unitId = Number(request.query?.unitId)
		if (!unitId) return fail("缺少 unitId")
		return success(service.getKeyPortOverview(unitId))
	})

	// GET /online/key-port/detail?unitId=xx
	app.get<{ Querystring: DateRangeQuery }>("/online/key-port/detail", async request => {
		const unitId = Number(request.query?.unitId)
		if (!unitId) return fail("缺少 unitId")
		const { page = 1, pageSize = 10 } = request.query || {}
		const result = service.getKeyPortDetail({ unitId, page, pageSize })
		return success(result)
	})
}
