# 模块化开发模式

## 模块目录结构

每个业务模块在 `src/modules/<module-name>/` 下独立组织：

```
modules/<module-name>/
├── index.ts          # 模块入口（导出 routes, api, menu）
├── layout.vue        # 模块级布局（可选）
├── menu.config.ts    # 菜单配置
├── api/              # 模块级 API 接口
│   ├── index.ts      # API 统一导出
│   ├── account.ts
│   └── role.ts
├── assets/           # 模块级资源（可选）
├── components/       # 模块级私有组件（可选）
├── router/
│   └── routes.ts     # 模块路由配置
├── store/            # 模块级状态（可选）
└── views/            # 模块页面视图组件
    ├── account-list.vue
    └── role-list.vue
```

## 模块入口（index.ts）

模块入口统一导出 routes、api、menu：

```typescript
// 模块入口模式
import type { RouteRecordRaw } from 'vue-router'

export interface ModuleConfig {
  name: string
  routes: RouteRecordRaw[]
  // menu: {...}
}

export default { name: '<module-name>', routes } as ModuleConfig
```

## 路由配置

- 路由 `component` 使用动态 `import()` 懒加载
- 路由命名与路径规范见 vue-conventions

## 模块间隔离

- 模块间禁止互相引用
- 共享逻辑提取到 `src/composables/`、`src/utils/` 等公共目录
- 共享组件放在 `src/components/` 公共目录

## API 命名空间封装

模块 API 使用命名空间对象封装，保持清晰的调用层级。

### 子模块 API 文件结构

```
api/
├── index.ts      # API 统一导出
├── types.ts     # 共享类型定义
├── rrgk/        # 业务子模块 API
│   ├── index.ts
│   └── types.ts
└── xtsz/        # 系统配置 API
    ├── index.ts
    └── types.ts
```

### 子模块 API 写法

使用命名空间对象封装 API 方法和类型：

```typescript
// api/rrgk/index.ts
import request from '@/api/request'
import type { TreeNode } from './types'

export type { TreeNode }

export const rrgk = {
  getTreeData(type: 'yhgl' | 'gxjg') {
    return request.get<{ state: number; message: string; data: TreeNode[] }>('/zddxgk/tree', {
      params: { type }
    })
  }
}
```

### 主入口统一导出

```typescript
// api/index.ts
export { rrgk } from './rrgk'
export type { TreeNode } from './rrgk'
```

### 使用方式

```typescript
// 在组件中调用
import { rrgk, type TreeNode } from '@/modules/zddxgk/api'

const res = await rrgk.getTreeData('yhgl')
```

## 模块模板

`src/modules/_templates/` 提供了模块的标准模板，创建新模块时复制此模板修改。