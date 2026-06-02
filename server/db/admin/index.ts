/**
 * admin 分类聚合入口
 * 聚合所有管理后台相关的数据库模块
 */
import type { DbModule } from "../types.js"
import { ucenterModule } from "./ucenter/index.js"
import { sysconfigModule } from "./sysconfig/index.js"

export const adminModules: DbModule[] = [ucenterModule, sysconfigModule]