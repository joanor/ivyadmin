import { DictionaryStruct, FormPropRule } from '@/libs/shared/types'

export interface Result<T = any, K = ResultColumnsData[]> {
  code: number
  type?: 'success' | 'error' | 'warning'
  message: string
  result: T
  columns?: K // 字段说明，可以当作表头
}

// 接口返回的columns字段类型
export interface ResultColumnsData extends FormPropRule<string> {
  title: string
  nullable: boolean
  hidden: boolean
  format: string
  readOnly: boolean
  notes: string
  width?: string
  fixed?: boolean | 'right' | 'left'
  selectOption?: DictionaryStruct[]
  [x: string]: string | number | boolean | any
}

// 分页接口返回的类型
export interface ResultPaging<T> {
  current: number
  orders: string[]
  pages: number
  records: T[]
  searchCount: boolean
  size: number
  total: number
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
