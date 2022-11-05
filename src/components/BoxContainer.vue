<template>
  <div class="box-container" :style="{
    background: bgcolor,
    borderRadius: rounded + 'px',
    width,
    height: height + 'px',
  }">
    <div v-if="title.length > 0" class="box-title">
      {{ title }}
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>

defineProps({
  title: {
    type: String,
    default: '',
  },
  bgcolor: {
    type: String,
    default: '#fff',
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: [Number, String],
    default: 174,
  },
  rounded: {
    type: [Number, String],
    default: 4,
  },
})
</script>

<style lang="scss" scoped>
.box-container {
  padding: 20px;
}

.box-title {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
  line-height: 24px;
}
</style>
