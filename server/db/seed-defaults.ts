/**
 * 默认种子数据定义
 * 统一存放 db.ts 初始化和 seed.ts 数据生成的共享数据
 * 避免重复定义，保持单一数据源
 */

// 字典默认数据已迁移至各字典独立目录下 data.json 文件

// ============================================================
// 系统配置默认数据
// ============================================================

export const defaultSysConfigs = [
  { key: "site_name", value: "HX 管理后台", type: "text", description: "网站名称", sort_order: 1 },
  { key: "site_logo", value: "", type: "image", description: "网站 Logo", sort_order: 2 },
  {
    key: "site_description",
    value: "基于 HX-Vue3-Template 的后台管理系统",
    type: "textarea",
    description: "网站描述",
    sort_order: 3
  },
  { key: "page_size", value: "20", type: "number", description: "默认分页大小", sort_order: 10 },
  {
    key: "upload_max_size",
    value: "5242880",
    type: "number",
    description: "文件上传大小限制(字节)",
    sort_order: 11
  }
]