<template>
	<div class="rrgk-container">
		<!-- 左侧区域 -->
		<div class="left-panel">
			<!-- Tab 切换 -->
			<div class="tab-header">
				<div
					v-for="tab in tabs"
					:key="tab.key"
					:class="['tab-item', { active: activeTab === tab.key }]"
					@click="handleTabChange(tab.key)"
				>
					<HxIcon v-if="tab.icon" :name="tab.icon" class="tab-icon" />
					<span>{{ tab.label }}</span>
				</div>
			</div>

			<!-- 树结构 -->
			<div class="tree-container">
				<el-tree
					ref="treeRef"
					:data="treeData"
					:props="treeProps"
					node-key="id"
					:default-expand-all="false"
					:expand-on-click-node="false"
					highlight-current
					@node-click="handleTreeNodeClick"
				>
					<template #default="{ data }">
						<span class="tree-node">
							<HxIcon v-if="data.icon" :name="data.icon" class="node-icon" />
							<span class="node-label">{{ data.label }}</span>
							<span v-if="data.count" class="node-count">({{ data.count }})</span>
						</span>
					</template>
				</el-tree>
			</div>
		</div>

		<!-- 右侧区域 -->
		<div class="right-panel">
			<!-- 筛选表单 -->
			<div class="filter-section">
				<HxForm
					ref="formRef"
					v-model="formData"
					:columns="formColumns"
					:cols="4"
					:show-action="true"
					@search="handleSearch"
					@reset="handleReset"
				/>
			</div>

			<!-- 视图切换和数据展示 -->
			<div class="data-section">
				<!-- 视图切换和操作栏 -->
				<div class="data-header">
					<div class="view-toggle">
						<el-radio-group v-model="viewMode" size="default">
							<el-radio-button value="table">
								<HxIcon name="table" />
								表格视图
							</el-radio-button>
							<el-radio-button value="card">
								<HxIcon name="card" />
								卡片视图
							</el-radio-button>
						</el-radio-group>
					</div>
					<div class="action-buttons">
						<el-button type="primary" @click="handleAdd">
							<HxIcon name="plus" />
							新增
						</el-button>
						<el-button @click="handleExport">
							<HxIcon name="download" />
							导出
						</el-button>
					</div>
				</div>

				<!-- 表格视图 -->
				<div v-show="viewMode === 'table'" class="table-container">
					<HxTable
						ref="tableRef"
            border
						:columns="tableColumns"
						:data="tableData"
						:show-pagination="true"
						:current-page="pagination.currentPage"
						:page-size="pagination.pageSize"
						:total="pagination.total"
						:page-sizes="[10, 20, 50, 100]"
						pagination-layout="total, sizes, prev, pager, next, jumper"
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
					>
						<template #action="{ row }">
							<el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
							<el-button type="danger" link @click="handleDelete(row)">删除</el-button>
						</template>
					</HxTable>
				</div>

				<!-- 卡片视图 -->
				<div v-show="viewMode === 'card'" class="card-container">
					<div class="card-grid">
						<div v-for="item in tableData" :key="item.id" class="data-card">
							<div class="card-header">
								<span class="card-title">{{ item.name }}</span>
								<el-tag :type="item.status === 'active' ? 'success' : 'info'">
									{{ item.status === "active" ? "启用" : "禁用" }}
								</el-tag>
							</div>
							<div class="card-body">
								<div class="card-item">
									<span class="label">编号：</span>
									<span class="value">{{ item.code }}</span>
								</div>
								<div class="card-item">
									<span class="label">类型：</span>
									<span class="value">{{ item.type }}</span>
								</div>
								<div class="card-item">
									<span class="label">创建时间：</span>
									<span class="value">{{ item.createTime }}</span>
								</div>
								<div class="card-item">
									<span class="label">描述：</span>
									<span class="value text-ellipsis-2">{{ item.description }}</span>
								</div>
							</div>
							<div class="card-footer">
								<el-button type="primary" link @click="handleEdit(item)">编辑</el-button>
								<el-button type="danger" link @click="handleDelete(item)">删除</el-button>
							</div>
						</div>
					</div>

					<!-- 卡片分页 -->
					<div class="card-pagination">
						<el-pagination
							v-model:current-page="pagination.currentPage"
							v-model:page-size="pagination.pageSize"
							:total="pagination.total"
							:page-sizes="[10, 20, 50, 100]"
							layout="total, sizes, prev, pager, next, jumper"
							@size-change="handleSizeChange"
							@current-change="handleCurrentChange"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="tsx">
