/**
 * 所属区县字典接口
 * GET /wzsys/public/dict/district?cityName=武汉
 * - 传 cityName：返回该城市的所有区县 [{name, code, level}, ...]
 * - 不传 cityName：返回所有城市列表 [{label, value}, ...]
 */
import type { FastifyInstance } from "fastify"
import { success } from "@utils/response"
import districtData from "./data.json"

export async function districtRoutes(app: FastifyInstance) {
  app.get("/", async (request) => {
    const { cityName } = request.query as { cityName?: string }
    if (cityName) {
      const districts = (districtData as Record<string, Array<{ name: string; code: string; level: string }>>)[cityName]
      if (!districts) {
        return success([])
      }
      return success(districts)
    }
    // 无参数时返回城市列表
    const cityList = Object.keys(districtData).map((city) => ({
      label: city,
      value: city,
    }))
    return success(cityList)
  })
}