/**
 * LVS (Log Statistics) 模块数据类型定义
 * 对应8个图表板块的数据结构
 */

// 板块1：日志总量统计 - 横向柱状图
export interface LogTotalStats {
  name: string
  value: number
}

// 板块2：应用日志总量排行 - 横向柱状图
export interface AppLogRanking {
  name: string
  value: number
}

// 板块3：日志总量统计饼图 - 环形饼图
export interface LogSharePie {
  name: string
  value: number
  itemStyle?: { color: string }
}

// 板块4：用户统计 - 柱状图
export interface UserStats {
  label: string
  val: number
}

// 板块5：应用统计 - 折线图
export interface AppStats {
  xAxis: string[]
  series: number[]
}

// 板块6：终端统计 - 列表数据
export interface TerminalStats {
  ip: string
  num: number
}

// 板块7：日志数量趋势统计 - 多折线图
export interface TrendStats {
  x: string[]
  data1: number[]
  data2: number[]
  data3: number[]
}

// 板块8：用户访问数量统计 - 面积折线图
export interface UserVisitStats {
  name: string
  val: number
}
