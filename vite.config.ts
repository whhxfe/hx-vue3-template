import { defineConfig, loadEnv } from "vite"
import vue from "@vitejs/plugin-vue"
import path from "path"
import vueDevTools from "vite-plugin-vue-devtools"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import legacy from "@vitejs/plugin-legacy" // 兼容低版本浏览器
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"
// import eslintPlugin from 'vite-plugin-eslint'
import UnoCSS from "unocss/vite" // 引入 UnoCSS 插件
import { visualizer } from "rollup-plugin-visualizer" // 导入体积分析插件
import vueJsx from "@vitejs/plugin-vue-jsx"
import zipPack from 'vite-plugin-zip-pack'
const OUT_DIR = "dist"
const ASSETS_DIR = "static"
const ASSETS_INLINE_LIMIT = 1024 * 4 // 4kb

// 区分开发/生产环境
export default defineConfig(({ mode, command }) => {
	const isProd = mode === "production"
	// 读取当前环境的 API 目标地址
	const env = loadEnv(mode, process.cwd())
	const apiTarget = env.VITE_API_TARGET || "http://192.168.6.58:38011"
	const apiPrefix = "/wzsys"

	const dateStr = new Date().toISOString().slice(0,16).replace(/[-T:]/g,'')
	return {
		// base: "./",
		css: {
			devSourcemap: !isProd, // 开发开启，生产关闭
			preprocessorOptions: {
				scss: {
					
				}
			}
		},
		resolve: {
			extensions: [".vue", ".ts", ".js", ".json"],
			alias: {
				"@": path.resolve(__dirname, "src"),
				"~": path.resolve(__dirname, "src/assets"),
			}
		},

		server: {
			open: false,
			port: 8000,
			host: "0.0.0.0",
			strictPort: false,
		proxy: {
				[apiPrefix]: {
					target: apiTarget,
					changeOrigin: true
				}
			}
		},
		plugins: [
			vue(),
			vueJsx(),
			UnoCSS(),
			createSvgIconsPlugin({
				iconDirs: [
					path.resolve(process.cwd(), "src/assets/svg/mono"),
					path.resolve(process.cwd(), "src/assets/svg/multi")
				],
				symbolId: "icon-[name]",
				inject: "body-last",
				customDomId: "__svg__icons__dom__"
			}),
      zipPack({
        inDir: 'dist',
        outFileName: `project-${mode}-${dateStr}.zip`,
        // 过滤：排除 .map / .log 等文件
        filter: (name) => !/\.(map|log)$/.test(name)
      }),
		  !isProd &&	vueDevTools(),
			// AutoImport：自动导入 API / Hooks（vue, vue-router, pinia）
			// AutoImport({
			// 	resolvers: [ElementPlusResolver()],
			// 	imports: ["vue", "vue-router", "pinia"],
			// 	dts: path.resolve(__dirname, "src/types/auto-imports.d.ts"),
			// 	eslintrc: {
			// 		enabled: true,
			// 		filepath: path.resolve(__dirname, ".eslintrc-auto-import.json"),
			// 		globalsPropValue: true
			// 	}
			// }),

			// Components：自动导入组件（ElementPlus + 自定义）
			// Components({
			// 	resolvers: [ElementPlusResolver()],
			// 	dirs: [
			// 		path.resolve(__dirname, "src/components"),
			// 		path.resolve(__dirname, "src/views/**/components")
			// 	],
			// 	dts: path.resolve(__dirname, "src/types/components.d.ts"),
			// 	extensions: ["vue"],
			// 	deep: true
			// }),

			// legacy：生产环境兼容旧浏览器（targets: chrome89, edge89, firefox89, safari15）
			// isProd && legacy({
			// 	targets: ["chrome89", "edge89", "firefox89", "safari15"]
			// }),

			// visualizer：生产环境打包体积分析
			isProd &&
				visualizer({
					filename: "dist/stats.html",
					gzipSize: true,
					brotliSize: true,
					open: true
				})
		].filter(Boolean),

		build: {
			target: "es2022",
			outDir: OUT_DIR,
			assetsDir: ASSETS_DIR,
			assetsInlineLimit: ASSETS_INLINE_LIMIT,
			sourcemap: !isProd, // 生产关闭 sourcemap
			minify: "esbuild",
			esbuild:{
				drop:[]
				// drop: isProd ? ["console", "debugger"]:[]
			},
			// terserOptions: {
			// 	compress: {
			// 		drop_console: isProd, // 生产删除 console
			// 		drop_debugger: isProd // 生产删除 debugger
			// 	}
			// },
			rollupOptions: {
				output: {
					// manualChunks: {
					// 	vendor: ["vue", "vue-router", "pinia"],
					// 	elementPlus: ["element-plus"]
					// },
					manualChunks(id: string) {
						if (
							id.includes("node_modules/vue/") ||
							id.includes("node_modules/vue-router/") ||
							id.includes("node_modules/pinia/")
						) {
							return "vendor"
						}
						if (id.includes("node_modules/element-plus/")) {
							return "elementPlus"
						}
					},
					entryFileNames: "static/js/[name]-[hash].js",
					chunkFileNames: "static/js/[name]-[hash].js",
					assetFileNames: ({ name }) => {
						if (!name) return "assets/others/[hash][extname]"
						const ext = name.split(".").pop()?.toLowerCase() || ""
						const dirMap = {
							"jpg|jpeg|png|gif|bmp|webp": "images",
							svg: "svg",
							"woff|woff2|eot|ttf|otf": "fonts",
							css: "css"
						}
						const dir = Object.entries(dirMap).find(([key]) => new RegExp(key).test(ext))?.[1] || "other"
						return `${ASSETS_DIR}/${dir}/[hash][extname]`
					}
				}
			}
		}
	}
})
