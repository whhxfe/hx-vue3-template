import request from '@/api/request'
import type { TreeNode } from './types'

export type { TreeNode }

export const rrgk = {
	getTreeData(type: 'yhgl' | 'gxjg') {
		return request.get<{ state: number; message: string; data: TreeNode[] }>('/wzsys/zddxgk/tree', {
			params: { type }
		})
	}
}
