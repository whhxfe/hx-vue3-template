/**
 * 通知公告种子数据
 */
import type { Database } from "sql.js"
import { faker } from "@faker-js/faker/locale/zh_CN"

/** 表为空时插入默认数据（服务启动时调用） */
export function seedNoticeDefaults(_db: Database) {
  // 通知公告没有需要初始化的默认数据
}

/** 生成 Faker 大数据（npm run seed 时调用） */
export function seedNoticeFakeData(db: Database) {
  console.log("🌱 正在生成通知公告数据...")
  const types = ["info", "warning", "success", "error"]
  const priorities = ["low", "normal", "high"]
  let count = 0
  for (let i = 0; i < 20; i++) {
    db.run(
      `INSERT INTO notices (title, content, type, priority, is_top, status, publish_at, author, views)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        faker.lorem.sentence(5),
        faker.lorem.paragraphs(2),
        faker.helpers.arrayElement(types),
        faker.helpers.arrayElement(priorities),
        faker.helpers.arrayElement([0, 0, 0, 1]),
        faker.helpers.arrayElement([0, 1, 1, 1]),
        faker.date.past().toISOString().replace("T", " ").slice(0, 19),
        faker.person.fullName(),
        faker.number.int({ min: 0, max: 500 })
      ]
    )
    count++
  }
  console.log(`  ✅ 已生成 ${count} 条通知公告数据`)
}