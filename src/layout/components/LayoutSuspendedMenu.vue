<template>
  <div
    class="flex flex-col absolute z-10 suspense-menus"
    :style="'left:' + left + 'px;top:80px'"
    @mouseenter="handleMouseEvent(true)"
    @mouseleave="handleMouseEvent(false)"
  >
    {{ props.foldMenus }}
    <!-- <router-link
      class="menu"
      :to="item.path"
      v-for="item in props.foldMenus"
      :key="item.path"
    >
      {{ item.resourceName }}
    </router-link> -->
  </div>
</template>

<script setup lang="ts">
import type { ResourceRoute } from '@/store'
import { watch } from 'vue'

const props = defineProps<{
  foldMenus: ResourceRoute[]
  left: number
}>()

const emit = defineEmits(['isMouseOnFoldMenus'])
const handleMouseEvent = (flag: boolean) => {
  emit('isMouseOnFoldMenus', flag)
}

watch(
  props.foldMenus,
  newValue => {
    console.log(`newValue`, newValue)
  },
  {
    immediate: true,
  }
)
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
