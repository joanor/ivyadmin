/**
 * 与表单相关的操作
 */

import { BaseStruct, generateFormAndRules, isString, _console } from 'ivy2'
import type { RuleItem } from 'async-validator'
import {
  ref,
  reactive,
  toRefs,
  Ref,
  nextTick,
  watchEffect,
  UnwrapRef,
} from 'vue'
import { FormInstance } from 'element-plus'
import { createFormAndRule } from '@/libs/formAndRules/records'
import { resetForm } from '@/libs/formAndRules/form'
import { ResultColumnsData } from '@/api/model'
import { useGlobalStore } from '@/store'
import { FormPropRule } from '@/libs/shared/types'

interface RuleItemExtend extends RuleItem {
  trigger: string
}

// 拿到字典，通过字典获取select选项的值
const useGlobal = useGlobalStore()

interface HookOption {
  expectOrderPropNames?: string[] // 期待的表单字段排序
  expectOmitedColumnNames?: string[] // 期待忽略的column字段
  expectPickedColumnNames?: string[] // 期待存在的表单字段
  customDictionary?: {
    [x: string]: Recordable[]
  } // 用户自定义的字典（当接口没有返回的时候，自定义的字典，用于select选项）
}

/**
 * 通过传入接口返回的columns，或者用户自己传入的字符串数组，来生成展示的表单字段
 * 可能存在的主要问题：
 * 1、接口返回的字段有一些是我们不需要的
 * 解决方法：通过字段hidden和传入自定义expectOmitedPropNames或expectPickedPropNames字段来进行过滤
 * 2、页面展示的表单字段和实际提交时的表单字段不一致。（因为页面form表单是自动生成的，所以存在此问题，）
 * 解决方法：先生成我们提交表单时的表单结构字段，然后再通过hidden和传入自定义expectOmitedPropNames或expectPickedPropNames来生成页面展示的字段列表
 * @param myFormProps 表单字段名称组成的字符串数组
 * @param columns 由接口返回
 * @param option
 * @returns
 */
