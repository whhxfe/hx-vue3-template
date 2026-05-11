import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import prettier from "eslint-plugin-prettier";
// 导入 ESLint 配置类型（用于类型约束）
import type { Linter } from "eslint";

// 定义 ESLint 配置（通过泛型约束为 Linter.FlatConfig 数组）
const eslintConfig: Linter.FlatConfig[] = [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    plugins: { js, prettier },
    extends: ["js/recommended"]
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    }
  },
  // 类型断言：确保 TypeScript-ESLint 配置符合 FlatConfig 类型
  ...tseslint.configs.recommended as Linter.FlatConfig[],
  // Vue 推荐配置的类型适配
  pluginVue.configs["flat/recommended"] as Linter.FlatConfig,
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: pluginVue.parser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".vue"],
        project: "./tsconfig.app.json"
      }
    }
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"]
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"]
  },
  {
    ignores: ["**/*.d.ts"]
  },
  {
    rules: {
      "vue/multi-word-component-names": "error"
    }
  }
];

// 导出配置（通过 defineConfig 进一步增强类型校验）
export default defineConfig(eslintConfig);