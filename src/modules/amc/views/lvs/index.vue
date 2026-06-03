<script setup lang="ts">
import { computed } from 'vue'
import { useAsyncState } from '@vueuse/core'
import { useTheme } from '@/hooks/useTheme'
import { lvs } from '@/modules/amc/api'

// 主题相关
const { isDark } = useTheme()

// 图表轴标签颜色
const axisLabelColor = computed(() => isDark.value ? '#8b9cc7' : '#606266')
// 图表图例文字颜色
const legendTextColor = computed(() => isDark.value ? '#fff' : '#606266')

// ============================================================
// 板块1：日志总量统计 - Log Total Stats
// ============================================================
function useLogTotalStats() {
  const colors = ['#FF7D29', '#FFB354', '#2894FF', '#367BED', '#9254DE']

  const { state, isLoading } = useAsyncState(
    async () => {
      const res = await lvs.getLogTotalStats()
      return res.data.map((item, index) => ({
        name: item.name,
        value: item.value,
        color: colors[index % colors.length]
      })) as { name: string; value: number; color: string }[]
    },
    [] as { name: string; value: number; color: string }[],
    { immediate: true }
  )

  const option = computed(() => ({
    grid: { left: 50, right: 20, top: 20, bottom: 20 },
    xAxis: { type: 'value', show: false },
    yAxis: { type: 'category', data: state.value.map(i => i.name), axisLabel: { color: axisLabelColor.value } },
    series: [{
      type: 'bar',
      barWidth: 16,
      data: state.value.map(i => ({ value: i.value, itemStyle: { color: i.color } }))
    }]
  }))

  return { option, isLoading }
}

// ============================================================
// 板块2：应用日志总量排行 - App Log Ranking
// ============================================================
function useAppLogRanking() {
  const colors = ['#FF7D29', '#FFB354', '#43B6FF', '#2876F5', '#9254DE']

  const { state, isLoading } = useAsyncState(
    async () => {
      const res = await lvs.getAppLogRanking()
      return res.data.map((item, index) => ({
        name: item.name,
        value: item.value,
        color: colors[index % colors.length]
      })) as { name: string; value: number; color: string }[]
    },
    [] as { name: string; value: number; color: string }[],
    { immediate: true }
  )

  const option = computed(() => ({
    grid: { left: 50, right: 20, top: 20, bottom: 20 },
    xAxis: { type: 'value', show: false },
    yAxis: { type: 'category', data: state.value.map(i => i.name), axisLabel: { color: axisLabelColor.value } },
    series: [{
      type: 'bar',
      barWidth: 16,
      data: state.value.map(i => ({ value: i.value, itemStyle: { color: i.color } }))
    }]
  }))

  return { option, isLoading }
}

// ============================================================
// 板块3：日志总量统计饼图 - Log Share Pie
// ============================================================
function useLogSharePie() {
  const { state, isLoading } = useAsyncState(
    async () => {
      const res = await lvs.getLogSharePie()
      return res.data
    },
    [] as { name: string; value: number; itemStyle?: { color: string } }[],
    { immediate: true }
  )

  const option = computed(() => ({
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: ['35%', '70%'],
      data: state.value
    }]
  }))

  return { option, isLoading }
}

// ============================================================
// 板块4：用户统计 - User Stats Bar
// ============================================================
function useUserStatsBar() {
  const { state, isLoading } = useAsyncState(
    async () => {
      const res = await lvs.getUserStatsBar()
      return res.data
    },
    [] as { label: string; val: number }[],
    { immediate: true }
  )

  const option = computed(() => ({
    grid: { left: 40, right: 20, top: 30, bottom: 30 },
    xAxis: { data: state.value.map(i => i.label), axisLabel: { color: axisLabelColor.value } },
    yAxis: { axisLabel: { color: axisLabelColor.value } },
    series: [{
      type: 'bar',
      itemStyle: { color: '#528BFF' },
      data: state.value.map(i => i.val)
    }]
  }))

  return { option, isLoading }
}

