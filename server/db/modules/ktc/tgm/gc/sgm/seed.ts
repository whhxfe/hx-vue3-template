/**
 * tgm/gc/sgm 模块种子数据（子群体管理）
 */
import type { Database } from "sql.js"
import { faker } from "@faker-js/faker/locale/zh_CN"

export function seedSgmDefaults(_db: Database) {}

export function seedSgmFakeData(db: Database) {
  const rows = db.exec("SELECT COUNT(*) FROM ktc_sgm_groups")
  const existingCount = Number(rows[0]?.values[0]?.[0] ?? 0)
  if (existingCount > 0) {
    console.log("  ⏭️ sgm 子群体数据已存在，跳过生成")
    return
  }

  const parentRows = db.exec("SELECT id FROM ktc_gc_groups")
  const parentIds: number[] = parentRows[0]?.values.map((r: any[]) => r[0] as number) || []
  if (parentIds.length === 0) {
    console.log("  ⏭️ 无父群体数据，跳过 sgm 子群体生成")
    return
  }

  const categoryTypes = ["上访群体", "涉稳群体", "维权群体", "利益诉求", "重点关注"]
  const warningTypeOptions = ["轨迹异常", "昼伏夜出", "失活", "聚集预警", "高频出行"]
  const tagOptions = ["上访群体", "重点关注", "涉稳群体", "维权群体"]
  const territories = ["林芝市墨脱县", "林芝市巴宜区", "林芝市米林县", "林芝市工布江达县", "林芝市朗县", "林芝市察隅县", "林芝市波密县"]
  const policeNames = ["张林芝", "李国安", "王建军", "刘志远", "陈卫民", "赵永强"]
  const unitNames = ["林芝市公安局网安支队", "林芝市公安局国保支队", "巴宜区公安分局", "林芝市公安局治安支队"]
  const surnames = ["常", "李", "王", "张", "刘", "陈", "杨", "赵", "周", "吴"]
  const groupNames = ["上访", "维权", "诉求", "纠纷", "安置", "环保", "劳资"]

  console.log("🌱 正在生成 sgm 子群体数据...")

  let count = 0
  for (let i = 0; i < 40; i++) {
    const parentGroupId = faker.helpers.arrayElement(parentIds)
    const categoryType = faker.helpers.arrayElement(categoryTypes)
    const surname = faker.helpers.arrayElement(surnames)
    const gName = faker.helpers.arrayElement(groupNames)
    const name = `${surname}某${gName}子群体`

    const warningCount = faker.number.int({ min: 0, max: 2 })
    const warnings: string[] = []
    for (let j = 0; j < warningCount; j++) {
      const w = faker.helpers.arrayElement(warningTypeOptions)
      if (!warnings.includes(w)) warnings.push(w)
    }

    const tagCount = faker.number.int({ min: 1, max: 2 })
    const tags: string[] = []
    for (let j = 0; j < tagCount; j++) {
      const t = faker.helpers.arrayElement(tagOptions)
      if (!tags.includes(t)) tags.push(t)
    }

    const memberCount = faker.number.int({ min: 3, max: 80 })
    const activeCount = faker.number.int({ min: 0, max: Math.floor(memberCount * 0.5) })
    const recommendCount = faker.number.int({ min: 0, max: Math.floor(memberCount * 0.3) })
    const groupCount = faker.number.int({ min: 1, max: 10 })
    const entryTime = faker.date.between({ from: "2023-01-01", to: new Date() })

    const reasons = [
      "该子群体成员间联系紧密，需加强关注。",
      "涉及历史遗留问题，需协调处理。",
      "群体活跃度较高，需密切关注动态。"
    ]

    db.run(
      `INSERT INTO ktc_sgm_groups (parent_group_id, name, category_type, member_count, territory, police_name, unit_name, reason, active_count, recommend_count, group_count, warning_types, tags, entry_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        parentGroupId, name, categoryType, memberCount,
        faker.helpers.arrayElement(territories),
        faker.helpers.arrayElement(policeNames),
        faker.helpers.arrayElement(unitNames),
        faker.helpers.arrayElement(reasons),
        activeCount, recommendCount, groupCount,
        JSON.stringify(warnings), JSON.stringify(tags),
        entryTime.toISOString().replace("T", " ").slice(0, 19)
      ]
    )
    count++
  }
  console.log(`  ✅ 已生成 ${count} 条 sgm 子群体数据`)
}
