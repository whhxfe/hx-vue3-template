import type { DirectiveBinding, ObjectDirective, VNode } from 'vue';

// 扩展 HTMLElement 类型，存储 IntersectionObserver 实例（避免类型报错）
declare global {
  interface HTMLElement {
    _visibilityObserver?: IntersectionObserver;
    // 存储元素绑定的索引（对应原代码的 dataset.index）
    dataset: DOMStringMap & { index?: string };
  }
}

/**
 * 可见性监听指令的回调函数类型定义
 * @param isVisible - 元素是否进入视口
 * @param entry - IntersectionObserver 回调的 entry 对象
 */
type ObserveVisibilityCallback = (
  isVisible: boolean,
  entry: IntersectionObserverEntry
) => void;

/**
 * Vue3 TypeScript 可见性监听指令
 * 功能：元素进入视口时触发回调（用于懒加载附件数据）
 */
const observeVisibilityDirective: ObjectDirective = {
  /**
   * 元素绑定指令时调用（替代 Vue2 的 bind）
   * @param el - 绑定指令的 DOM 元素
   * @param binding - 指令绑定信息（包含回调函数）
   * @param _vnode - 元素对应的 VNode（暂未使用，保留参数位置）
   */
  beforeMount(
    el: HTMLElement,
    binding: DirectiveBinding<ObserveVisibilityCallback>,
    _vnode: VNode
  ) {
    // 校验绑定值必须是函数（回调函数）
    if (typeof binding.value !== 'function') {
      console.error('[observe-visibility] 指令绑定值必须是回调函数');
      return;
    }

    // 创建 IntersectionObserver 实例（监听元素是否进入视口）
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          // 元素进入视口时，调用回调函数并传入状态和 entry
          if (entry.isIntersecting) {
            binding.value(true, entry);
            // （可选）若只需触发一次，可在此处停止监听：observer.unobserve(el)
          }
        });
      },
      {
        // 配置：视口交叉比例为 0 即触发（元素刚进入视口就执行）
        threshold: 0,
      }
    );

    // 开始监听目标元素
    observer.observe(el);
    // 将 observer 实例挂载到元素上（用于解绑时清理）
    el._visibilityObserver = observer;
  },

  /**
   * 指令与元素解绑时调用（替代 Vue2 的 unbind）
   * 清理：停止监听，避免内存泄漏
   */
  unmounted(el: HTMLElement) {
    const observer = el._visibilityObserver;
    if (observer) {
      observer.unobserve(el); // 停止监听目标元素
      delete el._visibilityObserver; // 删除元素上的实例引用
    }
  },
};

export default observeVisibilityDirective;