export type RegionLevel = "省" | "市" | "区"
export type ReturnFormat = "tree" | "flat"
export type Depth = 1 | 2 | 3

export interface RegionItem {
  code: string
  name: string
  level: RegionLevel
}

export interface RegionNode extends RegionItem {
  children?: RegionNode[]
}

export interface QueryParams {
  depth?: Depth
  parentCode?: string
  keyword?: string
  format?: ReturnFormat
  provinceName?: string
  cityName?: string
  districtName?: string
}
