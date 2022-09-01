<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { _console, getBrowserInfo } from 'ivy2'

/**
 * 判断是否是支持的浏览器
 */
const dialogShow = ref(false)
const browserInfo = getBrowserInfo()
if (browserInfo) {
  const realBrowserInfo = Array.isArray(browserInfo)
    ? browserInfo[0]
    : browserInfo
  if (['IE/7', 'IE/8', 'IE/9', 'IE/10'].includes(realBrowserInfo)) {
    dialogShow.value = true
    _console.error(`当前浏览器：${realBrowserInfo}`)
  }
}
</script>

<style scoped>
#app {
  min-width: $minWidth;
}
</style>
