<template>
  <div class="w-full h-full" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, Ref, unref } from 'vue'
import { createChart } from 'ivy2'

const chartRef = ref<HTMLElement | null>(null)

// defineProps<{
//   dataset: any[]
// }>()

const loading = ref(true)

onMounted(() => {
  nextTick(() => {
    const chart = createChart(unref(chartRef as Ref<HTMLElement>), {
      color: ['#86DF6C', '#2CAB40'],
      grid: {
        top: '15%', //grid组件距上下左右的距离
        left: '5%',
        right: '5%',
        bottom: '5%',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        show: false,
      },

      yAxis: {
        type: 'value',
        show: false,
      },
      series: [
        {
          name: '本月',
          type: 'bar',
          stack: 'Total1',
          data: [120, 132, 101, 134, 90, 230, 210],
          itemStyle: {
            borderRadius: [2],
          },
        },
        {
          name: '上月',
          type: 'bar',
          stack: 'Total2',
          data: [94, 172, 51, 110, 80, 210, 26],
          itemStyle: {
            borderRadius: [2],
          },
        },
      ],
    })
  })
})
</script>

<style scoped></style>
