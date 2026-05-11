/**
 * Fastify Mock Server 入口
 * 启动方式：cd server && npm run dev
 */
import { initDatabase } from "./db/db"
import { createApp } from "./app"
import { PORT } from "./swagger"

await initDatabase()

const app = await createApp()

await app.listen({ port: PORT, host: "0.0.0.0" })