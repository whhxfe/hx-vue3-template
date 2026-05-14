import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success } from "@utils/response"

interface TreeNode {
	id: number
	label: string
	count?: number
	icon?: string
	children?: TreeNode[]
}

/**
 * 站点信息管理（zddxgk）路由实现
 * 
 * 层级路由: /wzsys/zddxgk/...
 * prefix 已在 modules/index.ts 中指定为 /zddxgk
 * 此时 app.prefix 已经是 /wzsys/zddxgk
 */
export const zddxgkRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
	// 获取树形结构数据
	app.get("/tree", async (request, reply) => {
		const query = request.query as { type?: string }
		const { type } = query

		// 业务管理 (ywlb -> yhgl)
		const yhglData: TreeNode[] = [
			{
				id: 1,
				label: "企业管理",
				count: 50,
				icon: "office-building",
				children: [
					{ id: 11, label: "国有企业", count: 20, icon: "bank" },
					{ id: 12, label: "民营企业", count: 15, icon: "factory" },
					{ id: 13, label: "外资企业", count: 15, icon: "globe" }
				]
			},
			{ id: 2, label: "企业管理-已标记", count: 25, icon: "star" },
			{ id: 3, label: "企业管理-回收站", count: 5, icon: "delete" }
		]

		// 关系机构 (gxjg)
		const gxjgData: TreeNode[] = [
			{
				id: 1,
				label: "全部机构",
				count: 80,
				icon: "building",
				children: [
					{ id: 21, label: "总公司", count: 20, icon: "building" },
					{ id: 22, label: "分公司", count: 60, icon: "office" }
				]
			},
			{ id: 2, label: "合作机构", count: 30, icon: "handshake" },
			{ id: 3, label: "关联机构", count: 15, icon: "link" }
		]

		// 兼容旧的 ywlb 参数
		if (type === "ywlb") {
			return success(yhglData)
		}

		const data = type === "gxjg" ? gxjgData : yhglData
		return success(data)
	})
}
