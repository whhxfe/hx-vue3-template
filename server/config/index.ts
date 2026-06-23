/**
 * 统一配置中心
 * 集中管理所有 server 配置，避免配置散落在各文件中
 * 所有业务代码统一从此文件导入配置
 */
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ============================================================
// 服务配置
// ============================================================
export const serverConfig = {
  /** 监听端口 */
  port: 3000,
  /** 监听主机 */
  host: "0.0.0.0"
}

// ============================================================
// CORS 配置
// ============================================================
export const corsConfig = {
  /** 允许所有来源（配合 credentials） */
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] as string[],
  allowedHeaders: ["Content-Type", "Authorization", "token"] as string[],
  exposedHeaders: ["Content-Disposition"] as string[]
}

// ============================================================
// 文件上传配置
// ============================================================
export const uploadConfig = {
  /** 文件上传大小限制 (10MB) */
  fileSize: 10 * 1024 * 1024
}

// ============================================================
// 认证配置（auth）
// ============================================================
export const authConfig = {
  /** Token 有效期（秒）- 24小时 */
  tokenExpiresIn: 24 * 60 * 60,
  /** Token 存储最大数量限制，防止内存泄漏 */
  maxTokens: 10000,
  /** token 字符串前缀 */
  tokenPrefix: "mock_token_"
}

// ============================================================
// 模块配置（module）
// ============================================================
/** 后台系统模块列表 */
export const adminModuleKeys = ["ucenter", "sysconfig", "syslog", "dict", "notice"] as const

export type AdminModuleKey = (typeof adminModuleKeys)[number]

/** 业务模块列表 */
export const businessModules = [
  { key: "_templates", name: "模板示例", path: "/templates" },
  { key: "zddxgk", name: "站点管理", path: "/zddxgk" },
  { key: "pbct", name: "数据管理", path: "/pbct" },
  { key: "amc", name: "审计中心", path: "/amc" },
  { key: "ktc", name: "重点对象管控", path: "/ktc" }
] as const

/** 业务模块 key 联合类型 */
export type BusinessModuleKey = (typeof businessModules)[number]["key"]

// ============================================================
// 分页配置（pagination）
// ============================================================
export const paginationConfig = {
  /** 默认页码 */
  defaultPage: 1,
  /** 默认每页条数 */
  defaultPageSize: 20,
  /** 最大每页条数 */
  maxPageSize: 500
}

// ============================================================
// Swagger / OpenAPI 配置
// ============================================================
export const swaggerConfig = {
  openapi: {
    info: {
      title: "HX Mock Server API",
      description: "前端自测 Mock 服务 - Fastify + SQLite(sql.js) + Swagger",
      version: "1.0.0"
    },
    servers: [
      { url: `http://localhost:${serverConfig.port}`, description: "本地开发" }
    ],
    tags: [
      { name: "认证接口", description: "登录/登出/用户信息" },
      { name: "用户管理", description: "用户 CRUD（SQLite）" },
      { name: "操作日志", description: "操作日志查询（SQLite）" },
      { name: "系统设置", description: "系统设置管理（SQLite）" },
      { name: "数据统计", description: "仪表盘统计数据（SQLite）" },
      { name: "用户中心", description: "账号管理、角色管理、权限分配" }
    ]
  }
}

export const swaggerUiConfig = {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list" as const,
    deepLinking: true
  }
}

// ============================================================
// 数据库配置
// ============================================================
export const dbConfig = {
  /** 数据库文件路径 */
  dbPath: path.resolve(__dirname, "../db/mock.db")
}

// ============================================================
// 日志配置
// ============================================================
export const loggerConfig = {
  /** Fastify 框架内部日志级别 */
  level: "warn" as const,
  /** 请求参数格式化最大长度 */
  paramMaxLength: 300
}