<template>
  <div class="overflow-hidden">
    <!-- header -->
    <LayoutHeader :projectName="projectName"></LayoutHeader>

    <!-- 面包屑 -->
    <LayoutBreadCrumb></LayoutBreadCrumb>

    <!-- 主体内容 -->
    <LayoutContainer></LayoutContainer>
  </div>
</template>

<script setup lang="ts">
import LayoutHeader from './components/LayoutHeader.vue'
import LayoutBreadCrumb from './components/LayoutBreadCrumb.vue'
import LayoutContainer from './components/LayoutContainer.vue'
import { computed } from 'vue'

const projectName = computed(() => {
  return `${window.config.projectName}`
})
</script>

<style scoped></style>
