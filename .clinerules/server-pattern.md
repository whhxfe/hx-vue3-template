# 后端 Mock 服务开发规范

## 技术栈

| 类别 | 技术选型 |
|------|---------|
| 框架 | Fastify 5 |
| 数据库 | SQLite（sql.js） |
| 数据生成 | @faker-js/faker |
| API 文档 | @fastify/swagger + @fastify/swagger-ui |
| 运行 | tsx（TypeScript 直接执行） |

## 路由模块规范

路由函数以 `async (app: FastifyInstance, prefix: string)` 形式注册：

```typescript
// routes/modules/<module-name>/index.ts
import type { FastifyInstance } from "fastify"
import { getDb } from "../../../db/db"

export async function ucenterRoutes(app: FastifyInstance, prefix: string) {
  app.get("/ucenter/role", async (request, reply) => {
    const db = getDb()
    // ...查询逻辑
  })
}
```

- API 路径使用 kebab-case（如 `/ucenter/account`, `/ucenter/role`）

## 数据库规范

- 表名使用 snake_case（如 `sys_account`, `sys_role`）
- 字段名使用 snake_case（如 `display_name`, `created_at`）
- 每个表必须有 `id` 作为自增主键
- 时间字段统一使用 `created_at` 和 `updated_at`

## 统一响应格式

```typescript
// utils/response.ts
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 成功响应
export function success<T>(data: T, message = "操作成功"): ApiResponse<T>

// 分页响应
export function paginate<T>(list: T[], total: number, page: number, pageSize: number): ApiResponse

// 错误响应
export function error(message = "操作失败", code = 6000): ApiResponse
