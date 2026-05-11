import type { App } from "vue";
import thousandthDirective from "./thousandth";
import observeVisibilityDirective from "./observe-visibility";
// 定义指令安装函数的类型，确保参数类型正确
const install = (app: App): void => {
  // 注册千分位指令，指定指令名称和实现
  app.directive("thousandth", thousandthDirective);
  app.directive("observe-visibility", observeVisibilityDirective);
  // 如果有其他指令，可以在这里继续注册
};

// 导出包含install方法的对象，符合Vue插件规范
export default {
  install
};
