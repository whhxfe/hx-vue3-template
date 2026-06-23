/**
 * API 模块统一导出
 */

// tpm/pc 模块（人员管控，包含公共类型）
export { pc, FOLLOW_LEVEL_OPTIONS } from './tpm/pc'
export type {
	TreeNode,
	DictItem,
	ListItem,
	ListQuery,
	ListResult,
	ApiResponse,
	FollowLevel
} from './tpm/pc'

// tpm/pw 模块（人员预警）
export { pw } from './tpm/pw'
export type { ListItem as PwListItem, ListQuery as PwListQuery } from './tpm/pw'

// tpm/pm 模块（人员上图）
export { pm, FOLLOW_STATUS_OPTIONS } from './tpm/pm'
export type { ListItem as PmListItem, ListQuery as PmListQuery, FollowStatus } from './tpm/pm'

// tgm/gc 模块（群体管控）
export { gc } from './tgm/gc'
export type { TreeNode as GcTreeNode, ListItem as GcListItem, ListQuery as GcListQuery, DictItem as GcDictItem } from './tgm/gc'
