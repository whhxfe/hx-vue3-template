<template>
	<div class="flex flex-col h-full p-4 bg-bg-base gap-4 overflow-y-auto">
		<!-- 统计卡片区域 -->
		<div class="grid grid-cols-4 gap-4" v-loading="statsLoading">
			<div
				v-for="stat in statsData"
				:key="stat.title"
				class="relative flex items-center gap-4 p-5 bg-bg-elevated rounded-md border border-border-base shadow-base overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-primary"
			>
				<!-- 顶部渐变条 -->
				<div
					class="absolute top-0 left-0 right-0 h-1 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
					:class="`bg-gradient-to-r from-primary to-primary/20`"
				/>
				<!-- 图标 -->
				<div
					class="flex items-center justify-center w-14 h-14 rounded-xl flex-shrink-0 shadow-md"
					:style="{ background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)` }"
				>
					<el-icon :size="28" color="#ffffff">
						<component :is="stat.icon" />
					</el-icon>
				</div>
				<!-- 内容 -->
				<div class="flex-1 min-w-0 relative">
					<div class="text-2xl font-bold text-text-primary leading-tight truncate">
						{{ stat.value }}
					</div>
					<div class="text-sm text-text-secondary mt-1 font-medium truncate">{{ stat.title }}</div>
					<div
						class="flex items-center gap-1 mt-2 text-xs font-medium"
						:class="stat.trend > 0 ? 'text-success' : 'text-danger'"
					>
						<el-icon v-if="stat.trend > 0"><ArrowUp /></el-icon>
						<el-icon v-else><ArrowDown /></el-icon>
						<span>{{ Math.abs(stat.trend) }}%</span>
						<span class="text-text-placeholder">较上周</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 图表区域 -->
		<div class="grid grid-cols-5 gap-4">
			<!-- 左侧柱状图 -->
			<div class="col-span-3 relative bg-bg-elevated rounded-md p-5 border border-border-base shadow-base" v-loading="chartLoading">
				<div class="flex justify-between items-center mb-5 pb-3 border-b border-dashed border-border-base">
					<span class="text-base font-semibold text-text-primary relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-4 before:bg-gradient-to-b before:from-primary before:to-primary/50 before:rounded-sm">
						月度销售额统计
					</span>
					<el-radio-group v-model="barPeriod" size="small" @change="handleBarPeriodChange">
						<el-radio-button value="week">本周</el-radio-button>
						<el-radio-button value="month">本月</el-radio-button>
						<el-radio-button value="year">本年</el-radio-button>
					</el-radio-group>
				</div>
				<div class="h-80">
					<v-chart :option="barOption" autoresize />
				</div>
			</div>

			<!-- 右侧饼图 -->
			<div class="col-span-2 relative bg-bg-elevated rounded-md p-5 border border-border-base shadow-base" v-loading="chartLoading">
				<div class="flex justify-between items-center mb-5 pb-3 border-b border-dashed border-border-base">
					<span class="text-base font-semibold text-text-primary relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-4 before:bg-gradient-to-b before:from-primary before:to-primary/50 before:rounded-sm">
						销售分类占比
					</span>
					<el-select v-model="pieType" size="small" placeholder="选择分类" @change="handlePieTypeChange">
						<el-option label="全部" value="all" />
						<el-option label="电子产品" value="electronic" />
						<el-option label="办公用品" value="office" />
						<el-option label="生活用品" value="daily" />
					</el-select>
				</div>
				<div class="h-80">
					<v-chart :option="pieOption" autoresize />
				</div>
			</div>
		</div>

		<!-- 底部折线图 -->
		<div class="relative bg-bg-elevated rounded-md p-5 border border-border-base shadow-base" v-loading="chartLoading">
			<div class="flex justify-between items-center mb-5 pb-3 border-b border-dashed border-border-base">
				<span class="text-base font-semibold text-text-primary relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-4 before:bg-gradient-to-b before:from-primary before:to-primary/50 before:rounded-sm">
					年度销售趋势
				</span>
				<div class="flex gap-2">
					<el-date-picker
						v-model="lineYear"
						type="year"
						size="small"
						placeholder="选择年份"
						format="YYYY"
						value-format="YYYY"
						@change="handleYearChange"
					/>
					<el-button size="small" @click="handleExportData">导出数据</el-button>
				</div>
			</div>
			<div class="h-72">
				<v-chart :option="lineOption" autoresize />
			</div>
		</div>

		<!-- 最新订单列表 -->
		<div class="relative bg-bg-elevated rounded-md p-5 border border-border-base shadow-base" v-loading="orderLoading">
			<div class="flex justify-between items-center mb-4 pb-3 border-b border-dashed border-border-base">
				<span class="text-base font-semibold text-text-primary relative pl-3 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-4 before:bg-gradient-to-b before:from-primary before:to-primary/50 before:rounded-sm">
					最新订单
				</span>
				<el-button type="primary" link @click="handleViewAllOrders">查看全部</el-button>
			</div>
			<el-table :data="orderList" stripe>
				<el-table-column prop="orderNo" label="订单编号" width="180" />
				<el-table-column prop="product" label="商品名称" min-width="200" />
				<el-table-column prop="amount" label="订单金额" width="120" align="right">
					<template #default="{ row }">
						<span class="text-danger font-semibold">¥{{ row.amount.toFixed(2) }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="status" label="订单状态" width="100" align="center">
					<template #default="{ row }">
						<el-tag :type="getStatusType(row.status)" size="small">
							{{ getStatusText(row.status) }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="下单时间" width="180" />
				<el-table-column label="操作" width="120" align="center">
					<template #default="{ row }">
						<el-button type="primary" link @click="handleViewOrder(row)">查看</el-button>
						<el-button type="primary" link @click="handleExportOrder(row)">导出</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import { ElMessage } from "element-plus"
import { ArrowUp, ArrowDown } from "@element-plus/icons-vue"
import { useAsyncState } from "@vueuse/core"
import { dashboard, type StatItem, type ChartData, type PieItem, type OrderItem } from "@/modules/_templates/api"

const barPeriod = ref("month")
const pieType = ref("all")
const lineYear = ref(new Date().getFullYear().toString())

// ==================== 统计数据 ====================
const {
	state: statsData,
	isLoading: statsLoading,
	execute: loadStats
} = useAsyncState(async () => {
	const res = await dashboard.getStats()
	return (res.state === 2000 || res.state === 200) && res.data ? res.data : []
}, [], { immediate: false })

// ==================== 图表数据（共享 loading） ====================
const chartLoading = ref(false)
const monthlySalesData = ref<ChartData[]>([])
const pieChartData = ref<PieItem[]>([])
const salesTrendData = ref<ChartData[]>([])

const loadMonthlySales = async (period: string) => {
	chartLoading.value = true
	try {
		const res = await dashboard.getMonthlySales(period as "week" | "month" | "year")
		if (res.state === 2000 || res.state === 200) {
			monthlySalesData.value = res.data || []
		}
	} finally {
		chartLoading.value = false
	}
}

const loadPieData = async (type: string) => {
	chartLoading.value = true
	try {
		const res = await dashboard.getPieData(type)
		if (res.state === 2000 || res.state === 200) {
			pieChartData.value = res.data || []
		}
	} finally {
		chartLoading.value = false
	}
}

const loadSalesTrend = async (year: string) => {
	chartLoading.value = true
	try {
		const res = await dashboard.getSalesTrend(year)
		if (res.state === 2000 || res.state === 200) {
			salesTrendData.value = res.data || []
		}
	} finally {
		chartLoading.value = false
	}
}

// ==================== 订单列表 ====================
const orderLoading = ref(false)
const orderList = ref<OrderItem[]>([])

const loadOrders = async (page: number = 1, pageSize: number = 10) => {
	orderLoading.value = true
	try {
		const res = await dashboard.getOrders(page, pageSize)
		if ((res.state === 2000 || res.state === 200) && res.data) {
			orderList.value = res.data.list || []
		}
	} finally {
		orderLoading.value = false
	}
}

// ==================== 柱状图配置 ====================
const barOption = computed(() => ({
	tooltip: {
		trigger: "axis",
		axisPointer: {
			type: "shadow"
		}
	},
	grid: {
		left: "3%",
		right: "4%",
		bottom: "3%",
		top: "10%",
		containLabel: true
	},
	xAxis: {
		type: "category",
		data: monthlySalesData.value.map((item: ChartData) => item.month),
		axisLine: {
			lineStyle: {
				color: "#e4e7ed"
			}
		},
		axisLabel: {
			color: "#606266"
		}
	},
	yAxis: {
		type: "value",
		axisLine: {
			show: false
		},
		axisLabel: {
			color: "#606266"
		},
		splitLine: {
			lineStyle: {
				color: "#f0f0f0"
			}
		}
	},
	series: [
		{
			name: "销售额",
			type: "bar",
			data: monthlySalesData.value.map((item: ChartData) => item.value),
			itemStyle: {
				color: {
					type: "linear",
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{ offset: 0, color: "#409eff" },
						{ offset: 1, color: "#79bbff" }
					]
				},
				borderRadius: [4, 4, 0, 0]
			},
			barWidth: "50%"
		}
	]
}))

// ==================== 饼图配置 ====================
const pieOption = computed(() => ({
	tooltip: {
		trigger: "item",
		formatter: "{b}: {c} ({d}%)"
	},
	legend: {
		orient: "vertical",
		right: "5%",
		top: "center",
		textStyle: {
			color: "#606266"
		}
	},
	series: [
		{
			name: "销售分类",
			type: "pie",
			radius: ["45%", "70%"],
			center: ["35%", "50%"],
			avoidLabelOverlap: false,
			itemStyle: {
				borderRadius: 6,
				borderColor: "#fff",
				borderWidth: 2
			},
			label: {
				show: false,
				position: "center"
			},
			emphasis: {
				label: {
					show: true,
					fontSize: 16,
					fontWeight: "bold"
				}
			},
			labelLine: {
				show: false
			},
			data: pieChartData.value.map((item: PieItem) => ({
				value: item.value,
				name: item.name,
				itemStyle: { color: item.color }
			}))
		}
	]
}))

// ==================== 折线图配置 ====================
const lineOption = computed(() => ({
	tooltip: {
		trigger: "axis"
	},
	legend: {
		data: ["销售额", "订单量"],
		bottom: 0,
		textStyle: {
			color: "#606266"
		}
	},
	grid: {
		left: "3%",
		right: "4%",
		bottom: "15%",
		top: "5%",
		containLabel: true
	},
	xAxis: {
		type: "category",
		boundaryGap: false,
		data: salesTrendData.value.map((item: ChartData) => item.month),
		axisLine: {
			lineStyle: {
				color: "#e4e7ed"
			}
		},
		axisLabel: {
			color: "#606266"
		}
	},
	yAxis: {
		type: "value",
		axisLine: {
			show: false
		},
		axisLabel: {
			color: "#606266"
		},
		splitLine: {
			lineStyle: {
				color: "#f0f0f0"
			}
		}
	},
	series: [
		{
			name: "销售额",
			type: "line",
			smooth: true,
			symbol: "circle",
			symbolSize: 8,
			data: salesTrendData.value.map((item: ChartData) => item.value),
			lineStyle: {
				color: "#409eff",
				width: 2
			},
			itemStyle: {
				color: "#409eff"
			},
			areaStyle: {
				color: {
					type: "linear",
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{ offset: 0, color: "rgba(64, 158, 255, 0.3)" },
						{ offset: 1, color: "rgba(64, 158, 255, 0.05)" }
					]
				}
			}
		},
		{
			name: "订单量",
			type: "line",
			smooth: true,
			symbol: "circle",
			symbolSize: 8,
			data: salesTrendData.value.map((item: ChartData) => Math.floor(item.value / 20)),
			lineStyle: {
				color: "#67c23a",
				width: 2
			},
			itemStyle: {
				color: "#67c23a"
			}
		}
	]
}))

