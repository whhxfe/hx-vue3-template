# 后端 Mock 服务开发规范

## 技术栈

| 类别 | 技术选型 |
|------|---------|
| 框架 | Fastify 5 |
| 数据库 | SQLite（sql.js） |
| 数据生成 | @faker-js/faker |
| API 文档 | @fastify/swagger + @fastify/swagger-ui |
| 运行 | tsx（TypeScript 直接执行） |

## 模块自动扫描

业务模块（`routes/modules/` 和 `db/modules/`）支持自动扫描，无需手动注册。

### 新增业务模块步骤

1. 在 `server/routes/modules/` 下创建模块目录（如 `my-module/`）
2. 创建 `index.ts` 并导出 `FastifyPluginAsync` 作为 default export
3. 在 `server/db/modules/` 下创建同名目录
4. 创建 `index.ts` 并导出 `DbModule` 作为 default export
5. 完成！自动扫描器会自动发现并注册

### 约定

- 目录名即为路由前缀（如 `zddxgk` → `/wzsys/zddxgk`）
- 以 `_` 开头的目录会被跳过（如 `_templates`）
- 路由模块必须导出 `FastifyPluginAsync` 作为 default export
- 数据库模块必须导出 `DbModule` 作为 default export

### 路由模块示例

```typescript
// routes/modules/my-module/index.ts
import type { FastifyInstance, FastifyPluginAsync } from "fastify"

const myModuleRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/list", async () => {
    return { data: [] }
  })
}

export default myModuleRoutes
```

### 数据库模块示例

```typescript
// db/modules/my-module/index.ts
import type { Database } from "sql.js"
import type { DbModule } from "../../types.js"

const myModule: DbModule = {
  createTables: (db: Database) => {
    db.run(`CREATE TABLE IF NOT EXISTS my_table (...)`)
  },
  seedDefaults: (db: Database) => {
    // 插入默认数据
  }
}

export default myModule
```

## 路由模块规范

路由函数以 `FastifyPluginAsync` 形式注册，使用相对路径：

```typescript
// routes/modules/<module-name>/index.ts
import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { success } from "@utils/response"

const myRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.get("/list", async (request, reply) => {
    return success([])
  })
}

export default myRoutes
```

- API 路径使用 kebab-case（如 `/ucenter/account`, `/ucenter/role`）
- 路由使用相对路径，prefix 由注册时自动添加

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
```
