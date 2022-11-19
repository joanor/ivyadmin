export interface Result<T = any, K = any[]> {
  code: number
  type?: 'success' | 'error' | 'warning'
  message: string
  result: T
  columns?: K // 字段说明，可以当作表头
}

export interface FirstListValue {
  update: string
  value: string | number
}

export type FirstInfo = {
  count: number
  compare: number
}

export interface ConsumePower {
  detail: FirstInfo
  records: FirstListValue[]
}

export interface FirstListValue {
  update: string
  value: string | number
}
