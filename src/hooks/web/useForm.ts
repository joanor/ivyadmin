/**
 * 与表单相关的操作
 * 包括重置表单，编辑表单时赋值等操作
 */

import { BaseStruct, generateFormAndRules, isString } from 'ivy2'
import type { RuleItem } from 'async-validator'
import { ref, reactive, toRefs, Ref, watch, unref, isRef } from 'vue'
import { FormInstance } from 'element-plus'
import { createFormAndRule } from '@/libs/formAndRules/records'
import { resetForm } from '@/libs/formAndRules/form'
import { ResultColumnsData } from '@/libs/model'
import { useGlobalStore } from '@/store'
import { ModelType, DictFieldType } from '../common'

interface RuleItemExtend extends RuleItem {
  trigger: string
}

interface SelectOption {
  codeId: string
  codeType?: string
  name: string
  value: string
}

interface FormColumns extends ResultColumnsData {
  selectOptions: SelectOption[]
  formItemType: string | DictFieldType | undefined
}

// 控制那些表单字段需要在页面展示和是否需要在form对象中保留
interface BlackListField {
  field: string // 接口返回的columns中无需在页面展示的字段
  beIn: boolean //  表示仍需要在form表单中出现的字段（但可以不出现在页面中）
}

/**
 * 需要进行form表单校验的字段（默认）
 * 数组第一个元素表示提示语;
 * 数组第二个元素表示触发条件,不填的话默认为'blur'(说明表单元素为input,不需要选择)
 * 数组第三个元素表示字典接口中返回的字段名称
 *
 * 如果只有第一个元素，没有第二和第三个元素，表示是input
 * 如果第一、第二个和第三个元素同时存在，说明是select，并且可以从字典接口中获取选项
 * 如果只有第一和第二个元素，但没有第三个元素，说明是date或者没有字典的select
 * 
 * @example
 * 
 * const formInRuleProps = {
     name: ['请输入代码值的名称'],
     commAddress: ['请输入通信地址'],
     commMode: ['请选择通信方式', 'change', 'COMM_MODE'],
     protocolType: ['请输入资产编号', 'change', 'PROTOCOL_TYPE'],
     phaseLine: ['请选择相线', 'change', 'PHASE_LINE'],
     baudrate: ['请选择波特率', 'change', 'BAUDRATE'],
     state: ['请选择设备状态', 'change', 'METER_STATE'],
     equipType: [
       '请选择设备类型',
       'change',
       {
         water: 'WATER_METER_TYPE',
         gas: 'GAS_METER_TYPE',
       },
     ],
   }
 * 
 */
export const formInRuleProps: Record<string, (string | DictFieldType)[]> = {
  orgName: ['请输入企业名称'],
  orgType: ['请输入企业类型'],
  employees: ['请输入企业员工人数'],
  area: ['请输入企业占地面积'],
  orgAddr: ['请输入企业地址'],
}

/**
 * 无需进行form表单校验的字段（默认）
 * 数组第一个元素表示元素类型
 * 数组第二个元素表示从字典中获取的select选项值，如果没有第二个元素，表示是用户自定义的选项（通过userSelectOptions参数）
 */
export const formNotRuleProps: Record<string, (string | DictFieldType)[]> = {
  validFlag: ['select'],
}

// 拿到字典，通过字典获取select选项的值
const useGlobal = useGlobalStore()

/**
 * @param formPropList
 * @param blacklistProps 接口返回的columns中，不需要出现在页面中的字段列表
 * @param userSelectOptions 用户自定义的select选项（而不是从字典中获取）
 * @param aformInRulePropList 用户自定义的需要校验的表单字段
 * @param aformNotRulePropList 用户自定义的不需要校验的表单字段
 * @param model 有的时候表单字段相同，但是select选项却不相同。通过model来进行区分。
 * @returns
 *
 * @example
 *
 */
