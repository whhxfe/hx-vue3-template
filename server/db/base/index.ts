/**
 * base 分类聚合入口
 * 聚合所有基础模块（不属于某个业务模块的通用表）
 */
import type { DbModule } from "../types.js"
import { usersModule } from "./users/index.js"
import { settingsModule } from "./settings/index.js"
import { logsModule } from "./logs/index.js"

export const baseModules: DbModule[] = [usersModule, settingsModule, logsModule]