export default function <FormStruct>(
  myFormProps: (FormPropRule<string> | string)[],
  columns?: Ref<ResultColumnsData[]>,
  option: HookOption = {}
) {
  const initialHookOption = {
    expectOrderPropNames: [] as [],
    expectOmitedColumnNames: [] as string[],
    expectPickedColumnNames: [] as string[],
    customDictionary: {} as {
      [x: string]: Recordable[]
    },
    ...option,
  }

  const {
    expectOrderPropNames,
    expectOmitedColumnNames,
    expectPickedColumnNames,
    customDictionary,
  } = initialHookOption

  const dictionary: Recordable = {
    ...useGlobal.dicts,
  }

  // 将用户传入的myFormProps转成FormPropRule[]类型
  const myHandledFormProps = myFormProps.map(v => {
    if (isString(v)) {
      return {
        name: v,
      }
    } else {
      return v
    }
  })

  // 获取表单的全部字段
  const myFormPropNames = myHandledFormProps.map(v => v.name)

  // 获取需要校验的表单字段名称组成的数组
  const expectRequiredPropNames = myHandledFormProps
    .filter(v => v.required)
    .map(v => v.name)

  // 表单涉及的数据
  const formRef = ref<FormInstance>() as Ref<FormInstance> // 表单ref
  const data = reactive({
    form: {} as FormStruct,
    rules: {} as Recordable,
    formColumns: [] as ResultColumnsData[], // 由于接口返回的columns和表单要展示的字段不完全一致，所以这里定义了新的变量formColumns用于保存页面中form要展示的字段
  })

  let attaches: BaseStruct<string, boolean>[] = []
  let pageShowFormColumnNames: string[] = []
  let pageOmitedFormColumnNames: string[] = []

  // 接口返回列表，自动生成表单结构和校验规则
  if (columns) {
    const unwatch = watchEffect(() => {
      // 若接口没有返回值，则直接返回
      if (columns.value.length === 0) return

      /**
       * 以下从第1步到第4步，生成的是页面中展示的表单字段（跟提交时的表单字段可能会有区别：比如id字段，不需要在页面中出现，但是编辑提交时需要带上）
       */

      // 1、重新排序并过滤不需要出现在页面中的form字段
      const orderedColumnNames = Array.from(
        new Set([...expectOrderPropNames, ...myFormPropNames])
      ).filter(
        columnName =>
          expectPickedColumnNames.indexOf(columnName) > -1 ||
          expectOmitedColumnNames.indexOf(columnName) === -1
      )

      // 2、生成表单字段的对象数组(ResultColumnsData[]类型)
      const orderedColumns = orderedColumnNames
        .map<ResultColumnsData | undefined>(columnName => {
          return columns.value.find(column => column.name === columnName)
        })
        .filter(v => v) as ResultColumnsData[]

      // 3、设置表单字段的trigger、selectOption、message、component属性
      orderedColumns.forEach(column => {
        const tmp = myHandledFormProps.filter(v => v.name === column.name)[0]
        if (tmp) {
          if (!column.trigger) {
            // 不存在column.trigger，说明不是接口返回的字典字段
            column.trigger = tmp.trigger || 'blur'
            column.selectOption = tmp.dictname
              ? dictionary[tmp.dictname] || []
              : customDictionary[column.name] || []
            column.message = tmp.message || `请输入${column.title}`
            column.component = tmp.component || 'input'
          } else {
            // 若已经存在column.trigger，说明接口返回时已经确定的，是字典字段。属于select类型，trigger为change
            // _console.error(`${column.name}存在默认的trigger`)
          }
        }
      })

      // 4、赋值给表示页面展示的表单字段的变量
      data.formColumns = orderedColumns

      // 获取最终在页面展示的表单字段字符串数组
      pageShowFormColumnNames = orderedColumns.map(v => v.name)

      // 那么不在页面中展示的表单字段就是最终被忽略的字段（不能直接使用expectOmitedColumnNames，因为还有expectPickedColumnNames的存在）
      pageOmitedFormColumnNames = myFormPropNames.filter(
        v => pageShowFormColumnNames.indexOf(v) === -1
      )

      // 用于生成表单和校验规则
      attaches = columns.value
        .filter(v => myFormPropNames.indexOf(v.name) > -1)
        .map(column => {
          let validatorObj: RuleItemExtend = {} as RuleItemExtend
          if (expectRequiredPropNames.some(v => v === column.name)) {
            if (column.validator) {
              validatorObj = {
                trigger: column.trigger ?? 'blur',
                validator: column.validator,
              }
            }
          }
          return {
            label: column.name,
            default: '',
            required: expectRequiredPropNames.some(v => v === column.name),
            rule: [
              {
                required: expectRequiredPropNames.some(v => v === column.name),
                message: column.message ?? '',
                trigger: column.trigger ?? 'blur',
              },
              validatorObj,
            ] as RuleItemExtend[],
            id: '',
          }
        })

      // 生成最终的表单和校验规则
      const [_form, _rules] = generateFormAndRules(
        [...myFormPropNames],
        createFormAndRule([...attaches])
      )
      data.form = _form as UnwrapRef<FormStruct>
      data.rules = _rules
      // 取消监听
      unwatch()
    })
  } else {
    // 用于生成表单和校验规则
    attaches = myHandledFormProps.map(myProp => {
      let validatorObj: RuleItemExtend = {} as RuleItemExtend
      if (expectRequiredPropNames.some(v => v === myProp.name)) {
        if (myProp.validator) {
          validatorObj = {
            trigger: myProp.trigger ?? 'blur',
            validator: myProp.validator,
          }
        }
      }
      return {
        label: myProp.name,
        default: '',
        required: expectRequiredPropNames.some(v => v === myProp.name),
        rule: [
          {
            required: expectRequiredPropNames.some(v => v === myProp.name),
            message: myProp.message ?? '',
            trigger: myProp.trigger ?? 'blur',
          },
          validatorObj,
        ] as RuleItemExtend[],
        id: '',
      }
    })
    const [_form, _rules] = generateFormAndRules(
      [...myFormPropNames],
      createFormAndRule([...attaches])
    )
    data.form = _form as UnwrapRef<FormStruct>
    data.rules = _rules
  }

  // 重置表单
  const onResetForm = resetForm(() => {
    // 因为重置表单只能重置页面中展示的字段，而不在页面中展示的字段，没有办法通过resetFields来重置，所以这里人工设置一下
    pageOmitedFormColumnNames.forEach(v => {
      const t = attaches.find(v2 => v2.label === v)
      ;(data.form as Recordable)[v] = t ? t.default : ''
    })
  })

  // 当表单数据回显的时候
  const onEchoForm = (obj: Recordable) => {
    // 保存编辑表单需要传入id
    nextTick(() => {
      // 必须要放在nextTick中执行，否则如果一开始就会给表单赋初值，当重置表单的时候就不对了
      for (const prop of Object.keys(data.form as Recordable)) {
        ;(data.form as Recordable)[prop] = obj[prop]
      }
    })
  }

  return {
    ...toRefs(data),
    formRef,
    onResetForm,
    onEchoForm,
  }
}

/**
 * 此方法用于生成表单类型推断
 * @param configs 
 * @example
   import useForm, { defineFormTypes } from '@/hooks/web/useForm'
   const searchFormProps = defineFormTypes(['companyName', 'address'])
   const { form: searchForm, formRef: searchFormRef } = useForm<
     {
       [P in typeof searchFormProps[number] as P extends string ? P : never]:
         | string
         | number
     } & { [x: string]: string | number }
   >(searchFormProps)
 */
export function defineFormTypes<T extends string>(
  configs: (FormPropRule<T> | T)[]
) {
  return configs
}
