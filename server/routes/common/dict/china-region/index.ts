/**
 * 中国行政区划灵活查询接口
 * GET /wzsys/public/dict/china-region
 *
 * 参数:
 *   - depth: 1=省, 2=省市, 3=省市区（默认 1）
 *   - parentCode: 按父级代码筛选（2位省/4位市/6位区县）
 *   - keyword: 按名称模糊搜索
 *   - format: tree=树形, flat=扁平列表（默认 flat）
 *   - provinceName/cityName/districtName: 按名称精确筛选
 */
import type { FastifyInstance } from "fastify"
import { success } from "@utils/response"
import {
  provincesCode,
  countiesCode,
  getCitiesByProvince,
  getCountiesByCity,
} from "cn-division"
import type { RegionItem, RegionNode, QueryParams, Depth } from "./types"

type ProvinceItem = { code: string; name: string; level: "省" }
type CityItem = { code: string; name: string; level: "市" }
type DistrictItem = { code: string; name: string; level: "区" }

// 完整的城市数据（包含 getCitiesByProvince 返回的所有条目，覆盖 citiesCode 不完整的地区如西藏林芝等）
type CityRaw = { c: string; n: string; p: string }
const allCities: CityRaw[] = []
for (const p of provincesCode) {
  const provCode = String(p.c).padStart(2, "0")
  allCities.push(...getCitiesByProvince(provCode))
}

function buildMaps() {
  const provinceCityMap = new Map<string, CityItem[]>()
  const cityDistrictMap = new Map<string, DistrictItem[]>()

  for (const p of provincesCode) {
    const provCode = String(p.c).padStart(2, "0")
    const cities = getCitiesByProvince(provCode)
    provinceCityMap.set(
      provCode,
      cities.map((c) => ({
        code: String(c.c),
        name: c.n,
        level: "市" as const,
      }))
    )
  }

  for (const c of allCities) {
    const cityCode = String(c.c).padStart(4, "0")
    const districts = getCountiesByCity(cityCode)
    cityDistrictMap.set(
      cityCode,
      districts.map((a) => ({
        code: String(a.c).padStart(6, "0"),
        name: a.n,
        level: "区" as const,
      }))
    )
  }

  return { provinceCityMap, cityDistrictMap }
}

