export interface DistrictItem {
  name: string
  code: string
  level: string
}

export interface DistrictData {
  [cityName: string]: DistrictItem[]
}