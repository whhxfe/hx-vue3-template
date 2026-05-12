/** 树节点 */
export interface TreeNode {
	id: string | number
	label: string
	count?: number
	icon?: string
	children?: TreeNode[]
}