import { ref, reactive, computed } from "vue"
import { ElMessage, ElMessageBox, ElTag } from "element-plus"
import { HxForm, HxTable, HxIcon } from "@hx/ui"
import type { FormColumn, TableColumn } from "@hx/ui"

// Tab 配置
const tabs = [
	{ key: "category", label: "分类", icon: "folder" },
	{ key: "department", label: "部门", icon: "building" },
	{ key: "region", label: "区域", icon: "map" }
]

const activeTab = ref("category")

// 树形数据
const treeData = ref([
	{
		id: 1,
		label: "全部数据",
		count: 100,
		icon: "folder-open",
		children: [
			{
				id: 11,
				label: "类别一",
				count: 30,
				icon: "document",
				children: [
					{ id: 111, label: "子类别 1-1", count: 10, icon: "file" },
					{ id: 112, label: "子类别 1-2", count: 20, icon: "file" }
				]
			},
			{
				id: 12,
				label: "类别二",
				count: 40,
				icon: "document",
				children: [
					{ id: 121, label: "子类别 2-1", count: 15, icon: "file" },
					{ id: 122, label: "子类别 2-2", count: 25, icon: "file" }
				]
			},
			{
				id: 13,
				label: "类别三",
				count: 30,
				icon: "document"
			}
		]
	},
	{
		id: 2,
		label: "已标记",
		count: 50,
		icon: "star",
		children: [
			{ id: 21, label: "重要数据", count: 25, icon: "star-filled" },
			{ id: 22, label: "待处理", count: 25, icon: "clock" }
		]
	},
	{
		id: 3,
		label: "回收站",
		count: 10,
		icon: "delete"
	}
])

const treeProps = {
	children: "children",
	label: "label"
}

// 表单配置
const formData = ref({
	name: "",
	code: "",
	type: "",
	status: "",
	dateRange: []
})

const formColumns = computed<FormColumn[]>(() => [
	{
		prop: "name",
		label: "名称",
		type: "input",
		placeholder: "请输入名称",
		colSpan: 1
	},
	{
		prop: "code",
		label: "编号",
		type: "input",
		placeholder: "请输入编号",
		colSpan: 1
	},
	{
		prop: "type",
		label: "类型",
		type: "select",
		placeholder: "请选择类型",
		options: [
			{ label: "全部", value: "" },
			{ label: "类型一", value: "type1" },
			{ label: "类型二", value: "type2" },
			{ label: "类型三", value: "type3" }
		],
		colSpan: 1
	},
	{
		prop: "status",
		label: "状态",
		type: "select",
		placeholder: "请选择状态",
		options: [
			{ label: "全部", value: "" },
			{ label: "启用", value: "active" },
			{ label: "禁用", value: "inactive" }
		],
		colSpan: 1
	},
	{
		prop: "dateRange",
		label: "创建时间",
		type: "daterange",
		placeholder: "请选择时间范围",
		colSpan: 2,
		valueFormat: "YYYY-MM-DD",
		componentProps: {
			rangeSeparator: "至",
			startPlaceholder: "开始日期",
			endPlaceholder: "结束日期"
		}
	}
])

