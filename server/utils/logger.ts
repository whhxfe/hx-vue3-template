/**
 * 请求日志工具
 * 格式化并输出接口访问日志
 */
import type { FastifyRequest, FastifyReply } from "fastify"
import { loggerConfig } from "../config/index.js"

/** 格式化请求参数（防止大文件/大对象） */
function formatParams(data: unknown, maxLen = 300): string {
  if (!data) return "无"
  try {
    const str = JSON.stringify(data)
    return str.length > maxLen ? str.slice(0, maxLen) + "..." : str
  } catch {
    return String(data).slice(0, maxLen)
  }
}

/** 记录接口访问日志 */
export function logRequest(request: FastifyRequest, reply: FastifyReply, startTime: number) {
  const { method, url } = request
  const duration = Date.now() - startTime
  const token = (request.headers as Record<string, string | undefined>).token || request.headers.authorization || "-"
  const ip =
    request.headers["x-forwarded-for"] || request.headers["x-real-ip"] || request.ip || "-"
  const status = reply.statusCode

  const path = url.split("?")[0]

  const lines = [
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `  🕐  ${new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}`,
    `  📡 ${method}  ${path}`,
    `  👤 Token: ${String(token).slice(0, 35)}${String(token).length > 35 ? "..." : ""}`,
    `  🌐 IP:    ${ip}`,
    `  ⏱️  ${duration}ms  |  📊 ${status}`,
    ""
  ]

  const query = request.query
  const params = request.params
  const body = request.body

  if (query && Object.keys(query).length > 0) {
    lines.push(`  📋 Query:  ${formatParams(query, loggerConfig.paramMaxLength)}`)
  }
  if (params && Object.keys(params).length > 0) {
    lines.push(`  📋 Params: ${formatParams(params, loggerConfig.paramMaxLength)}`)
  }
  if (body && Object.keys(body).length > 0) {
    lines.push(`  📋 Body:   ${formatParams(body, loggerConfig.paramMaxLength)}`)
  }

  lines.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  lines.push("")

  console.log(lines.join("\n"))
}