// ============================================================
// 板块5：应用统计 - App Stats Line
// ============================================================
function useAppStatsLine() {
  const { state, isLoading } = useAsyncState(
    async () => {
      const res = await lvs.getAppStatsLine()
      return res.data
    },
    { xAxis: [] as string[], series: [] as number[] },
    { immediate: true }
  )

  const option = computed(() => ({
    grid: { left: 40, right: 20, top: 30, bottom: 30 },
    xAxis: { data: state.value.xAxis, axisLabel: { color: axisLabelColor.value } },
    yAxis: { axisLabel: { color: axisLabelColor.value } },
    series: [{
      type: 'line',
      smooth: true,
      areaStyle: { color: 'rgba(82,139,255,0.15)' },
      data: state.value.series
    }]
  }))

  return { option, isLoading }
}

// ============================================================
// 板块6：终端统计 - Terminal Stats List
// ============================================================
function useTerminalStatsList() {
  const { state, isLoading } = useAsyncState(
    async () => {
      const res = await lvs.getTerminalStatsList()
      return res.data
    },
    [] as { ip: string; num: number }[],
    { immediate: true }
  )

  return { data: state, isLoading }
}

// ============================================================
// 板块7：日志数量趋势统计 - Trend Stats Multi Line
// ============================================================
function useTrendStatsLine() {
  const { state, isLoading } = useAsyncState(
    async () => {
      const res = await lvs.getTrendStatsLine()
      return res.data
    },
    { x: [] as string[], data1: [] as number[], data2: [] as number[], data3: [] as number[] },
    { immediate: true }
  )

  const option = computed(() => ({
    legend: { top: 0, textStyle: { color: legendTextColor.value } },
    grid: { left: 40, right: 20, top: 50, bottom: 30 },
    xAxis: { data: state.value.x, axisLabel: { color: axisLabelColor.value } },
    yAxis: { axisLabel: { color: axisLabelColor.value } },
    series: [
      { name: '互联网大数据云平台', type: 'line', data: state.value.data1, itemStyle: { color: '#528BFF' } },
      { name: '数据治理平台', type: 'line', data: state.value.data2, itemStyle: { color: '#46D9E6' } },
      { name: '服务开放平台', type: 'line', data: state.value.data3, itemStyle: { color: '#FFB354' } },
    ]
  }))

  return { option, isLoading }
}

// ============================================================
// 板块8：用户访问数量统计 - User Visit Stats Line
// ============================================================
function useUserVisitStats() {
  const { state, isLoading } = useAsyncState(
    async () => {
      const res = await lvs.getUserVisitStats()
      return res.data.map((item, index) => ({
        ...item,
        color: ['#00B8FF', '#54CCFF', '#93DDFF'][index % 3]
      })) as { name: string; val: number; color: string }[]
    },
    [] as { name: string; val: number; color: string }[],
    { immediate: true }
  )

  const option = computed(() => ({
    grid: { left: 30, right: 20, top: 30, bottom: 30 },
    xAxis: { data: state.value.map(i => i.name), axisLabel: { color: axisLabelColor.value } },
    yAxis: { axisLabel: { color: axisLabelColor.value } },
    series: [{
      type: 'line',
      smooth: true,
      areaStyle: { opacity: 0.5 },
      data: state.value.map(i => ({ value: i.val, itemStyle: { color: i.color } }))
    }]
  }))

  return { option, isLoading }
}

// 初始化各板块数据
const logTotalStats = useLogTotalStats()
const appLogRanking = useAppLogRanking()
const logSharePie = useLogSharePie()
const userStatsBar = useUserStatsBar()
const appStatsLine = useAppStatsLine()
const terminalStatsList = useTerminalStatsList()
const trendStatsLine = useTrendStatsLine()
const userVisitStats = useUserVisitStats()
</script>

