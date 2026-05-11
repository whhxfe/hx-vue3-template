# 项目概览

## 技术栈

| 类别 | 技术选型 |
|------|---------|
| 构建工具 | Vite 8 + Vue 3 + TypeScript 5.9 |
| UI 框架 | Element Plus 2.13 |
| 样式方案 | UnoCSS (Attributify + Icons + Directives) + SCSS |
| 状态管理 | Pinia 3 |
| 路由 | Vue Router 4 |
| 图标方案 | @iconify/vue + vite-plugin-svg-icons |
| HTTP 客户端 | Axios |
| 工具库 | @vueuse/core, dayjs, lodash |
| 包管理器 | npm |
| 代码规范 | ESLint 9 + Prettier 3.8 |
| 后端模拟 | Fastify 5 + sql.js (server/ 目录) |

## 项目类型

企业级后台管理系统，采用 **模块化架构**（modules），支持前端多业务域并行开发。

## 运行命令

```bash
npm run dev          # 开发模式
npm run dev:mock     # 本地 mock 接口模式
npm run build        # 生产构建
npm run lint         # ESLint 检查
npm run lint:fix     # ESLint 自动修复
```

## 顶层目录

```
hx-vue3-template/
├── public/           # 静态资源（不会被构建处理）
├── server/           # Fastify + sql.js Mock 服务
├── src/              # 前端源码
│   ├── api/          # 全局 API 接口
│   ├── assets/       # 静态资源（会被构建处理）
│   ├── components/   # 全局公共组件
│   ├── composables/  # 组合式函数
│   ├── directives/   # 自定义指令
│   ├── hooks/        # 自定义 Hooks
│   ├── hx-components/ # 平台核心布局组件
│   ├── modules/      # 业务模块（模块化架构）
│   ├── router/       # 根路由配置
│   ├── store/        # Pinia 全局 Store
│   ├── styles/       # 全局样式
│   ├── types/        # 全局类型定义
│   ├── utils/        # 工具函数
│   └── views/        # 根级视图页面
├── dist/             # 构建产物
├── dist-zip/         # 构建产物压缩包
├── .clinerules/      # AI 编码规范
├── eslint.config.ts  # ESLint 配置
├── prettier.config.ts # Prettier 配置
├── uno.config.ts     # UnoCSS 配置
├── vite.config.ts    # Vite 构建配置
└── tsconfig.json     # TypeScript 配置
```

## server/ 目录

```
server/
├── index.ts      # 服务入口
├── app.ts        # App 工厂（创建 Fastify 实例，注册插件/路由）
├── swagger.ts    # Swagger 配置
├── db/           # 数据库初始化、种子数据
├── routes/       # 路由 & 控制器
│   ├── auth/     # 认证模块
│   └── modules/  # 业务模块 API
└── utils/        # 工具函数
```

## 路径别名

- `@/` → `./src/`
- `~/` → `./src/assets/`