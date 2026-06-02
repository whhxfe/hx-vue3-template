<script setup lang="ts">
import { ref } from 'vue'
import { useAsyncState } from '@vueuse/core'

// =============== Mock 数据 ===============
const logRankData = ref([
  { name: '互联网大数据云平台', value: 53876, color: '#FF7D29' },
  { name: '数据治理平台', value: 20391, color: '#FFB354' },
  { name: '服务开放平台', value: 19879, color: '#2894FF' },
  { name: 'XXX平台', value: 13876, color: '#367BED' },
  { name: 'XXX平台', value: 12876, color: '#9254DE' },
])

const appRankData = ref([
  { name: '综合查询', value: 53876, color: '#FF7D29' },
  { name: '综合查询', value: 41200, color: '#FFB354' },
  { name: '综合查询', value: 38600, color: '#43B6FF' },
  { name: '综合查询', value: 29900, color: '#2876F5' },
  { name: '综合查询', value: 22100, color: '#9254DE' },
])

const pieData = ref([
  { name: '互联网大数据云平台', value: 53876, itemStyle: { color: '#528BFF' } },
  { name: '数据治理平台', value: 20391, itemStyle: { color: '#FFD438' } },
  { name: '服务开放平台', value: 19879, itemStyle: { color: '#9966EE' } },
  { name: '其他', value: 19879, itemStyle: { color: '#46D9E6' } },
])

const userBarData = ref([
  { label: '管理员', val: 2109 },
  { label: '运维人员', val: 720 },
  { label: '用户01', val: 420 },
  { label: '用户02', val: 360 },
  { label: '用户03', val: 900 },
])

const appLineData = ref({
  xAxis: ['综合查询', '全量档案', '认证中心', '轨迹分析', '两群专项', '网购专项', '行为分析'],
  series: [290, 230, 205, 198, 182, 152, 168],
})

const terminalList = ref([
  { ip: '192.168.7.78.120', num: 13876 },
  { ip: '192.168.7.78.119', num: 11776 },
  { ip: '192.168.7.78.118', num: 10576 },
  { ip: '192.168.7.78.117', num: 9876 },
  { ip: '192.168.7.78.116', num: 8876 },
])

const trendLineData = ref({
  x: ['21', '22', '23', '24', '25', '26', '27'],
  data1: [46000, 44000, 39000, 32000, 30000, 31000, 24000],
  data2: [35000, 32000, 28000, 22000, 20000, 21000, 14000],
  data3: [23000, 20000, 12000, 9000, 8500, 6000, 3200],
})

const userVisitData = ref([
  { name: '互联网大数据云平台', val: 1090, color: '#00B8FF' },
  { name: '数据治理平台', val: 860, color: '#54CCFF' },
  { name: '服务开放平台', val: 320, color: '#93DDFF' },
])

// =============== 加载状态 ===============
const { isLoading } = useAsyncState(async () => {
  await new Promise(resolve => setTimeout(resolve, 300))
}, null, { immediate: true })
</script>

