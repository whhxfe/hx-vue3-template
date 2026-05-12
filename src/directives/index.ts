import type { App } from 'vue'
import thousandthDirective from './thousandth'
import observeVisibilityDirective from './observe-visibility'
import { vPermission, vPermissionDisabled } from './permission'

const install = (app: App): void => {
	app.directive('thousandth', thousandthDirective)
	app.directive('observe-visibility', observeVisibilityDirective)
	app.directive('permission', vPermission)
	app.directive('permission-disabled', vPermissionDisabled)
}

export { vPermission, vPermissionDisabled }

export default { install }
