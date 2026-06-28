<template>
	<div class="pm-container">
		<!-- 左侧卡片列表区域 -->
		<div class="list-panel">
			<!-- 卡片列表 -->
			<div class="card-section">
				<div class="card-header">
					<div class="header-left">
						<el-input v-model="searchKeyword" placeholder="搜索姓名、手机号" prefix-icon="Search" clearable style="width: 200px"
							@input="handleSearchInput" />
					</div>
					<div class="card-actions">
						<el-button type="default" size="small" @click="filterDrawerVisible = true">
							<HxIcon type="iconify" name="ep:filter" />
							筛选条件
						</el-button>
					</div>
				</div>
				<div class="card-container">
					<HxCardList v-loading="tableLoading" :data="tableData" :columns="1" :row-gap="12" :column-gap="12"
						:show-pagination="true" :current-page="pagination.currentPage" :page-size="pagination.pageSize"
						:total="pagination.total" :page-sizes="[10, 20, 50, 100]" pagination-size="small" background
						pagination-layout="prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange">
						<template #default="{ item }">
							<div :data-card-id="item.id" class="data-card" :class="{ active: selectedCardId === item.id }"
								@click="handleCardClick(item)">
								<el-avatar v-if="item.avatar" :src="item.avatar" :size="48" />
								<el-avatar v-else :size="48">{{ item.name?.charAt(0) }}</el-avatar>
								<div class="card-info">
									<div class="card-row">
										<span class="name">{{ item.name }}</span>
										<span class="text-sm">{{ item.gender }} · {{ item.age }}岁</span>
										<el-tag :type="item.followStatus === '1' ? 'success' : 'info'" size="small">
											{{ item.followStatusName }}
										</el-tag>
									</div>
									<div class="card-row secondary">
										<span class="id-card color-blue">{{ item.idCard }}</span>

									</div>

								</div>
								<el-button class="detail-btn" type="primary" link @click.stop="handleViewDetail(item)">
									<HxIcon type="iconify" name="ep:more" ></HxIcon>
								</el-button>
							</div>
						</template>
					</HxCardList>
				</div>
			</div>
		</div>

		<!-- 筛选条件抽屉 -->
		<el-drawer v-model="filterDrawerVisible" title="筛选条件" direction="rtl" size="400px">
			<HxForm ref="formRef" v-model="formData" :fields="formColumns" :cols="1" :show-action="true"
				@search="handleSearch" @reset="handleReset" />
		</el-drawer>

		<!-- 详情弹窗 -->
		<el-dialog v-model="detailDialogVisible" title="人员详情" width="600px">
			<div v-if="detailRow" class="detail-content">
				<el-descriptions :column="2" border>
					<el-descriptions-item label="姓名">{{ detailRow.name }}</el-descriptions-item>
					<el-descriptions-item label="性别">{{ detailRow.gender }}</el-descriptions-item>
					<el-descriptions-item label="年龄">{{ detailRow.age }}岁</el-descriptions-item>
					<el-descriptions-item label="手机号">{{ detailRow.phone }}</el-descriptions-item>
					<el-descriptions-item label="身份证号" :span="2">{{ detailRow.idCard }}</el-descriptions-item>
					<el-descriptions-item label="人员类别" :span="2">
						<el-tag type="warning">{{ detailRow.categoryName }}</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="关注状态" :span="2">
						<el-tag :type="detailRow.followStatus === '1' ? 'success' : 'info'">
							{{ detailRow.followStatusName }}
						</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="居住地址" :span="2">{{ detailRow.residenceAddressName }}</el-descriptions-item>
					<el-descriptions-item label="数据来源" :span="2">{{ detailRow.dataSourceName }}</el-descriptions-item>
					<el-descriptions-item v-if="detailRow.tagsName?.length" label="标签" :span="2">
						<el-tag v-for="tag in detailRow.tagsName" :key="tag" type="warning" size="small" class="mr-4">
							{{ tag }}
						</el-tag>
					</el-descriptions-item>
				</el-descriptions>
			</div>
			<template #footer>
				<el-button @click="detailDialogVisible = false">关闭</el-button>
				<el-button type="primary" @click="handleEditFromDetail">编辑</el-button>
			</template>
		</el-dialog>

		<!-- 右侧地图区域 -->
		<div class="map-panel">
			<div class="map-header">
				<span class="map-title">人员分布地图</span>
				<span class="map-stat">
					共
					<span class="stat-value">{{ tableData.length }}</span>
					人
				</span>
			</div>
			<div class="map-content">
				<HxMap ref="mapRef" :center="{ lon: 114.3419, lat: 30.5468 }" :zoom="10" :height="'100%'"
					@map-ready="handleMapReady">
					<hx-map-cluster v-if="enableCluster" :markers="mapMarkers" :distance="50" :marker-style="markerStyle"
						@cluster-click="handleClusterClick">
						<hx-map-markers :markers="mapMarkers" :marker-style="markerStyle">
							<hx-map-popup ref="popupRef" multiple :render="renderPopup" />
						</hx-map-markers>
					</hx-map-cluster>
					<template v-else>
						<hx-map-markers :markers="mapMarkers" :marker-style="markerStyle">
							<hx-map-popup ref="popupRef" multiple :render="renderPopup" />
						</hx-map-markers>
					</template>
				</HxMap>
			</div>
		</div>
	</div>
