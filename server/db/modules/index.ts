/**
 * modules 分类聚合入口
 * 聚合所有业务模块的数据库模块
 * 
 * 注：ryyj 和 ryst 是 zddxgk 的子模块，由 zddxgkModule 内部聚合
 */
import type { DbModule } from "../types.js"
import { zddxgkModule } from "./zddxgk/index.js"
import { pbctModule } from "./pbct/index.js"

export const businessModules: DbModule[] = [zddxgkModule, pbctModule]
