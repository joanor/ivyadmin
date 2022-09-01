import { debounce } from 'ivy2'
import { onMounted, ref } from 'vue'
const marginRight = 48
export default function () {
  const project = ref<HTMLElement>()
  const system = ref<HTMLElement>()

  const width = ref<number>(0)

  function changeWidth() {
    if (project.value && system.value) {
      const tWidth =
        project.value.offsetWidth + system.value.offsetWidth + 110 + marginRight
      const clientWidth = document.body.clientWidth
      if (clientWidth > 1600) {
        width.value = clientWidth - tWidth
      } else {
        width.value = 1600 - tWidth
      }
    }
  }

  // 生成防抖函数
  const newDebounce = debounce(changeWidth, 500)

  onMounted(() => {
    changeWidth()
    window.addEventListener('resize', newDebounce, false)
  })

  return {
    project,
    system,
    width,
  }
}
