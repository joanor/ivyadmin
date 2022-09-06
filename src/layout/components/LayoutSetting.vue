<template>
  <div class="flex items-center float-right h-full" ref="setting">
    <el-icon
      v-if="!isFullScreen"
      :class="`mr2 cursor-pointer i-ant-design-fullscreen-outlined`"
      :size="20"
      color="#fff"
      @click="toggleFullScreen"
    ></el-icon>
    <el-icon
      v-else
      :class="`mr2 cursor-pointer i-ant-design-fullscreen-exit-outlined`"
      :size="20"
      color="#fff"
      @click="toggleFullScreen"
    ></el-icon>
    <el-icon
      :class="`mr2 cursor-pointer i-ant-design-translation-outlined`"
      :size="20"
      color="#fff"
      @click="onClickOperaters"
    ></el-icon>
    <el-icon
      :class="`mr2 cursor-pointer i-ant-design-setting-outlined`"
      :size="20"
      color="#fff"
      @click="onClickOperaters"
    ></el-icon>
    <div class="avatar">
      <!-- <img :src="avatar" alt="" /> -->
    </div>
    <div class="userinfo mr2">
      {{ userInfo }}
    </div>
    <el-dropdown @command="handleCommand">
      <el-icon
        class="i-ant-design-poweroff-outlined cursor-pointer"
        :size="20"
        color="#fff"
      ></el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="exit">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { toFullScreen, exitFullscreen } from 'ivy2'
import { computed, reactive, ref } from 'vue'
import { useUserStore } from '@/store'
import store from 'store2'
import { useRouter } from 'vue-router'

const isFullScreen = ref<boolean>(false)
const setting = ref<HTMLElement>()
function toggleFullScreen() {
  if (isFullScreen.value) exitFullscreen()
  else toFullScreen()
  isFullScreen.value = !isFullScreen.value
}

const useUser = useUserStore()
const userInfo = computed(() => `您好！${useUser.userInfo.userName}`)

const onClickOperaters = (icon: { name: string }) => {}
const router = useRouter()

const handleCommand = (command: string) => {
  if (command === 'exit') {
    console.log(`exit`)
    store.clearAll()
    router.push('/login')
  }
}

defineExpose({ setting })
</script>

<style scoped>
.userinfo {
  color: #fff;
}
</style>
