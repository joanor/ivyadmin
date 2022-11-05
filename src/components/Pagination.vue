<template>
  <el-pagination hide-on-single-page v-model:currentPage="current" v-model:page-size="size" :page-sizes="pageSizes"
    layout="total, prev, pager, next, sizes" :total="total" class="pagination flex justify-end mt-3">
  </el-pagination>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  total: number
  pageSizes?: number[]
  pages: number
  size: number
  current: number
}>(), {
  total: 0,
  pageSizes: () => [10, 20, 30, 50],
  pages: 0,
  size: 0,
  current: 0
})

const emit = defineEmits(['currentPage', 'pageSize'])

watch(() => props.current, (newValue) => {
  console.log(`当前页数是`, newValue)
  emit('currentPage', newValue)

})
watch(() => props.size, (newValue) => {
  console.log(`当前size是`, newValue)
  emit('pageSize', newValue)
})

const currentPage = ref(1)
const pageSize = ref(10)
</script>

<style scoped lang="scss">

</style>