// @see: https://prettier.io/docs/en/configuration.html
import type { Config } from "prettier"

const config: Config = {
	// 基础格式设置
	printWidth: 120,
	tabWidth: 2,
	useTabs: true,
	semi: false,
	singleQuote: false,
	quoteProps: "as-needed",
	jsxSingleQuote: false,
	trailingComma: "none",

	// 对象与数组格式
	bracketSpacing: true,
	bracketSameLine: false,

	// 箭头函数格式
	arrowParens: "avoid",

	// HTML/Vue 相关
	htmlWhitespaceSensitivity: "ignore",
	vueIndentScriptAndStyle: false,
	htmlSelfClosing: true,
	singleAttributePerLine: false,

	// 文档处理
	proseWrap: "preserve",

	// 特殊标记
	requirePragma: false,
	insertPragma: false,

	// 文件范围控制
	rangeStart: 0,
	rangeEnd: Infinity,

	// 行尾格式
	endOfLine: "auto",
	//
	parameterCountThreshold: 3
}

export default config