export default function (
  formPropList: Ref<ResultColumnsData[]> | string[], // 这里的ResultColumnsData由接口的返回来确定，一个项目中肯定是保持一致的
  blacklistProps: BlackListField[] = [],
  userSelectOptions: {
    [x: string]: SelectOption[]
  } = {},
  aformInRulePropList: Record<string, (string | DictFieldType)[]> = {},
  aformNotRulePropList: Record<string, (string | DictFieldType)[]> = {},
  model: ModelType = 'water'
) {
  const formInRulePropList = {
    ...formInRuleProps,
    ...aformInRulePropList,
  }

  const formNotRulePropList = {
    ...formNotRuleProps,
    ...aformNotRulePropList,
  }

  const formRef = ref<FormInstance>() as Ref<FormInstance> // 表单ref
  const data = reactive({
    form: {} as Record<string, any>,
    rules: {} as Record<string, any>,
    formColumns: [] as FormColumns[], // 由于接口返回的columns和表单要展示的字段不完全一致，所以这里定义了新的变量formColumns用于保存form要展示的字段
  })

  let blackList: string[] = []
  let props: string[] = []
  let attaches: BaseStruct<string, boolean>[] = []

  blackList = blacklistProps.map(v => v.field)

  // 用于自动生成表单结构和校验规则
  if (isRef(formPropList)) {
    // 接口返回结构
    watch(formPropList, newValue => {
      // 将黑名单中的字段过滤掉，剩下的都是可以用于表单在页面展示的字段
      const formPropList = unref(newValue).filter(
        column => blackList.indexOf(column.name) === -1
      )

      // 自定义内部方法
      const setFormItemType = (propName: string) => {
        if (Object.keys(formInRulePropList).indexOf(propName) > -1) {
          // 需要校验的表单字段
          if (!formInRulePropList[propName][1]) {
            return 'input'
          } else if (formInRulePropList[propName][1] === 'change') {
            return 'select'
          }
        } else if (Object.keys(formNotRulePropList).indexOf(propName) > -1) {
          // 不需要校验的表单字段
          return formNotRulePropList[propName][0]
        } else {
          // 默认是input
          return 'input'
        }
      }
      // 生成formColumns（select的选项可能是字典返回的，也可能是用户自己写的，又或者需要规则校验的，也有可能不需要规则校验）
      data.formColumns = formPropList.map(item => {
        let tmpProp = ''
        if (
          Object.keys(formInRulePropList).indexOf(item.name) > -1 &&
          formInRulePropList[item.name][2]
        ) {
          // 需要校验的字段，同时取字典返回数据
          const tmp = formInRulePropList[item.name][2]
          isString(tmp) ? (tmpProp = tmp) : (tmpProp = tmp[model])
        } else if (
          Object.keys(formNotRulePropList).indexOf(item.name) > -1 &&
          formNotRulePropList[item.name][1]
        ) {
          // 不需要校验的字段，同时取字典返回
          const tmp = formNotRulePropList[item.name][1]
          isString(tmp) ? (tmpProp = tmp) : (tmpProp = tmp[model])
        } else {
          // 用户自己定义select options
          tmpProp = item.name
        }

        return {
          ...item,
          selectOptions: tmpProp
            ? useGlobal.dicts[tmpProp] || userSelectOptions[tmpProp]
            : [],
          formItemType: setFormItemType(item.name),
        }
      })

      // 生成自定义校验规则
      props = formPropList.map(column => column.name)
      attaches = unref(newValue).map(column => ({
        label: column.name,
        default: '',
        required: Object.keys(formInRulePropList).indexOf(column.name) > -1,
        rule: [
          {
            required: Object.keys(formInRulePropList).indexOf(column.name) > -1,
            message: formInRulePropList[column.name]
              ? formInRulePropList[column.name][0] ?? ''
              : '',
            trigger: formInRulePropList[column.name]
              ? formInRulePropList[column.name][1] ?? 'blur'
              : '',
          },
        ] as RuleItemExtend[],
        id: '',
      }))

      // 生成最终的表单和校验规则
      const [_form, _rules] = generateFormAndRules(
        [...props],
        createFormAndRule([...attaches])
      )
      data.form = _form
      data.rules = _rules
    })
  } else {
    props = formPropList.filter(column => blackList.indexOf(column) === -1)
    attaches = props.map(column => ({
      label: column,
      default: '',
      required: false,
      rule: [],
      id: '',
    }))
    const [_form, _rules] = generateFormAndRules(
      [...props],
      createFormAndRule([...attaches])
    )
    data.form = _form
    data.rules = _rules
  }

  // 重置表单
  const onResetForm = resetForm(() => {
    console.log(`重置表单`)
  })

  // 编辑表单赋值
  const onEditForm = (obj: Recordable, ...inNeedProps: string[]) => {
    // 保存编辑表单需要传入id
    for (const prop of Object.keys(obj)) {
      if (
        blackList.indexOf(prop) === -1 ||
        [
          ...blacklistProps.filter(v => v.beIn).map(v => v.field),
          ...inNeedProps,
        ].indexOf(prop) > -1
      ) {
        data.form[prop] = obj[prop]
      }
    }
  }

  return {
    ...toRefs(data),
    formRef,
    onResetForm,
    onEditForm,
  }
}
