/**
 * tgm/gc/ga 群体档案模块路由
 *
 * 层级路由: /wzsys/ktc/tgm/gc/ga/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success, pagedList } from "@utils/response"
import { queryAll } from "@utils/db-helper"

export const gaRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// 群体基本信息
	app.get("/info", async (request) => {
		const groupId = Number((request.query as any).groupId)
		if (!groupId) return success(null)

		const rows = queryAll("SELECT * FROM ktc_gc_groups WHERE id = ?", [groupId])
		if (rows.length === 0) return success(null)

		const row = rows[0]
		const warningTypes = row.warning_types ? JSON.parse(row.warning_types) : []
		const categoryMap: Record<string, string> = {
			"上访群体": "上访群体", "涉稳群体": "涉稳群体", "维权群体": "维权群体",
			"利益诉求": "利益诉求", "重点关注": "重点关注"
		}

		return success({
			id: row.id,
			name: row.name,
			categoryType: categoryMap[row.category_type] || row.category_type || "",
			controlCategory: "重点关注",
			territory: row.territory || "",
			memberCount: row.member_count || 0,
			activeCount: row.active_count || 0,
			recommendCount: row.recommend_count || 0,
			policeName: row.police_name || "",
			unitName: row.unit_name || "",
			reason: row.reason || "",
			warningTypes
		})
	})

	// 共性分析 - tabs
	app.get("/community-tabs", async (request) => {
		const tabs = [
			{ key: "group", label: "同群人员", count: 23 },
			{ key: "location", label: "同位置聚集人员", count: 15 },
			{ key: "ticket", label: "购买进京机票人员", count: 8 }
		]
		return success(tabs)
	})

	// 共性分析 - 数据
	app.get("/community-groups", async (request) => {
		const groupId = Number((request.query as any).groupId)
		const type = (request.query as any).type || "group"

		if (type === "group") {
			const groups = [
				{ id: 1, groupName: "群组名称001", groupNumber: "388673721", groupType: "QQ群", commonMembers: 3, description: "相关描述信息，相关描述信息", members: [
					{ id: 1, qqNumber: "503928176", nickname: "一级侦查员", phone: "18873972938", name: "李泽宽", idCard: "230823198610212832" },
					{ id: 2, qqNumber: "1029586983", nickname: "秋风", phone: "18976442019", name: "李泽宽", idCard: "230823198610212832" },
					{ id: 3, qqNumber: "305968799", nickname: "落叶", phone: "15809182392", name: "李泽宽", idCard: "230823198610212832" }
				]},
				{ id: 2, groupName: "群组名称002", groupNumber: "84732908", groupType: "微信群", commonMembers: 5, description: "相关描述信息", members: [] },
				{ id: 3, groupName: "群组名称003", groupNumber: "103857165", groupType: "QQ群", commonMembers: 2, description: "相关描述信息，相关描述信息", members: [] }
			]
			return success(groups)
		}

		if (type === "location") {
			const groups = [
				{ id: 10, groupName: "聚集地点-林芝广场", groupNumber: "--", groupType: "线下", commonMembers: 8, description: "多次在林芝广场聚集", members: [
					{ id: 10, qqNumber: "200111222", nickname: "阳光", phone: "13800001111", name: "王明", idCard: "542600199001011234" },
					{ id: 11, qqNumber: "300222333", nickname: "风雨", phone: "13900002222", name: "李华", idCard: "542600199002021234" }
				]},
				{ id: 11, groupName: "聚集地点-八一镇", groupNumber: "--", groupType: "线下", commonMembers: 5, description: "多次在八一镇区域聚集", members: [] }
			]
			return success(groups)
		}

		if (type === "ticket") {
			const groups = [
				{ id: 20, groupName: "进京航班-CA4112", groupNumber: "CA4112", groupType: "机票", commonMembers: 4, description: "2026年3月15日成都至北京航班", members: [
					{ id: 20, qqNumber: "400333444", nickname: "行者", phone: "15800003333", name: "张伟", idCard: "542600199003031234" },
					{ id: 21, qqNumber: "500444555", nickname: "远行", phone: "15900004444", name: "刘洋", idCard: "542600199004041234" }
				]},
				{ id: 21, groupName: "进京航班-CA1234", groupNumber: "CA1234", groupType: "机票", commonMembers: 2, description: "2026年4月20日拉萨至北京航班", members: [] }
			]
			return success(groups)
		}

		return success([])
	})

	// 行为活动
	app.post("/behavior-activities", async (request) => {
		const { page = 1, pageSize = 10 } = (request.body || {}) as any
		const mockData = Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			sourceIp: "192.268.110.35",
			sourcePort: "8080",
			destIp: "192.168.35.11",
			destPort: "8082",
			protocol: "HTTPS",
			action: ["搜索", "登录", "上线", "评论"][i % 4],
			dataSource: "5GZK数据",
			resourceType: "业务库",
			captureTime: `2026-02-20 10:32:0${i}`,
			phone: "18925868686"
		}))

		const start = (page - 1) * pageSize
		const list = mockData.slice(start, start + pageSize)
		return pagedList(list, mockData.length, page, pageSize)
	})

	// 研判信息
	app.get("/judgments", async (request) => {
		const judgments = [
			{ id: 1, conclusion: "重点关注", conclusionType: "danger", unit: "林芝市公安局网安支队", person: "张林芝", time: "2026-05-09 12:34:00", basis: "相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明" },
			{ id: 2, conclusion: "一级", conclusionType: "warning", unit: "林芝市公安局网安支队", person: "张林芝", time: "2026-05-07 10:13:20", basis: "相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明，相关研判依据说明" }
		]
		return success(judgments)
	})
}
