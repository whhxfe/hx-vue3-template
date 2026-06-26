/**
 * tgm/gw 群体预警模块路由
 *
 * 层级路由: /wzsys/ktc/tgm/gw/...
 */
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success, pagedList } from "@utils/response"

export const gwRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// 获取群体名称选项
	app.get("/group-options", async () => {
		const options = [
			{ label: "常进京上访群体", value: "常进京上访群体" },
			{ label: "常闹事群体", value: "常闹事群体" },
			{ label: "常进京维权群体", value: "常进京维权群体" },
			{ label: "涉稳群体", value: "涉稳群体" },
			{ label: "利益诉求群体", value: "利益诉求群体" }
		]
		return success(options)
	})

	// 获取人员分值选项
	app.get("/score-options", async () => {
		const options = [
			{ label: "90分以上", value: "90" },
			{ label: "80-89分", value: "80" },
			{ label: "70-79分", value: "70" },
			{ label: "60-69分", value: "60" },
			{ label: "60分以下", value: "50" }
		]
		return success(options)
	})

	// 获取预警类型选项
	app.get("/warning-type-options", async () => {
		const options = [
			{ label: "红色预警", value: "红色预警" },
			{ label: "橙色预警", value: "橙色预警" },
			{ label: "黄色预警", value: "黄色预警" },
			{ label: "蓝色预警", value: "蓝色预警" }
		]
		return success(options)
	})

	// 获取列表数据
	app.post("/list", async (request) => {
		const { page = 1, pageSize = 10, keyword = "", groupName = "", score = "", warningType = "", isJudged } = (request.body || {}) as any

		const warningLevels = [
			{ name: "红色预警", type: "danger" },
			{ name: "橙色预警", type: "warning" },
			{ name: "黄色预警", type: "warning" },
			{ name: "蓝色预警", type: "info" }
		]

		const groups = ["常进京上访群体", "常闹事群体", "常进京维权群体", "涉稳群体", "利益诉求群体"]
		const surnames = ["李", "张", "王", "赵", "刘", "陈", "杨", "黄", "周", "吴"]
		const names = ["泽宽", "小龙", "伟", "强", "磊", "军", "洋", "峰", "超", "明"]

		const mockData = Array.from({ length: 300 }, (_, i) => {
			const wl = warningLevels[i % warningLevels.length]
			const scoreVal = 60 + Math.floor(Math.random() * 35)
			return {
				id: i + 1,
				name: surnames[i % surnames.length] + names[i % names.length],
				idCard: `42098119${85 + (i % 20)}${1000 + i}1532${10 + (i % 9)}`,
				gender: i % 2 === 0 ? "男" : "女",
				age: 25 + (i % 30),
				warningLevel: wl.name,
				warningLevelName: wl.name,
				score: scoreVal,
				scoreChange: i % 3 === 0 ? "↑" : (i % 3 === 1 ? "↓" : "→"),
				groupName: groups[i % groups.length],
				phone: `138${60296 + i}85${8}`,
				address: "林芝市墨脱县",
				regionAlarm: Math.floor(Math.random() * 3),
				gatherAlarm: Math.floor(Math.random() * 3),
				behaviorAlarm: Math.floor(Math.random() * 3),
				identityInfo: `今日新增${Math.floor(Math.random() * 5)}条`,
				behaviorInfo: `今日行为${Math.floor(Math.random() * 10)}次`,
				relationInfo: `关系重点人${Math.floor(Math.random() * 8)}人`,
				isJudged: i % 4 === 0,
				isIgnored: i % 7 === 0
			}
		})

		let filtered = mockData
		if (keyword) {
			filtered = filtered.filter(d => d.name.includes(keyword) || d.idCard.includes(keyword))
		}
		if (groupName) {
			filtered = filtered.filter(d => d.groupName === groupName)
		}
		if (warningType) {
			filtered = filtered.filter(d => d.warningLevel === warningType)
		}
		if (isJudged !== undefined && isJudged !== "") {
			filtered = filtered.filter(d => d.isJudged === isJudged)
		}

		const start = (page - 1) * pageSize
		const list = filtered.slice(start, start + pageSize)
		return pagedList(list, filtered.length, page, pageSize)
	})

	// 导出
	app.post("/export", async () => {
		return success(null, "导出成功")
	})
}
