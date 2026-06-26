<template>
	<div class="gw-container">
		<!-- 筛选表单 -->
		<div class="filter-section">
			<div class="filter-row">
				<div class="filter-item">
					<span class="filter-label">关键字：</span>
					<el-input v-model="formData.keyword" placeholder="请输入姓名、身份证号" clearable style="width: 200px" @keyup.enter="handleSearch" />
				</div>
				<div class="filter-item">
					<span class="filter-label">群体名称：</span>
					<el-select v-model="formData.groupName" placeholder="请选择" clearable style="width: 160px">
						<el-option v-for="item in groupOptions" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</div>
				<div class="filter-item">
					<span class="filter-label">人员分值：</span>
					<el-select v-model="formData.score" placeholder="请选择" clearable style="width: 140px">
						<el-option v-for="item in scoreOptions" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</div>
				<div class="filter-item">
					<span class="filter-label">预警类型：</span>
					<el-select v-model="formData.warningType" placeholder="请选择" clearable style="width: 140px">
						<el-option v-for="item in warningTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</div>
				<div class="filter-item">
					<el-checkbox v-model="formData.isJudged">已研判</el-checkbox>
				</div>
				<div class="filter-actions">
					<el-button type="primary" @click="handleSearch">查询</el-button>
					<el-button @click="handleReset">重置</el-button>
				</div>
			</div>
		</div>

		<!-- 数据展示区域 -->
		<div class="data-section">
			<!-- 操作栏 -->
			<div class="data-header">
				<div class="header-left">
					<el-dropdown trigger="click" @command="handleSortChange">
						<el-button>
							{{ sortLabelMap[sortField] || '排序方式' }}
							<el-icon class="el-icon--right"><ArrowDown /></el-icon>
						</el-button>
						<template #dropdown>
							<el-dropdown-menu>
								<el-dropdown-item command="score">推荐分值</el-dropdown-item>
								<el-dropdown-item command="entryTime">录入时间</el-dropdown-item>
								<el-dropdown-item command="alarmCount">报警数</el-dropdown-item>
							</el-dropdown-menu>
						</template>
					</el-dropdown>
					<el-button link type="primary" @click="toggleSortOrder">
						<el-icon>
							<SortUp v-if="sortOrder === 'asc'" />
							<SortDown v-else />
						</el-icon>
					</el-button>
				</div>
				<div class="header-right">
					<HxExporter
						ref="exporterRef"
						:export-action="'/ktc/tgm/gw/export'"
						:method="'post'"
						:current-page="pagination.currentPage"
						:page-size="pagination.pageSize"
						:total-count="pagination.total"
						:max-export-count="10000"
						button-text="导出"
						dialog-title="导出群体预警数据"
						:get-search-params="getSearchParams"
						@success="handleExportSuccess"
						@error="handleExportError"
					/>
				</div>
			</div>

			<!-- 卡片列表 -->
			<div class="card-list" v-loading="tableLoading">
				<div
					v-for="item in tableData"
					:key="item.id"
					class="warning-card"
				>
					<div class="card-main">
						<div class="card-left">
							<el-avatar :size="48">
								<el-icon :size="24"><User /></el-icon>
							</el-avatar>
							<div class="card-title-area">
								<div class="card-title-row">
									<span class="card-name">{{ item.name }}</span>
									<span class="card-idcard">{{ item.idCard }}</span>
									<span class="card-meta">{{ item.gender }} {{ item.age }}岁</span>
									<el-tag :type="getWarningTagType(item.warningLevel)" size="small" effect="dark">
										{{ item.warningLevelName }}
									</el-tag>
									<span class="card-score" :class="getScoreClass(item.score)">{{ item.score }}分</span>
									<span class="score-change" :class="item.scoreChange === '↑' ? 'up' : (item.scoreChange === '↓' ? 'down' : '')">
										{{ item.scoreChange }}
									</span>
									<el-tag v-if="item.isIgnored" type="info" size="small" effect="plain" class="ignore-tag">
										<el-icon><WarningFilled /></el-icon> 忽略
									</el-tag>
								</div>
							</div>
						</div>
						<div class="card-right">
							<span v-if="item.isJudged" class="judged-stamp">已研判</span>
							<el-button type="primary" link @click="handleAnalysis(item)">分析研判</el-button>
						</div>
					</div>
					<div class="card-body">
						<div class="info-row">
							<div class="info-col">
								<span class="info-label">所属群体：</span>
								<span class="info-value">{{ item.groupName }}</span>
							</div>
							<div class="info-col">
								<span class="info-label">区域报警：</span>
								<span class="info-value">今日报警 <span :class="{ 'alarm-highlight': item.regionAlarm > 0 }">{{ item.regionAlarm }}</span>次</span>
							</div>
							<div class="info-col">
								<span class="info-label">身份信息：</span>
								<span class="info-value">{{ item.identityInfo }}</span>
							</div>
						</div>
						<div class="info-row">
							<div class="info-col">
								<span class="info-label">手机号：</span>
								<span class="info-value">{{ item.phone }}</span>
							</div>
							<div class="info-col">
								<span class="info-label">聚集报警：</span>
								<span class="info-value">今日报警 <span :class="{ 'alarm-highlight': item.gatherAlarm > 0 }">{{ item.gatherAlarm }}</span>次</span>
							</div>
							<div class="info-col">
								<span class="info-label">行为信息：</span>
								<span class="info-value">{{ item.behaviorInfo }}</span>
							</div>
						</div>
						<div class="info-row">
							<div class="info-col">
								<span class="info-label">户籍地址：</span>
								<span class="info-value">{{ item.address }}</span>
							</div>
							<div class="info-col">
								<span class="info-label">行为报警：</span>
								<span class="info-value">今日报警 <span :class="{ 'alarm-highlight': item.behaviorAlarm > 0 }">{{ item.behaviorAlarm }}</span>次</span>
							</div>
							<div class="info-col">
								<span class="info-label">关系信息：</span>
								<span class="info-value">{{ item.relationInfo }}</span>
							</div>
						</div>
					</div>
				</div>

				<el-empty v-if="!tableLoading && tableData.length === 0" description="暂无数据" />
			</div>

			<!-- 分页 -->
			<div class="pagination-wrapper">
				<span class="page-info">
					当前显示{{ pageStart }}-{{ pageEnd }}条，共{{ pagination.total }}条
				</span>
				<div class="page-size-wrap">
					<el-select v-model="pagination.pageSize" size="small" @change="handleSizeChange">
						<el-option :value="10" label="10条/页" />
						<el-option :value="20" label="20条/页" />
						<el-option :value="50" label="50条/页" />
					</el-select>
				</div>
				<el-pagination
					v-model:current-page="pagination.currentPage"
					v-model:page-size="pagination.pageSize"
					:total="pagination.total"
					:page-sizes="[10, 20, 50]"
					layout="prev, pager, next, jumper"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue"
