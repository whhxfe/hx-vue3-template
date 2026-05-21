/**
 * API 模块统一导出
 */

// rygk 模块（包含公共类型）
export { rygk, FOLLOW_LEVEL_OPTIONS } from './rygk'
export type {
	TreeNode,
	DictItem,
	ListItem,
	ListQuery,
	ListResult,
	ApiResponse,
	FollowLevel
} from './rygk'

// ryyj 模块
export { ryyj } from './ryyj'
export type { ListItem as RyyjListItem, ListQuery as RyyjListQuery } from './ryyj'
