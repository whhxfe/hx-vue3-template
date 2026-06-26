<template>
	<div id="section-online" class="online-behavior-container">
		<h4 class="sub-section-title">线上行为</h4>

		<!-- 日期筛选 -->
		<div class="filter-container">
			<el-form :inline="true" :model="filterState">
				<el-form-item label="分析时段">
					<el-date-picker
						v-model="filterState.dateRange"
						type="daterange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						value-format="YYYY-MM-DD"
						:shortcuts="dateRangeShortcuts"
						style="width: 260px"
					/>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSearch">
						<el-icon><Search /></el-icon>
						查询
					</el-button>
					<el-button @click="handleReset">
						<el-icon><RefreshRight /></el-icon>
						重置
					</el-button>
				</el-form-item>
			</el-form>
		</div>

		<!-- 卡片展示 -->
		<div class="card-grid">
			<NetHabitCard :unit-id="unitId" :date-range="appliedDateRange" />
			<PacketAnalysisCard :unit-id="unitId" :date-range="appliedDateRange" />
			<AppUsageCard :unit-id="unitId" :date-range="appliedDateRange" />
			<WebsiteVisitCard :unit-id="unitId" :date-range="appliedDateRange" />
			<ContentAnalysisCard :unit-id="unitId" :date-range="appliedDateRange" />
			<MediaAnalysisCard :unit-id="unitId" :date-range="appliedDateRange" />
			<LargeFileCard :unit-id="unitId" :date-range="appliedDateRange" />
			<KeyPortCard :unit-id="unitId" :date-range="appliedDateRange" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue"
import { useThrottleFn } from "@vueuse/core"
import { Search, RefreshRight } from "@element-plus/icons-vue"
import {
	NetHabitCard,
	PacketAnalysisCard,
	AppUsageCard,
	WebsiteVisitCard,
	ContentAnalysisCard,
	MediaAnalysisCard,
	LargeFileCard,
	KeyPortCard
} from "./online-behavior"
import { dateRangeShortcuts } from "@/modules/ktc/config/dateShortcuts"

defineOptions({ name: "OnlineBehavior" })

const props = defineProps<{
	unitId: number
}>()

// 表单筛选状态（用户当前编辑的值）
const filterState = reactive({
	dateRange: null as [string, string] | null
})

// 已应用的日期范围（点击查询后才推送给卡片）
const appliedDateRange = ref<[string, string] | null>(null)

const applySearch = () => {
	appliedDateRange.value = filterState.dateRange ? [...filterState.dateRange] : null
}

const applyReset = () => {
	filterState.dateRange = null
	appliedDateRange.value = null
}

// 1500ms 节流：防止用户连续点击触发重复请求
const handleSearch = useThrottleFn(applySearch, 1500)
const handleReset = useThrottleFn(applyReset, 1500)

watch(() => props.unitId, () => {
	filterState.dateRange = null
	appliedDateRange.value = null
})
</script>

<style lang="scss" scoped>
.online-behavior-container {
	margin-bottom: 24px;
	padding: 16px;
	background: var(--el-fill-color-lighter);
	border-radius: 6px;
	border: 1px solid var(--el-border-color-extra-light);
}

.sub-section-title {
	margin: 0 0 16px 0;
	font-size: 14px;
	font-weight: 600;
	color: var(--el-text-color-primary);
	position: relative;
	padding-left: 10px;

	&::before {
		content: "";
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 3px;
		height: 14px;
		background: var(--el-color-primary);
		border-radius: 2px;
	}
}

.filter-container {
	margin-bottom: 16px;

	:deep(.el-form-item) {
		margin-bottom: 0;
	}
}

.card-grid {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 16px;

	@media (max-width: 1400px) {
		grid-template-columns: repeat(3, 1fr);
	}

	@media (max-width: 1100px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (max-width: 768px) {
		grid-template-columns: 1fr;
	}
}
</style>