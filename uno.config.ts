// uno.config.ts
import { defineConfig } from "unocss"
import presetUno from "@unocss/preset-uno"
import presetIcons from "@unocss/preset-icons"
// import presetAttributify from "@unocss/preset-attributify"
import transformerDirectives from "@unocss/transformer-directives"
export default defineConfig({
	presets: [
		presetUno({
			// preflight: false
		}),
		presetIcons({
			warn: true,
			scale: 1,
			collections: {
				// "mdi:": () => import("@iconify-json/mdi/icons.json").then(i => i.default)
				// carbon: () => import('@iconify-json/carbon/icons.json').then(i => i.default),
				// logos: () => import('@iconify-json/logos/icons.json').then(i => i.default),
			},
			extraProperties: {
				display: "inline-block",
				"vertical-align": "middle",
				cursor: "pointer"
				// ...
			}
		})
	],
	// 🚫 禁止 UnoCSS 命中原生标签
	blocklist: ["table", "thead", "tbody", "tr", "th", "td", "header", "aside", "section", "main", "layout"],
	// 👇 关键：启用 directives 转换器
	transformers: [
		transformerDirectives()
		// 可选：如果你还用到变体分组，可加 transformerVariantGroup()
	],
	theme: {
		fontFamily: {
			bebas: ["Bebas", "sans-serif"],
			siyuan: ["siyuan_normal"]
		},
		// ---- CSS Variables 桥接 ----
		// 将主题 CSS 变量映射到 UnoCSS 语义颜色名
		// 模板中使用 bg-bg-elevated / text-text-primary 等类名
		// 本质仍是 CSS 变量，会随 html.dark 切换自动变化
		colors: {
			// Background Colors
			bg: {
				base: "var(--bg-base)",
				elevated: "var(--bg-elevated)",
				overlay: "var(--bg-overlay)",
				hover: "var(--bg-hover)",
				active: "var(--bg-active)",
				disabled: "var(--bg-disabled)",
			},
			// Text Colors
			text: {
				primary: "var(--text-primary)",
				regular: "var(--text-regular)",
				secondary: "var(--text-secondary)",
				placeholder: "var(--text-placeholder)",
				disabled: "var(--text-disabled)",
				inverse: "var(--text-inverse)",
			},
			// Border Colors
			border: {
				base: "var(--border-base)",
				light: "var(--border-light)",
				lighter: "var(--border-lighter)",
				"extra-light": "var(--border-extra-light)",
				dark: "var(--border-dark)",
				darker: "var(--border-darker)",
				hover: "var(--border-hover)",
			},
			// Fill Colors（兼容 Element Plus 填充色）
			fill: {
				DEFAULT: "var(--el-fill-color)",
				light: "var(--el-fill-color-light)",
				lighter: "var(--el-fill-color-lighter)",
				"extra-light": "var(--el-fill-color-extra-light)",
				dark: "var(--el-fill-color-dark)",
				darker: "var(--el-fill-color-darker)",
				blank: "var(--el-fill-color-blank)",
			},
			// 品牌色（不随主题变化，但语义化访问更方便）
			primary: {
				DEFAULT: "var(--color-primary)",
				"light-3": "var(--color-primary-light-3)",
				"light-5": "var(--color-primary-light-5)",
				"light-7": "var(--color-primary-light-7)",
				"dark-2": "var(--color-primary-dark-2)",
			},
			success: {
				DEFAULT: "var(--color-success)",
				"dark-2": "var(--color-success-dark-2)",
			},
			warning: {
				DEFAULT: "var(--color-warning)",
				"dark-2": "var(--color-warning-dark-2)",
			},
			danger: {
				DEFAULT: "var(--color-danger)",
				"dark-2": "var(--color-danger-dark-2)",
			},
			info: {
				DEFAULT: "var(--color-info)",
				"dark-2": "var(--color-info-dark-2)",
			},
		},
		// Border Radius 映射
		borderRadius: {
			sm: "var(--radius-sm)",
			base: "var(--radius-base)",
			md: "var(--radius-md)",
			lg: "var(--radius-lg)",
			round: "var(--radius-round)",
			full: "var(--radius-circle)",
		},
		// Box Shadow 映射
		boxShadow: {
			sm: "var(--shadow-sm)",
			base: "var(--shadow-base)",
			md: "var(--shadow-md)",
			lg: "var(--shadow-lg)",
			xl: "var(--shadow-xl)",
		},
	},
	shortcuts: {
		"border-light": ["border-1", "border-gray-200", "border-solid", "rounded-md"],
		// 更新为新的 CSS 变量名
		page: ["w-full", "h-full", "p-5", "bg-bg-base"],
		layout: ["w-full", "h-full", "overflow-y-hidden"],
		panel: [
			"p-5",
			"bg-bg-elevated",		// 使用映射后的语义色
			"rounded-md",
			"min-h-12.5",
			"mb-5",
			"last:mb-0"
		],
		"btn-group": ["flex", "items-center", "justify-between", "gap-4"],
		"flex-x": "flex items-center",
		"flex-y": "flex justify-center",
		"flex-c": "flex items-center justify-center",
		"flex-b": "flex items-center justify-between",
		"flex-a": "flex items-center justify-around",
		"flex-col-c": "flex flex-col items-center justify-center",
		"flex-col-b": "flex flex-col items-center justify-between",
		// 新增高频组合 shortcut
		card: "bg-bg-elevated text-text-primary border border-border-base shadow-base rounded-md",
		"card-hover": "bg-bg-elevated text-text-primary border border-border-base shadow-md rounded-md hover:shadow-lg transition-shadow",
		"text-main": "text-text-primary",
		"text-muted": "text-text-secondary",
		"bg-page": "bg-bg-base",
	}
})