<template>
  <svg
    :class="`${svgClass} ${spin ? 'scoped-svg-animation' : ''}`"
    aria-hidden="true"
    :style="getStyle"
  >
    <use :href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts" setup>
import { computed, CSSProperties } from 'vue'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  className: {
    type: String,
    default: '',
  },
  size: {
    type: [Number, String],
    default: 16,
  },
  name: {
    type: String,
    required: true,
  },
  spin: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: '#333',
  },
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)

const svgClass = computed(() => 'svg-icon ' + props.className)

const getStyle = computed((): CSSProperties => {
  const { size } = props
  let s = `${size}`
  s = `${s.replace('px', '')}px`
  return {
    width: s,
    height: s,
  }
})
</script>
<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.scoped-svg-animation {
  animation: rotate 2s linear infinite;
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
