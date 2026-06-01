/**
 * zddxgk 模块种子数据（人员概况）
 */
import type { Database } from "sql.js"
import { faker } from "@faker-js/faker/locale/zh_CN"

/** 表为空时插入默认数据（服务启动时调用） */
export function seedZddxgkDefaults(_db: Database) {
  // zddxgk 没有需要初始化的默认数据
}

/** 生成 Faker 大数据（npm run seed 时调用） */
export function seedZddxgkFakeData(db: Database) {
  const categories = [
    { name: "重点关注", code: "important", description: "需要重点关注的人员", sort_order: 1 },
    { name: "一般人员", code: "normal", description: "普通人员", sort_order: 2 },
    { name: "困难群体", code: "difficult", description: "生活困难需要帮扶的人员", sort_order: 3 },
    { name: "特殊人群", code: "special", description: "特殊类型人员", sort_order: 4 }
  ]
  const dataSources = ["community", "hospital", "police", "grid", "self"]
  const addresses = [
    { code: "420100", name: "武汉市" },
    { code: "420200", name: "黄石市" },
    { code: "420300", name: "十堰市" },
    { code: "420500", name: "宜昌市" },
    { code: "420600", name: "襄阳市" },
    { code: "420700", name: "鄂州市" },
    { code: "421000", name: "荆州市" },
    { code: "421100", name: "黄冈市" },
    { code: "421200", name: "咸宁市" },
    { code: "421300", name: "随州市" }
  ]
  const tags = ["独居老人", "低保户", "残疾人", "留守儿童", "退役军人", "党员", "志愿者", "困难家庭", "慢性病患者", "孕妇"]
  const surnames = ["张", "王", "李", "刘", "陈", "杨", "黄", "赵", "周", "吴"]
  const givenNames = ["伟", "芳", "娜", "敏", "静", "丽", "强", "磊", "军", "洋"]

  // 生成树结构
  console.log("🌱 正在生成 rygk 树结构...")
  db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", ["yhgl", "企业管理", 0, 1, "office-building"])
  db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", ["yhgl", "企业管理-已标记", 0, 2, "star"])
  db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", ["yhgl", "企业管理-回收站", 0, 3, "delete"])
  const yhglRootId = db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] as number
  db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", ["yhgl", "国有企业", yhglRootId, 1, "bank"])
  db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", ["yhgl", "民营企业", yhglRootId, 2, "factory"])
  db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", ["yhgl", "外资企业", yhglRootId, 3, "globe"])

  db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", ["gxjg", "全部机构", 0, 1, "building"])
  db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", ["gxjg", "合作机构", 0, 2, "handshake"])
  db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", ["gxjg", "关联机构", 0, 3, "link"])
  const gxjgRootId = db.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0] as number
  db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", ["gxjg", "总公司", gxjgRootId, 1, "building"])
  db.run("INSERT INTO rygk_trees (type, name, parent_id, sort_order, icon) VALUES (?, ?, ?, ?, ?)", ["gxjg", "分公司", gxjgRootId, 2, "office"])
  console.log("  ✅ 已生成树结构数据")

  // 生成类别
  console.log("🌱 正在生成 rygk 类别数据...")
  for (const cat of categories) {
    db.run("INSERT INTO rygk_categories (name, code, description, sort_order) VALUES (?, ?, ?, ?)", [cat.name, cat.code, cat.description, cat.sort_order])
  }
  console.log(`  ✅ 已生成 ${categories.length} 条类别数据`)

  // 生成人员数据
  console.log("🌱 正在生成 rygk 人员数据...")
  const treeNodeRows = db.exec("SELECT id, type FROM rygk_trees WHERE status = 1")
  const allNodes: { id: number; type: string }[] = treeNodeRows[0]?.values.map((row: any[]) => ({
    id: row[0] as number,
    type: row[1] as string
  })) || []
  const yhglNodes = allNodes.filter((r) => r.type === "yhgl")
  const gxjgNodes = allNodes.filter((r) => r.type === "gxjg")

  let personCount = 0
  for (let i = 0; i < 100; i++) {
    const gender = faker.helpers.arrayElement(["男", "女"])
    const category = faker.helpers.arrayElement(categories)
    const dataSource = faker.helpers.arrayElement(dataSources)
    const address = faker.helpers.arrayElement(addresses)
    const followStatus = faker.helpers.arrayElement(["0", "0", "0", "1"])
    const entryTime = faker.date.between({ from: "2024-01-01", to: new Date() })

    const personTags: string[] = []
    const tagCount = faker.number.int({ min: 1, max: 3 })
    for (let j = 0; j < tagCount; j++) {
      const tag = faker.helpers.arrayElement(tags)
      if (!personTags.includes(tag)) personTags.push(tag)
    }

    const hasAvatar = faker.number.int({ min: 1, max: 10 }) <= 3
    const longitude = faker.number.float({ min: 108.5, max: 119.5, fractionDigits: 6 })
    const latitude = faker.number.float({ min: 29.0, max: 33.5, fractionDigits: 6 })
    const month = String(faker.number.int({ min: 1, max: 12 })).padStart(2, "0")
    const day = String(faker.number.int({ min: 1, max: 28 })).padStart(2, "0")

    const useYhgl = faker.number.int({ min: 1, max: 10 }) <= 7
    const targetNodes = useYhgl ? yhglNodes : gxjgNodes
    const targetNode = faker.helpers.arrayElement(targetNodes)

    db.run(
      `INSERT INTO rygk_persons
      (name, gender, age, phone, id_card, residence_address, category, data_source, tags, follow_status, avatar, tree_id, tree_type, longitude, latitude, entry_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        faker.helpers.arrayElement(surnames) + faker.helpers.arrayElement(givenNames), gender,
        faker.number.int({ min: 18, max: 80 }), faker.phone.number({ style: "national" }),
        `420100${faker.number.int({ min: 1950, max: 2005 })}${month}${day}${String(i).padStart(4, "0")}X`,
        address.code, category.code, dataSource, JSON.stringify(personTags), followStatus,
        hasAvatar ? faker.image.avatar() : null, targetNode.id, targetNode.type,
        longitude, latitude, entryTime.toISOString().replace("T", " ").slice(0, 19)
      ]
    )
    personCount++
  }
  console.log(`  ✅ 已生成 ${personCount} 条人员数据`)
}