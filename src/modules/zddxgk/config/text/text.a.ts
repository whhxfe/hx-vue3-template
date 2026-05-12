/**
 * zddxgk 模块文字配置 A 版本
 * 人地地图 - 日常监控
 */
import type { TextConfig } from './types'

const textA: TextConfig = {
	// ========== 通用 ==========
	common: {
		confirm: '确认',
		cancel: '取消',
		save: '保存',
		delete: '删除',
		edit: '编辑',
		add: '新增',
		search: '搜索',
		reset: '重置',
		export: '导出',
		view: '查看',
		submit: '提交',
		all: '全部',
		enabled: '启用',
		disabled: '禁用',
		loading: '加载中...',
		noData: '暂无数据',
		success: '操作成功',
		error: '操作失败',
		warning: '警告',
		yes: '是',
		no: '否',
		ok: '确定',
		back: '返回',
		close: '关闭',
		tip: '提示',
		deleteConfirm: '确定要删除「{name}」吗？',
		status: '状态',
		createTime: '创建时间',
		description: '描述',
		action: '操作'
	},

	// ========== 人日管理 ==========
	rrgk: {
		title: '人日管理',
		businessManagement: '业务管理',
		relationOrgan: '关系机构',
		name: '名称',
		code: '编号',
		type: '类型',
		typeAll: '全部',
		type1: '类型一',
		type2: '类型二',
		type3: '类型三',
		statusActive: '启用',
		statusInactive: '禁用',
		createTime: '创建时间',
		tableView: '表格视图',
		cardView: '卡片视图',
		searchPlaceholder: '搜索名称、编号...',
		resetConfirm: '已重置'
	},

	// ========== 人日预警 ==========
	rryj: {
		title: '人日预警'
	},

	// ========== 人日态势 ==========
	rrst: {
		title: '人日态势'
	},

	// ========== 目标其他检查 ==========
	mbqtjc: {
		title: '目标其他检查'
	},

	// ========== 目标调研检查 ==========
	mbdyjc: {
		title: '目标调研检查'
	},

	// ========== 目标模型管理 ==========
	mbmxgl: {
		title: '目标模型管理'
	},

	// ========== 菜单 ==========
	menu: {
		rrgk: '人日管理',
		rryj: '人日预警',
		rrst: '人日态势',
		mbqtjc: '目标其他检查',
		mbdyjc: '目标调研检查',
		mbmxgl: '目标模型管理'
	},

	// ========== 路由 meta ==========
	route: {
		zddxgk: '人地地图',
		rrgk: '人日管理',
		rryj: '人日预警',
		rrst: '人日态势',
		mbqtjc: '目标其他检查',
		mbdyjc: '目标调研检查',
		mbmxgl: '目标模型管理'
	},

	module: {
		title: '人地地图',
		name: 'zddxgk'
	}
}

export default textA