<template>
  <div class="p-4 bg-[#0F1C3D]  w-full h-full">
    <div class="w-full h-full grid grid-cols-4 gap-5">
      <!-- 1. 日志总量统计 -->
      <div class="bg-[#1A2946] rounded-12 p-4">
        <div class="text-white font-500 mb-3">日志总量统计</div>
        <v-chart class="h-[320px]" autoresize :option="{
          grid: { left: 50, right: 20, top: 20, bottom: 20 },
          xAxis: { type: 'value', show: false },
          yAxis: { type: 'category', data: logRankData.map(i => i.name), axisLabel: { color: '#aaa' } },
          series: [{
            type: 'bar',
            barWidth: 16,
            data: logRankData.map(i => ({ value: i.value, itemStyle: { color: i.color } }))
          }]
        }" />
      </div>

      <!-- 2. 应用日志排行 -->
      <div class="bg-[#1A2946] rounded-12 p-4">
        <div class="text-white font-500 mb-3">应用日志总量排行</div>
        <v-chart class="h-[320px]" autoresize :option="{
          grid: { left: 50, right: 20, top: 20, bottom: 20 },
          xAxis: { type: 'value', show: false },
          yAxis: { type: 'category', data: appRankData.map(i => i.name), axisLabel: { color: '#aaa' } },
          series: [{
            type: 'bar',
            barWidth: 16,
            data: appRankData.map(i => ({ value: i.value, itemStyle: { color: i.color } }))
          }]
        }" />
      </div>

      <!-- 3. 饼图 -->
      <div class="bg-[#1A2946] rounded-12 p-4">
        <div class="text-white font-500 mb-3">日志总量统计</div>
        <v-chart class="h-[320px]" autoresize :option="{
          tooltip: { trigger: 'item' },
          series: [{
            type: 'pie',
            radius: ['35%', '70%'],
            data: pieData
          }]
        }" />
      </div>

      <!-- 4. 用户统计 -->
      <div class="bg-[#1A2946] rounded-12 p-4">
        <div class="text-white font-500 mb-3">用户统计</div>
        <v-chart class="h-[320px]" autoresize :option="{
          grid: { left: 40, right: 20, top: 30, bottom: 30 },
          xAxis: { data: userBarData.map(i => i.label), axisLabel: { color: '#aaa' } },
          yAxis: { axisLabel: { color: '#aaa' } },
          series: [{
            type: 'bar',
            itemStyle: { color: '#528BFF' },
            data: userBarData.map(i => i.val)
          }]
        }" />
      </div>

      <!-- 5. 应用统计 -->
      <div class="bg-[#1A2946] rounded-12 p-4">
        <div class="text-white font-500 mb-3">应用统计</div>
        <v-chart class="h-[320px]" autoresize :option="{
          grid: { left: 40, right: 20, top: 30, bottom: 30 },
          xAxis: { data: appLineData.xAxis, axisLabel: { color: '#aaa' } },
          yAxis: { axisLabel: { color: '#aaa' } },
          series: [{
            type: 'line',
            smooth: true,
            areaStyle: { color: 'rgba(82,139,255,0.15)' },
            data: appLineData.series
          }]
        }" />
      </div>

      <!-- 6. 终端统计 -->
      <div class="bg-[#1A2946] rounded-12 p-4">
        <div class="text-white font-500 mb-3">终端统计</div>
        <div class="h-[320px] overflow-auto py-2">
          <div v-for="(item, idx) in terminalList" :key="idx" class="flex items-center my-3">
            <div class="text-#ccc text-sm w-160 flex-shrink-0">{{ item.ip }}</div>
            <div class="flex-1 h-5 bg-[#2A3A5A] rounded-3 overflow-hidden relative">
              <div class="h-full bg-[#9254DE] rounded-3" :style="{ width: item.num / 150 + 'px' }"></div>
            </div>
            <div class="text-#999 text-sm w-60 text-right ml-2">{{ item.num }}</div>
          </div>
        </div>
      </div>

      <!-- 7. 趋势统计 -->
      <div class="bg-[#1A2946] rounded-12 p-4">
        <div class="flex justify-between items-center mb-3">
          <span class="text-white font-500">日志数量趋势统计</span>
          <span class="text-xs bg-[#2A3A5A] text-#ccc px-2 py-1 rounded-4">近一周</span>
        </div>
        <v-chart class="h-[320px]" autoresize :option="{
          legend: { top: 0, textStyle: { color: '#fff' } },
          grid: { left: 40, right: 20, top: 50, bottom: 30 },
          xAxis: { data: trendLineData.x, axisLabel: { color: '#aaa' } },
          yAxis: { axisLabel: { color: '#aaa' } },
          series: [
            { name: '互联网大数据云平台', type: 'line', data: trendLineData.data1, itemStyle: { color: '#528BFF' } },
            { name: '数据治理平台', type: 'line', data: trendLineData.data2, itemStyle: { color: '#46D9E6' } },
            { name: '服务开放平台', type: 'line', data: trendLineData.data3, itemStyle: { color: '#FFB354' } },
          ]
        }" />
      </div>

      <!-- 8. 用户访问 -->
      <div class="bg-[#1A2946] rounded-12 p-4">
        <div class="text-white font-500 mb-3">用户访问数量统计</div>
        <v-chart class="h-[320px]" autoresize :option="{
          grid: { left: 30, right: 20, top: 30, bottom: 30 },
          xAxis: { data: userVisitData.map(i => i.name), axisLabel: { color: '#aaa' } },
          yAxis: { axisLabel: { color: '#aaa' } },
          series: [{
            type: 'line',
            smooth: true,
            areaStyle: { opacity: 0.5 },
            data: userVisitData.map(i => ({ value: i.val, itemStyle: { color: i.color } }))
          }]
        }" />
      </div>
    </div>
  </div>
</template>