// ==================== 状态映射 ====================
const getStatusType = (status: OrderItem["status"]) => {
	const map: Record<OrderItem["status"], string> = {
		pending: "warning",
		processing: "primary",
		completed: "success",
		cancelled: "info"
	}
	return map[status]
}

const getStatusText = (status: OrderItem["status"]) => {
	const map: Record<OrderItem["status"], string> = {
		pending: "待处理",
		processing: "处理中",
		completed: "已完成",
		cancelled: "已取消"
	}
	return map[status]
}

// ==================== 事件处理 ====================
const handleBarPeriodChange = (period: string) => {
	loadMonthlySales(period)
}

const handlePieTypeChange = (type: string) => {
	loadPieData(type)
}

const handleYearChange = (year: string) => {
	loadSalesTrend(year)
}

const handleExportData = () => {
	ElMessage.success("操作成功")
}

const handleViewAllOrders = () => {
	ElMessage.info("查看全部")
}

const handleViewOrder = (row: OrderItem) => {
	ElMessage.info(`查看 ${row.orderNo}`)
}

const handleExportOrder = (row: OrderItem) => {
	ElMessage.success(`导出 ${row.orderNo}`)
}

// ==================== 初始化加载 ====================
onMounted(async () => {
	await Promise.all([
		loadStats(),
		loadMonthlySales(barPeriod.value),
		loadPieData(pieType.value),
		loadSalesTrend(lineYear.value),
		loadOrders()
	])
})
</script>
