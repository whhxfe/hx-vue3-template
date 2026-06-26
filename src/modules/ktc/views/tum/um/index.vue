<template>
	<div class="um-container">
		<!-- 左侧卡片列表区域 -->
		<div class="list-panel">
			<!-- 卡片列表 -->
			<div class="card-section">
				<div class="card-header">
					<div class="header-left">
						<el-input v-model="searchKeyword" placeholder="搜索IP、ADSL号" prefix-icon="Search" clearable style="width: 200px"
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
							<div :data-card-id="(item as any).id" class="data-card" :class="{ active: selectedCardId === (item as any).id }"
								@click="handleCardClick(item as any)">
								<div class="card-icon" :class="(item as any).controlCategory">
									<HxIcon type="iconify" name="ep:monitor" />
								</div>
								<div class="card-info">
									<div class="card-row">
										<span class="name">{{ (item as any).ip || (item as any).adsl }}</span>
										<el-tag :type="getCategoryTagType((item as any).controlCategory)" size="small">
											{{ (item as any).controlCategoryName }}
										</el-tag>
									</div>
									<div class="card-row secondary">
										<span class="text-sm">{{ (item as any).unitTypeName }}</span>
										<span class="text-sm text-gray-400">{{ (item as any).ipLocation }}</span>
									</div>
								</div>
								<el-button class="detail-btn" type="primary" link @click.stop="handleViewDetail(item as any)">
									<HxIcon type="iconify" name="ep:more" />
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
		<el-dialog v-model="detailDialogVisible" title="单元详情" width="600px">
			<div v-if="detailRow" class="detail-content">
				<el-descriptions :column="2" border>
					<el-descriptions-item label="IP地址">{{ (detailRow as any).ip || '-' }}</el-descriptions-item>
					<el-descriptions-item label="ADSL号">{{ (detailRow as any).adsl || '-' }}</el-descriptions-item>
					<el-descriptions-item label="单元类型">
						<el-tag :type="(detailRow as any).unitType === 'fixed_ip' ? 'primary' : 'success'">
							{{ (detailRow as any).unitTypeName }}
						</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="管控类别">
						<el-tag :type="getCategoryTagType((detailRow as any).controlCategory)">
							{{ (detailRow as any).controlCategoryName }}
						</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="端口数量">{{ (detailRow as any).portCount }}</el-descriptions-item>
					<el-descriptions-item label="终端数量">{{ (detailRow as any).terminalCount }}</el-descriptions-item>
					<el-descriptions-item label="IP属地" :span="2">{{ (detailRow as any).ipLocation || '-' }}</el-descriptions-item>
					<el-descriptions-item label="关注人员">{{ (detailRow as any).focusPerson || '-' }}</el-descriptions-item>
					<el-descriptions-item label="关注单位">{{ (detailRow as any).focusUnit || '-' }}</el-descriptions-item>
					<el-descriptions-item label="预警类型" :span="2">
						<el-tag v-if="(detailRow as any).warningTypeName" :type="getWarningTagType((detailRow as any).warningType)">
							{{ (detailRow as any).warningTypeName }}
						</el-tag>
						<span v-else>-</span>
					</el-descriptions-item>
					<el-descriptions-item label="研判状态">
						<el-tag :type="(detailRow as any).isJudged ? 'success' : 'info'">
							{{ (detailRow as any).isJudged ? '已研判' : '未研判' }}
						</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="布控状态">
						<el-tag :type="(detailRow as any).isControlled ? 'success' : 'info'">
							{{ (detailRow as any).isControlled ? '已布控' : '未布控' }}
						</el-tag>
					</el-descriptions-item>
					<el-descriptions-item label="录入时间" :span="2">{{ (detailRow as any).entryTime || '-' }}</el-descriptions-item>
				</el-descriptions>
			</div>
			<template #footer>
				<el-button @click="detailDialogVisible = false">关闭</el-button>
			</template>
		</el-dialog>

		<!-- 右侧地图区域 -->
		<div class="map-panel">
			<div class="map-header">
				<span class="map-title">单元分布地图</span>
				<span class="map-stat">
					共
					<span class="stat-value">{{ tableData.length }}</span>
					个单元
				</span>
			</div>
			<div class="map-content">
				<HxMap ref="mapRef" :center="{ lon: 114.3419, lat: 30.5468 }" :zoom="10" :height="'100%'"
					@map-ready="handleMapReady">
					<hx-map-cluster v-if="enableCluster" :markers="mapMarkers" :distance="50" :marker-style="markerStyle"
						@cluster-click="handleClusterClick">
						<hx-map-markers :markers="mapMarkers" :marker-style="markerStyle">
							<hx-map-popup ref="popupRef" :multiple="false" :render="renderPopup" />
						</hx-map-markers>
					</hx-map-cluster>
					<template v-else>
						<hx-map-markers :markers="mapMarkers" :marker-style="markerStyle">
							<hx-map-popup ref="popupRef" :multiple="false" :render="renderPopup" />
						</hx-map-markers>
					</template>
				</HxMap>
			</div>
		</div>
	</div>
