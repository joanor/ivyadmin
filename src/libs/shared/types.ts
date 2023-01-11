import { DICT_FIELDS } from './constant'

// 表单属性及规则结构
export interface FormPropRule<T, U = string> {
  name: T
  default?: U // 默认初始值
  message?: string
  trigger?: 'blur' | 'change' // 触发方式
  dictname?: string // 字典表中的字段名称，字母全部大写
  required?: boolean // 字段是否需要校验
  validator?: AnyFunction
  component?:
    | 'checkbox'
    | 'input'
    | 'select'
    | 'date'
    | 'time'
    | 'number'
    | 'radio'
    | 'switch'
    | 'upload'
    | 'text'
    | 'inputselect'
}

/**
 * **********************字典相关类型**********************
 */
export type DictionaryStruct = {
  codeId?: string
  codeType?: string
  value: string
  name: string
}

export type DictField = typeof DICT_FIELDS[number]

export type DictType = {
  [K in typeof DICT_FIELDS[number]]: DictionaryStruct[]
} & {
  [x: string]: DictionaryStruct[]
}
/*********************************************************/
