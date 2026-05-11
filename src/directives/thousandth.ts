// directives/thousandth.ts
import type { DirectiveBinding, ObjectDirective } from 'vue';

// 扩展HTMLElement类型，存储原始值（用于更新对比）
declare global {
  interface HTMLElement {
    _rawValue?: number | string | null | undefined;
  }
}

/**
 * 核心格式化：千分位+指定小数位
 * @param value 待格式化值
 * @param decimalDigits 保留小数位数（默认0）
 */
const formatWithThousandth = (value: any, decimalDigits = 0): string => {
  // 处理空值/非数字：直接返回原始内容
  if (value === null || value === undefined || isNaN(Number(value))) {
    return String(value || '');
  }

  const number = Number(value);
  // 原生API实现：千分位+固定小数位（decimalDigits控制）
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimalDigits,
    maximumFractionDigits: decimalDigits, // 最小/最大一致，避免位数波动
  }).format(number);
};

// 简化版千分位指令
const thousandthDirective: ObjectDirective = {
  // 初始化：首次格式化
  created(el: HTMLElement, binding: DirectiveBinding) {
    el._rawValue = binding.value;
    // 解析参数：指令参数（如:2）转为小数位数，默认0
    const decimalDigits = binding.arg ? Math.max(0, parseInt(binding.arg, 10)) : 0;
    el.textContent = formatWithThousandth(binding.value, decimalDigits);
  },

  // 数据更新：仅值变化时重新格式化
  updated(el: HTMLElement, binding: DirectiveBinding) {
    if (el._rawValue !== binding.value) {
      el._rawValue = binding.value;
      const decimalDigits = binding.arg ? Math.max(0, parseInt(binding.arg, 10)) : 0;
      el.textContent = formatWithThousandth(binding.value, decimalDigits);
    }
  },

  // 解绑清理：删除自定义属性
  unmounted(el: HTMLElement) {
    delete el._rawValue;
  },
};

export default thousandthDirective;