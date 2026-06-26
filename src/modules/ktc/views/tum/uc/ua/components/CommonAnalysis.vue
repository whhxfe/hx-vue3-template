<template>
	<section id="section-common" class="ua-section">
		<div class="section-header">
			<h3 class="section-title">共性分析</h3>
		</div>
		<div class="section-body">
			<el-tabs v-model="activeTab" @tab-change="handleTabChange">
				<el-tab-pane label="访问同网站终端" name="website">
					<el-table
						v-loading="loading"
						:data="tabData"
						border
					>
						<el-table-column type="expand">
							<template #default="{ row }">
								<div class="expand-container">
									<el-table :data="(row as WebsiteCommonItem).terminals || []" border>
										<el-table-column type="index" label="序号" width="60" align="center" />
										<el-table-column prop="imei" label="终端IMEI" min-width="150" />
										<el-table-column prop="imsi" label="终端IMSI" min-width="150" />
										<el-table-column prop="mac" label="终端MAC" min-width="140" />
										<el-table-column prop="visitTime" label="访问时间" min-width="180" />
										<el-table-column prop="visitDuration" label="访问时长" min-width="120" />
									</el-table>
								</div>
							</template>
						</el-table-column>
						<el-table-column type="index" label="序号" width="60" align="center" />
						<el-table-column prop="domain" label="网站域名" min-width="150" />
						<el-table-column prop="ip" label="IP" min-width="120" />
						<el-table-column prop="websiteType" label="网站类型" min-width="100" />
						<el-table-column prop="commonTerminals" label="共同访问终端" min-width="120" />
						<el-table-column prop="remark" label="备注" min-width="150" />
					</el-table>
					<div class="pagination-container">
						<el-pagination
							v-model:current-page="pagination.currentPage"
							v-model:page-size="pagination.pageSize"
							:page-sizes="[10, 20, 50, 100]"
							:total="pagination.total"
							layout="total, sizes, prev, pager, next, jumper"
							@size-change="handleSizeChange"
							@current-change="handlePageChange"
						/>
					</div>
				</el-tab-pane>
				<el-tab-pane label="使用同APP终端" name="app">
					<el-table
						v-loading="loading"
						:data="tabData"
						border
					>
						<el-table-column type="expand">
							<template #default="{ row }">
								<div class="expand-container">
									<el-table :data="(row as AppCommonItem).terminals || []" border>
										<el-table-column type="index" label="序号" width="60" align="center" />
										<el-table-column prop="imei" label="终端IMEI" min-width="150" />
										<el-table-column prop="imsi" label="终端IMSI" min-width="150" />
										<el-table-column prop="mac" label="终端MAC" min-width="140" />
										<el-table-column prop="useTime" label="使用时间" min-width="180" />
										<el-table-column prop="useDuration" label="使用时长" min-width="120" />
									</el-table>
								</div>
							</template>
						</el-table-column>
						<el-table-column type="index" label="序号" width="60" align="center" />
						<el-table-column prop="appName" label="APP名称" min-width="120" />
						<el-table-column prop="domain" label="域名" min-width="150" />
						<el-table-column prop="appType" label="APP类型" min-width="100" />
						<el-table-column prop="commonTerminals" label="共同使用终端" min-width="120" />
						<el-table-column prop="remark" label="备注" min-width="150" />
					</el-table>
					<div class="pagination-container">
						<el-pagination
							v-model:current-page="pagination.currentPage"
							v-model:page-size="pagination.pageSize"
							:page-sizes="[10, 20, 50, 100]"
							:total="pagination.total"
							layout="total, sizes, prev, pager, next, jumper"
							@size-change="handleSizeChange"
							@current-change="handlePageChange"
						/>
					</div>
				</el-tab-pane>
				<el-tab-pane label="发布同关键词的终端" name="keyword">
					<el-table
						v-loading="loading"
						:data="tabData"
						border
					>
						<el-table-column type="expand">
							<template #default="{ row }">
								<div class="expand-container">
									<el-table :data="(row as KeywordCommonItem).terminals || []" border>
										<el-table-column type="index" label="序号" width="60" align="center" />
										<el-table-column prop="imei" label="终端IMEI" min-width="150" />
										<el-table-column prop="imsi" label="终端IMSI" min-width="150" />
										<el-table-column prop="mac" label="终端MAC" min-width="140" />
										<el-table-column prop="publishTime" label="发布时间" min-width="180" />
										<el-table-column prop="publishPlatform" label="发布平台" min-width="150" />
									</el-table>
								</div>
							</template>
						</el-table-column>
						<el-table-column type="index" label="序号" width="60" align="center" />
						<el-table-column prop="keyword" label="关键词" min-width="150" />
						<el-table-column prop="keywordType" label="关键词类型" min-width="100" />
						<el-table-column prop="commonTerminals" label="共同发布终端" min-width="120" />
						<el-table-column prop="remark" label="备注" min-width="150" />
					</el-table>
					<div class="pagination-container">
						<el-pagination
							v-model:current-page="pagination.currentPage"
							v-model:page-size="pagination.pageSize"
							:page-sizes="[10, 20, 50, 100]"
							:total="pagination.total"
							layout="total, sizes, prev, pager, next, jumper"
							@size-change="handleSizeChange"
							@current-change="handlePageChange"
						/>
					</div>
				</el-tab-pane>
				<el-tab-pane label="发布同多媒体内容的终端" name="media">
					<el-table
						v-loading="loading"
						:data="tabData"
						border
					>
						<el-table-column type="expand">
							<template #default="{ row }">
								<div class="expand-container">
									<el-table :data="(row as MediaCommonItem).terminals || []" border>
										<el-table-column type="index" label="序号" width="60" align="center" />
										<el-table-column prop="imei" label="终端IMEI" min-width="150" />
										<el-table-column prop="imsi" label="终端IMSI" min-width="150" />
										<el-table-column prop="mac" label="终端MAC" min-width="140" />
										<el-table-column prop="publishTime" label="发布时间" min-width="180" />
										<el-table-column prop="publishPlatform" label="发布平台" min-width="150" />
									</el-table>
								</div>
							</template>
						</el-table-column>
						<el-table-column type="index" label="序号" width="60" align="center" />
						<el-table-column prop="name" label="名称" min-width="150" />
						<el-table-column prop="mediaType" label="多媒体类型" min-width="100" />
						<el-table-column prop="commonTerminals" label="共同发布终端" min-width="120" />
						<el-table-column prop="remark" label="备注" min-width="150" />
					</el-table>
					<div class="pagination-container">
						<el-pagination
							v-model:current-page="pagination.currentPage"
							v-model:page-size="pagination.pageSize"
							:page-sizes="[10, 20, 50, 100]"
							:total="pagination.total"
							layout="total, sizes, prev, pager, next, jumper"
							@size-change="handleSizeChange"
							@current-change="handlePageChange"
						/>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue"
