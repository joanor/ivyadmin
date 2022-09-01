<template>
  <div
    class="flex flex-col absolute z-10 suspense-menus"
    :style="'left:' + left + 'px;top:80px'"
    @mouseenter="handleMouseEvent(true)"
    @mouseleave="handleMouseEvent(false)"
  >
    <router-link
      class="menu"
      :to="item.path"
      v-for="item in foldMenus"
      :key="item.path"
    >
      {{ item.menuName }}
    </router-link>
  </div>
</template>

<script setup lang="ts">
defineProps(['foldMenus', 'left'])

const emit = defineEmits(['isMouseOnFoldMenus'])
const handleMouseEvent = (flag: boolean) => {
  emit('isMouseOnFoldMenus', flag)
}
</script>

<style lang="scss" scoped>
.suspense-menus {
  background: $blue;
  a {
    color: $white;
    padding: 15px 20px;
    &:hover {
      // background: $gray;
      color: black;
    }
  }
}
</style>
