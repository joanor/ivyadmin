<template>
  <div class="box-border relative app-header">
    <slot>
      <!-- 0-1. 系统左上角相关 -->
      <div ref="project" class="float-left h-full app-header-projectname">
        {{ projectName }}
      </div>

      <!-- 0-2. header栏中间菜单部分 -->
      <LayoutNavBar
        class="float-left h-full"
        @expand="showFoldMenuList"
        :width="width"
        :menuList="menuList"
      ></LayoutNavBar>

      <!-- 0-3. 系统右上角相关 -->
      <LayoutSetting ref="system"></LayoutSetting>

      <!-- 1-1. 悬浮菜单 -->
      <LayoutSuspendedMenu
        :foldMenus="foldMenus"
        :left="left"
        v-if="showFold"
      ></LayoutSuspendedMenu>
    </slot>
  </div>
</template>

<script setup lang="ts">
import LayoutNavBar from './LayoutNavBar.vue'
import LayoutSetting from './LayoutSetting.vue'
import LayoutSuspendedMenu from './LayoutSuspendedMenu.vue'
import useHeader from '@/hooks/web/useHeader'
import useFoldMenu from '@/hooks/web/useFoldMenu'
import { usePermissionStore } from '@/store'

defineProps({
  projectName: {
    type: String,
    required: true,
  },
})

const { project, system, width } = useHeader()
const { menuList } = usePermissionStore()

// 悬浮框显示多余菜单
const { foldMenus, showFold, left, handleMouseOnFoldMenus, showFoldMenuList } =
  useFoldMenu()
</script>

<style scoped lang="scss">
.app-header {
  background-color: $blue;
  height: 70px;
  padding: 0 20px;
  &-projectname {
    line-height: 70px;
    font-size: 28px;
    color: $white;
  }
}
</style>