</template>

<script setup lang="tsx">
import { ref, reactive, computed, onMounted } from "vue"
import { ElMessage } from "element-plus"
import { fromLonLat } from "ol/proj"
import { HxForm, HxIcon, HxCardList, HxMap, HxMapCluster, HxMapMarkers, HxMapPopup } from "@whhx/ui"
import type { FormField, MapMarkerItem, ClusterContentInfo } from "@whhx/ui"
import { pm, type ListItem as PmListItem } from "@/modules/ktc/api"

// ==================== 地图相关 ====================
const enableCluster = ref(true)
const mapRef = ref<InstanceType<typeof HxMap> | null>(null)
const popupRef = ref<InstanceType<typeof HxMapPopup> | null>(null)
const mapReady = ref(false)

const markerStyle = computed(() => ({
	iconUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=fengshier",
	iconSize: [36, 36] as [number, number],
	iconOriginalSize: [36, 36] as [number, number],
	iconAnchor: [0.5, 1] as [number, number]
}))

const mapMarkers = computed<MapMarkerItem[]>(() => {
	return tableData.value
		.filter(item => item.longitude && item.latitude)
		.map(item => ({
			id: item.id!,
			lon: item.longitude!,
			lat: item.latitude!,
			name: item.name,
			avatar: item.avatar,
			iconUrl: item.avatar,
			phone: item.phone,
			gender: item.gender,
			age: item.age,
			address: item.residenceAddressName
		}))
})

const selectedCardId = ref<number | undefined>(undefined)

// ==================== 筛选抽屉 ====================
const filterDrawerVisible = ref(false)
const searchKeyword = ref("")

// ==================== 详情弹窗 ====================
const detailDialogVisible = ref(false)
const detailRow = ref<PmListItem | null>(null)

// ==================== 表单配置 ====================
const formData = ref({
	keyword: "",
	dataSource: "",
	category: "",
	followStatus: ""
})

const formColumns = computed<FormField[]>(() => [
	{
		prop: "dataSource",
		label: "数据来源",
		type: "select",
		placeholder: "请选择数据来源",
		remote: {
			url: "/ktc/tpm/pm/dict/source",
			labelKey: "label",
			valueKey: "value"
		},
		colSpan: 1
	},
	{
		prop: "category",
		label: "类别",
		type: "select",
		placeholder: "请选择类别",
		remote: {
			url: "/ktc/tpm/pm/dict/category",
			labelKey: "label",
			valueKey: "value"
		},
		colSpan: 1
	},
	{
		prop: "followStatus",
		label: "关注状态",
		type: "select",
		options: [
			{ label: "全部", value: "" },
			{ label: "重点关注", value: "1" },
			{ label: "一般关注", value: "2" },
			{ label: "普通", value: "0" }
		],
		colSpan: 1
	}
])

// ==================== 分页配置 ====================
const pagination = reactive({
	currentPage: 1,
	pageSize: 20,
	total: 0
})

// ==================== 表格数据 ====================
const tableData = ref<PmListItem[]>([])
const tableLoading = ref(false)

// ==================== Refs ====================
const formRef = ref()

// 标记为已使用
void formRef

