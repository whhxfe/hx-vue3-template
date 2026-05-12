/**
 * 权限指令
 */
import type { Directive, DirectiveBinding } from 'vue'

interface PermissionDirectiveValue {
	permission?: string | string[]
	role?: string | string[]
}

/**
 * 检查是否有权限
 * 根据实际权限系统实现
 */
const checkPermission = (value: PermissionDirectiveValue): boolean => {
	// TODO: 根据实际权限系统实现
	// 示例实现：
	// const userStore = useUserStore()
	// if (!userStore.permissions) return false
	// if (Array.isArray(value.permission)) {
	//   return value.permission.some(p => userStore.permissions.includes(p))
	// }
	// return userStore.permissions.includes(value.permission)
	return true
}

export const vPermission: Directive = {
	mounted(el: HTMLElement, binding: DirectiveBinding<PermissionDirectiveValue>) {
		const { value } = binding

		if (!value) return

		const hasPermission = checkPermission(value)

		if (!hasPermission) {
			// 隐藏元素或移除
			if (el.parentNode) {
				el.parentNode.removeChild(el)
			}
		}
	}
}

/**
 * 权限按钮指令 - 禁用无权限的按钮
 */
export const vPermissionDisabled: Directive = {
	mounted(el: HTMLElement, binding: DirectiveBinding<PermissionDirectiveValue>) {
		const { value } = binding

		if (!value) return

		const hasPermission = checkPermission(value)

		if (!hasPermission) {
			el.setAttribute('disabled', 'true')
			el.classList.add('is-disabled')
			el.addEventListener('click', preventClick, true)
		}
	},
	unmounted(el: HTMLElement) {
		el.removeEventListener('click', preventClick, true)
	}
}

const preventClick = (e: Event) => {
	e.stopImmediatePropagation()
	e.preventDefault()
}

export default vPermission