<template>
  <div class="p-4 bg-bg-base min-h-full">
    <div class="w-full grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(360px,1fr))]">

      <!-- ============================================================ -->
      <!-- 板块1：日志总量统计 - 横向柱状图，展示各系统日志量排名 -->
      <!-- ============================================================ -->
      <div class="bg-bg-elevated rounded-3 p-4 border border-border-base shadow-base" v-loading="logTotalStats.isLoading.value">
        <div class="text-text-primary font-500 mb-3">日志总量统计</div>
        <v-chart class="h-[320px]" autoresize :option="logTotalStats.option.value" />
      </div>

      <!-- ============================================================ -->
      <!-- 板块2：应用日志总量排行 - 横向柱状图，展示应用日志排名 -->
      <!-- ============================================================ -->
      <div class="bg-bg-elevated rounded-3 p-4 border border-border-base shadow-base" v-loading="appLogRanking.isLoading.value">
        <div class="text-text-primary font-500 mb-3">应用日志总量排行</div>
        <v-chart class="h-[320px]" autoresize :option="appLogRanking.option.value" />
      </div>

      <!-- ============================================================ -->
      <!-- 板块3：日志总量统计饼图 - 环形饼图，展示各系统日志占比 -->
      <!-- ============================================================ -->
      <div class="bg-bg-elevated rounded-3 p-4 border border-border-base shadow-base" v-loading="logSharePie.isLoading.value">
        <div class="text-text-primary font-500 mb-3">日志总量统计</div>
        <v-chart class="h-[320px]" autoresize :option="logSharePie.option.value" />
      </div>

      <!-- ============================================================ -->
      <!-- 板块4：用户统计 - 柱状图，展示不同角色用户数量 -->
      <!-- ============================================================ -->
      <div class="bg-bg-elevated rounded-3 p-4 border border-border-base shadow-base" v-loading="userStatsBar.isLoading.value">
        <div class="text-text-primary font-500 mb-3">用户统计</div>
        <v-chart class="h-[320px]" autoresize :option="userStatsBar.option.value" />
      </div>

      <!-- ============================================================ -->
      <!-- 板块5：应用统计 - 面积折线图，展示各应用使用趋势 -->
      <!-- ============================================================ -->
      <div class="bg-bg-elevated rounded-3 p-4 border border-border-base shadow-base" v-loading="appStatsLine.isLoading.value">
        <div class="text-text-primary font-500 mb-3">应用统计</div>
        <v-chart class="h-[320px]" autoresize :option="appStatsLine.option.value" />
      </div>

      <!-- ============================================================ -->
      <!-- 板块6：终端统计 - 列表展示，展示终端IP访问数量 -->
      <!-- ============================================================ -->
      <div class="bg-bg-elevated rounded-3 p-4 border border-border-base shadow-base" v-loading="terminalStatsList.isLoading.value">
        <div class="text-text-primary font-500 mb-3">终端统计</div>
        <div class="h-[320px] overflow-auto py-2">
          <div v-for="(item, idx) in terminalStatsList.data.value" :key="idx" class="flex items-center my-3">
            <div class="text-text-secondary text-sm w-160 flex-shrink-0">{{ item.ip }}</div>
            <div class="flex-1 h-5 rounded-3 overflow-hidden relative" :class="isDark ? 'bg-[#2d3b57]' : 'bg-[#e8ecf1]'">
              <div class="h-full bg-[#9254DE] rounded-3" :style="{ width: item.num / 150 + 'px' }"></div>
            </div>
            <div class="text-text-placeholder text-sm w-60 text-right ml-2">{{ item.num }}</div>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- 板块7：日志数量趋势统计 - 多折线图，展示近一周各系统日志趋势 -->
      <!-- ============================================================ -->
      <div class="bg-bg-elevated rounded-3 p-4 border border-border-base shadow-base" v-loading="trendStatsLine.isLoading.value">
        <div class="flex justify-between items-center mb-3">
          <span class="text-text-primary font-500">日志数量趋势统计</span>
          <span class="text-xs px-2 py-1 rounded-4" :class="isDark ? 'bg-[#2d3b57] text-[#ccc]' : 'bg-[#e8ecf1] text-[#606266]'">近一周</span>
        </div>
        <v-chart class="h-[320px]" autoresize :option="trendStatsLine.option.value" />
      </div>

      <!-- ============================================================ -->
      <!-- 板块8：用户访问数量统计 - 面积折线图，展示各平台访问量 -->
      <!-- ============================================================ -->
      <div class="bg-bg-elevated rounded-3 p-4 border border-border-base shadow-base" v-loading="userVisitStats.isLoading.value">
        <div class="text-text-primary font-500 mb-3">用户访问数量统计</div>
        <v-chart class="h-[320px]" autoresize :option="userVisitStats.option.value" />
      </div>

    </div>
  </div>
</template>
