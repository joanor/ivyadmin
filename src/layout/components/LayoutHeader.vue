<template>
  <div class="box-border relative app-header">
    <slot>
      <!-- 0-1. 系统左上角项目名称 -->
      <div ref="project" class="float-left h-full app-header-projectname">
        {{ projectName }}
      </div>

      <!-- 0-2. header栏中间菜单部分 -->
      <LayoutNavBar
        class="float-left h-full"
        :width="width"
        :menuList="menuList"
      ></LayoutNavBar>

      <!-- 0-3. 系统右上角相关 -->
      <div class="flex items-center float-right h-full" ref="system">
        <div class="avatar">
          <!-- <img :src="avatar" alt="" /> -->
        </div>
        <div class="userinfo truncate">
          {{ userInfo }}
        </div>
        <el-dropdown trigger="click" @command="handleCommand">
          <i class="el-icon-switch-button"></i>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in commands"
                :key="item.key"
                :command="item.command"
              >
                {{ item.title }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 1-1. 悬浮菜单 -->
      <!-- <LayoutSuspendedMenu></LayoutSuspendedMenu> -->
    </slot>
  </div>
</template>

<script setup lang="ts">
import LayoutNavBar from './LayoutNavBar.vue'
import LayoutSuspendedMenu from './LayoutSuspendedMenu.vue'
import useHeader from '@/hooks/web/useHeader'
import { usePermissionStore, useUserStore } from '@/store'
import { computed } from 'vue'

defineProps({
  projectName: {
    type: String,
    required: true,
  },
})

const commands = [
  {
    key: '001',
    title: '退出',
    command: 'exit',
  },
]

const handleCommand = (command: string) => {
  if (command === 'exit') {
    console.log(`exit`)
  }
}

const { project, system, width } = useHeader()
const { menuList } = usePermissionStore()
const useUser = useUserStore()
const userInfo = computed(() => `您好！${useUser.userInfo.userName}`)
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
