<template>
  <div class="app-container box-border overflow-y-auto">
    <slot></slot>
    <el-backtop target=".app-container"></el-backtop>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
  height: calc(100vh - 70px);
}
</style>
