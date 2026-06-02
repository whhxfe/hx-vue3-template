/**
 * pbct 模块种子数据（排查台账）
 * - pbct_persons: 人员信息表
 * - pbct_records: 记录表
 */
import type { Database } from "sql.js"

/** 表为空时插入默认数据（服务启动时调用） */
export function seedPbctDefaults(_db: Database) {
	// pbct 数据由用户导入，不需要默认数据
}

/** 生成 Faker 大数据（npm run seed 时调用） */
export function seedPbctFakeData(_db: Database) {
	// pbct 数据由用户导入，不需要 Faker 生成
}