export async function chinaRegionRoutes(app: FastifyInstance) {
  const { provinceCityMap, cityDistrictMap } = buildMaps()

  app.get("/", async (request) => {
    const {
      depth = "1",
      parentCode,
      keyword,
      format = "flat",
      provinceName,
      cityName,
      districtName,
    } = request.query as QueryParams

    const d = Number(depth) as Depth
    if (![1, 2, 3].includes(d)) {
      return success([])
    }

    const kw = keyword?.trim()
    const kwLower = kw?.toLowerCase()

    // ── Step 1: 归一化 parentCode ──
    // 优先精确匹配，而非截取前缀
    const codeStr = parentCode ? String(parentCode) : ""
    let pcLen = 0
    let pc = ""

    // 精确匹配 6 位区县
    if (codeStr.length === 6 && countiesCode.some((a) => a.c === codeStr)) {
      pcLen = 6
      pc = codeStr
    }
    // 精确匹配 4 位城市
    else if (codeStr.length === 4 && allCities.some((ct) => ct.c === codeStr)) {
      pcLen = 4
      pc = codeStr
    }
    // 精确匹配 2 位省份
    else if (codeStr.length === 2 && provincesCode.some((pr) => String(pr.c) === codeStr)) {
      pcLen = 2
      pc = codeStr
    }
    // 对于 6 位码，如果精确匹配失败，尝试取前 4 位
    else if (codeStr.length === 6) {
      const p4 = codeStr.substring(0, 4)
      if (allCities.some((ct) => ct.c === p4)) {
        pcLen = 4
        pc = p4
      } else {
        const p2 = codeStr.substring(0, 2)
        if (provincesCode.some((pr) => String(pr.c) === p2)) {
          pcLen = 2
          pc = p2
        }
      }
    }

    // ── Step 2: 确定省份列表 ──
    let provinces: ProvinceItem[] = provincesCode.map((p) => ({
      code: String(p.c),
      name: p.n,
      level: "省" as const,
    }))

    // 省份名精确筛选
    if (provinceName) {
      provinces = provinces.filter((p) => p.name === provinceName)
    }

    // 省份关键字筛选（只有匹配到省份才过滤）
    if (kwLower) {
      const matchedProvinces = provinces.filter((p) =>
        p.name.toLowerCase().includes(kwLower)
      )
      if (matchedProvinces.length > 0) {
        provinces = matchedProvinces
      }
    }

    // 2位省代码筛选
    if (pcLen === 2) {
      provinces = provinces.filter((p) => p.code === pc)
    }

    // 4位市代码筛选 → 找到对应省
    if (pcLen === 4) {
      const city = allCities.find((ct) => ct.c === pc)
      if (city) {
        provinces = provinces.filter((p) => p.code === city.p)
      } else {
        return success([])
      }
    }

    // 6位区县代码筛选 → 找到对应省
    if (pcLen === 6) {
      const district = countiesCode.find((a) => a.c === pc)
      if (district) {
        const city = allCities.find((ct) => ct.c === district.cc)
        if (city) {
          provinces = provinces.filter((p) => p.code === city.p)
        }
      } else {
        return success([])
      }
    }

    // 城市名精确筛选 → 扩大省份范围（支持模糊匹配，如"林芝"匹配"林芝市"）
    if (cityName) {
      const matched = allCities.filter((c) => c.n.includes(cityName))
      const provCodes = [...new Set(matched.map((c) => c.p))]
      provinces = provinces.filter((p) => provCodes.includes(p.code))
    }

    // 区县名精确筛选 → 扩大省份范围（支持模糊匹配）
    if (districtName) {
      const matched = countiesCode.filter((a) => a.n.includes(districtName))
      const cityCodes = [...new Set(matched.map((a) => a.cc))]
      const provCodes = [
        ...new Set(
          allCities
            .filter((c) => cityCodes.includes(String(c.c)))
            .map((c) => c.p)
        ),
      ]
      provinces = provinces.filter((p) => provCodes.includes(p.code))
    }

    // ── Step 3: 构建返回结果 ──
    // 根据 parentCode 确定返回的起点级别
    const startLevel: "province" | "city" | "district" =
      pcLen === 6 ? "district" : pcLen === 4 ? "city" : "province"

    if (format === "tree") {
      const tree: RegionNode[] = provinces.map((province) => {
        let cities = provinceCityMap.get(province.code) ?? []

        // 4位城市代码筛选
        if (pcLen === 4) {
          cities = cities.filter((c) => c.code === pc)
        }

        // 城市名精确筛选
        if (cityName) {
          cities = cities.filter((c) => c.name.includes(cityName))
        } else if (kwLower && d >= 2) {
          const matched = cities.filter((c) =>
            c.name.toLowerCase().includes(kwLower)
          )
          if (matched.length > 0) cities = matched
        }

        const cityNodes = cities.map((city) => {
          let districts = cityDistrictMap.get(city.code) ?? []

          if (districtName) {
            districts = districts.filter((a) => a.name.includes(districtName))
          } else if (kwLower && d >= 3) {
            districts = districts.filter((a) =>
              a.name.toLowerCase().includes(kwLower)
            )
          }

          return {
            ...city,
            children: d >= 3 ? districts : undefined,
          } as RegionNode
        })

        return {
          ...province,
          children: d >= 2 ? cityNodes : undefined,
        } as RegionNode
      })
      return success(tree)
    }

    // flat 模式
    const flatList: RegionItem[] = []

    for (const province of provinces) {
      if (startLevel === "province" && d >= 1) {
        flatList.push(province)
      }

      if (d >= 2) {
        let cities = provinceCityMap.get(province.code) ?? []

        // 4位城市代码筛选
        if (pcLen === 4) {
          cities = cities.filter((c) => c.code === pc)
        }

        // 城市名精确筛选
        if (cityName) {
          cities = cities.filter((c) => c.name.includes(cityName))
        } else if (kwLower && d >= 2) {
          const matched = cities.filter((c) =>
            c.name.toLowerCase().includes(kwLower)
          )
          if (matched.length > 0) cities = matched
        }

        for (const city of cities) {
          // 当 parentCode 是4位市级时，只返回区县，不返回城市本身
          if (startLevel !== "district" && pcLen !== 4) {
            flatList.push(city)
          }

          if (d >= 3) {
            let districts = cityDistrictMap.get(city.code) ?? []

            // 6位区县代码筛选
            if (pcLen === 6) {
              districts = districts.filter((a) => a.code === pc)
            }

            // 区县名精确筛选
            if (districtName) {
              districts = districts.filter((a) => a.name.includes(districtName))
            } else if (kwLower) {
              districts = districts.filter((a) =>
                a.name.toLowerCase().includes(kwLower)
              )
            }

            flatList.push(...districts)
          }
        }
      }
    }

    return success(flatList)
  })
}
