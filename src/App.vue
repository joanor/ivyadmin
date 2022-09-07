<template>
  <div id="app">
    <!-- <router-view></router-view> -->
    是的
    <div class="lefti"></div>
    <h1 id="myText"></h1>
    <button id="changeLayout" class="button">change</button>
    <div class="group">
      <div class="box">
        Common "FLIP" techniques employed by other tools won't work with flex
        elements because of the way browsers handle width/height.
      </div>
      <div class="box">
        Simply set
        <code>absolute: true</code>
        to have GSAP's Flip plugin make the elements position: absolute during
        the flip to work around challenges with flex and grid layouts.
      </div>
      <div class="box">
        When the flip animation is done, elements get reverted back to their
        normal positioning and everything appears seamless.
      </div>
      <div class="box">Happy flipping!</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
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

onMounted(() => {
  window.gsap.to('.lefti', {
    width: 300,
    duration: 2,
    ease: window.Power0.easeInOut,
  })

  window.gsap.to('#myText', {
    duration: 2,
    text: 'TextPlugin的使用',
    delay: 1,
  })

  const group = document.querySelector('.group')
  document.querySelector('.button')?.addEventListener('click', () => {
    const state = window.Flip.getState('.group, .box')

    console.log('~~~~~', state)
    group?.classList.toggle('reorder')
    window.Flip.from(state, {
      absolute: true,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power1.inOut',
    })
  })
})
</script>

<style scoped>
#app {
  min-width: $minWidth;
}

.lefti {
  width: 100px;
  height: 100px;
  background-color: red;
}

.group.reorder {
  flex-direction: row;
}

h1 {
  color: white;
  font-weight: 400;
}

.group {
  width: 740px;
  height: auto;
  padding: 4px;
  background: #111;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: black;
  position: relative;
}

.box {
  margin: 4px;
  padding: 8px;
  font-size: 22px;
  line-height: 28px;
}
.box:nth-child(1) {
  background: rgba(85, 102, 205, 0.7);
}
.box:nth-child(2) {
  background: rgba(125, 70, 200, 0.7);
}
.box:nth-child(3) {
  background: rgba(33, 150, 243, 0.7);
}
.box:nth-child(4) {
  background: rgba(0, 188, 212, 0.7);
}

.button {
  padding: 10px 20px;
  margin-bottom: 10px;
}
</style>
