import { ModelType, DictFieldType } from '../common'
import { formInRuleProps, formNotRuleProps } from './useForm'
import { useGlobalStore } from '@/store'
import { isString } from 'ivy2'

// 字典
const useGlobal = useGlobalStore()

/**
 * 展示数据的时候，将接口返回的数据翻译成字典中对应的数据
 * @param aformInRulePropList
 * @param aformNotRulePropList
 * @returns
 */
export default function (
  aformInRulePropList: Record<string, (string | DictFieldType)[]> = {},
  aformNotRulePropList: Record<string, (string | DictFieldType)[]> = {}
) {
  const onDecodeDict = (
    row: Recordable,
    prop: string,
    userDefineDict = '',
    model: ModelType = 'water'
  ) => {
    const formInRulePropList = {
      ...formInRuleProps,
      ...aformInRulePropList,
    }

    const formNotRulePropList = {
      ...formNotRuleProps,
      ...aformNotRulePropList,
    }
    if (prop in formInRulePropList || prop in formNotRulePropList) {
      // 当prop在formInRuleProps或formNotRuleProps中时
      const dictName =
        prop in formInRulePropList
          ? formInRulePropList[prop][2]
          : formNotRulePropList[prop][1]
      if (dictName) {
        return (
          useGlobal.dicts[
            isString(dictName) ? dictName : dictName[model]
          ]?.filter(obj => obj.value === row[prop])[0]?.name ?? '暂无数据'
        )
      } else {
        return row[prop]
      }
    } else {
      // 否则可以自定义字典名称或者直接取值
      return userDefineDict
        ? useGlobal.dicts[userDefineDict]?.filter(
            obj => obj.value === row[prop]
          )[0]?.name ?? '暂无数据'
        : row[prop]
    }
  }

  return {
    onDecodeDict,
  }
}