// 表格列配置
const tableColumns = computed<TableColumn[]>(() => [
	{
		type: "index",
		label: "序号",
		width: 60,
		align: "center"
	},
	{
		prop: "name",
		label: "名称",
		minWidth: 150,
		showOverflowTooltip: true
	},
	{
		prop: "code",
		label: "编号",
		width: 120
	},
	{
		prop: "type",
		label: "类型",
		width: 100
	},
	{
		prop: "status",
		label: "状态",
		width: 80,
		align: "center",
		render: (row: Record<string, unknown>) => {
			const statusType = row.status === "active" ? "success" : "info"
			const text = row.status === "active" ? "启用" : "禁用"
			return (
				<>
					<ElTag type={statusType}>{text}</ElTag>
				</>
			)
		}
	},
	{
		prop: "createTime",
		label: "创建时间",
		width: 180
	},
	{
		prop: "description",
		label: "描述",
		minWidth: 200,
		showOverflowTooltip: true
	},
  //
	// {
	// 	label: "操作",
	// 	width: 150,
	// 	fixed: "right",
	// 	slot: "action"
	// }
])

// 模拟数据 
const generateMockData = () => {
	const types = ["类型一", "类型二", "类型三"]
	const statuses = ["active", "inactive"]
	const data = []
	for (let i = 1; i <= 50; i++) {
		data.push({
			id: i,
			name: `数据项 ${i}`,
			code: `CODE${String(i).padStart(4, "0")}`,
			type: types[i % 3],
			status: statuses[i % 2],
			createTime: `2024-${String(Math.floor(i / 4) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")} ${String(i % 24).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
			description: `这是第 ${i} 条数据的详细描述信息，包含各种相关内容。`
		})
	}
	return data
}

const allData = ref(generateMockData())

// 分页配置
const pagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0
})

// 视图模式
const viewMode = ref<"table" | "card">("table")

// 表格数据
const tableData = computed(() => {
	const start = (pagination.currentPage - 1) * pagination.pageSize
	const end = start + pagination.pageSize
	pagination.total = allData.value.length
	return allData.value.slice(start, end)
})

// Refs - 用于获取组件实例
const formRef = ref()
const tableRef = ref()
const treeRef = ref()

// 标记为已使用（避免未使用变量警告）
void formRef
void tableRef
void treeRef

// Tab 切换
const handleTabChange = (key: string) => {
	activeTab.value = key
	// 切换 Tab 时重新加载树形数据
	loadTreeData(key)
}

// 加载树形数据
const loadTreeData = (type: string) => {
	// 模拟根据类型加载不同数据
	console.log("加载树形数据:", type)
}

// 树节点点击
const handleTreeNodeClick = (data: Record<string, unknown>) => {
	console.log("选中节点:", data)
	// 选中节点后刷新列表数据
	pagination.currentPage = 1
}

// 搜索
const handleSearch = (values: Record<string, unknown>) => {
	console.log("搜索条件:", values)
	pagination.currentPage = 1
	ElMessage.success("搜索成功")
}

// 重置
const handleReset = () => {
	formData.value = {
		name: "",
		code: "",
		type: "",
		status: "",
		dateRange: []
	}
	pagination.currentPage = 1
	ElMessage.info("已重置")
}

// 分页
const handleSizeChange = (size: number) => {
	pagination.pageSize = size
	pagination.currentPage = 1
}

const handleCurrentChange = (page: number) => {
	pagination.currentPage = page
}

// 新增
const handleAdd = () => {
	ElMessage.info("点击新增")
}

// 导出
const handleExport = () => {
	ElMessage.info("点击导出")
}

// 编辑
const handleEdit = (row: Record<string, unknown>) => {
	console.log("编辑:", row)
	ElMessage.info(`编辑: ${row.name}`)
}

// 删除
const handleDelete = (row: Record<string, unknown>) => {
	ElMessageBox.confirm(`确认删除 "${row.name}" 吗？`, "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning"
	})
  .then(() => {
    ElMessage.success("删除成功")
  })
  .catch(() => {
    ElMessage.info("已取消")
  })
}
</script>

<style lang="scss" scoped>
@use "./index.scss" as *;
</style>
