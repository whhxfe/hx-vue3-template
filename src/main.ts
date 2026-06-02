import { createApp } from "vue"
import { createPinia } from "pinia"
import router from "./router"
import App from "./App.vue"
import ElementPlus from "element-plus"
import HxUI from "@hx/ui"
import "@hx/ui/dist/index.css"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import zhCn from "element-plus/es/locale/lang/zh-cn"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
// import dayjs from "dayjs"
import * as dayjs from "dayjs"
import isLeapYear from "dayjs/plugin/isLeapYear.js" // 导入插件
import "dayjs/locale/zh-cn" // 导入本地化语言

dayjs.extend(isLeapYear) // 使用插件
dayjs.locale("zh-cn") // 使用本地化语言
// import "dayjs/locale/zh-cn";

import "@/utils/echarts" // echarts 注册
import ECharts from "vue-echarts"
import "virtual:svg-icons-register"

import directives from "./directives"
import "uno.css"
// import "virtual:unocss-devtools"

import "./styles/index.scss"
import "normalize.css"

const app = createApp(App)
const pinia = createPinia()

app.use(ElementPlus, {
	locale: zhCn
})
app.use(HxUI)
app.use(pinia)
app.use(router)
app.use(directives)
// 注册几个必要的全局组件
app.component("v-chart", ECharts)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}

app.mount("#app")
