module.exports = {
	root: true,
	env: { browser: true, es2021: true, node: true },
	parser: "vue-eslint-parser",
	parserOptions: {
		parser: "@typescript-eslint/parser",
		project: ["./tsconfig.json"], // 可选：增强类型检查
		tsconfigRootDir: __dirname,
		extraFileExtensions: [".vue"]
	},
	extends: [
		"eslint:recommended",
		"plugin:vue/vue3-recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended" // ✅ prettier集成
	],
	rules: {
		// 一些可选规则
		"vue/multi-word-component-names": "off",
		"@typescript-eslint/no-unused-vars": ["warn"],
		"@typescript-eslint/no-explicit-any": "off"
	}
}
