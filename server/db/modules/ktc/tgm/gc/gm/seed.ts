/**
 * tgm/gc/gm 模块种子数据（群组管理）
 */
import type { Database } from "sql.js"
import { faker } from "@faker-js/faker/locale/zh_CN"

export function seedGmDefaults(_db: Database) {}

export function seedGmFakeData(db: Database) {
  const rows = db.exec("SELECT COUNT(*) FROM ktc_gm_groups")
  const existingCount = Number(rows[0]?.values[0]?.[0] ?? 0)
  if (existingCount > 0) {
    console.log("  ⏭️ gm 群组数据已存在，跳过生成")
    return
  }

  const groupRows = db.exec("SELECT id FROM ktc_gc_groups")
  const groupIds: number[] = groupRows[0]?.values.map((r: any[]) => r[0] as number) || []
  if (groupIds.length === 0) {
    console.log("  ⏭️ 无群体数据，跳过 gm 群组生成")
    return
  }

  const types = ["QQ群", "微信群"]
  const namePrefixes = ["常进京上访", "维权交流", "利益诉求", "环保关注", "劳资纠纷", "物业维权", "拆迁安置", "医患沟通"]
  const nameSuffixes = ["群", "交流群", "讨论群", "互助群"]

  console.log("🌱 正在生成 gm 群组数据...")

  let count = 0
  for (let i = 0; i < 68; i++) {
    const groupId = faker.helpers.arrayElement(groupIds)
    const type = faker.helpers.arrayElement(types)
    const namePrefix = faker.helpers.arrayElement(namePrefixes)
    const nameSuffix = faker.helpers.arrayElement(nameSuffixes)
    const name = `${namePrefix}${nameSuffix}${String(i + 1).padStart(3, "0")}`
    const number = String(faker.number.int({ min: 10000000, max: 99999999 }))
    const memberCount = faker.number.int({ min: 5, max: 200 })
    const activeCount = faker.number.int({ min: 0, max: Math.floor(memberCount * 0.5) })
    const entryTime = faker.date.between({ from: "2023-01-01", to: new Date() })

    const descriptions = [
      "相关描述信息，相关描述信息",
      "相关描述信息，相关描述信息，相关描述信息",
      "相关描述信息",
      ""
    ]

    db.run(
      `INSERT INTO ktc_gm_groups (group_id, name, number, type, member_count, active_count, description, entry_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [groupId, name, number, type, memberCount, activeCount, faker.helpers.arrayElement(descriptions), entryTime.toISOString().replace("T", " ").slice(0, 19)]
    )
    count++
  }
  console.log(`  ✅ 已生成 ${count} 条 gm 群组数据`)
}
