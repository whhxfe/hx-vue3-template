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
						<el-button @click="handleOpenMyDay">我的一天</el-button>
						<el-button @click="handleOpenOpLog">操作日志</el-button>
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
								<el-link type="primary" :underline="false" class="more-link" @click="handleOpenOnlineTime">更多 »</el-link>
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
								<el-link type="primary" :underline="false" class="more-link" @click="handleOpenOnlineLocation">更多 »</el-link>
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
								<el-link type="primary" :underline="false" class="more-link" @click="handleOpenAppAnalysis">更多 »</el-link>
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
								<el-link type="primary" :underline="false" class="more-link" @click="handleOpenWebsiteAnalysis">更多 »</el-link>
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
								<el-link type="primary" :underline="false" class="more-link" @click="handleOpenContentAnalysis">更多 »</el-link>
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
								<el-link type="primary" :underline="false" class="more-link" @click="handleOpenMediaAnalysis">更多 »</el-link>
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
								<el-link type="primary" :underline="false" class="more-link" @click="handleOpenLargeFile">更多 »</el-link>
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
								<el-link type="primary" :underline="false" class="more-link" @click="handleOpenKeyPort">更多 »</el-link>
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
									<div class="date-picker-wrap">
										<el-date-picker
											v-model="activityTimeRange"
											type="daterange"
											range-separator="~"
											start-placeholder="开始日期"
											end-placeholder="结束日期"
											value-format="YYYY-MM-DD"
											:shortcuts="dateShortcuts"
										/>
									</div>
								</div>
							</el-col>
							<el-col :span="12" style="text-align: right">
								<el-button type="primary" @click="loadActivities">查询</el-button>
								<el-button @click="resetActivityFilter">重置</el-button>
							</el-col>
						</el-row>
					</div>
					<el-table :data="activities" border style="width: 100%; margin-top: 12px" :max-height="400">
						<el-table-column prop="sourceIp" label="源IP" min-width="110" />
						<el-table-column prop="sourcePort" label="源端口" width="70" align="center" />
						<el-table-column prop="destIp" label="目的IP" min-width="110" />
						<el-table-column prop="destPort" label="目的端口" width="80" align="center" />
						<el-table-column prop="protocol" label="协议类型" width="80" align="center" />
						<el-table-column prop="action" label="动作" width="70" align="center" />
						<el-table-column prop="dataSource" label="数据来源" min-width="90" />
						<el-table-column prop="resourceType" label="资源类型" width="80" />
						<el-table-column prop="captureTime" label="截获时间" min-width="150" sortable />
						<el-table-column prop="phone" label="关联手机号" min-width="120" />
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

		<!-- 我的一天弹窗 -->
		<el-dialog
			v-model="myDayVisible"
			title="历史动态"
			width="800px"
			:close-on-click-modal="false"
			class="my-day-dialog"
		>
			<div class="my-day-toolbar">
				<el-button @click="handleExportMyDay">导出</el-button>
				<el-input v-model="myDayKeyword" placeholder="请输入" clearable style="width: 200px" @keyup.enter="loadMyDayData">
					<template #append>
						<el-button @click="loadMyDayData">
							<el-icon><Search /></el-icon>
						</el-button>
					</template>
				</el-input>
			</div>
			<div class="my-day-content" v-loading="myDayLoading">
				<div v-for="(group, gIdx) in myDayGroups" :key="gIdx" class="day-group">
					<div class="day-header">
						<el-icon class="day-icon"><RemoveFilled /></el-icon>
						<span class="day-date">{{ group.date }} {{ group.weekday }}</span>
						<span class="day-count">{{ group.items.length }}</span>
					</div>
					<div class="day-timeline">
						<div v-for="(item, iIdx) in group.items" :key="iIdx" class="timeline-item">
							<div class="timeline-dot" :class="item.level" />
							<div class="timeline-content">
								<div class="timeline-title">
									<span class="item-title">{{ item.title }}</span>
									<span class="item-time">{{ item.time }}</span>
								</div>
								<div class="timeline-detail" v-html="item.detail" />
							</div>
						</div>
					</div>
				</div>
				<el-empty v-if="!myDayLoading && myDayGroups.length === 0" description="暂无数据" />
			</div>
			<template #footer>
				<el-button @click="myDayVisible = false">关闭</el-button>
			</template>
		</el-dialog>

		<!-- 操作日志弹窗 -->
		<el-dialog
			v-model="opLogVisible"
			title="操作日志"
			width="800px"
			:close-on-click-modal="false"
			class="op-log-dialog"
		>
			<div class="op-log-toolbar">
				<el-button @click="handleExportOpLog">导出</el-button>
				<el-input v-model="opLogKeyword" placeholder="请输入关键字" clearable style="width: 200px" @keyup.enter="loadOpLogData">
					<template #append>
						<el-button @click="loadOpLogData">
							<el-icon><Search /></el-icon>
						</el-button>
					</template>
				</el-input>
			</div>
			<div class="op-log-content" v-loading="opLogLoading">
				<div v-for="(group, gIdx) in opLogGroups" :key="gIdx" class="log-group">
					<div class="log-group-header" @click="toggleLogGroup(group)">
						<el-icon class="group-icon" :class="{ expanded: group.expanded }">
							<component :is="group.expanded ? 'RemoveFilled' : 'CirclePlusFilled'" />
						</el-icon>
						<span class="group-date">{{ group.date }} {{ group.weekday }}</span>
						<span class="group-count">{{ group.items.length }}</span>
					</div>
					<transition name="el-zoom-in-top">
						<div v-show="group.expanded" class="log-group-content">
							<div v-for="(item, iIdx) in group.items" :key="iIdx" class="log-item">
								<div class="log-dot" />
								<div class="log-info">
									<span class="log-title">{{ item.title }}</span>
									<span class="log-meta">修改人：{{ item.operator }} | 修改时间：{{ item.time }}</span>
								</div>
							</div>
						</div>
					</transition>
				</div>
				<el-empty v-if="!opLogLoading && opLogGroups.length === 0" description="暂无数据" />
			</div>
			<template #footer>
				<el-button @click="opLogVisible = false">关闭</el-button>
			</template>
		</el-dialog>

		<!-- 上网时段分析弹窗 -->
		<el-dialog
			v-model="onlineTimeVisible"
			title="上网时段分析"
			width="900px"
			:close-on-click-modal="false"
			class="online-time-dialog"
		>
			<div class="online-time-content" v-loading="onlineTimeLoading">
				<!-- 时段统计 -->
				<div class="chart-section">
					<h4 class="section-title">时段统计</h4>
					<div class="chart-container" ref="chartRef" />
				</div>

				<!-- 上网明细 -->
				<div class="detail-section">
					<h4 class="section-title">上网明细</h4>
					<el-table :data="onlineTimeList" border style="width: 100%">
						<el-table-column prop="time" label="上网时间" width="180" sortable />
						<el-table-column prop="stationId" label="基站编号" min-width="200" />
						<el-table-column prop="siteOrApp" label="访问网站/应用" min-width="150" />
						<el-table-column prop="phone" label="关联手机号" width="140" />
					</el-table>
					<div class="online-time-pagination">
						<span class="page-info">当前显示{{ onlineTimePageStart }}-{{ onlineTimePageEnd }}条，共{{ onlineTimeTotal }}条</span>
						<div class="page-size-wrap">
							<el-select v-model="onlineTimePageSize" size="small" @change="loadOnlineTimeList">
								<el-option :value="10" label="10条/页" />
								<el-option :value="20" label="20条/页" />
								<el-option :value="50" label="50条/页" />
							</el-select>
						</div>
						<el-pagination
							v-model:current-page="onlineTimePage"
							v-model:page-size="onlineTimePageSize"
							:total="onlineTimeTotal"
							:page-sizes="[10, 20, 50]"
							layout="prev, pager, next, jumper"
							@size-change="loadOnlineTimeList"
							@current-change="loadOnlineTimeList"
						/>
					</div>
				</div>
			</div>
			<template #footer>
				<el-button @click="onlineTimeVisible = false">关闭</el-button>
			</template>
		</el-dialog>

		<!-- 上网地点分析弹窗 -->
		<el-dialog
			v-model="onlineLocationVisible"
			title="上网地点分析"
			width="1100px"
			:close-on-click-modal="false"
			class="online-location-dialog"
		>
			<div class="online-location-content" v-loading="onlineLocationLoading">
				<!-- 左侧列表 -->
				<div class="location-list-panel">
					<div class="location-header">上网次数：{{ locationTotalCount }}</div>
					<div class="location-list" ref="locationListRef">
						<div
							v-for="(item, idx) in locationList"
							:key="item.id"
							:class="['location-card', { active: selectedLocationIndex === idx }]"
							@click="handleLocationCardClick(idx)"
							:ref="(el) => { if (el) locationCardRefs[idx] = el as HTMLElement }"
						>
							<div class="location-info">
								<div class="info-row">
									<el-icon><Clock /></el-icon>
									<span>{{ item.time }}</span>
								</div>
								<div class="info-row">
									<el-icon><Location /></el-icon>
									<span>{{ item.address }}</span>
								</div>
								<div class="info-row">
									<el-icon><Phone /></el-icon>
									<span>{{ item.phone }}</span>
								</div>
							</div>
						</div>
						<el-empty v-if="locationList.length === 0" description="暂无数据" />
					</div>
				</div>
				<!-- 右侧地图 -->
				<div class="map-panel">
					<div class="map-container" ref="mapContainerRef" />
				</div>
			</div>
			<template #footer>
				<el-button @click="onlineLocationVisible = false">关闭</el-button>
			</template>
		</el-dialog>

		<!-- 使用应用分析弹窗 -->
		<el-dialog
			v-model="appAnalysisVisible"
			title="使用应用分析"
			width="900px"
			:close-on-click-modal="false"
			class="app-analysis-dialog"
		>
			<div class="app-analysis-content" v-loading="appAnalysisLoading">
				<!-- 使用次数排行 -->
				<div class="chart-section">
					<h4 class="section-title">使用次数排行</h4>
					<div class="chart-container" ref="appChartRef" />
				</div>

				<!-- 已安装应用及使用次数 -->
				<div class="app-grid-section">
					<h4 class="section-title">已安装应用及使用次数</h4>
					<div v-for="(group, gIdx) in appGroups" :key="gIdx" class="app-group">
						<div class="app-category">
							<div class="category-icon">{{ group.icon }}</div>
							<span class="category-name">{{ group.category }}</span>
						</div>
						<div class="app-list">
							<div v-for="app in group.apps" :key="app.name" class="app-item">
								<div class="app-icon-placeholder">
									<img v-if="app.icon" :src="app.icon" class="app-icon-img" />
									<div v-else class="app-icon-default" />
								</div>
								<div class="app-name">{{ app.name }}</div>
								<el-link type="primary" :underline="false" @click="handleOpenAppDetail(app)">{{ app.count }}</el-link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<template #footer>
				<el-button @click="appAnalysisVisible = false">关闭</el-button>
			</template>
		</el-dialog>

		<!-- 应用使用次数详情弹窗 -->
		<el-dialog
			v-model="appDetailVisible"
			title="应用使用次数"
			width="800px"
			:close-on-click-modal="false"
			class="app-detail-dialog"
		>
			<div class="app-detail-content">
				<!-- 应用信息 -->
				<div class="app-info-card" v-if="currentApp">
					<div class="app-icon-large">
						<img v-if="currentApp.icon" :src="currentApp.icon" />
						<div v-else class="app-icon-placeholder-lg" />
						<span class="app-label">{{ currentApp.name }}</span>
					</div>
					<div class="app-info-grid">
						<div class="info-item">
							<span class="info-label">账号：</span>
							<span class="info-value">{{ currentApp.account }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">微信ID：</span>
							<span class="info-value">{{ currentApp.wechatId }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">关联手机号：</span>
							<span class="info-value">{{ currentApp.phone }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">关联IMSI：</span>
							<span class="info-value">{{ currentApp.imsi }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">首次发现时间：</span>
							<span class="info-value">{{ currentApp.firstTime }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">最近发现时间：</span>
							<span class="info-value">{{ currentApp.lastTime }}</span>
						</div>
						<div class="info-item full-width">
							<span class="info-label">使用次数：</span>
							<span class="info-value count">{{ currentApp.count }}</span>
						</div>
					</div>
				</div>

				<!-- 使用次数明细 -->
				<div class="detail-section">
					<h4 class="section-title">使用次数明细</h4>
					<el-table :data="appDetailList" border style="width: 100%">
						<el-table-column prop="time" label="使用时间" width="180" sortable />
						<el-table-column prop="stationId" label="基站编号" min-width="200">
							<template #default="{ row }">
								<span>{{ row.stationId }}</span>
								<el-icon class="location-pin"><Location /></el-icon>
							</template>
						</el-table-column>
						<el-table-column prop="phone" label="关联手机号" width="140" />
					</el-table>
					<div class="detail-pagination">
						<span class="page-info">当前显示{{ appDetailPageStart }}-{{ appDetailPageEnd }}条，共{{ appDetailTotal }}条</span>
						<div class="page-size-wrap">
							<el-select v-model="appDetailPageSize" size="small" @change="loadAppDetailList">
								<el-option :value="10" label="10条/页" />
								<el-option :value="20" label="20条/页" />
								<el-option :value="50" label="50条/页" />
							</el-select>
						</div>
						<el-pagination
							v-model:current-page="appDetailPage"
							v-model:page-size="appDetailPageSize"
							:total="appDetailTotal"
							:page-sizes="[10, 20, 50]"
							layout="prev, pager, next, jumper"
							@size-change="loadAppDetailList"
							@current-change="loadAppDetailList"
						/>
					</div>
				</div>
			</div>
			<template #footer>
				<el-button @click="appDetailVisible = false">关闭</el-button>
			</template>
		</el-dialog>

		<!-- 访问网站分析弹窗 -->
		<el-dialog
			v-model="websiteAnalysisVisible"
			title="访问网站分析"
			width="900px"
			:close-on-click-modal="false"
			class="website-analysis-dialog"
		>
			<div class="website-analysis-content" v-loading="websiteAnalysisLoading">
				<div class="website-header">
					<h4 class="section-title">访问网站列表（{{ websiteTotalCount }}）</h4>
					<el-input v-model="websiteKeyword" placeholder="请输入网站域名、IP地址" clearable style="width: 240px" @keyup.enter="loadWebsiteList">
						<template #append>
							<el-button @click="loadWebsiteList">
								<el-icon><Search /></el-icon>
							</el-button>
						</template>
					</el-input>
				</div>
				<el-table :data="websiteList" border style="width: 100%" :max-height="450">
					<el-table-column prop="domain" label="网站域名" min-width="140" show-overflow-tooltip />
					<el-table-column prop="ip" label="IP地址" min-width="120" />
					<el-table-column prop="firstTime" label="首次发现时间" min-width="150" sortable />
					<el-table-column prop="lastTime" label="最近发现时间" min-width="150" sortable />
					<el-table-column prop="phone" label="关联手机号" min-width="120" />
					<el-table-column prop="visitCount" label="访问次数" width="90" align="center">
						<template #default="{ row }">
							<el-link type="primary" :underline="false" @click="handleOpenWebsiteDetail(row)">{{ row.visitCount }}</el-link>
						</template>
					</el-table-column>
				</el-table>
				<div class="website-pagination">
					<span class="page-info">当前显示{{ websitePageStart }}-{{ websitePageEnd }}条，共{{ websiteTotal }}条</span>
					<div class="page-size-wrap">
						<el-select v-model="websitePageSize" size="small" @change="loadWebsiteList">
							<el-option :value="10" label="10条/页" />
							<el-option :value="20" label="20条/页" />
							<el-option :value="50" label="50条/页" />
						</el-select>
					</div>
					<el-pagination
						v-model:current-page="websitePage"
						v-model:page-size="websitePageSize"
						:total="websiteTotal"
						:page-sizes="[10, 20, 50]"
						layout="prev, pager, next, jumper"
						@size-change="loadWebsiteList"
						@current-change="loadWebsiteList"
					/>
				</div>
			</div>
			<template #footer>
				<el-button @click="websiteAnalysisVisible = false">关闭</el-button>
			</template>
		</el-dialog>

		<!-- 网站访问次数详情弹窗 -->
		<el-dialog
			v-model="websiteDetailVisible"
			title="网站访问次数"
			width="800px"
			:close-on-click-modal="false"
			class="website-detail-dialog"
		>
			<div class="website-detail-content">
				<div class="site-info-card" v-if="currentWebsite">
					<div class="info-grid">
						<div class="info-item">
							<span class="info-label">网站域名：</span>
							<span class="info-value">{{ currentWebsite.domain }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">IP地址：</span>
							<span class="info-value">{{ currentWebsite.ip }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">关联手机号：</span>
							<span class="info-value">{{ currentWebsite.phone }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">关联IMSI：</span>
							<span class="info-value">{{ currentWebsite.imsi }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">首次发现时间：</span>
							<span class="info-value">{{ currentWebsite.firstTime }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">最近发现时间：</span>
							<span class="info-value">{{ currentWebsite.lastTime }}</span>
						</div>
						<div class="info-item">
							<span class="info-label">访问次数：</span>
							<span class="info-value count">{{ currentWebsite.visitCount }}</span>
						</div>
					</div>
				</div>
				<div class="detail-section">
					<h4 class="section-title">访问次数明细</h4>
					<el-table :data="websiteDetailList" border style="width: 100%" :max-height="400">
						<el-table-column prop="time" label="访问时间" min-width="160" sortable />
						<el-table-column prop="stationId" label="基站编号" min-width="200">
							<template #default="{ row }">
								<span>{{ row.stationId }}</span>
								<el-icon class="location-pin"><Location /></el-icon>
							</template>
						</el-table-column>
						<el-table-column prop="phone" label="关联手机号" width="140" />
					</el-table>
					<div class="detail-pagination">
						<span class="page-info">当前显示{{ websiteDetailPageStart }}-{{ websiteDetailPageEnd }}条，共{{ websiteDetailTotal }}条</span>
						<div class="page-size-wrap">
							<el-select v-model="websiteDetailPageSize" size="small" @change="loadWebsiteDetailList">
								<el-option :value="10" label="10条/页" />
								<el-option :value="20" label="20条/页" />
								<el-option :value="50" label="50条/页" />
							</el-select>
						</div>
						<el-pagination
							v-model:current-page="websiteDetailPage"
							v-model:page-size="websiteDetailPageSize"
							:total="websiteDetailTotal"
							:page-sizes="[10, 20, 50]"
							layout="prev, pager, next, jumper"
							@size-change="loadWebsiteDetailList"
							@current-change="loadWebsiteDetailList"
						/>
					</div>
				</div>
			</div>
			<template #footer>
				<el-button @click="websiteDetailVisible = false">关闭</el-button>
			</template>
		</el-dialog>

		<!-- 内容分析弹窗 -->
		<el-dialog
			v-model="contentAnalysisVisible"
			title="内容分析"
			width="900px"
			:close-on-click-modal="false"
			class="content-analysis-dialog"
		>
			<div class="content-analysis-content" v-loading="contentAnalysisLoading">
				<div class="content-header">
					<h4 class="section-title">命中敏感信息（{{ contentTotalCount }}）</h4>
					<div class="content-tabs">
						<el-radio-group v-model="contentTab" @change="handleContentTabChange">
							<el-radio-button value="keyword">命中关键词</el-radio-button>
							<el-radio-button value="person">涉及重点人</el-radio-button>
							<el-radio-button value="tibetan">命中藏语</el-radio-button>
						</el-radio-group>
						<span class="tab-desc">内容命中关键词7次，涉及重点人4次，命中藏语6次</span>
					</div>
				</div>
				<div class="content-list" v-loading="contentListLoading">
					<div v-for="item in contentList" :key="item.id" class="content-item">
						<div class="item-icon">
							<el-icon color="#409eff" :size="18"><Document /></el-icon>
						</div>
						<div class="item-body">
							<div class="item-content" v-html="highlightText(item.content, item.keywords)"></div>
							<div class="item-meta">
								<span v-if="item.hasMultiPerson" class="multi-person-tag">多重点人命中</span>
								<el-link type="primary" :underline="false" class="detail-link" @click="handleOpenContentDetail(item)">详情</el-link>
							</div>
							<div class="item-info">
								<span>截获时间：{{ item.captureTime }}</span>
								<span>URL：{{ item.url }}</span>
								<span>应用名称：{{ item.appName }}</span>
								<el-link type="primary" :underline="false">{{ item.appAccount }}</el-link>
							</div>
						</div>
					</div>
					<el-empty v-if="contentList.length === 0 && !contentListLoading" description="暂无数据" />
				</div>
			</div>
			<template #footer>
				<el-button @click="contentAnalysisVisible = false">关闭</el-button>
			</template>
		</el-dialog>

		<!-- 内容详情弹窗 -->
		<el-dialog
			v-model="contentDetailVisible"
			title="详情"
			width="700px"
			:close-on-click-modal="false"
			class="content-detail-dialog"
		>
			<div class="content-detail-content" v-if="currentContent">
				<div class="detail-title" v-html="highlightText(currentContent.content, currentContent.keywords)"></div>
				<div class="detail-info-grid">
					<div class="info-item">
						<span class="info-label">截获时间：</span>
						<span class="info-value">{{ currentContent.captureTime }}</span>
					</div>
					<div class="info-item">
						<span class="info-label">IMSI：</span>
						<span class="info-value">{{ currentContent.imsi }}</span>
					</div>
					<div class="info-item">
						<span class="info-label">上网认证账号：</span>
						<span class="info-value">{{ currentContent.authAccount }}</span>
					</div>
					<div class="info-item">
						<span class="info-label">基站号：</span>
						<span class="info-value">{{ currentContent.stationId }} <el-icon class="location-pin"><Location /></el-icon></span>
					</div>
					<div class="info-item">
						<span class="info-label">应用名称：</span>
						<span class="info-value">{{ currentContent.appName }}</span>
					</div>
					<div class="info-item">
						<span class="info-label">应用账号：</span>
						<span class="info-value">{{ currentContent.appAccount }}</span>
					</div>
					<div class="info-item full-width">
						<span class="info-label">URL：</span>
						<span class="info-value">{{ currentContent.url }}</span>
					</div>
				</div>
				<div class="detail-text-section">
					<span class="text-label">文本内容：</span>
					<span class="text-content" v-html="highlightText(currentContent.fullContent || currentContent.content, currentContent.keywords)"></span>
				</div>
			</div>
			<template #footer>
				<el-button @click="contentDetailVisible = false">关闭</el-button>
			</template>
		</el-dialog>

		<!-- 多媒体分析弹窗 -->
		<el-dialog
			v-model="mediaAnalysisVisible"
			title="多媒体分析"
			width="900px"
			:close-on-click-modal="false"
			class="media-analysis-dialog"
		>
			<div class="media-analysis-content" v-loading="mediaAnalysisLoading">
				<div class="media-header">
					<h4 class="section-title">命中敏感图片音视频（{{ mediaTotalCount }}）</h4>
					<div class="media-tabs">
						<el-radio-group v-model="mediaTab" @change="handleMediaTabChange">
							<el-radio-button value="image">图片</el-radio-button>
							<el-radio-button value="audio">音频</el-radio-button>
							<el-radio-button value="video">视频</el-radio-button>
						</el-radio-group>
						<span class="tab-desc">内容命中敏感图片<strong style="color: var(--el-color-danger)">51</strong>张，音频<strong style="color: var(--el-color-danger)">32</strong>个，视频<strong style="color: var(--el-color-danger)">19</strong>个</span>
					</div>
				</div>
				<div class="media-list" v-loading="mediaListLoading">
					<div v-for="item in mediaList" :key="item.id" class="media-item" @click="handlePreviewMedia(item)">
						<div class="media-thumb">
							<img v-if="item.thumbUrl" :src="item.thumbUrl" class="thumb-img" />
							<div v-else class="thumb-placeholder">
								<el-icon :size="24" color="#c0c4cc"><VideoCamera /></el-icon>
							</div>
						</div>
						<div class="media-info">
							<div class="media-row">
								<span class="media-label">图片来源：</span>
								<span>{{ item.source }}</span>
							</div>
							<div class="media-row">
								<span class="media-label">URL：</span>
								<span>{{ item.url }}</span>
							</div>
							<div class="media-row">
								<span class="media-label">账号：</span>
								<el-link type="primary" :underline="false">{{ item.account }}</el-link>
								<span class="media-label" style="margin-left: 16px">截获时间：</span>
								<span>{{ item.captureTime }}</span>
							</div>
						</div>
					</div>
					<el-empty v-if="mediaList.length === 0 && !mediaListLoading" description="暂无数据" />
				</div>
			</div>
			<template #footer>
				<el-button @click="mediaAnalysisVisible = false">关闭</el-button>
			</template>
		</el-dialog>

		<!-- 大文件分析弹窗 -->
		<el-dialog
			v-model="largeFileVisible"
			title="大文件分析"
			width="900px"
			:close-on-click-modal="false"
			class="large-file-dialog"
		>
			<div class="large-file-content" v-loading="largeFileLoading">
				<div class="large-file-header">
					<h4 class="section-title">大文件列表（{{ largeFileTotalCount }}）</h4>
					<el-input v-model="largeFileKeyword" placeholder="请输入" clearable style="width: 200px" @keyup.enter="loadLargeFileList">
						<template #append>
							<el-button @click="loadLargeFileList">
								<el-icon><Search /></el-icon>
							</el-button>
						</template>
					</el-input>
				</div>
				<el-table :data="largeFileList" border style="width: 100%" :max-height="450">
					<el-table-column prop="fileName" label="大文件名称" min-width="140" show-overflow-tooltip />
					<el-table-column prop="fileType" label="文件类型" min-width="100" />
					<el-table-column prop="fileFormat" label="文件格式" width="100" />
					<el-table-column prop="fileSize" label="文件大小（MB）" width="140" align="right" sortable />
					<el-table-column prop="appName" label="所属应用" min-width="100" />
					<el-table-column prop="captureTime" label="截获时间" width="170" sortable />
				</el-table>
				<div class="large-file-pagination">
					<span class="page-info">当前显示{{ largeFilePageStart }}-{{ largeFilePageEnd }}条，共{{ largeFileTotal }}条</span>
					<div class="page-size-wrap">
						<el-select v-model="largeFilePageSize" size="small" @change="loadLargeFileList">
							<el-option :value="10" label="10条/页" />
							<el-option :value="20" label="20条/页" />
							<el-option :value="50" label="50条/页" />
						</el-select>
					</div>
					<el-pagination
						v-model:current-page="largeFilePage"
						v-model:page-size="largeFilePageSize"
						:total="largeFileTotal"
						:page-sizes="[10, 20, 50]"
						layout="prev, pager, next, jumper"
						@size-change="loadLargeFileList"
						@current-change="loadLargeFileList"
					/>
				</div>
			</div>
			<template #footer>
				<el-button @click="largeFileVisible = false">关闭</el-button>
			</template>
		</el-dialog>

		<!-- 重点端口分析弹窗 -->
		<el-dialog
			v-model="keyPortVisible"
			title="重点端口分析"
			width="900px"
			:close-on-click-modal="false"
			class="key-port-dialog"
		>
			<div class="key-port-content" v-loading="keyPortLoading">
				<div class="key-port-header">
					<h4 class="section-title">重点端口列表（{{ keyPortTotalCount }}）</h4>
					<el-input v-model="keyPortKeyword" placeholder="请输入" clearable style="width: 200px" @keyup.enter="loadKeyPortList">
						<template #append>
							<el-button @click="loadKeyPortList">
								<el-icon><Search /></el-icon>
							</el-button>
						</template>
					</el-input>
				</div>
				<el-table :data="keyPortList" border style="width: 100%" :max-height="450">
					<el-table-column prop="port" label="端口" min-width="100" />
					<el-table-column prop="ip" label="对应IP" min-width="140" />
					<el-table-column prop="firstTime" label="首次访问时间" min-width="160" sortable />
					<el-table-column prop="lastTime" label="最近访问时间" min-width="160" sortable />
					<el-table-column prop="visitCount" label="访问次数" width="100" align="right" />
				</el-table>
				<div class="key-port-pagination">
					<span class="page-info">当前显示{{ keyPortPageStart }}-{{ keyPortPageEnd }}条，共{{ keyPortTotal }}条</span>
					<div class="page-size-wrap">
						<el-select v-model="keyPortPageSize" size="small" @change="loadKeyPortList">
							<el-option :value="10" label="10条/页" />
							<el-option :value="20" label="20条/页" />
							<el-option :value="50" label="50条/页" />
						</el-select>
					</div>
					<el-pagination
						v-model:current-page="keyPortPage"
						v-model:page-size="keyPortPageSize"
						:total="keyPortTotal"
						:page-sizes="[10, 20, 50]"
						layout="prev, pager, next, jumper"
						@size-change="loadKeyPortList"
						@current-change="loadKeyPortList"
					/>
				</div>
			</div>
			<template #footer>
				<el-button @click="keyPortVisible = false">关闭</el-button>
			</template>
		</el-dialog>

		<!-- 文件预览弹窗 -->
		<HXFilePreview ref="filePreviewRef" />

		<!-- 研判弹窗 -->
		<el-dialog
			v-model="judgeDialogVisible"
			title="研判"
			width="600px"
			:close-on-click-modal="false"
		>
			<el-form ref="judgeFormRef" :model="judgeFormData" :rules="judgeFormRules" label-width="90px">
				<el-form-item label="管控类别" prop="categoryType">
					<el-select v-model="judgeFormData.categoryType" placeholder="请选择" style="width: 100%">
						<el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="研判依据" prop="basis">
					<el-input
						v-model="judgeFormData.basis"
						type="textarea"
						:rows="6"
						placeholder="请输入研判依据"
					/>
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="judgeDialogVisible = false">取消</el-button>
				<el-button type="primary" :loading="judgeSubmitLoading" @click="handleJudgeSubmit">确定</el-button>
			</template>
		</el-dialog>

		<!-- 浮动研判按钮 -->
		<div class="float-judge-btn" @click="handleFloatJudge">研判</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick, onBeforeUnmount, shallowRef } from "vue"
import { useRoute } from "vue-router"
import { ElMessage } from "element-plus"
import { Document, User, Search, Monitor, Location, Grid, Position, VideoCamera, FolderOpened, Connection, RemoveFilled, CirclePlusFilled, Clock, Phone } from "@element-plus/icons-vue"
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

// ==================== 行为信息 ====================
const behaviorTimeRange = ref<string[]>([])
const dateShortcuts = [
	{ text: "近一周", value: () => { const e = new Date(); const s = new Date(); s.setDate(s.getDate() - 7); return [s, e] } },
	{ text: "近一月", value: () => { const e = new Date(); const s = new Date(); s.setMonth(s.getMonth() - 1); return [s, e] } },
	{ text: "近三月", value: () => { const e = new Date(); const s = new Date(); s.setMonth(s.getMonth() - 3); return [s, e] } }
]

const activityFilter = reactive({ dataSource: "", resourceType: "", action: "" })
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
	judgeFormRef.value?.resetFields()
	Object.assign(judgeFormData, { categoryType: groupInfo.value.controlCategory || "重点关注", basis: "" })
	judgeDialogVisible.value = true
}

// ==================== 研判弹窗 ====================
const judgeDialogVisible = ref(false)
const judgeSubmitLoading = ref(false)
const judgeFormRef = ref()

const categoryOptions = [
	{ label: "重点关注", value: "重点关注" },
	{ label: "一般关注", value: "一般关注" },
	{ label: "已办结", value: "已办结" }
]

const judgeFormData = reactive({
	categoryType: "重点关注",
	basis: ""
})

const judgeFormRules = {
	categoryType: [{ required: true, message: "请选择管控类别", trigger: "change" }],
	basis: [{ required: true, message: "请输入研判依据", trigger: "blur" }]
}

const handleJudgeSubmit = async () => {
	const valid = await judgeFormRef.value?.validate()
	if (!valid) return

	judgeSubmitLoading.value = true
	try {
		const res = await ga.submitJudgment(groupId.value, judgeFormData.categoryType, judgeFormData.basis)
		if ((res as any)?.state === 2000) {
			ElMessage.success("研判成功")
			judgeDialogVisible.value = false
			loadGroupInfo()
			loadJudgments()
		}
	} catch {
		ElMessage.error("研判失败")
	} finally {
		judgeSubmitLoading.value = false
	}
}

// ==================== 我的一天 ====================
const myDayVisible = ref(false)
const myDayLoading = ref(false)
const myDayKeyword = ref("")

interface MyDayItem {
	title: string
	time: string
	detail: string
	level: string
}

interface MyDayGroup {
	date: string
	weekday: string
	items: MyDayItem[]
}

const myDayGroups = ref<MyDayGroup[]>([])

const loadMyDayData = async () => {
	myDayLoading.value = true
	try {
		const res = await ga.getMyDay(groupId.value, myDayKeyword.value)
		myDayGroups.value = res.data || []
	} catch {
		myDayGroups.value = []
	} finally {
		myDayLoading.value = false
	}
}

const handleOpenMyDay = () => {
	myDayVisible.value = true
	myDayKeyword.value = ""
	loadMyDayData()
}

const handleExportMyDay = () => {
	ElMessage.success("导出成功")
}

// ==================== 操作日志 ====================
const opLogVisible = ref(false)
const opLogLoading = ref(false)
const opLogKeyword = ref("")

interface OpLogItem {
	title: string
	operator: string
	time: string
}

interface OpLogGroup {
	date: string
	weekday: string
	items: OpLogItem[]
	expanded: boolean
}

const opLogGroups = ref<OpLogGroup[]>([])

const loadOpLogData = async () => {
	opLogLoading.value = true
	try {
		const res = await ga.getOpLogs(groupId.value, opLogKeyword.value)
		opLogGroups.value = (res.data || []).map((g: any) => ({ ...g, expanded: true }))
	} catch {
		opLogGroups.value = []
	} finally {
		opLogLoading.value = false
	}
}

const handleOpenOpLog = () => {
	opLogVisible.value = true
	opLogKeyword.value = ""
	loadOpLogData()
}

const toggleLogGroup = (group: OpLogGroup) => {
	group.expanded = !group.expanded
}

const handleExportOpLog = () => {
	ElMessage.success("导出成功")
}

// ==================== 上网时段分析 ====================
const onlineTimeVisible = ref(false)
const onlineTimeLoading = ref(false)
const chartRef = ref<HTMLElement>()
const onlineTimeList = ref<any[]>([])
const onlineTimePage = ref(1)
const onlineTimePageSize = ref(10)
const onlineTimeTotal = ref(0)
const onlineTimeChart = ref<any>(null)

const onlineTimePageStart = computed(() => onlineTimeTotal.value === 0 ? 0 : (onlineTimePage.value - 1) * onlineTimePageSize.value + 1)
const onlineTimePageEnd = computed(() => Math.min(onlineTimePage.value * onlineTimePageSize.value, onlineTimeTotal.value))

const loadOnlineTimeData = async () => {
	onlineTimeLoading.value = true
	try {
		const [chartRes, listRes] = await Promise.all([
			ga.getOnlineTimeChart(groupId.value),
			ga.getOnlineTimeList(groupId.value, { page: onlineTimePage.value, pageSize: onlineTimePageSize.value })
		])
		onlineTimeList.value = listRes.data?.list || []
		onlineTimeTotal.value = listRes.data?.total || 0

		if (chartRes.data) {
			renderChart(chartRes.data)
		}
	} catch {
		onlineTimeList.value = []
		onlineTimeTotal.value = 0
	} finally {
		onlineTimeLoading.value = false
	}
}

const loadOnlineTimeList = async () => {
	try {
		const res = await ga.getOnlineTimeList(groupId.value, { page: onlineTimePage.value, pageSize: onlineTimePageSize.value })
		onlineTimeList.value = res.data?.list || []
		onlineTimeTotal.value = res.data?.total || 0
	} catch {
		onlineTimeList.value = []
		onlineTimeTotal.value = 0
	}
}

const renderChart = (data: { hours: string[]; values: number[] }) => {
	if (!chartRef.value) return

	import("echarts").then((echarts) => {
		if (onlineTimeChart.value) {
			onlineTimeChart.value.dispose()
		}

		const chart = echarts.init(chartRef.value!)
		onlineTimeChart.value = chart

		const option = {
			tooltip: {
				trigger: "axis",
				formatter: (params: any) => {
					const p = params[0]
					return `${p.name}上网次数：${p.value}`
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
				data: data.hours,
				boundaryGap: false,
				axisLine: { lineStyle: { color: "#e0e0e0" } },
				axisLabel: { color: "#666" }
			},
			yAxis: {
				type: "value",
				max: 100,
				axisLine: { show: false },
				splitLine: { lineStyle: { color: "#f0f0f0" } },
				axisLabel: { color: "#999" }
			},
			series: [
				{
					name: "上网次数",
					type: "line",
					data: data.values,
					smooth: true,
					symbol: "circle",
					symbolSize: 8,
					lineStyle: { color: "#409eff", width: 2 },
					itemStyle: { color: "#409eff" },
					areaStyle: {
						color: {
							type: "linear",
							x: 0, y: 0, x2: 0, y2: 1,
							colorStops: [
								{ offset: 0, color: "rgba(64,158,255,0.3)" },
								{ offset: 1, color: "rgba(64,158,255,0.05)" }
							]
						}
					}
				}
			]
		}

		chart.setOption(option)

		const resizeHandler = () => chart.resize()
		window.addEventListener("resize", resizeHandler)
	})
}

const handleOpenOnlineTime = () => {
	onlineTimeVisible.value = true
	onlineTimePage.value = 1
	onlineTimePageSize.value = 10
	nextTick(() => {
		loadOnlineTimeData()
	})
}

// ==================== 上网地点分析 ====================
interface LocationItem {
	id: number
	time: string
	address: string
	phone: string
	lng: number
	lat: number
}

interface MapPoint {
	x: number
	y: number
	label: string
}

const onlineLocationVisible = ref(false)
const onlineLocationLoading = ref(false)
const locationList = ref<LocationItem[]>([])
const locationTotalCount = ref(0)
const selectedLocationIndex = ref(-1)
const locationCardRefs = ref<Record<number, HTMLElement>>({})
const mapContainerRef = ref<HTMLElement>()
const mapPoints = ref<MapPoint[]>([])
const olMap = shallowRef<any>(null)
const olMarkers = shallowRef<any[]>([])

const loadLocationData = async () => {
	onlineLocationLoading.value = true
	try {
		const res = await ga.getOnlineLocations(groupId.value)
		locationList.value = res.data?.list || []
		locationTotalCount.value = res.data?.total || 0

		mapPoints.value = locationList.value.map((item, idx) => ({
			x: 15 + (idx % 5) * 18,
			y: 15 + Math.floor(idx / 5) * 25,
			label: item.address.substring(0, 8) + "..."
		}))

		nextTick(() => {
			initOlMap()
		})
	} catch {
		locationList.value = []
		locationTotalCount.value = 0
		mapPoints.value = []
	} finally {
		onlineLocationLoading.value = false
	}
}

const initOlMap = async () => {
	if (!mapContainerRef.value || locationList.value.length === 0) return

	const ol = await import("ol")
	const { Map, View } = ol
	const { Tile: TileLayer, Vector: VectorLayer } = await import("ol/layer")
	const { XYZ, Vector: VectorSource } = await import("ol/source")
	const { Point } = await import("ol/geom")
	const { Style, Icon, Text: TextStyle, Fill, Stroke } = await import("ol/style")
	const { fromLonLat } = await import("ol/proj")
	const { defaults: defaultsInteraction } = await import("ol/interaction")

	if (olMap.value) {
		olMap.value.setTarget(null)
		olMap.value = null
	}

	const map = new Map({
		target: mapContainerRef.value,
		layers: [
			new TileLayer({
				source: new XYZ({
					url: MAP_CONFIG.normalUrl + "/{z}/{x}/{y}.png",
					crossOrigin: "anonymous"
				})
			})
		],
		view: new View({
			center: fromLonLat(locationList.value[0] ? [locationList.value[0].lng, locationList.value[0].lat] : MAP_CONFIG.center),
			zoom: MAP_CONFIG.zoom,
			minZoom: MAP_CONFIG.minZoom,
			maxZoom: MAP_CONFIG.maxZoom
		}),
		interactions: defaultsInteraction({ mouseWheelZoom: true })
	})

	const vectorSource = new VectorSource()
	const markers: any[] = []

	locationList.value.forEach((item, idx) => {
		const feature = new ol.Feature({
			geometry: new Point(fromLonLat([item.lng, item.lat])),
			locationIndex: idx
		})

		const isSelected = selectedLocationIndex.value === idx
		feature.setStyle([
			new Style({
				image: new Icon({
					src: isSelected
						? "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0z" fill="#f56c6c"/><circle cx="16" cy="14" r="6" fill="white"/></svg>')
						: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 24 30"><path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 18 12 18s12-9 12-18C24 5.37 18.63 0 12 0z" fill="#409eff"/><circle cx="12" cy="10" r="4" fill="white"/></svg>'),
					scale: isSelected ? 1 : 0.8,
					anchor: [0.5, 1]
				}),
				text: new TextStyle({
					text: item.address.substring(0, 10) + "...",
					font: "12px sans-serif",
					fill: new Fill({ color: "#333" }),
					stroke: new Stroke({ color: "#fff", width: 3 }),
					offsetY: isSelected ? -45 : -35
				})
			})
		])

		vectorSource.addFeature(feature)
		markers.push({ feature, index: idx })
	})

	const vectorLayer = new VectorLayer({
		source: vectorSource
	})
	map.addLayer(vectorLayer)

	map.on("click", (evt: any) => {
		const feature = map.forEachFeatureAtPixel(evt.pixel, (f: any) => f)
		if (feature) {
			const idx = feature.get("locationIndex")
			handleMapPointClick(idx)
		}
	})

	map.on("pointermove", (evt: any) => {
		const hit = map.hasFeatureAtPixel(evt.pixel)
		map.getTargetElement().style.cursor = hit ? "pointer" : ""
	})

	olMap.value = map
	olMarkers.value = markers
}

const handleOpenOnlineLocation = () => {
	onlineLocationVisible.value = true
	selectedLocationIndex.value = -1
	nextTick(() => {
		loadLocationData()
	})
}

const handleLocationCardClick = (idx: number) => {
	selectedLocationIndex.value = idx
	highlightMarker(idx)
	flyToLocation(idx)
}

const handleMapPointClick = (idx: number) => {
	selectedLocationIndex.value = idx
	highlightMarker(idx)

	nextTick(() => {
		const card = locationCardRefs.value[idx]
		if (card) {
			card.scrollIntoView({ behavior: "smooth", block: "center" })
		}
	})
}

const highlightMarker = async (idx: number) => {
	const { Style, Icon, Text: TextStyle, Fill, Stroke } = await import("ol/style")

	olMarkers.value.forEach((marker) => {
		const isSelected = marker.index === idx
		const item = locationList.value[marker.index]
		marker.feature.setStyle([
			new Style({
				image: new Icon({
					src: isSelected
						? "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0z" fill="#f56c6c"/><circle cx="16" cy="14" r="6" fill="white"/></svg>')
						: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 24 30"><path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 18 12 18s12-9 12-18C24 5.37 18.63 0 12 0z" fill="#409eff"/><circle cx="12" cy="10" r="4" fill="white"/></svg>'),
					scale: isSelected ? 1 : 0.8,
					anchor: [0.5, 1]
				}),
				text: new TextStyle({
					text: item?.address.substring(0, 10) + "...",
					font: "12px sans-serif",
					fill: new Fill({ color: "#333" }),
					stroke: new Stroke({ color: "#fff", width: 3 }),
					offsetY: isSelected ? -45 : -35
				})
			})
		])
	})
}

const flyToLocation = async (idx: number) => {
	if (!olMap.value || !locationList.value[idx]) return

	const { fromLonLat } = await import("ol/proj")
	const item = locationList.value[idx]
	const view = olMap.value.getView()

	view.animate({
		center: fromLonLat([item.lng, item.lat]),
		zoom: 14,
		duration: 500
	})
}

// ==================== 使用应用分析 ====================
const appAnalysisVisible = ref(false)
const appAnalysisLoading = ref(false)
const appChartRef = ref<HTMLElement>()
const appGroups = ref<any[]>([])
const appChart = shallowRef<any>(null)

interface AppItem {
	name: string
	count: number
	icon?: string
	account?: string
	wechatId?: string
	phone?: string
	imsi?: string
	firstTime?: string
	lastTime?: string
}

const loadAppAnalysisData = async () => {
	appAnalysisLoading.value = true
	try {
		const res = await ga.getAppAnalysis(groupId.value)
		appGroups.value = res.data?.groups || []

		nextTick(() => {
			renderAppChart(res.data?.chartData || { names: [], values: [] })
		})
	} catch {
		appGroups.value = []
	} finally {
		appAnalysisLoading.value = false
	}
}

const renderAppChart = (data: { names: string[]; values: number[] }) => {
	if (!appChartRef.value) return

	import("echarts").then((echarts) => {
		if (appChart.value) {
			appChart.value.dispose()
		}

		const chart = echarts.init(appChartRef.value!)
		appChart.value = chart

		const option = {
			tooltip: {
				trigger: "axis",
				formatter: (params: any) => {
					const p = params[0]
					return `${p.name}：${p.value}`
				}
			},
			grid: {
				left: "3%",
				right: "4%",
				bottom: "15%",
				top: "10%",
				containLabel: true
			},
			xAxis: {
				type: "category",
				data: data.names,
				axisLabel: {
					rotate: 0,
					interval: 0,
					color: "#666",
					fontSize: 12
				},
				axisLine: { lineStyle: { color: "#e0e0e0" } }
			},
			yAxis: {
				type: "value",
				max: 1000,
				axisLine: { show: false },
				splitLine: { lineStyle: { color: "#f0f0f0" } },
				axisLabel: { color: "#999" }
			},
			series: [
				{
					name: "使用次数",
					type: "bar",
					data: data.values,
					barWidth: "50%",
					itemStyle: {
						color: {
							type: "linear",
							x: 0, y: 0, x2: 0, y2: 1,
							colorStops: [
								{ offset: 0, color: "#409eff" },
								{ offset: 1, color: "#79bbff" }
							]
						},
						borderRadius: [4, 4, 0, 0]
					},
					emphasis: {
						itemStyle: {
							color: {
								type: "linear",
								x: 0, y: 0, x2: 0, y2: 1,
								colorStops: [
									{ offset: 0, color: "#337ecc" },
									{ offset: 1, color: "#409eff" }
								]
							}
						}
					}
				}
			]
		}

		chart.setOption(option)
	})
}

const handleOpenAppAnalysis = () => {
	appAnalysisVisible.value = true
	nextTick(() => {
		loadAppAnalysisData()
	})
}

// ==================== 应用使用详情 ====================
const appDetailVisible = ref(false)
const currentApp = ref<AppItem | null>(null)
const appDetailList = ref<any[]>([])
const appDetailPage = ref(1)
const appDetailPageSize = ref(10)
const appDetailTotal = ref(0)

const appDetailPageStart = computed(() => appDetailTotal.value === 0 ? 0 : (appDetailPage.value - 1) * appDetailPageSize.value + 1)
const appDetailPageEnd = computed(() => Math.min(appDetailPage.value * appDetailPageSize.value, appDetailTotal.value))

const handleOpenAppDetail = (app: AppItem) => {
	currentApp.value = {
		...app,
		account: app.account || "lizekuang001",
		wechatId: app.wechatId || "1285374923",
		phone: app.phone || "18925868686",
		imsi: app.imsi || "S6875D84F863F587",
		firstTime: app.firstTime || "2018-03-03 10:32:01",
		lastTime: app.lastTime || "2021-12-27 10:32:01"
	}
	appDetailVisible.value = true
	appDetailPage.value = 1
	appDetailPageSize.value = 10
	loadAppDetailList()
}

const loadAppDetailList = async () => {
	try {
		const res = await ga.getAppDetailList(groupId.value, currentApp.value?.name || "", {
			page: appDetailPage.value,
			pageSize: appDetailPageSize.value
		})
		appDetailList.value = res.data?.list || []
		appDetailTotal.value = res.data?.total || 0
	} catch {
		appDetailList.value = []
		appDetailTotal.value = 0
	}
}

// ==================== 访问网站分析 ====================
const websiteAnalysisVisible = ref(false)
const websiteAnalysisLoading = ref(false)
const websiteList = ref<any[]>([])
const websiteTotal = ref(0)
const websiteTotalCount = ref(0)
const websiteKeyword = ref("")
const websitePage = ref(1)
const websitePageSize = ref(10)

const websitePageStart = computed(() => websiteTotal.value === 0 ? 0 : (websitePage.value - 1) * websitePageSize.value + 1)
const websitePageEnd = computed(() => Math.min(websitePage.value * websitePageSize.value, websiteTotal.value))

const loadWebsiteList = async () => {
	websiteAnalysisLoading.value = true
	try {
		const res = await ga.getWebsiteList(groupId.value, {
			page: websitePage.value,
			pageSize: websitePageSize.value,
			keyword: websiteKeyword.value
		})
		websiteList.value = res.data?.list || []
		websiteTotal.value = res.data?.total || 0
		websiteTotalCount.value = res.data?.totalCount || 0
	} catch {
		websiteList.value = []
		websiteTotal.value = 0
	} finally {
		websiteAnalysisLoading.value = false
	}
}

const handleOpenWebsiteAnalysis = () => {
	websiteAnalysisVisible.value = true
	websitePage.value = 1
	websiteKeyword.value = ""
	loadWebsiteList()
}

// ==================== 网站访问次数详情 ====================
const websiteDetailVisible = ref(false)
const currentWebsite = ref<any>(null)
const websiteDetailList = ref<any[]>([])
const websiteDetailPage = ref(1)
const websiteDetailPageSize = ref(10)
const websiteDetailTotal = ref(0)

const websiteDetailPageStart = computed(() => websiteDetailTotal.value === 0 ? 0 : (websiteDetailPage.value - 1) * websiteDetailPageSize.value + 1)
const websiteDetailPageEnd = computed(() => Math.min(websiteDetailPage.value * websiteDetailPageSize.value, websiteDetailTotal.value))

const handleOpenWebsiteDetail = (row: any) => {
	currentWebsite.value = {
		...row,
		imsi: row.imsi || "S6875D84F863F587",
		firstTime: row.firstTime || "2018-03-03 10:32:01",
		lastTime: row.lastTime || "2021-12-27 10:16:32"
	}
	websiteDetailVisible.value = true
	websiteDetailPage.value = 1
	websiteDetailPageSize.value = 10
	loadWebsiteDetailList()
}

const loadWebsiteDetailList = async () => {
	try {
		const res = await ga.getWebsiteDetailList(groupId.value, currentWebsite.value?.domain || "", {
			page: websiteDetailPage.value,
			pageSize: websiteDetailPageSize.value
		})
		websiteDetailList.value = res.data?.list || []
		websiteDetailTotal.value = res.data?.total || 0
	} catch {
		websiteDetailList.value = []
		websiteDetailTotal.value = 0
	}
}

// ==================== 内容分析 ====================
const contentAnalysisVisible = ref(false)
const contentAnalysisLoading = ref(false)
const contentListLoading = ref(false)
const contentTab = ref("keyword")
const contentList = ref<any[]>([])
const contentTotalCount = ref(11)
const contentDetailVisible = ref(false)
const currentContent = ref<any>(null)
const filePreviewRef = ref()

const highlightText = (text: string, keywords?: string[]) => {
	if (!text) return ""
	let result = text
	if (keywords && keywords.length > 0) {
		keywords.forEach((kw) => {
			const regex = new RegExp(kw, "g")
			result = result.replace(regex, `<span style="color:#f56c6c;font-weight:600">${kw}</span>`)
		})
	}
	return result
}

const loadContentList = async (tab: string) => {
	contentListLoading.value = true
	try {
		const res = await ga.getContentList(groupId.value, tab)
		contentList.value = res.data?.list || []
		contentTotalCount.value = res.data?.total || 0
	} catch {
		contentList.value = []
		contentTotalCount.value = 0
	} finally {
		contentListLoading.value = false
	}
}

const handleContentTabChange = (tab: string) => {
	loadContentList(tab)
}

const handleOpenContentAnalysis = () => {
	contentAnalysisVisible.value = true
	contentTab.value = "keyword"
	loadContentList("keyword")
}

const handleOpenContentDetail = (item: any) => {
	currentContent.value = {
		...item,
		fullContent: item.fullContent || item.content,
		imsi: item.imsi || "460001357924680",
		authAccount: item.authAccount || "13030572306",
		stationId: item.stationId || "KK89K-LLS98YT-SS8CB-SSUT 跑马山东路彭吉林寺附近"
	}
	contentDetailVisible.value = true
}

// ==================== 多媒体分析 ====================
const mediaAnalysisVisible = ref(false)
const mediaAnalysisLoading = ref(false)
const mediaListLoading = ref(false)
const mediaTab = ref("image")
const mediaList = ref<any[]>([])
const mediaTotalCount = ref(0)

const loadMediaList = async (tab: string) => {
	mediaListLoading.value = true
	try {
		const res = await ga.getMediaList(groupId.value, tab)
		mediaList.value = res.data?.list || []
		mediaTotalCount.value = res.data?.total || 0
	} catch {
		mediaList.value = []
		mediaTotalCount.value = 0
	} finally {
		mediaListLoading.value = false
	}
}

const handleMediaTabChange = (tab: string) => {
	loadMediaList(tab)
}

const handleOpenMediaAnalysis = () => {
	mediaAnalysisVisible.value = true
	mediaTab.value = "image"
	loadMediaList("image")
}

const handlePreviewMedia = (item: any) => {
	if (filePreviewRef.value) {
		filePreviewRef.value.open([item.url || item.thumbUrl])
	}
}

// ==================== 大文件分析 ====================
const largeFileVisible = ref(false)
const largeFileLoading = ref(false)
const largeFileList = ref<any[]>([])
const largeFileTotal = ref(0)
const largeFileTotalCount = ref(0)
const largeFileKeyword = ref("")
const largeFilePage = ref(1)
const largeFilePageSize = ref(10)

const largeFilePageStart = computed(() => largeFileTotal.value === 0 ? 0 : (largeFilePage.value - 1) * largeFilePageSize.value + 1)
const largeFilePageEnd = computed(() => Math.min(largeFilePage.value * largeFilePageSize.value, largeFileTotal.value))

const loadLargeFileList = async () => {
	largeFileLoading.value = true
	try {
		const res = await ga.getLargeFileList(groupId.value, {
			page: largeFilePage.value,
			pageSize: largeFilePageSize.value,
			keyword: largeFileKeyword.value
		})
		largeFileList.value = res.data?.list || []
		largeFileTotal.value = res.data?.total || 0
		largeFileTotalCount.value = res.data?.totalCount || 0
	} catch {
		largeFileList.value = []
		largeFileTotal.value = 0
	} finally {
		largeFileLoading.value = false
	}
}

const handleOpenLargeFile = () => {
	largeFileVisible.value = true
	largeFilePage.value = 1
	largeFileKeyword.value = ""
	loadLargeFileList()
}

// ==================== 重点端口分析 ====================
const keyPortVisible = ref(false)
const keyPortLoading = ref(false)
const keyPortList = ref<any[]>([])
const keyPortTotal = ref(0)
const keyPortTotalCount = ref(0)
const keyPortKeyword = ref("")
const keyPortPage = ref(1)
const keyPortPageSize = ref(10)

const keyPortPageStart = computed(() => keyPortTotal.value === 0 ? 0 : (keyPortPage.value - 1) * keyPortPageSize.value + 1)
const keyPortPageEnd = computed(() => Math.min(keyPortPage.value * keyPortPageSize.value, keyPortTotal.value))

const loadKeyPortList = async () => {
	keyPortLoading.value = true
	try {
		const res = await ga.getKeyPortList(groupId.value, {
			page: keyPortPage.value,
			pageSize: keyPortPageSize.value,
			keyword: keyPortKeyword.value
		})
		keyPortList.value = res.data?.list || []
		keyPortTotal.value = res.data?.total || 0
		keyPortTotalCount.value = res.data?.totalCount || 0
	} catch {
		keyPortList.value = []
		keyPortTotal.value = 0
	} finally {
		keyPortLoading.value = false
	}
}

const handleOpenKeyPort = () => {
	keyPortVisible.value = true
	keyPortPage.value = 1
	keyPortKeyword.value = ""
	loadKeyPortList()
}

// ==================== 生命周期 ====================
onMounted(() => {
	loadGroupInfo()
	loadCommonTabs()
	loadCommunityGroups()
	loadActivities()
	loadJudgments()
})

onBeforeUnmount(() => {
	if (olMap.value) {
		olMap.value.setTarget(null)
		olMap.value = null
	}
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

.my-day-dialog {
	.my-day-toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}

	.my-day-content {
		max-height: 500px;
		overflow-y: auto;
		border: 1px solid var(--el-border-color-lighter);
		border-radius: 8px;
		padding: 16px;

		.day-group {
			margin-bottom: 24px;

			&:last-child {
				margin-bottom: 0;
			}

			.day-header {
				display: flex;
				align-items: center;
				gap: 10px;
				margin-bottom: 16px;
				padding-bottom: 12px;
				border-bottom: 1px solid var(--el-border-color-lighter);

				.day-icon {
					font-size: 20px;
					color: var(--el-color-primary);
				}

				.day-date {
					font-size: 16px;
					font-weight: 600;
					color: var(--el-text-color-primary);
				}

				.day-count {
					font-size: 14px;
					color: var(--el-text-color-secondary);
					background: var(--el-fill-color-light);
					padding: 2px 8px;
					border-radius: 10px;
				}
			}

			.day-timeline {
				padding-left: 8px;

				.timeline-item {
					display: flex;
					gap: 16px;
					margin-bottom: 20px;
					position: relative;

					&:not(:last-child)::after {
						content: "";
						position: absolute;
						left: 5px;
						top: 14px;
						bottom: -20px;
						width: 2px;
						background: var(--el-border-color-lighter);
					}

					.timeline-dot {
						width: 12px;
						height: 12px;
						border-radius: 50%;
						flex-shrink: 0;
						margin-top: 4px;
						z-index: 1;

						&.normal {
							background: var(--el-color-info);
						}

						&.info {
							background: var(--el-color-primary);
						}

						&.warning {
							background: var(--el-color-warning);
						}

						&.danger {
							background: var(--el-color-danger);
						}
					}

					.timeline-content {
						flex: 1;

						.timeline-title {
							display: flex;
							align-items: center;
							gap: 12px;
							margin-bottom: 6px;

							.item-title {
								font-size: 15px;
								font-weight: 600;
								color: var(--el-text-color-primary);
							}

							.item-time {
								font-size: 13px;
								color: var(--el-text-color-secondary);
							}
						}

						.timeline-detail {
							font-size: 13px;
							color: var(--el-text-color-regular);
							line-height: 1.6;
						}
					}
				}
			}
		}
	}
}

.op-log-dialog {
	.op-log-toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}

	.op-log-content {
		max-height: 500px;
		overflow-y: auto;
		border: 1px solid var(--el-border-color-lighter);
		border-radius: 8px;
		padding: 16px;

		.log-group {
			margin-bottom: 16px;

			&:last-child {
				margin-bottom: 0;
			}

			.log-group-header {
				display: flex;
				align-items: center;
				gap: 10px;
				cursor: pointer;
				padding: 8px 0;
				user-select: none;

				.group-icon {
					font-size: 20px;
					color: var(--el-color-primary);
					transition: transform 0.3s;

					&.expanded {
						transform: rotate(0deg);
					}
				}

				.group-date {
					font-size: 16px;
					font-weight: 600;
					color: var(--el-text-color-primary);
				}

				.group-count {
					font-size: 14px;
					color: var(--el-text-color-secondary);
					background: var(--el-fill-color-light);
					padding: 2px 8px;
					border-radius: 10px;
				}
			}

			.log-group-content {
				padding-left: 8px;

				.log-item {
					display: flex;
					gap: 16px;
					padding: 12px 0;
					border-bottom: 1px dashed var(--el-border-color-lighter);

					&:last-child {
						border-bottom: none;
					}

					.log-dot {
						width: 10px;
						height: 10px;
						border-radius: 50%;
						background: var(--el-color-primary);
						flex-shrink: 0;
						margin-top: 5px;
					}

					.log-info {
						flex: 1;

						.log-title {
							display: block;
							font-size: 15px;
							font-weight: 600;
							color: var(--el-text-color-primary);
							margin-bottom: 4px;
						}

						.log-meta {
							font-size: 13px;
							color: var(--el-text-color-secondary);
						}
					}
				}
			}
		}
	}
}

.online-time-dialog {
	.online-time-content {
		max-height: 600px;
		overflow-y: auto;

		.chart-section {
			margin-bottom: 24px;

			.section-title {
				font-size: 16px;
				font-weight: 600;
				color: var(--el-text-color-primary);
				margin: 0 0 12px;
				padding-left: 10px;
				border-left: 3px solid var(--el-color-primary);
			}

			.chart-container {
				width: 100%;
				height: 300px;
				border: 1px solid var(--el-border-color-lighter);
				border-radius: 8px;
				padding: 16px;
			}
		}

		.detail-section {
			.section-title {
				font-size: 16px;
				font-weight: 600;
				color: var(--el-text-color-primary);
				margin: 0 0 12px;
				padding-left: 10px;
				border-left: 3px solid var(--el-color-primary);
			}

			.online-time-pagination {
				display: flex;
				align-items: center;
				gap: 12px;
				margin-top: 16px;
				padding-top: 16px;
				border-top: 1px solid var(--el-border-color-lighter);

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
}

.online-location-dialog {
	.online-location-content {
		display: flex;
		gap: 16px;
		height: 550px;

		.location-list-panel {
			width: 320px;
			min-width: 320px;
			display: flex;
			flex-direction: column;
			border: 1px solid var(--el-border-color-lighter);
			border-radius: 8px;
			overflow: hidden;

			.location-header {
				padding: 12px 16px;
				font-size: 14px;
				font-weight: 600;
				color: var(--el-text-color-primary);
				border-bottom: 1px solid var(--el-border-color-lighter);
				background: var(--el-fill-color-light);
			}

			.location-list {
				flex: 1;
				overflow-y: auto;
				padding: 8px;

				.location-card {
					padding: 12px;
					border: 1px solid var(--el-border-color-lighter);
					border-radius: 8px;
					margin-bottom: 8px;
					cursor: pointer;
					transition: all 0.2s;

					&:hover {
						border-color: var(--el-color-primary-light-5);
						background: var(--el-color-primary-light-9);
					}

					&.active {
						border-color: var(--el-color-primary);
						background: var(--el-color-primary-light-9);
						box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
					}

					.location-info {
						.info-row {
							display: flex;
							align-items: center;
							gap: 8px;
							margin-bottom: 6px;
							font-size: 13px;
							color: var(--el-text-color-regular);

							&:last-child {
								margin-bottom: 0;
							}

							.el-icon {
								color: var(--el-text-color-secondary);
							}
						}
					}
				}
			}
		}

		.map-panel {
			flex: 1;
			border: 1px solid var(--el-border-color-lighter);
			border-radius: 8px;
			overflow: hidden;

			.map-container {
				width: 100%;
				height: 100%;
				position: relative;

				:deep(.ol-control) {
					button {
						background: var(--el-bg-color, #fff);
						color: var(--el-text-color-primary);
						border: 1px solid var(--el-border-color);

						&:hover {
							background: var(--el-fill-color-light);
						}
					}

					&.ol-zoom,
					&.ol-rotate {
						top: 10px;
						left: auto;
						right: 10px;
					}

					&.ol-zoom {
						right: 10px;
						top: 10px;
					}

					&.ol-rotate {
						right: 10px;
						top: 50px;
					}
				}

				:deep(.ol-attribution) {
					bottom: 4px;
					right: 4px;
					font-size: 10px;
				}
			}
		}
	}
}

.app-analysis-dialog {
	.app-analysis-content {
		max-height: 600px;
		overflow-y: auto;

		.section-title {
			font-size: 16px;
			font-weight: 600;
			color: var(--el-text-color-primary);
			margin: 0 0 12px;
			padding-left: 10px;
			border-left: 3px solid var(--el-color-primary);
		}

		.chart-section {
			margin-bottom: 24px;

			.chart-container {
				width: 100%;
				height: 300px;
				border: 1px solid var(--el-border-color-lighter);
				border-radius: 8px;
				padding: 16px;
			}
		}

		.app-grid-section {
			.app-group {
				display: flex;
				gap: 16px;
				margin-bottom: 20px;
				padding: 16px;
				background: var(--el-fill-color-lighter);
				border-radius: 8px;

				.app-category {
					width: 80px;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					gap: 8px;

					.category-icon {
						width: 48px;
						height: 48px;
						display: flex;
						align-items: center;
						justify-content: center;
						background: var(--el-bg-color, #fff);
						border-radius: 12px;
						font-size: 24px;
						box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
					}

					.category-name {
						font-size: 13px;
						color: var(--el-text-color-regular);
						text-align: center;
					}
				}

				.app-list {
					flex: 1;
					display: flex;
					flex-wrap: wrap;
					gap: 16px;

					.app-item {
						display: flex;
						flex-direction: column;
						align-items: center;
						gap: 6px;
						width: 70px;

						.app-icon-placeholder {
							width: 52px;
							height: 52px;
							border-radius: 12px;
							overflow: hidden;
							background: var(--el-bg-color, #fff);
							display: flex;
							align-items: center;
							justify-content: center;

							.app-icon-img {
								width: 100%;
								height: 100%;
								object-fit: cover;
							}

							.app-icon-default {
								width: 100%;
								height: 100%;
								background: linear-gradient(135deg, #e8f4f8 0%, #d4e8f0 100%);
							}
						}

						.app-name {
							font-size: 12px;
							color: var(--el-text-color-regular);
							text-align: center;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							width: 100%;
						}
					}
				}
			}
		}
	}
}

.app-detail-dialog {
	.app-detail-content {
		.app-info-card {
			display: flex;
			gap: 24px;
			padding: 20px;
			background: var(--el-fill-color-lighter);
			border-radius: 8px;
			margin-bottom: 24px;

			.app-icon-large {
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 8px;

				img, .app-icon-placeholder-lg {
					width: 64px;
					height: 64px;
					border-radius: 12px;
				}

				.app-icon-placeholder-lg {
					background: linear-gradient(135deg, #e8f4f8 0%, #d4e8f0 100%);
				}

				.app-label {
					font-size: 13px;
					color: var(--el-text-color-regular);
				}
			}

			.app-info-grid {
				flex: 1;
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 12px;

				.info-item {
					font-size: 14px;

					.info-label {
						color: var(--el-text-color-secondary);
					}

					.info-value {
						color: var(--el-text-color-primary);
						font-weight: 500;

						&.count {
							color: var(--el-color-primary);
							font-size: 18px;
							font-weight: 600;
						}
					}

					&.full-width {
						grid-column: 1 / -1;
					}
				}
			}
		}

		.detail-section {
			.section-title {
				font-size: 16px;
				font-weight: 600;
				color: var(--el-text-color-primary);
				margin: 0 0 12px;
				padding-left: 10px;
				border-left: 3px solid var(--el-color-primary);
			}

			.location-pin {
				color: var(--el-color-danger);
				margin-left: 4px;
			}

			.detail-pagination {
				display: flex;
				align-items: center;
				gap: 12px;
				margin-top: 16px;
				padding-top: 16px;
				border-top: 1px solid var(--el-border-color-lighter);

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
}

.website-analysis-dialog {
	.website-analysis-content {
		.website-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 16px;

			.section-title {
				font-size: 16px;
				font-weight: 600;
				color: var(--el-text-color-primary);
				margin: 0;
				padding-left: 10px;
				border-left: 3px solid var(--el-color-primary);
			}
		}

		.website-pagination {
			display: flex;
			align-items: center;
			gap: 12px;
			margin-top: 16px;
			padding-top: 16px;
			border-top: 1px solid var(--el-border-color-lighter);

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

.website-detail-dialog {
	.website-detail-content {
		.site-info-card {
			padding: 20px;
			background: var(--el-fill-color-lighter);
			border-radius: 8px;
			margin-bottom: 24px;

			.info-grid {
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				gap: 12px;

				.info-item {
					font-size: 14px;

					.info-label {
						color: var(--el-text-color-secondary);
					}

					.info-value {
						color: var(--el-text-color-primary);
						font-weight: 500;

						&.count {
							color: var(--el-color-primary);
							font-size: 18px;
							font-weight: 600;
						}
					}
				}
			}
		}

		.detail-section {
			.section-title {
				font-size: 16px;
				font-weight: 600;
				color: var(--el-text-color-primary);
				margin: 0 0 12px;
				padding-left: 10px;
				border-left: 3px solid var(--el-color-primary);
			}

			.location-pin {
				color: var(--el-color-danger);
				margin-left: 4px;
			}

			.detail-pagination {
				display: flex;
				align-items: center;
				gap: 12px;
				margin-top: 16px;
				padding-top: 16px;
				border-top: 1px solid var(--el-border-color-lighter);

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
}

.media-analysis-dialog {
	.media-analysis-content {
		max-height: 600px;
		overflow-y: auto;

		.media-header {
			margin-bottom: 16px;

			.section-title {
				font-size: 16px;
				font-weight: 600;
				color: var(--el-text-color-primary);
				margin: 0 0 12px;
				padding-left: 10px;
				border-left: 3px solid var(--el-color-primary);
			}

			.media-tabs {
				display: flex;
				align-items: center;
				gap: 16px;

				.tab-desc {
					font-size: 13px;
					color: var(--el-text-color-secondary);
				}
			}
		}

		.media-list {
			.media-item {
				display: flex;
				gap: 16px;
				padding: 16px 0;
				border-bottom: 1px solid var(--el-border-color-lighter);
				cursor: pointer;
				transition: background 0.2s;

				&:hover {
					background: var(--el-fill-color-light);
				}

				&:last-child {
					border-bottom: none;
				}

				.media-thumb {
					width: 80px;
					height: 60px;
					flex-shrink: 0;
					border-radius: 6px;
					overflow: hidden;
					border: 1px solid var(--el-border-color-lighter);

					.thumb-img {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}

					.thumb-placeholder {
						width: 100%;
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						background: var(--el-fill-color-lighter);
					}
				}

				.media-info {
					flex: 1;
					min-width: 0;

					.media-row {
						font-size: 13px;
						margin-bottom: 4px;
						color: var(--el-text-color-regular);

						&:last-child {
							margin-bottom: 0;
						}

						.media-label {
							color: var(--el-text-color-secondary);
						}
					}
				}
			}
		}
	}
}

.large-file-dialog {
	.large-file-content {
		.large-file-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 16px;

			.section-title {
				font-size: 16px;
				font-weight: 600;
				color: var(--el-text-color-primary);
				margin: 0;
				padding-left: 10px;
				border-left: 3px solid var(--el-color-primary);
			}
		}

		.large-file-pagination {
			display: flex;
			align-items: center;
			gap: 12px;
			margin-top: 16px;
			padding-top: 16px;
			border-top: 1px solid var(--el-border-color-lighter);

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

.key-port-dialog {
	.key-port-content {
		.key-port-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 16px;

			.section-title {
				font-size: 16px;
				font-weight: 600;
				color: var(--el-text-color-primary);
				margin: 0;
				padding-left: 10px;
				border-left: 3px solid var(--el-color-primary);
			}
		}

		.key-port-pagination {
			display: flex;
			align-items: center;
			gap: 12px;
			margin-top: 16px;
			padding-top: 16px;
			border-top: 1px solid var(--el-border-color-lighter);

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

.content-analysis-dialog {
	.content-analysis-content {
		.content-header {
			margin-bottom: 16px;

			.section-title {
				font-size: 16px;
				font-weight: 600;
				color: var(--el-text-color-primary);
				margin: 0 0 12px;
				padding-left: 10px;
				border-left: 3px solid var(--el-color-primary);
			}

			.content-tabs {
				display: flex;
				align-items: center;
				gap: 16px;

				.tab-desc {
					font-size: 13px;
					color: var(--el-text-color-secondary);
				}
			}
		}

		.content-list {
			max-height: 450px;
			overflow-y: auto;

			.content-item {
				display: flex;
				gap: 12px;
				padding: 14px 0;
				border-bottom: 1px solid var(--el-border-color-lighter);

				&:last-child {
					border-bottom: none;
				}

				.item-icon {
					flex-shrink: 0;
					margin-top: 2px;
				}

				.item-body {
					flex: 1;
					min-width: 0;

					.item-content {
						font-size: 14px;
						color: var(--el-text-color-primary);
						margin-bottom: 8px;
						line-height: 1.6;
					}

					.item-meta {
						display: flex;
						align-items: center;
						gap: 12px;
						margin-bottom: 8px;

						.multi-person-tag {
							font-size: 12px;
							color: var(--el-color-warning);
							border: 1px solid var(--el-color-warning-light-5);
							padding: 2px 8px;
							border-radius: 4px;
							background: var(--el-color-warning-light-9);
						}

						.detail-link {
							margin-left: auto;
						}
					}

					.item-info {
						display: flex;
						flex-wrap: wrap;
						gap: 16px;
						font-size: 13px;
						color: var(--el-text-color-secondary);

						.el-link {
							font-size: 13px;
						}
					}
				}
			}
		}
	}
}

.content-detail-dialog {
	.content-detail-content {
		.detail-title {
			font-size: 15px;
			font-weight: 600;
			color: var(--el-text-color-primary);
			margin-bottom: 16px;
			line-height: 1.6;
		}

		.detail-info-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 12px;
			padding: 16px;
			background: var(--el-fill-color-lighter);
			border-radius: 8px;
			margin-bottom: 16px;

			.info-item {
				font-size: 14px;

				.info-label {
					color: var(--el-text-color-secondary);
				}

				.info-value {
					color: var(--el-text-color-primary);
					font-weight: 500;

					.location-pin {
						color: var(--el-color-danger);
						margin-left: 4px;
					}
				}

				&.full-width {
					grid-column: 1 / -1;
				}
			}
		}

		.detail-text-section {
			font-size: 14px;
			line-height: 1.8;

			.text-label {
				color: var(--el-text-color-secondary);
			}

			.text-content {
				color: var(--el-text-color-primary);
			}
		}
	}
}
</style>
