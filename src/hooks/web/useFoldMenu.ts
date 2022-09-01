import type { ResourceRoute } from '@/store'
import { isBoolean, isObject } from 'ivy2'
import { Recoverable } from 'repl'
import { ref } from 'vue'

export default function () {
  const foldMenus = ref<ResourceRoute>()
  const showFold = ref<boolean>(false)
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
      const { foldMenuList, x } = values
      showFold.value = true
      foldMenus.value = foldMenuList.value
      left.value = x
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