</template>

<script setup lang="tsx">
import { ref, reactive, computed, onMounted } from "vue"
import { ElMessage, ElTag } from "element-plus"
import { fromLonLat } from "ol/proj"
import { HxForm, HxIcon, HxCardList, HxMap, HxMapCluster, HxMapMarkers, HxMapPopup } from "@whhx/ui"
import type { FormField, MapMarkerItem, ClusterContentInfo } from "@whhx/ui"
import { um, type ListItem as UmListItem } from "@/modules/ktc/api"

defineOptions({ name: 'UnitMap' })

// ==================== 地图相关 ====================
const enableCluster = ref(false)
const mapRef = ref<InstanceType<typeof HxMap> | null>(null)
const popupRef = ref<InstanceType<typeof HxMapPopup> | null>(null)
const mapReady = ref(false)

const markerStyle = computed(() => ({
	iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23409eff'%3E%3Cpath d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/%3E%3C/svg%3E",
	iconSize: [32, 32] as [number, number],
	iconOriginalSize: [32, 32] as [number, number],
	iconAnchor: [0.5, 1] as [number, number]
}))

const mapMarkers = computed<MapMarkerItem[]>(() => {
	return tableData.value
		.filter((item: any) => item.longitude && item.latitude)
		.map((item: any) => ({
			shape:'map-marker',
			id: item.id,
			lon: item.longitude,
			lat: item.latitude,
			name: item.ip || item.adsl,
			ip: item.ip,
			adsl: item.adsl,
			unitTypeName: item.unitTypeName,
			controlCategoryName: item.controlCategoryName,
			ipLocation: item.ipLocation,
			focusPerson: item.focusPerson,
			warningTypeName: item.warningTypeName
		}))
})

const selectedCardId = ref<number | undefined>(undefined)

// ==================== 筛选抽屉 ====================
const filterDrawerVisible = ref(false)
const searchKeyword = ref("")

// ==================== 详情弹窗 ====================
const detailDialogVisible = ref(false)
const detailRow = ref<UmListItem | null>(null)

// ==================== 表单配置 ====================
const formData = ref({
	keyword: "",
	unitType: "",
	controlCategory: ""
})

const formColumns = computed<FormField[]>(() => [
	{
		prop: "unitType",
		label: "单元类型",
		type: "select",
		placeholder: "请选择单元类型",
		remote: {
			url: "/ktc/tum/um/dict/unit-type",
			labelKey: "label",
			valueKey: "value"
		},
		colSpan: 1
	},
	{
		prop: "controlCategory",
		label: "管控类别",
		type: "select",
		placeholder: "请选择管控类别",
		remote: {
			url: "/ktc/tum/um/dict/control-category",
			labelKey: "label",
			valueKey: "value"
		},
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
const tableData = ref<UmListItem[]>([])
const tableLoading = ref(false)

// ==================== Refs ====================
const formRef = ref()

// 标记为已使用
void formRef

// ==================== 工具方法 ====================

const getCategoryTagType = (category: string): any => {
	const map: Record<string, string> = {
		focus: "danger",
		level1: "warning",
		level2: "",
		level3: "info",
		other: "info"
	}
	return map[category] || "info"
}

const getWarningTagType = (type: string): any => {
	const map: Record<string, string> = {
		red: "danger",
		orange: "warning",
		yellow: "",
		blue: "info"
	}
	return map[type] || "info"
}

// ==================== 筛选条件 ====================
const buildListQuery = () => {
	const query: Record<string, unknown> = {
		page: pagination.currentPage,
		pageSize: pagination.pageSize,
		keyword: formData.value.keyword || undefined,
		unitType: formData.value.unitType || undefined,
		controlCategory: formData.value.controlCategory || undefined
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
		const res = await um.getList(query)
		tableData.value = (res.data?.list || []) as any[]
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
		unitType: "",
		controlCategory: ""
	}
	searchKeyword.value = ""
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
			<div class="popup-icon">
				<HxIcon type="iconify" name="ep:monitor" />
			</div>
			<div class="popup-info">
				<span class="popup-name">{item.name as string}</span>
				<span class="popup-meta">{item.unitTypeName as string} · {item.ipLocation as string}</span>
			</div>
		</div>
		<div class="popup-body">
			{item.controlCategoryName && (
				<div class="popup-item">
					<span class="label">管控类别：</span>
					<span class="value">{item.controlCategoryName as string}</span>
				</div>
			)}
			{item.focusPerson && (
				<div class="popup-item">
					<span class="label">关注人员：</span>
					<span class="value">{item.focusPerson as string}</span>
				</div>
			)}
			{item.warningTypeName && (
				<div class="popup-item">
					<span class="label">预警类型：</span>
					<span class="value">{item.warningTypeName as string}</span>
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
const handleCardClick = (item: any) => {
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
const handleViewDetail = (item: any) => {
	detailRow.value = item
	detailDialogVisible.value = true
}

// ==================== 生命周期 ====================
onMounted(() => {
	loadTableData()
})
</script>

<style lang="scss" scoped>
@use "./index.scss" as *;
</style>
