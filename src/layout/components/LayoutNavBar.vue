<template>
  <div
    class="menulist flex items-center overflow-hidden"
    :style="'max-width:' + width + 'px;'"
    ref="menuContainer"
  >
    <router-link
      class="menu"
      :to="'/' + item.routePath"
      v-for="item in nonFoldMenuList"
      :key="item.routePath"
    >
      {{ item.resourceName }}
    </router-link>
    <i
      class="el-icon-menu cursor-pointer"
      @mouseenter="showFoldMenus"
      @mouseleave="emit('foldmenu', false)"
      v-if="isShowFold"
    ></i>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { ResourceRoute } from '@/store'
import { cloneDeep } from 'ivy2'

interface Props {
  menuList: ResourceRoute[]
  width: number
}

const props = defineProps<Props>()
const menuContainer = ref<HTMLDivElement>()
let nonFoldMenuList = reactive<ResourceRoute[]>(cloneDeep(props.menuList)) // 非折叠菜单列表
let foldMenuList = reactive<ResourceRoute[]>([]) // 折叠菜单列表
const emit = defineEmits(['foldmenu'])
const showFoldMenus = function (e: MouseEvent) {
  const target = e.target as HTMLElement
  emit('foldmenu', {
    foldMenuList,
    x: target.offsetLeft || 0,
    y: e.pageY,
  })
}

const isShowFold = computed(() => foldMenuList.length > 0)

const widthMap = new Map<number, number>()

function setFoldMenus() {
  const marginRight = 48
  if (menuContainer.value) {
    let sumWidth = 0
    // 第一步，首先判断有没有物理上的溢出
    const isOverFlow = menuContainer.value.scrollWidth > props.width
    if (isOverFlow) {
      // 当溢出的时候
      const indexes: number[] = []
      for (let i = 0, m = menuContainer.value.childNodes; i < m.length; i++) {
        if (m[i].nodeName === 'A' || m[i].nodeName === 'LI') {
          // 判断从第几个菜单开始溢出
          sumWidth += (m[i] as HTMLElement).offsetWidth + marginRight
          widthMap.set(i, sumWidth)
          if (sumWidth > props.width) {
            // 将溢出的菜单放入“折叠菜单数组中”
            foldMenuList.push(props.menuList[i])
            // 将溢出菜单的序号放入“溢出菜单序号数组中”
            indexes.push(i)
          }
        }
      }
      nonFoldMenuList = props.menuList.slice(0, indexes[0] - 1)
      foldMenuList = [props.menuList[indexes[0] - 1]].concat(foldMenuList)
    }
  } else {
    // 当不溢出的时候，查看溢出菜单数组是否不为空
    if (foldMenuList.length > 0) {
      const indexes: number[] = []
      widthMap.forEach((value, i) => {
        if (value > props.width) {
          indexes.push(i)
        }
      })
      if (indexes.length > 0) {
        nonFoldMenuList = props.menuList.slice(0, indexes[0] - 1)
        foldMenuList = props.menuList.slice(indexes[0] - 1)
      } else {
        nonFoldMenuList = props.menuList.slice(0)
        foldMenuList = []
      }
    }
  }
}

watch(
  () => props.width,
  (newValue: number) => {
    if (newValue > 0) {
      setFoldMenus()
    }
  },
  {
    immediate: true,
  }
)
</script>

<style scoped lang="scss">
.menulist {
  margin-left: 110px;
  color: $white;
  flex: 0, 0, auto;
  .menu {
    flex: 0 0 auto;
  }
  a {
    color: inherit;
    margin-right: 48px;
    padding-bottom: 17px;
    padding-top: 17px;
  }
  i {
    margin-right: 48px;
  }
}
</style>
