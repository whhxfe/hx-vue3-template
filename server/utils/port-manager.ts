/**
 * 端口管理工具
 * 检测端口占用、强制释放端口
 */
import { execSync } from "node:child_process"

/** 获取占用指定端口的进程 PID（Windows） */
export function getPortProcessId(port: number): number | null {
  try {
    const output = execSync(`netstat -ano | findstr :${port}`, {
      encoding: "utf-8",
      timeout: 3000
    })
    const lines = output.trim().split("\n")
    for (const line of lines) {
      if (line.includes("LISTENING")) {
        const parts = line.trim().split(/\s+/)
        const pid = Number.parseInt(parts[parts.length - 1], 10)
        if (!Number.isNaN(pid) && pid !== process.pid) {
          return pid
        }
      }
    }
  } catch {
    // netstat 执行失败，忽略
  }
  return null
}

/** 强制释放端口：杀死占用端口的其他进程 */
export function forceReleasePort(port: number): boolean {
  const pid = getPortProcessId(port)
  if (!pid) return false
  try {
    console.log(`端口 ${port} 被进程 ${pid} 占用，正在释放...`)
    execSync(`taskkill /F /PID ${pid}`, { encoding: "utf-8", timeout: 5000 })
    console.log(`已终止进程 ${pid}`)
    return true
  } catch (err: any) {
    console.error(`终止进程 ${pid} 失败:`, err.message)
    return false
  }
}