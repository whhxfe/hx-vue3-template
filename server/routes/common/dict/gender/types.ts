export interface DictItem {
  label: string
  value: string
}

export interface DictResponse {
  code: number
  message: string
  data: DictItem[]
}