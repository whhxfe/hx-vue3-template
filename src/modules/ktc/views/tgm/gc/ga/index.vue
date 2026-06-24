<template>
	<div class="ga-container">
		<!-- 主内容 -->
		<div class="main-content" ref="mainContentRef">
			<!-- 基本信息 -->
			<div class="section" id="section-basic">
				<div class="section-header">
					<div class="section-title">
						<el-icon><Document /></el-icon>
						<span>基本信息</span>
					</div>
					<div class="section-actions">
						<el-button>我的一天</el-button>
						<el-button>操作日志</el-button>
					</div>
				</div>
				<div class="basic-info-card" v-loading="infoLoading">
					<div class="info-header">
						<el-avatar :size="56">
							<el-icon :size="28"><User /></el-icon>
						</el-avatar>
						<h3 class="group-name">{{ groupInfo.name }}</h3>
					</div>
					<div class="info-grid">
						<div class="info-item">
							<span class="info-label">群体类型：</span>
							<span class="info-value">{{ groupInfo.categoryType }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">管控类别：</span>
							<span class="info-value">{{ groupInfo.controlCategory }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">群体属地：</span>
							<span class="info-value">{{ groupInfo.territory }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">群体人员：</span>
							<span class="info-value">{{ groupInfo.memberCount }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">活跃人员：</span>
							<span class="info-value">{{ groupInfo.activeCount }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">推荐人员：</span>
							<span class="info-value">{{ groupInfo.recommendCount }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">关注民警：</span>
							<span class="info-value">{{ groupInfo.policeName }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">关注单位：</span>
							<span class="info-value">{{ groupInfo.unitName }}</span>
						</div>
					</div>
					<div class="info-row-full">
						<span class="info-label">关注原因：</span>
						<span class="info-value">{{ groupInfo.reason }}</span>
					</div>
					<div class="info-row-full">
						<span class="info-label">预警类型：</span>
						<div class="info-value">
							<el-tag v-for="tag in groupInfo.warningTypes" :key="tag" size="small" type="danger" effect="plain" class="warning-tag">
								{{ tag }}
							</el-tag>
							<span v-if="!groupInfo.warningTypes?.length">—</span>
						</div>
					</div>
				</div>
			</div>

			<!-- 共性分析 -->
			<div class="section" id="section-common">
				<div class="section-header">
					<div class="section-title">
						<el-icon><Search /></el-icon>
						<span>共性分析</span>
					</div>
				</div>
				<div class="common-tabs">
					<el-tabs v-model="commonTab" @tab-change="handleCommonTabChange">
						<el-tab-pane
							v-for="tab in commonTabs"
							:key="tab.key"
							:label="`${tab.label}(${tab.count})`"
							:name="tab.key"
						/>
					</el-tabs>
				</div>
				<el-table :data="communityGroups" border style="width: 100%">
					<el-table-column type="expand">
						<template #default="{ row }">
							<div class="expand-table">
								<el-table :data="row.members" border size="small">
									<el-table-column prop="qqNumber" label="QQ号" width="120" />
									<el-table-column prop="nickname" label="昵称" width="120" />
									<el-table-column prop="phone" label="手机号" width="130" />
									<el-table-column prop="name" label="姓名" width="100" />
									<el-table-column prop="idCard" label="身份证号" />
								</el-table>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="groupName" label="群名称" min-width="140" />
					<el-table-column prop="groupNumber" label="群号" width="120" />
					<el-table-column prop="groupType" label="群组类型" width="100" align="center" />
					<el-table-column prop="commonMembers" label="共群成员" width="100" align="center" />
					<el-table-column prop="description" label="描述" min-width="180" show-overflow-tooltip />
				</el-table>
			</div>

			<!-- 行为信息 -->
			<div class="section" id="section-behavior">
				<div class="section-header">
					<div class="section-title">
						<el-icon><Monitor /></el-icon>
						<span>行为信息</span>
					</div>
				</div>

				<!-- 线上行为 -->
				<div class="behavior-subsection" id="section-online">
					<h4 class="subsection-title">线上行为</h4>
					<div class="time-range-bar">
						<span class="range-label">分析时段：</span>
						<div class="date-picker-wrap">
							<el-date-picker
								v-model="behaviorTimeRange"
								type="daterange"
								range-separator="~"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								value-format="YYYY-MM-DD"
								:shortcuts="dateShortcuts"
							/>
						</div>
					</div>
					<div class="analysis-cards">
						<div class="analysis-card">
							<div class="card-title">
								<el-icon color="#409eff"><Monitor /></el-icon>
								<span>上网习惯分析</span>
								<el-link type="primary" :underline="false" class="more-link">更多 »</el-link>
							</div>
							<div class="card-body">
								<p>最常上网时段：<strong>20:00-23:00</strong></p>
								<p>上网次数：<strong>128</strong></p>
							</div>
						</div>
						<div class="analysis-card">
							<div class="card-title">
								<el-icon color="#409eff"><Location /></el-icon>
								<span>上网地点分析</span>
								<el-link type="primary" :underline="false" class="more-link">更多 »</el-link>
							</div>
							<div class="card-body">
								<p>最常上网地点：<strong>哈尔滨市道里区和和平...</strong></p>
								<p>上网次数：<strong>86</strong></p>
							</div>
						</div>
						<div class="analysis-card">
							<div class="card-title">
								<el-icon color="#409eff"><Grid /></el-icon>
								<span>使用应用分析</span>
								<el-link type="primary" :underline="false" class="more-link">更多 »</el-link>
							</div>
							<div class="card-body">
								<p>最常用应用：<strong>微信</strong></p>
								<p>使用次数：<strong>69</strong></p>
							</div>
						</div>
						<div class="analysis-card">
							<div class="card-title">
								<el-icon color="#409eff"><Position /></el-icon>
								<span>访问网站分析</span>
								<el-link type="primary" :underline="false" class="more-link">更多 »</el-link>
							</div>
							<div class="card-body">
								<p>最常访问网站：<strong>www.baidu.com</strong></p>
								<p>访问次数：<strong>88</strong></p>
							</div>
						</div>
						<div class="analysis-card">
							<div class="card-title">
								<el-icon color="#409eff"><Document /></el-icon>
								<span>内容分析</span>
								<el-link type="primary" :underline="false" class="more-link">更多 »</el-link>
							</div>
							<div class="card-body">
								<p>敏感图片数量：<strong>128</strong></p>
								<p>敏感音频数量：<strong>86</strong></p>
								<p>敏感视频数量：<strong>216</strong></p>
							</div>
						</div>
						<div class="analysis-card">
							<div class="card-title">
								<el-icon color="#409eff"><VideoCamera /></el-icon>
								<span>多媒体分析</span>
								<el-link type="primary" :underline="false" class="more-link">更多 »</el-link>
							</div>
							<div class="card-body">
								<p>大文件数量：<strong>1,317</strong></p>
								<p>最常产生大文件应用：<strong>百度网盘</strong></p>
								<p>最常使用大文件类型：<strong>视频</strong></p>
							</div>
						</div>
						<div class="analysis-card">
							<div class="card-title">
								<el-icon color="#409eff"><FolderOpened /></el-icon>
								<span>大文件分析</span>
								<el-link type="primary" :underline="false" class="more-link">更多 »</el-link>
							</div>
							<div class="card-body">
								<p>重点端口数量：<strong>219</strong></p>
								<p>访问总次数：<strong>9,219</strong></p>
								<p>最常访问重点端口：<strong>8082</strong></p>
							</div>
						</div>
						<div class="analysis-card">
							<div class="card-title">
								<el-icon color="#409eff"><Connection /></el-icon>
								<span>重点端口分析</span>
								<el-link type="primary" :underline="false" class="more-link">更多 »</el-link>
							</div>
							<div class="card-body">
								<p>重点端口数量：<strong>219</strong></p>
								<p>访问总次数：<strong>9,219</strong></p>
								<p>最常访问重点端口：<strong>8082</strong></p>
							</div>
						</div>
					</div>
				</div>

				<!-- 行为活动 -->
				<div class="behavior-subsection" id="section-offline">
					<h4 class="subsection-title">行为活动</h4>
					<div class="activity-filter">
						<el-row :gutter="16">
							<el-col :span="6">
								<div class="filter-item">
									<span class="filter-label">数据来源：</span>
									<el-input v-model="activityFilter.dataSource" placeholder="请输入" clearable />
								</div>
							</el-col>
							<el-col :span="6">
								<div class="filter-item">
									<span class="filter-label">资源类型：</span>
									<el-input v-model="activityFilter.resourceType" placeholder="请输入" clearable />
								</div>
							</el-col>
							<el-col :span="6">
								<div class="filter-item">
									<span class="filter-label">动作：</span>
									<el-input v-model="activityFilter.action" placeholder="请输入" clearable />
								</div>
							</el-col>
						</el-row>
						<el-row :gutter="16" style="margin-top: 12px">
							<el-col :span="12">
								<div class="filter-item">
									<span class="filter-label">截获时间：</span>
									<el-radio-group v-model="activityTimeType" size="default">
										<el-radio-button value="all">全部</el-radio-button>
										<el-radio-button value="week">近一周</el-radio-button>
										<el-radio-button value="month">近一月</el-radio-button>
										<el-radio-button value="quarter">近三月</el-radio-button>
										<el-radio-button value="custom">自定义</el-radio-button>
									</el-radio-group>
									<el-date-picker
										v-if="activityTimeType === 'custom'"
										v-model="activityTimeRange"
										type="daterange"
										range-separator="~"
										start-placeholder="开始日期"
										end-placeholder="结束日期"
										value-format="YYYY-MM-DD"
										style="width: 280px; margin-left: 8px"
									/>
								</div>
							</el-col>
							<el-col :span="12" style="text-align: right">
								<el-button type="primary" @click="loadActivities">查询</el-button>
								<el-button @click="resetActivityFilter">重置</el-button>
							</el-col>
						</el-row>
					</div>
					<el-table :data="activities" border style="width: 100%; margin-top: 12px">
						<el-table-column prop="sourceIp" label="源IP" width="130" />
						<el-table-column prop="sourcePort" label="源端口" width="80" align="center" />
						<el-table-column prop="destIp" label="目的IP" width="130" />
						<el-table-column prop="destPort" label="目的端口" width="90" align="center" />
						<el-table-column prop="protocol" label="协议类型" width="90" align="center" />
						<el-table-column prop="action" label="动作" width="80" align="center" />
						<el-table-column prop="dataSource" label="数据来源" width="100" />
						<el-table-column prop="resourceType" label="资源类型" width="90" />
						<el-table-column prop="captureTime" label="截获时间" width="170" sortable />
						<el-table-column prop="phone" label="关联手机号" width="130" />
					</el-table>
					<div class="activity-pagination">
						<el-pagination
							v-model:current-page="activityPage"
							v-model:page-size="activityPageSize"
							:total="activityTotal"
							:page-sizes="[10, 20, 50]"
							layout="total, sizes, prev, pager, next"
							@size-change="loadActivities"
							@current-change="loadActivities"
						/>
					</div>
				</div>
			</div>

			<!-- 研判信息 -->
			<div class="section" id="section-judgment">
				<div class="section-header">
					<div class="section-title">
						<el-icon><Document /></el-icon>
						<span>研判信息</span>
					</div>
				</div>
				<div v-for="item in judgments" :key="item.id" class="judgment-card">
					<div class="judgment-header">
						<span class="judgment-title">研判结论：</span>
						<el-tag :type="item.conclusionType === '重点关注' ? 'danger' : 'warning'" effect="dark" size="default">
							{{ item.conclusion }}
						</el-tag>
					</div>
					<div class="judgment-meta">
						<span>研判单位：{{ item.unit }}</span>
						<span>研判人：{{ item.person }}</span>
						<span>研判时间：{{ item.time }}</span>
					</div>
					<div class="judgment-basis">
						<span>研判依据：</span>{{ item.basis }}
					</div>
				</div>
				<el-empty v-if="judgments.length === 0" description="暂无研判信息" />
			</div>
		</div>

		<!-- 右侧导航 -->
		<div class="side-nav">
			<div
				v-for="item in navItems"
				:key="item.key"
				:class="['nav-item', { active: activeNav === item.key }]"
				@click="scrollToSection(item.key)"
			>
				<el-icon><component :is="item.icon" /></el-icon>
				<span>{{ item.label }}</span>
			</div>
			<div
				v-for="item in behaviorSubItems"
				:key="item.key"
				:class="['nav-item sub', { active: activeNav === item.key }]"
				@click="scrollToSection(item.key)"
			>
				<span>{{ item.label }}</span>
			</div>
			<div
				:class="['nav-item', { active: activeNav === 'judgment' }]"
				@click="scrollToSection('judgment')"
			>
				<el-icon><Document /></el-icon>
				<span>研判信息</span>
			</div>
		</div>

		<!-- 浮动研判按钮 -->
		<div class="float-judge-btn" @click="handleFloatJudge">研判</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { useRoute } from "vue-router"
import { ElMessage } from "element-plus"
import { Document, User, Search, Monitor, Location, Grid, Position, VideoCamera, FolderOpened, Connection } from "@element-plus/icons-vue"
import { ga } from "@/modules/ktc/api/tgm/gc"
import type { GaGroupInfo, GaCommunityGroup, GaBehaviorActivity, GaJudgment } from "@/modules/ktc/api/tgm/gc/ga"

defineOptions({ name: 'GroupArchive' })

const route = useRoute()
const groupId = ref(Number(route.query.groupId) || 0)

// ==================== 导航 ====================
const activeNav = ref("basic")
const navItems = [
	{ key: "basic", label: "基本信息", icon: Document },
	{ key: "common", label: "共性分析", icon: Search },
	{ key: "behavior", label: "行为信息", icon: Monitor }
]

const behaviorSubItems = [
	{ key: "online", label: "线上行为" },
	{ key: "offline", label: "线下行为" }
]

const mainContentRef = ref<HTMLElement>()

const scrollToSection = (key: string) => {
	activeNav.value = key
	const el = document.getElementById(`section-${key}`)
	el?.scrollIntoView({ behavior: "smooth", block: "start" })
}

// ==================== 基本信息 ====================
const infoLoading = ref(false)
const groupInfo = ref<GaGroupInfo>({
	id: 0, name: "", categoryType: "", controlCategory: "", territory: "",
	memberCount: 0, activeCount: 0, recommendCount: 0, policeName: "", unitName: "",
	reason: "", warningTypes: []
})

const loadGroupInfo = async () => {
	if (!groupId.value) return
	infoLoading.value = true
	try {
		const res = await ga.getGroupInfo(groupId.value)
		groupInfo.value = res.data || groupInfo.value
	} catch {
		// use default
	} finally {
		infoLoading.value = false
	}
}

// ==================== 共性分析 ====================
const commonTab = ref("group")
const commonTabs = ref<{ key: string; label: string; count: number }[]>([])
const communityGroups = ref<GaCommunityGroup[]>([])

const loadCommonTabs = async () => {
	if (!groupId.value) return
	try {
		const res = await ga.getCommunityTabs(groupId.value)
		commonTabs.value = res.data || []
	} catch {
		commonTabs.value = []
	}
}

const loadCommunityGroups = async (type?: string) => {
	if (!groupId.value) return
	try {
		const tabType = type || commonTab.value
		const res = await ga.getCommunityGroups(groupId.value, tabType)
		communityGroups.value = res.data || []
	} catch {
		communityGroups.value = []
	}
}

const handleCommonTabChange = (tab: string) => {
	commonTab.value = tab
	loadCommunityGroups(tab)
}

// ==================== 行为信息 ====================
const behaviorTimeRange = ref<string[]>([])
const dateShortcuts = [
	{ text: "近一周", value: () => { const e = new Date(); const s = new Date(); s.setDate(s.getDate() - 7); return [s, e] } },
	{ text: "近一月", value: () => { const e = new Date(); const s = new Date(); s.setMonth(s.getMonth() - 1); return [s, e] } },
	{ text: "近三月", value: () => { const e = new Date(); const s = new Date(); s.setMonth(s.getMonth() - 3); return [s, e] } }
]

const activityFilter = reactive({ dataSource: "", resourceType: "", action: "" })
const activityTimeType = ref("all")
const activityTimeRange = ref<string[]>([])
const activities = ref<GaBehaviorActivity[]>([])
const activityPage = ref(1)
const activityPageSize = ref(10)
const activityTotal = ref(0)

const loadActivities = async () => {
	if (!groupId.value) return
	try {
		const res = await ga.getBehaviorActivities(groupId.value, {
			page: activityPage.value, pageSize: activityPageSize.value, ...activityFilter
		})
		activities.value = res.data?.list || []
		activityTotal.value = res.data?.total || 0
	} catch {
		activities.value = []
	}
}

const resetActivityFilter = () => {
	activityFilter.dataSource = ""
	activityFilter.resourceType = ""
	activityFilter.action = ""
	activityTimeType.value = "all"
	activityTimeRange.value = []
	activityPage.value = 1
	loadActivities()
}

// ==================== 研判信息 ====================
const judgments = ref<GaJudgment[]>([])

const loadJudgments = async () => {
	if (!groupId.value) return
	try {
		const res = await ga.getJudgments(groupId.value)
		judgments.value = res.data || []
	} catch {
		judgments.value = []
	}
}

const handleFloatJudge = () => {
	ElMessage.info("打开研判弹窗")
}

// ==================== 生命周期 ====================
onMounted(() => {
	loadGroupInfo()
	loadCommonTabs()
	loadCommunityGroups()
	loadActivities()
	loadJudgments()
})
</script>

<style lang="scss" scoped>
.ga-container {
	display: flex;
	height: 100%;
	background: var(--el-bg-color-page, #f5f7fa);
	overflow: hidden;

	.main-content {
		flex: 1;
		overflow-y: auto;
		padding: 24px 32px;
		padding-bottom: 80px;

		.section {
			margin-bottom: 36px;

			.section-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20px;
				padding-bottom: 12px;
				border-bottom: 2px solid var(--el-color-primary-light-8);

				.section-title {
					display: flex;
					align-items: center;
					gap: 8px;
					font-size: 18px;
					font-weight: 600;
					color: var(--el-text-color-primary);
					.el-icon { color: var(--el-color-primary); }
				}

				.section-actions {
					display: flex;
					gap: 8px;
				}
			}
		}

		.basic-info-card {
			background: var(--el-bg-color, #fff);
			border-radius: 12px;
			padding: 28px;
			box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

			.info-header {
				display: flex;
				align-items: center;
				gap: 20px;
				margin-bottom: 24px;
				padding-bottom: 20px;
				border-bottom: 1px solid var(--el-border-color-lighter);

				.group-name {
					font-size: 20px;
					margin: 0;
					color: var(--el-text-color-primary);
					font-weight: 600;
				}
			}

			.info-grid {
				display: grid;
				grid-template-columns: repeat(4, 1fr);
				gap: 18px;
				margin-bottom: 18px;
			}

			.info-item {
				display: flex;
				align-items: center;
				font-size: 14px;
				line-height: 1.8;
			}

			.info-row-full {
				display: flex;
				align-items: flex-start;
				font-size: 14px;
				margin-bottom: 10px;
				line-height: 1.8;

				.info-value {
					display: flex;
					flex-wrap: wrap;
					gap: 6px;
				}
			}

			.info-label {
				color: var(--el-text-color-secondary);
				white-space: nowrap;
			}

			.info-value {
				color: var(--el-text-color-primary);
			}

			.warning-tag { margin: 0; }
		}

		.common-tabs {
			margin-bottom: 16px;
			background: var(--el-bg-color, #fff);
			border-radius: 12px;
			padding: 16px 20px 0;
			box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
		}

		.expand-table {
			padding: 12px 48px;
		}

		.behavior-subsection {
			margin-bottom: 28px;

			.subsection-title {
				font-size: 16px;
				font-weight: 600;
				margin: 0 0 16px;
				color: var(--el-text-color-primary);
				padding-left: 10px;
				border-left: 3px solid var(--el-color-primary);
			}
		}

		.time-range-bar {
			display: flex;
			align-items: center;
			gap: 12px;
			margin-bottom: 20px;
			padding: 12px 16px;
			background: var(--el-bg-color, #fff);
			border-radius: 8px;
			border: 1px solid var(--el-border-color-lighter);

			.range-label {
				color: var(--el-text-color-secondary);
				font-size: 14px;
				white-space: nowrap;
			}

			.date-picker-wrap {
				width: 260px;

				:deep(.el-date-editor) {
					width: 100% !important;
				}
			}
		}

		.analysis-cards {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 16px;
			margin-bottom: 28px;

			.analysis-card {
				background: linear-gradient(135deg, #f8faff 0%, #fff 100%);
				border: 1px solid var(--el-border-color-lighter);
				border-radius: 12px;
				padding: 20px;
				transition: all 0.3s;
				position: relative;
				overflow: hidden;

				&::before {
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					width: 4px;
					height: 100%;
					background: var(--el-color-primary);
					border-radius: 0 4px 4px 0;
					opacity: 0;
					transition: opacity 0.3s;
				}

				&:hover {
					border-color: var(--el-color-primary-light-5);
					box-shadow: 0 6px 20px rgba(64, 158, 255, 0.15);
					transform: translateY(-3px);

					&::before {
						opacity: 1;
					}
				}

				.card-title {
					display: flex;
					align-items: center;
					gap: 10px;
					font-size: 15px;
					font-weight: 600;
					margin-bottom: 16px;
					color: var(--el-text-color-primary);

					.el-icon {
						font-size: 20px;
						padding: 6px;
						background: var(--el-color-primary-light-9);
						border-radius: 8px;
						color: var(--el-color-primary);
					}

					.more-link {
						margin-left: auto;
						font-size: 12px;
						font-weight: normal;
					}
				}

				.card-body {
					p {
						margin: 8px 0;
						font-size: 13px;
						color: var(--el-text-color-regular);
						line-height: 1.7;

						strong {
							color: var(--el-text-color-primary);
							font-weight: 600;
						}
					}
				}
			}
		}

		.activity-filter {
			background: var(--el-bg-color, #fff);
			border: 1px solid var(--el-border-color-lighter);
			border-radius: 10px;
			padding: 20px;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

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
		}

		.activity-pagination {
			display: flex;
			justify-content: flex-end;
			margin-top: 16px;
		}

		.judgment-card {
			background: var(--el-bg-color, #fff);
			border: 1px solid var(--el-border-color-lighter);
			border-radius: 12px;
			padding: 24px;
			margin-bottom: 16px;
			transition: all 0.2s;

			&:hover {
				box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
			}

			.judgment-header {
				display: flex;
				align-items: center;
				gap: 10px;
				margin-bottom: 14px;

				.judgment-title {
					font-size: 16px;
					font-weight: 600;
					color: var(--el-text-color-primary);
				}
			}

			.judgment-meta {
				display: flex;
				gap: 48px;
				font-size: 14px;
				color: var(--el-text-color-secondary);
				margin-bottom: 14px;
			}

			.judgment-basis {
				font-size: 14px;
				color: var(--el-text-color-regular);
				line-height: 1.8;

				span {
					color: var(--el-text-color-secondary);
				}
			}
		}
	}

	.side-nav {
		width: 140px;
		min-width: 140px;
		background: var(--el-bg-color, #fff);
		border-left: 1px solid var(--el-border-color-lighter);
		display: flex;
		flex-direction: column;
		padding: 16px 0;

		.nav-item {
			display: flex;
			align-items: center;
			gap: 8px;
			padding: 14px 20px;
			cursor: pointer;
			font-size: 14px;
			color: var(--el-text-color-regular);
			transition: all 0.2s;

			.el-icon { font-size: 18px; }

			&:hover {
				color: var(--el-color-primary);
				background: var(--el-fill-color-light);
			}

			&.active {
				color: var(--el-color-primary);
				background: var(--el-color-primary-light-9);
				font-weight: 600;
				border-left: 3px solid var(--el-color-primary);
				padding-left: 17px;
			}

			&.sub {
				padding: 10px 20px 10px 44px;
				font-size: 13px;
				gap: 0;
				color: var(--el-text-color-secondary);

				&.active {
					color: var(--el-color-primary);
					background: transparent;
					font-weight: 500;
					border-left: none;
					padding-left: 44px;
				}
			}
		}
	}

	.float-judge-btn {
		position: fixed;
		right: 140px;
		bottom: 40px;
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: var(--el-color-primary);
		color: #fff;
		font-size: 16px;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		box-shadow: 0 4px 16px rgba(64, 158, 255, 0.4);
		transition: all 0.3s;
		z-index: 100;

		&:hover {
			transform: scale(1.08);
			box-shadow: 0 6px 20px rgba(64, 158, 255, 0.5);
		}
	}
}
</style>
