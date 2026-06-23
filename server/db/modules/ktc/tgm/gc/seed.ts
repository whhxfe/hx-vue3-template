/**
 * ktc/tgm/gc 模块种子数据（群体管控）
 */
import type { Database } from "sql.js"
import { faker } from "@faker-js/faker/locale/zh_CN"

/** 表为空时插入默认数据（服务启动时调用） */
export function seedGcDefaults(_db: Database) {}

/** 生成 Faker 大数据（npm run seed 时调用） */
export function seedGcFakeData(db: Database) {
  const categoryTypes = ["上访群体", "涉稳群体", "维权群体", "利益诉求", "重点关注"]
  const warningTypeOptions = ["轨迹异常", "昼伏夜出", "失活", "聚集预警", "高频出行", "跨域流动"]
  const tagOptions = ["上访群体", "重点关注", "涉稳群体", "维权群体", "利益诉求", "重复上访", "重点人员"]
  const territories = [
    "林芝市墨脱县", "林芝市巴宜区", "林芝市米林县", "林芝市工布江达县",
    "林芝市朗县", "林芝市察隅县", "林芝市波密县"
  ]
  const policeNames = ["张林芝", "李国安", "王建军", "刘志远", "陈卫民", "赵永强", "周明辉", "吴晓东"]
  const unitNames = [
    "林芝市公安局网安支队", "林芝市公安局国保支队", "巴宜区公安分局",
    "林芝市公安局治安支队", "米林县公安局", "波密县公安局"
  ]
  const surnames = ["常", "李", "王", "张", "刘", "陈", "杨", "赵", "周", "吴", "黄", "马", "朱", "胡", "郭"]
  const groupNames = ["上访", "维权", "诉求", "纠纷", "安置", "环保", "劳资", "物业", "拆迁", "医患"]

  console.log("🌱 正在生成 gc 群体数据...")

  const rows = db.exec("SELECT COUNT(*) FROM ktc_gc_groups")
  const existingCount = Number(rows[0]?.values[0]?.[0] ?? 0)
  if (existingCount > 0) {
    console.log("  ⏭️ gc 群体数据已存在，跳过生成")
    return
  }

  let count = 0
  for (let i = 0; i < 30; i++) {
    const categoryType = faker.helpers.arrayElement(categoryTypes)
    const surname = faker.helpers.arrayElement(surnames)
    const gName = faker.helpers.arrayElement(groupNames)
    const name = `${surname}某${gName}群体`

    const warningCount = faker.number.int({ min: 0, max: 3 })
    const warnings: string[] = []
    for (let j = 0; j < warningCount; j++) {
      const w = faker.helpers.arrayElement(warningTypeOptions)
      if (!warnings.includes(w)) warnings.push(w)
    }

    const tagCount = faker.number.int({ min: 1, max: 3 })
    const tags: string[] = []
    for (let j = 0; j < tagCount; j++) {
      const t = faker.helpers.arrayElement(tagOptions)
      if (!tags.includes(t)) tags.push(t)
    }

    const isJudged = faker.number.int({ min: 1, max: 10 }) <= 3 ? 1 : 0
    const memberCount = faker.number.int({ min: 5, max: 200 })
    const activeCount = faker.number.int({ min: 0, max: Math.floor(memberCount * 0.6) })
    const recommendCount = faker.number.int({ min: 0, max: Math.floor(memberCount * 0.3) })
    const groupCount = faker.number.int({ min: 1, max: 20 })
    const subGroupCount = faker.number.int({ min: 0, max: Math.min(groupCount, 10) })
    const entryTime = faker.date.between({ from: "2023-01-01", to: new Date() })

    const reasons = [
      "该群体长期关注相关诉求，多次组织集体活动，需要持续关注和引导。",
      "群体成员间联系紧密，有一定组织性，需加强日常管理和信息收集。",
      "涉及历史遗留问题，成员诉求复杂，需协调多部门联合处理。",
      "群体活跃度较高，近期有新成员加入，需密切关注动态变化。",
      "曾多次赴上级部门反映问题，目前情绪相对稳定，仍需持续跟进。"
    ]

    db.run(
      `INSERT INTO ktc_gc_groups
      (name, category_type, is_judged, member_count, territory, police_name, unit_name, reason, active_count, recommend_count, group_count, sub_group_count, warning_types, tags, entry_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, categoryType, isJudged, memberCount,
        faker.helpers.arrayElement(territories),
        faker.helpers.arrayElement(policeNames),
        faker.helpers.arrayElement(unitNames),
        faker.helpers.arrayElement(reasons),
        activeCount, recommendCount, groupCount, subGroupCount,
        JSON.stringify(warnings), JSON.stringify(tags),
        entryTime.toISOString().replace("T", " ").slice(0, 19)
      ]
    )
    count++
  }
  console.log(`  ✅ 已生成 ${count} 条群体数据`)
}
