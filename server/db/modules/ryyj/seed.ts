/**
 * ryyj 模块种子数据（人员预警）
 */
import type { Database } from "sql.js"

/** 表为空时插入默认数据（服务启动时调用） */
export function seedRyyjDefaults(db: Database) {
  const result = db.exec("SELECT COUNT(*) FROM ryyj_persons")
  const count = result[0]?.values[0]?.[0] as number
  if (count > 0) return

  const sampleData = [
    { name: "张三", gender: "男", age: 35, id_card: "420100199001011234", phone: "13800138001", person_score: 85, warning_type: "1", business_category: "1", data_source: "community", education: "本科", occupation_type: "自由职业", residence_address: "武汉市洪山区", household_address: "420100", manage_dept: "dept_1", person_category: "重点关注", manage_category: "重点管控" },
    { name: "李四", gender: "女", age: 28, id_card: "420200199202021234", phone: "13900139002", person_score: 72, warning_type: "2", business_category: "2", data_source: "hospital", education: "大专", occupation_type: "个体经营", residence_address: "黄石市黄石港区", household_address: "420200", manage_dept: "dept_2", person_category: "一般关注", manage_category: "常规管理" },
    { name: "王五", gender: "男", age: 45, id_card: "420300198001031234", phone: "13700137003", person_score: 55, warning_type: "3", business_category: "3", data_source: "police", education: "高中", occupation_type: "无业", residence_address: "十堰市茅箭区", household_address: "420300", manage_dept: "dept_3", person_category: "帮扶对象", manage_category: "重点帮扶" },
    { name: "赵六", gender: "女", age: 52, id_card: "420500197201041234", phone: "13600136004", person_score: 90, warning_type: "1", business_category: "4", data_source: "grid", education: "初中", occupation_type: "退休", residence_address: "宜昌市西陵区", household_address: "420500", manage_dept: "dept_1", person_category: "重点关注", manage_category: "重点管控" },
    { name: "钱七", gender: "男", age: 33, id_card: "420600199103051234", phone: "13500135005", person_score: 68, warning_type: "4", business_category: "5", data_source: "self", education: "硕士", occupation_type: "企业员工", residence_address: "襄阳市襄城区", household_address: "420600", manage_dept: "dept_2", person_category: "一般关注", manage_category: "常规管理" },
    { name: "孙八", gender: "女", age: 41, id_card: "420700198401061234", phone: "13400134006", person_score: 78, warning_type: "2", business_category: "1", data_source: "community", education: "本科", occupation_type: "教师", residence_address: "鄂州市鄂城区", household_address: "420700", manage_dept: "dept_4", person_category: "重点关注", manage_category: "重点关注" },
    { name: "周九", gender: "男", age: 29, id_card: "421000199501071234", phone: "13300133007", person_score: 45, warning_type: "3", business_category: "2", data_source: "hospital", education: "大专", occupation_type: "销售", residence_address: "荆州市沙市区", household_address: "421000", manage_dept: "dept_1", person_category: "帮扶对象", manage_category: "帮扶管理" },
    { name: "吴十", gender: "女", age: 38, id_card: "421100198601081234", phone: "13200132008", person_score: 82, warning_type: "1", business_category: "3", data_source: "police", education: "高中", occupation_type: "服务员", residence_address: "黄冈市黄州区", household_address: "421100", manage_dept: "dept_2", person_category: "重点关注", manage_category: "重点管控" }
  ]

  for (const data of sampleData) {
    db.run(
      `INSERT INTO ryyj_persons
      (name, gender, age, id_card, phone, person_score, warning_type, business_category, data_source, education, occupation_type, residence_address, household_address, manage_dept, person_category, manage_category, entry_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
      [data.name, data.gender, data.age, data.id_card, data.phone, data.person_score, data.warning_type, data.business_category, data.data_source, data.education, data.occupation_type, data.residence_address, data.household_address, data.manage_dept, data.person_category, data.manage_category]
    )
  }
}

/** 生成 Faker 大数据（npm run seed 时调用） */
export function seedRyyjFakeData(_db: Database) {
  // ryyj 使用默认示例数据即可
}