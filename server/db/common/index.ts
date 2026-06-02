/**
 * common 分类聚合入口
 * 聚合所有公共通用的数据库模块
 */
import type { DbModule } from "../types.js"
import { noticeModule } from "./notice/index.js"
import { syslogModule } from "./syslog/index.js"

export const commonModules: DbModule[] = [noticeModule, syslogModule]