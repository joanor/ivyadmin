<template>
  <div class="app-sidebar flex flex-col justify-between">
    <el-menu :default-active="activeIndex" class="el-menu-vertical-demo overflow-y-auto" :collapse="isCollapse"
      @select="handleSelectMenu" ref="menuRef">
      <template v-for="menu in menuList">
        <template v-if="menu.children.length > 0">
          <el-sub-menu :key="menu.menuId" :index="menu.menuId">
            <template #title>
              <el-icon class="mr-4">
                <SvgIcon :name="menu.icon" size="16"></SvgIcon>
              </el-icon>
              <span>{{ menu.menuName }}</span>
            </template>
            <el-menu-item v-for="cmenu in menu.children" :index="'/' + cmenu.menuId">{{ cmenu.menuName }}</el-menu-item>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="menu.menuId">
            <el-icon class="mr-4">
              <SvgIcon :name="menu.icon" size="16"></SvgIcon>
            </el-icon>
            <template #title>
              <span>{{ menu.menuName }}</span>
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
    <div class="fold mb-4 mt-4 text-right pr-4">
      <el-icon class="cursor-pointer" style="backgroundColor:#f7f8fa" @click="toggleCollapse">
        <IEpFold v-if="!isCollapse" />
        <IEpExpand v-else />
      </el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import microApp, {
  EventCenterForMicroApp,
  getActiveApps,
} from '@micro-zoe/micro-app'
import { ref, computed, onBeforeMount, onMounted, watchEffect, watch } from 'vue'
import { ElMenu } from 'element-plus'
import { config } from '@/config'
import { useRouter } from 'vue-router'
import { menuList } from './menuList'
import { usePathStore } from '@/store'

let activeIndex = ref('user_overview')
watch(activeIndex, (newValue) => {
  console.log(`变化了吗，默认路由`, newValue)
})

const menuRef = ref<typeof ElMenu>()

const router = useRouter()
// const microAppNames: string[] = config.keys()

const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
  console.log('ttttttttttt', key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log('aaaaaaaaaaa', key, keyPath)
}

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

watchEffect(() => {
  console.log(``,)
})


const usePath = usePathStore()

/**
 * 当子应用还未渲染，通过基座控制路由跳转，子应用在初始化时会自己根据url渲染对应的页面
 * 当子应用已经渲染，则直接控制子应用路由进行内部跳转
 * getActiveApps: 用于获取正在运行的子应用
 */
const handleSelectMenu = (index: string, indexPath: string[]) => {
  console.log(`我在看下效果----->`, index, indexPath)
  const appName = indexPath[0]

  const path =
    indexPath.length === 1
      ? `/${indexPath[0]}#/`
      : `/${indexPath[0]}#${indexPath.slice(1).join()}`

  // 传入pinia中
  usePath.setBreadCrumb(path)

  if (!getActiveApps().includes(appName)) {
    // 当子应用还未渲染
    router.push(path)
  } else {
    // 当子应用已经渲染
    let childPath = path.replace(/^\/app_[^/]+/, '')
    !childPath && (childPath = '/') // 防止地址为空
    microApp.setData(appName, { path: childPath })
  }
}

onMounted(() => {
  // console.log(`----------->表单--------->`, menuRef.value?.open)
})
</script>

<style lang="scss" scoped>
.app-sidebar {
  height: calc(100vh - 60px);
  // width: 220px;
  background: #ffffff;
  border-right: 1px solid #e5e6eb;

  .mr-4 {
    margin-right: 14px !important;
  }

}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 220px;
  min-height: 400px;
}
</style>
