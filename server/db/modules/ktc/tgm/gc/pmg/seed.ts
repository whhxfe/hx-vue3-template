/**
 * tgm/gc/pmg 模块种子数据（群体人员管理）
 */
import type { Database } from "sql.js"
import { faker } from "@faker-js/faker/locale/zh_CN"

export function seedPmgDefaults(_db: Database) {}

export function seedPmgFakeData(db: Database) {
  const rows = db.exec("SELECT COUNT(*) FROM ktc_pmg_persons")
  const existingCount = Number(rows[0]?.values[0]?.[0] ?? 0)
  if (existingCount > 0) {
    console.log("  ⏭️ pmg 人员数据已存在，跳过生成")
    return
  }

  const groupRows = db.exec("SELECT id FROM ktc_gc_groups")
  const groupIds: number[] = groupRows[0]?.values.map((r: any[]) => r[0] as number) || []
  if (groupIds.length === 0) {
    console.log("  ⏭️ 无群体数据，跳过 pmg 人员生成")
    return
  }

  const warningTypeOptions = ["轨迹异常", "昼伏夜出", "失活", "聚集预警", "高频出行", "跨域流动"]
  const addresses = [
    "林芝市墨脱县", "林芝市巴宜区", "林芝市米林县", "林芝市工布江达县",
    "林芝市朗县", "林芝市察隅县", "林芝市波密县"
  ]
  const nations = ["汉", "藏", "回"]
  const surnames = ["张", "王", "李", "刘", "陈", "杨", "黄", "赵", "周", "吴", "马", "朱", "胡", "郭", "林"]
  const givenNames = ["伟", "芳", "娜", "敏", "静", "丽", "强", "磊", "军", "洋", "峰", "超", "明", "华", "建"]

  console.log("🌱 正在生成 pmg 人员数据...")

  let count = 0
  for (let i = 0; i < 200; i++) {
    const groupId = faker.helpers.arrayElement(groupIds)
    const gender = faker.helpers.arrayElement(["男", "女"])
    const age = faker.number.int({ min: 18, max: 75 })
    const surname = faker.helpers.arrayElement(surnames)
    const given = faker.helpers.arrayElement(givenNames)
    const name = surname + given
    const address = faker.helpers.arrayElement(addresses)
    const nation = faker.helpers.arrayElement(nations)
    const month = String(faker.number.int({ min: 1, max: 12 })).padStart(2, "0")
    const day = String(faker.number.int({ min: 1, max: 28 })).padStart(2, "0")
    const birthYear = new Date().getFullYear() - age
    const idCard = `542600${birthYear}${month}${day}${String(faker.number.int({ min: 1000, max: 9999 }))}`
    const entryTime = faker.date.between({ from: "2023-01-01", to: new Date() })

    const warningCount = faker.number.int({ min: 0, max: 3 })
    const warnings: string[] = []
    for (let j = 0; j < warningCount; j++) {
      const w = faker.helpers.arrayElement(warningTypeOptions)
      if (!warnings.includes(w)) warnings.push(w)
    }

    const followStatus = faker.number.int({ min: 1, max: 10 }) <= 3 ? "1" : "0"
    const hasAvatar = faker.number.int({ min: 1, max: 10 }) <= 3

    db.run(
      `INSERT INTO ktc_pmg_persons
      (group_id, name, gender, age, phone, id_card, nation, address, warning_types, follow_status, avatar, entry_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        groupId, name, gender, age,
        faker.phone.number({ style: "national" }),
        idCard, nation, address,
        JSON.stringify(warnings), followStatus,
        hasAvatar ? faker.image.avatar() : null,
        entryTime.toISOString().replace("T", " ").slice(0, 19)
      ]
    )
    count++
  }
  console.log(`  ✅ 已生成 ${count} 条 pmg 人员数据`)
}