import { useAsyncState } from "@vueuse/core"
import { ua } from "@/modules/ktc/api"
import type {
	WebsiteCommonItem,
	AppCommonItem,
	KeywordCommonItem,
	MediaCommonItem,
	CommonQuery
} from "@/modules/ktc/api/tum/uc/ua"

defineOptions({ name: "CommonAnalysis" })

const props = defineProps<{
	unitId: number
}>()

const activeTab = ref<"website" | "app" | "keyword" | "media">("website")

const pagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0
})

// 根据当前 tab 拉取对应数据（统一通过 useAsyncState 管理 loading）
const fetcherMap = {
	website: (q: CommonQuery) => ua.getWebsiteCommonList(q),
	app: (q: CommonQuery) => ua.getAppCommonList(q),
	keyword: (q: CommonQuery) => ua.getKeywordCommonList(q),
	media: (q: CommonQuery) => ua.getMediaCommonList(q)
} as const

const { state: tabData, isLoading: loading, execute: loadTabData } = useAsyncState<
	(WebsiteCommonItem | AppCommonItem | KeywordCommonItem | MediaCommonItem)[]
>(
	async () => {
		if (!props.unitId) {
			pagination.total = 0
			return []
		}
		const query: CommonQuery = {
			unitId: props.unitId,
			page: pagination.currentPage,
			pageSize: pagination.pageSize
		}
		const res = await fetcherMap[activeTab.value](query)
		const list = (res.data?.list || []) as (WebsiteCommonItem | AppCommonItem | KeywordCommonItem | MediaCommonItem)[]
		pagination.total = res.data?.total || 0
		return list
	},
	[],
	{ immediate: false, resetOnExecute: false }
)

// tab 切换或 unitId 变化时重新加载（置第 1 页）
watch(
	() => props.unitId,
	(id) => {
		if (id) {
			pagination.currentPage = 1
			loadTabData(0)
		}
	},
	{ immediate: true }
)

const handleTabChange = () => {
	pagination.currentPage = 1
	loadTabData(0)
}

const handleSizeChange = (size: number) => {
	pagination.pageSize = size
	pagination.currentPage = 1
	loadTabData(0)
}

const handlePageChange = (page: number) => {
	pagination.currentPage = page
	loadTabData(0)
}
</script>

<style lang="scss" scoped>
.ua-section {
	background: var(--el-bg-color);
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

	.section-header {
		padding: 16px 20px;
		border-bottom: 1px solid var(--el-border-color-lighter);

		.section-title {
			margin: 0;
			font-size: 15px;
			font-weight: 600;
			color: var(--el-text-color-primary);
			position: relative;
			padding-left: 12px;

			&::before {
				content: "";
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				width: 3px;
				height: 16px;
				background: var(--el-color-primary);
				border-radius: 2px;
			}
		}
	}

	.section-body {
		padding: 20px;
		min-height: 120px;
	}
}

.expand-container {
	padding: 16px;
	background: var(--el-fill-color-light);
	border-radius: 4px;
	margin: 8px 0;
}

.pagination-container {
	display: flex;
	justify-content: flex-end;
	margin-top: 16px;
}
</style>