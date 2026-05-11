declare module "vite-plugin-eslint" {
	import type { Plugin } from "vite"

	interface ESLintPluginOptions {
		cache?: boolean
		include?: string[]
		exclude?: string[]
		emitWarning?: boolean
		emitError?: boolean
		failOnWarning?: boolean
		failOnError?: boolean
	}

	function eslintPlugin(options?: ESLintPluginOptions): Plugin

	export default eslintPlugin
}