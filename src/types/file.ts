// 导入组件配置类型
export interface ImportConfig {
  templateDownloadUrl: string; // 模板文件下载地址
  uploadUrl: string; // 文件上传接口地址
  uploadFileName?: string; // 上传文件的表单字段名，默认 'file'
  onUploadSuccess?: (res: any) => void; // 上传成功回调
  onUploadError?: (err: Error) => void; // 上传失败回调
}

// 导出类型枚举
export enum ExportType {
  CURRENT_PAGE = 'currentPage', // 当前页
  SELECTED = 'selected', // 选中数据
  CUSTOM_COUNT = 'customCount' // 自定义条数
}

// 导出组件配置类型
export interface ExportConfig {
  exportUrl: string; // 导出接口地址
  currentPage: number; // 当前页码
  pageSize: number; // 每页条数
  total: number; // 总数据条数
  selectedRowKeys?: string[] | number[]; // 选中数据的ID
  onExportSuccess?: (res: any) => void; // 导出成功回调
  onExportError?: (err: Error) => void; // 导出失败回调
}