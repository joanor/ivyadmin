export interface Result<T = any, K = any[]> {
  code: number
  type?: 'success' | 'error' | 'warning'
  message: string
  result: T
  columns?: K // 字段说明，可以当作表头
}

export interface ResultAllMeter {
  electricityMeter: {
    type: 'electricityMeter'
    state: '1' | '2' | '3'
    nums: number
  }[]
  gasMeter: { type: 'gasMeter'; state: '1' | '2' | '3'; nums: number }[]
  iot: { type: 'iot'; state: '1' | '2' | '3'; nums: number }[]
  tmnl: { type: 'tmnl'; state: '1' | '2' | '3'; nums: number }[]
  waterMeter: { type: 'waterMeter'; state: '1' | '2' | '3'; nums: number }[]
  [x: string]: { type: string; state: '1' | '2' | '3'; nums: number }[]
}

// 上方Result中result的类型（适用于list列表）
export interface ResultData<T> {
  current: number
  orders: string[]
  pages: number
  records: T[]
  searchCount: boolean
  size: number
  total: number
}

// 上方ResultData中records的数组对象类型（电表）
export interface ResultOrginfoStruct {
  area: string
  contacts: string
  employees: string
  image: string
  newEnergyAccess: string
  operatingCapacity: string
  orgAddr: string
  orgIndustry: number
  orgName: string
  orgNo: string
  orgType: string
  profile: string
  tel: string
  wiringMode: string
  [x: string]: string | number
}

export interface ResultMainFieldStruct {
  codeSortId: number
  codeType: string
  dispSn: number
  name: string
  validFlag: string
  [x: string]: string | number
}

export interface ResultSubFieldStruct {
  codeId: number
  codeSortId: string
  dispSn: number
  name: string
  validFlag: string
  value: string
  [x: string]: string | number
}

export interface ResultOrgTreeStruct {
  orgId: number
  orgLevel: number
  orgName: string
  orgNo: string
  upOrgNo: string
  [x: string]: string | number
}

export interface ResultAreaTreeSolveStruct {
  areaId: number
  areaLevel: number
  areaName: string
  areaNo: string
  description: string
  orgNo: string
  upAreaNo: string
}

export interface ResultOrgDetailInfo {
  orgNo: string
  orgType: string
  orgName: string
  wiringMode: string
  operatingCapacity: string
  newEnergyAccess: string
  orgAddr: string
  contacts: string
  tel: string
  employees: string
  area: string
  profile: string
  image: string | null
  orgIndustry: null
}

// 上方Result中columns的类型数组对象类型
export type ResultColumnsData = {
  name: string
  title: string
  nullable: boolean
  hidden: boolean
  format: string
  readOnly: boolean
  notes: string
  [x: string]: string | number | boolean | any
}

/*****************上方为常用类型*****************/

// 请求参数的类型
export interface RequestParams {
  page: {
    size: number
    pages: number
  }
}

// 新增接口
export interface AddAreaStruct {
  areaId: number
  areaLevel: number
  areaName: string
  areaNo: string
  description: string
  orgNo: string
  upAreaNo: string
}