// ==================== 筛选条件 ====================
const buildListQuery = () => {
	const query: Record<string, unknown> = {
		page: pagination.currentPage,
		pageSize: pagination.pageSize,
		keyword: formData.value.keyword || undefined,
		dataSource: formData.value.dataSource || undefined,
		category: formData.value.category || undefined,
		followStatus: formData.value.followStatus || undefined
	}
	return query
}

// ==================== 方法 ====================

/**
 * 加载表格数据
 */
const loadTableData = async () => {
	tableLoading.value = true
	try {
		const query = buildListQuery()
		const res = await pm.getList(query)
		tableData.value = (res.data?.list || []) as PmListItem[]
		pagination.total = res.data?.total || 0
	} catch (error) {
		console.error("加载列表数据失败:", error)
		tableData.value = []
		pagination.total = 0
	} finally {
		tableLoading.value = false
	}
}

/**
 * 搜索
 */
const handleSearch = () => {
	pagination.currentPage = 1
	loadTableData()
	filterDrawerVisible.value = false
}

/**
 * 搜索输入（防抖处理）
 */
let searchTimer: ReturnType<typeof setTimeout> | null = null
const handleSearchInput = () => {
	if (searchTimer) clearTimeout(searchTimer)
	searchTimer = setTimeout(() => {
		formData.value.keyword = searchKeyword.value
		pagination.currentPage = 1
		loadTableData()
	}, 300)
}

/**
 * 重置
 */
const handleReset = () => {
	formData.value = {
		keyword: "",
		dataSource: "",
		category: "",
		followStatus: ""
	}
	pagination.currentPage = 1
	loadTableData()
}

/**
 * 分页大小改变
 */
const handleSizeChange = (size: number) => {
	pagination.pageSize = size
	pagination.currentPage = 1
	loadTableData()
}

/**
 * 页码改变
 */
const handleCurrentChange = (page: number) => {
	pagination.currentPage = page
	loadTableData()
}

// 渲染弹窗内容
const renderPopup = (item: MapMarkerItem) => (
	<div class="marker-popup">
		<div class="popup-header">
			{item.avatar ? (
				<img class="popup-avatar-img" src={item.avatar} alt={item.name as string} />
			) : (
				<div class="popup-avatar">{(item.name as string)?.charAt(0)}</div>
			)}
			<div class="popup-info">
				<span class="popup-name">{item.name}</span>
				<span class="popup-meta">{item.gender} · {item.age}岁</span>
			</div>
		</div>
		<div class="popup-body">
			{item.phone && (
				<div class="popup-item">
					<span class="label">电话：</span>
					<span class="value">{item.phone}</span>
				</div>
			)}
			{item.address && (
				<div class="popup-item">
					<span class="label">地址：</span>
					<span class="value">{item.address}</span>
				</div>
			)}
		</div>
	</div>
)

// 聚合点击
const handleClusterClick = (info: ClusterContentInfo) => {
	ElMessage.info(`聚合点包含 ${info.count} 个点位`)
}

/**
 * 地图就绪回调
 */
const handleMapReady = () => {
	mapReady.value = true
}

/**
 * 卡片点击 - 定位到对应点位并打开弹窗
 */
const handleCardClick = (item: PmListItem) => {
	selectedCardId.value = item.id

	if (!item.longitude || !item.latitude) return

	// 定位地图到该点位
	mapRef.value?.setCenter({ lon: item.longitude, lat: item.latitude })
	mapRef.value?.setZoom(13)

	// 打开对应弹窗
	const marker = mapMarkers.value.find(m => m.id === item.id)
	if (marker && popupRef.value) {
		const coord = fromLonLat([item.longitude, item.latitude]) as [number, number]
		popupRef.value.show(marker, coord)
	}
}

/**
 * 查看详情
 */
const handleViewDetail = (item: PmListItem) => {
	detailRow.value = item
	detailDialogVisible.value = true
}

/**
 * 编辑（从详情页进入）
 */
const handleEditFromDetail = () => {
	detailDialogVisible.value = false
	ElMessage.info("编辑功能开发中")
}

// ==================== 生命周期 ====================
onMounted(() => {
	loadTableData()
})
</script>

<style lang="scss" scoped>
@use "./index.scss" as *;
</style>
