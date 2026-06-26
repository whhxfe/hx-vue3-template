import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import type { Linter } from "eslint";

// pluginVue.configs["flat/recommended"] 中部分配置项没有 files 限制，
// 会导致 Vue 规则被应用到 .md 等非 Vue 文件上而崩溃，在此补充 files 限制。
const vueRecommended = pluginVue.configs["flat/recommended"];
const vueRecommendedFiltered = (Array.isArray(vueRecommended) ? vueRecommended : [vueRecommended]).map((config) => {
  if (!config.files) {
    return { ...config, files: ["**/*.vue"] as string[] };
  }
  return config;
});

// 定义全局类型（运行时注入或跨文件共享的类型，用于消除 no-undef 误报）
const sharedGlobals = {
  ...globals.browser,
  ...globals.node,
  SYS_CONFIG: "readonly",
  MenuItem: "readonly",
  StatItem: "readonly",
  OverviewData: "readonly",
  RegionItem: "readonly",
};

// 定义 ESLint 配置
const eslintConfig: Linter.FlatConfig[] = [
  // 排除不参与检查的目录
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/server/**",
      "**/.clinerules/**",
      "**/public/**",
      "**/*.d.ts",
    ]
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    plugins: { js },
    extends: ["js/recommended"]
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    languageOptions: {
      globals: sharedGlobals
    }
  },
  // TypeScript 规则
  ...tseslint.configs.recommended as Linter.FlatConfig[],
  // Vue 推荐配置
  ...vueRecommendedFiltered as Linter.FlatConfig[],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: pluginVue.parser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".vue"],
        ecmaFeatures: {
          // 允许 <script setup lang="tsx"> 中使用 JSX（ua 多个组件在 render 字段中使用）
          jsx: true
        }
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
  // 关闭与 prettier 冲突的规则（必须放在 Vue 配置之后）
  eslintConfigPrettier as Linter.FlatConfig,
  // 全局规则调整
  {
    files: ["**/*"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-duplicate-enum-values": "warn",
      "@typescript-eslint/no-require-imports": "off",
      // 关闭无用的转义字符检查（正则中 `/` 不需要转义）
      "no-useless-escape": "off",
      // `successMessage && fn()` 是惯用的卫语句写法
      "@typescript-eslint/no-unused-expressions": "off",
    }
  },
  // Vue 文件规则调整
  {
    files: ["**/*.vue"],
    rules: {
      // index、layout、303、404 等是标准命名习惯
      "vue/multi-word-component-names": ["error", {
        ignores: ["index", "layout", "default", "base", "303", "403", "404", "v2", "Layout", "Layout2"]
      }],
      // 关闭样式类 Vue 规则
      "vue/attributes-order": "off",
      "vue/first-attribute-linebreak": "off",
      "vue/component-name-in-template-casing": "off",
      "vue/html-self-closing": "off",
      "vue/block-order": "off",
      "vue/define-matches-order": "off",
      "vue/no-unused-components": "warn",
      "vue/require-default-prop": "off",
      "vue/v-on-event-hyphenation": "off",
      "vue/no-empty-component-block": "off",
      "vue/no-deprecated-v-on-native-modifier": "off",
      "vue/no-deprecated-slot-attribute": "off",
      // Vue 3.5+ ref 解包
      "vue/no-ref-as-operand": "off",
      "vue/no-unused-vars": "warn",
    }
  },
];

export default defineConfig(eslintConfig);
