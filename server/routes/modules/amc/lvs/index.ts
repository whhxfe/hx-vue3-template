/**
 * LVS (Log Visualization Statistics) 模块路由
 * 提供8个图表板块的Mock数据接口
 */
import type { FastifyInstance } from "fastify"

const lvsRoutes = async (app: FastifyInstance) => {

  /**
   * 板块1：日志总量统计 - 横向柱状图
   * Log Total Stats
   */
  app.get("/log-total-stats", async (_req, reply) => {
    const mockData = [
      { name: '互联网大数据云平台', value: 53876 },
      { name: '数据治理平台', value: 41200 },
      { name: '服务开放平台', value: 38600 },
      { name: '运维管理平台', value: 29900 },
      { name: '数据交换平台', value: 22100 },
    ]

    return reply.send({
      state: 2000,
      message: "success",
      data: mockData
    })
  })

  /**
   * 板块2：应用日志总量排行 - 横向柱状图
   * App Log Ranking
   */
  app.get("/app-log-ranking", async (_req, reply) => {
    const mockData = [
      { name: '综合查询', value: 53876 },
      { name: '全量档案', value: 41200 },
      { name: '认证中心', value: 38600 },
      { name: '轨迹分析', value: 29900 },
      { name: '两群专项', value: 22100 },
    ]

    return reply.send({
      state: 2000,
      message: "success",
      data: mockData
    })
  })

  /**
   * 板块3：日志总量统计饼图 - 环形饼图
   * Log Share Pie
   */
  app.get("/log-share-pie", async (_req, reply) => {
    const mockData = [
      { name: '互联网大数据云平台', value: 53876, itemStyle: { color: '#528BFF' } },
      { name: '数据治理平台', value: 20391, itemStyle: { color: '#FFD438' } },
      { name: '服务开放平台', value: 19879, itemStyle: { color: '#9966EE' } },
      { name: '其他', value: 19879, itemStyle: { color: '#46D9E6' } },
    ]

    return reply.send({
      state: 2000,
      message: "success",
      data: mockData
    })
  })

  /**
   * 板块4：用户统计 - 柱状图
   * User Stats Bar
   */
  app.get("/user-stats-bar", async (_req, reply) => {
    const mockData = [
      { label: '管理员', val: 2109 },
      { label: '运维人员', val: 720 },
      { label: '用户01', val: 420 },
      { label: '用户02', val: 360 },
      { label: '用户03', val: 900 },
    ]

    return reply.send({
      state: 2000,
      message: "success",
      data: mockData
    })
  })

  /**
   * 板块5：应用统计 - 折线图
   * App Stats Line
   */
  app.get("/app-stats-line", async (_req, reply) => {
    const mockData = {
      xAxis: ['综合查询', '全量档案', '认证中心', '轨迹分析', '两群专项', '网购专项', '行为分析'],
      series: [290, 230, 205, 198, 182, 152, 168],
    }

    return reply.send({
      state: 2000,
      message: "success",
      data: mockData
    })
  })

  /**
   * 板块6：终端统计 - 列表数据
   * Terminal Stats List
   */
  app.get("/terminal-stats-list", async (_req, reply) => {
    const mockData = [
      { ip: '192.168.7.78.120', num: 13876 },
      { ip: '192.168.7.78.119', num: 11776 },
      { ip: '192.168.7.78.118', num: 10576 },
      { ip: '192.168.7.78.117', num: 9876 },
      { ip: '192.168.7.78.116', num: 8876 },
    ]

    return reply.send({
      state: 2000,
      message: "success",
      data: mockData
    })
  })

  /**
   * 板块7：日志数量趋势统计 - 多折线图
   * Trend Stats Multi Line
   */
  app.get("/trend-stats-line", async (_req, reply) => {
    const mockData = {
      x: ['21', '22', '23', '24', '25', '26', '27'],
      data1: [46000, 44000, 39000, 32000, 30000, 31000, 24000],
      data2: [35000, 32000, 28000, 22000, 20000, 21000, 14000],
      data3: [23000, 20000, 12000, 9000, 8500, 6000, 3200],
    }

    return reply.send({
      state: 2000,
      message: "success",
      data: mockData
    })
  })

  /**
   * 板块8：用户访问数量统计 - 面积折线图
   * User Visit Stats Line
   */
  app.get("/user-visit-stats", async (_req, reply) => {
    const mockData = [
      { name: '互联网大数据云平台', val: 1090, color: '#00B8FF' },
      { name: '数据治理平台', val: 860, color: '#54CCFF' },
      { name: '服务开放平台', val: 320, color: '#93DDFF' },
    ]

    return reply.send({
      state: 2000,
      message: "success",
      data: mockData
    })
  })
}

export { lvsRoutes }
