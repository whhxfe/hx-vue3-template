/**
 * 路由模块导出
 */
import type { RouteRecordRaw } from 'vue-router'
import { getRoutes } from './routes'

export type { RouteRecordRaw }

export const routes: RouteRecordRaw[] = getRoutes()

export default routes