import { ElMessage } from "element-plus"
import { ArrowDown, SortUp, SortDown, User, WarningFilled } from "@element-plus/icons-vue"
import { HxExporter } from "@whhx/ui"
import { gw } from "@/modules/ktc/api/tgm/gw"
import type { WarningItem } from "@/modules/ktc/api/tgm/gw"

defineOptions({ name: 'GroupWarning' })

type ExporterExpose = { open: () => void; close: () => void }

const exporterRef = ref<ExporterExpose>()

// ==================== 下拉选项 ====================
const groupOptions = ref<{ label: string; value: string }[]>([])
const scoreOptions = ref<{ label: string; value: string }[]>([])
const warningTypeOptions = ref<{ label: string; value: string }[]>([])

const loadOptions = async () => {
	try {
		const [groupRes, scoreRes, typeRes] = await Promise.all([
			gw.getGroupOptions(),
			gw.getScoreOptions(),
			gw.getWarningTypeOptions()
		])
		groupOptions.value = groupRes.data || []
		scoreOptions.value = scoreRes.data || []
		warningTypeOptions.value = typeRes.data || []
	} catch {
		// use defaults
	}
}

// ==================== 筛选 ====================
const formData = ref({
	keyword: "",
	groupName: "",
	score: "",
	warningType: "",
	isJudged: false
})

