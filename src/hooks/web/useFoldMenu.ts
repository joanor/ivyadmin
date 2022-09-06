import type { ResourceRoute } from '@/store'
import { isBoolean, isObject } from 'ivy2'
import { ref, reactive, Ref } from 'vue'

interface ResultFoldMenu {
  foldMenus: ResourceRoute[]
  showFold: Ref<boolean>
  left: Ref<number>
  handleMouseOnFoldMenus: AnyFunction
  showFoldMenuList: AnyFunction
}

export default function (): ResultFoldMenu {
  const showFold = ref<boolean>(false)
  const foldMenus = reactive<ResourceRoute[]>([])
  const left = ref<number>(0)
  let mouseIsOnFoldMenus = false

  let timer: NodeJS.Timeout

  const handleMouseOnFoldMenus = (flag: boolean) => {
    mouseIsOnFoldMenus = flag
    if (!flag) {
      if (timer) clearTimeout(timer)
      showFold.value = false
    }
  }

  const showFoldMenuList = (values: boolean | Recordable) => {
    if (isBoolean(values)) {
      timer = setTimeout(() => {
        if (!values && !mouseIsOnFoldMenus) {
          // 说明此时鼠标不在悬浮框上
          showFold.value = false
        }
      }, 500)
    } else if (isObject(values)) {
      showFold.value = true
      left.value = values.x as number

      // 清空数组
      foldMenus.length = 0

      // vue3中数组不能再次直接赋值
      foldMenus.push(...(values.foldMenuList as ResourceRoute[]))
    }
  }
  return {
    foldMenus,
    showFold,
    left,
    handleMouseOnFoldMenus,
    showFoldMenuList,
  }
}
