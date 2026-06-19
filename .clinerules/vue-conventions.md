# Vue 组件规范

## 命名规范

### 文件与目录

| 类别 | 规范 | 示例 |
|------|------|------|
| Vue 组件文件 | 多词 kebab-case | `account-list.vue`, `role-list.vue` |
| components 目录 | 多词 kebab-case 目录 + `index.vue` | `theme-switch/index.vue`, `header/index.vue` |
| 模块目录 | kebab-case | `ucenter/`, `zddxgk/` |
| SCSS 样式文件 | `_` 前缀 + kebab-case | `_variables.scss`, `_mixins.scss` |

### 组件命名

| 类别 | 注册名规范 | 示例 |
|------|-----------|------|
| 平台布局组件 (components/) | `App` 前缀 + PascalCase | `AppLayout`, `AppHeader`, `AppMenu` |
| 页面级视图组件 | 多词 PascalCase (路由 name) | `AccountList`, `RoleList` |
| 全局公共组件 (components/) | PascalCase | `SideMenu`, `DataTable` |

### 路由命名

| 类别 | 规范 | 示例 |
|------|------|------|
| route name | PascalCase (与组件名对应) | `AccountList`, `RoleList` |
| route path | kebab-case | `/ucenter/account` |
| 模块根路由 path | kebab-case | `/ucenter` |

### JavaScript/TypeScript 命名

| 类别 | 规范 | 示例 |
|------|------|------|
| 变量 / 函数 | camelCase | `fetchList`, `handleSubmit` |
| 类 / 接口 | PascalCase | `AccountQuery`, `ModuleConfig` |
| 常量 | camelCase（不强制大写） | `const apiPrefix = "/wzsys"` |
| 枚举 | PascalCase | `enum RoleType` |
| 类型 / interface | PascalCase + 描述性 | `interface ModuleConfig` |

### CSS 命名

| 类别 | 规范 | 示例 |
|------|------|------|
| class 名 | kebab-case | `.account-list`, `.filter-bar` |
| SCSS 变量 | 语义化命名 | `$primary-color` |

## 组件定义

- 使用 `<script setup lang="ts">` 组合式 API
- 组件名必须为多词（ESLint 规则 `vue/multi-word-component-names`）
- 页面级视图组件使用 `defineOptions({ name: 'ComponentName' })` 声明名称

## SFC 结构顺序

1. `<template>` — 模板
2. `<script setup lang="ts">` — 脚本
3. `<style lang="scss" scoped>` — 样式

## 模板规范

- 根元素 class 名与文件名一致（kebab-case）
- 使用 Element Plus 的 `el-` 组件前缀
- Icon 使用 `@iconify/vue`
- 事件处理函数命名：`handle` + 动作，如 `handleSubmit`, `handleDelete`

## Script 顺序

1. 外部库导入（vue, element-plus, vue-router 等）
2. 项目内部导入（api, composables, components 等）
3. 类型导入
4. 响应式数据定义（ref, reactive, computed）
5. 普通函数定义
6. 生命周期钩子
7. `defineExpose` / `defineEmits` / `defineProps`（放在最后）

## Style 规范

- 始终使用 `scoped` 属性隔离样式
- 使用 `lang="scss"` 编写 SCSS
- 使用 `@use` 替代 `@import`（Dart Sass 推荐）
- 不嵌套超过 4 层
- 避免使用 `!important`，优先通过选择器优先级控制