// ==================== 排序 ====================
const sortField = ref("score")
const sortOrder = ref<"asc" | "desc">("desc")
const sortLabelMap: Record<string, string> = {
	score: "推荐分值",
	entryTime: "录入时间",
	alarmCount: "报警数"
}

const handleSortChange = (command: string) => {
	sortField.value = command
	pagination.currentPage = 1
	loadTableData()
}

const toggleSortOrder = () => {
	sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc"
	pagination.currentPage = 1
	loadTableData()
}

// ==================== 分页 ====================
const pagination = reactive({ currentPage: 1, pageSize: 10, total: 0 })
const pageStart = computed(() => pagination.total === 0 ? 0 : (pagination.currentPage - 1) * pagination.pageSize + 1)
const pageEnd = computed(() => Math.min(pagination.currentPage * pagination.pageSize, pagination.total))

// ==================== 数据 ====================
const tableData = ref<WarningItem[]>([])
const tableLoading = ref(false)

// ==================== 方法 ====================
const buildQuery = () => ({
	page: pagination.currentPage,
	pageSize: pagination.pageSize,
	keyword: formData.value.keyword || undefined,
	groupName: formData.value.groupName || undefined,
	score: formData.value.score || undefined,
	warningType: formData.value.warningType || undefined,
	isJudged: formData.value.isJudged || undefined,
	sortField: sortField.value,
	sortOrder: sortOrder.value
})

const getSearchParams = () => buildQuery()

const loadTableData = async () => {
	tableLoading.value = true
	try {
		const res = await gw.getList(buildQuery())
		tableData.value = res.data?.list || []
		pagination.total = res.data?.total || 0
	} catch {
		tableData.value = []
		pagination.total = 0
	} finally {
		tableLoading.value = false
	}
}

const handleSearch = () => {
	pagination.currentPage = 1
	loadTableData()
}

const handleReset = () => {
	formData.value = { keyword: "", groupName: "", score: "", warningType: "", isJudged: false }
	pagination.currentPage = 1
	loadTableData()
}

const handleSizeChange = (size: number) => {
	pagination.pageSize = size
	pagination.currentPage = 1
	loadTableData()
}

const handleCurrentChange = (page: number) => {
	pagination.currentPage = page
	loadTableData()
}

const handleAnalysis = (item: WarningItem) => {
	ElMessage.info(`分析研判：${item.name}`)
}

const getWarningTagType = (level: string) => {
	const map: Record<string, string> = {
		"红色预警": "danger",
		"橙色预警": "warning",
		"黄色预警": "",
		"蓝色预警": "info"
	}
	return map[level] || "info"
}

const getScoreClass = (score: number) => {
	if (score >= 90) return "score-high"
	if (score >= 80) return "score-medium"
	return "score-low"
}

const handleExportSuccess = () => {
	ElMessage.success("导出成功")
}

const handleExportError = (error: any) => {
	ElMessage.error(error.message || "导出失败")
}

// ==================== 生命周期 ====================
onMounted(() => {
	loadOptions()
	loadTableData()
})
</script>

<style lang="scss" scoped>
.gw-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 16px;
	background: var(--el-bg-color-page, #f5f7fa);
	gap: 16px;
	overflow: hidden;

	.filter-section {
		background: var(--el-bg-color, #fff);
		border-radius: 8px;
		padding: 16px;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
		flex-shrink: 0;

		.filter-row {
			display: flex;
			align-items: center;
			gap: 16px;
			flex-wrap: wrap;

			.filter-item {
				display: flex;
				align-items: center;
				gap: 8px;

				.filter-label {
					color: var(--el-text-color-secondary);
					font-size: 14px;
					white-space: nowrap;
				}
			}

			.filter-actions {
				display: flex;
				gap: 8px;
				margin-left: auto;
			}
		}
	}

	.data-section {
		flex: 1;
		background: var(--el-bg-color, #fff);
		border-radius: 8px;
		padding: 16px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

		.data-header {
			flex-shrink: 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 16px;

			.header-left {
				display: flex;
				align-items: center;
				gap: 4px;
			}
		}

		.card-list {
			flex: 1;
			overflow-y: auto;
			display: flex;
			flex-direction: column;
			gap: 16px;

			.warning-card {
				border: 1px solid var(--el-border-color);
				border-radius: 10px;
				padding: 16px;
				transition: all 0.3s;

				&:hover {
					border-color: var(--el-color-primary);
					box-shadow: 0 2px 12px rgba(64, 158, 255, 0.1);
				}

				.card-main {
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					margin-bottom: 12px;

					.card-left {
						display: flex;
						align-items: center;
						gap: 12px;
						min-width: 0;
						flex: 1;

						.card-title-area {
							min-width: 0;
							flex: 1;

							.card-title-row {
								display: flex;
								align-items: center;
								gap: 8px;
								flex-wrap: wrap;
							}

							.card-name {
								font-size: 16px;
								font-weight: 600;
								color: var(--el-text-color-primary);
							}

							.card-idcard {
								font-size: 13px;
								color: var(--el-text-color-secondary);
							}

							.card-meta {
								font-size: 13px;
								color: var(--el-text-color-regular);
							}

							.card-score {
								font-size: 14px;
								font-weight: 600;
								padding: 2px 8px;
								border-radius: 4px;

								&.score-high {
									background: rgba(245, 108, 108, 0.1);
									color: var(--el-color-danger);
								}

								&.score-medium {
									background: rgba(230, 162, 60, 0.1);
									color: var(--el-color-warning);
								}

								&.score-low {
									background: rgba(103, 194, 58, 0.1);
									color: var(--el-color-success);
								}
							}

							.score-change {
								font-size: 14px;
								font-weight: 600;

								&.up { color: var(--el-color-danger); }
								&.down { color: var(--el-color-success); }
							}

							.ignore-tag {
								margin-left: 4px;

								.el-icon {
									margin-right: 2px;
								}
							}
						}
					}

					.card-right {
						display: flex;
						align-items: center;
						gap: 16px;
						flex-shrink: 0;

						.judged-stamp {
							font-size: 12px;
							color: var(--el-color-danger);
							border: 2px solid var(--el-color-danger);
							border-radius: 50%;
							padding: 2px 6px;
							transform: rotate(-15deg);
							opacity: 0.7;
							font-weight: 600;
						}
					}
				}

				.card-body {
					display: flex;
					flex-direction: column;
					gap: 6px;
					padding-left: 60px;

					.info-row {
						display: grid;
						grid-template-columns: repeat(3, 1fr);
						gap: 12px;

						.info-col {
							font-size: 13px;

							.info-label {
								color: var(--el-text-color-secondary);
							}

							.info-value {
								color: var(--el-text-color-regular);

								.alarm-highlight {
									color: var(--el-color-danger);
									font-weight: 600;
								}
							}
						}
					}
				}
			}
		}

		.pagination-wrapper {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			gap: 12px;
			padding-top: 16px;
			border-top: 1px solid var(--el-border-color);
			margin-top: 16px;

			.page-info {
				font-size: 13px;
				color: var(--el-text-color-secondary);
			}

			.page-size-wrap {
				:deep(.el-select) {
					width: 110px;
				}
			}

			:deep(.el-pagination) {
				margin-left: auto;
			}
		}
	}
}
</style>
