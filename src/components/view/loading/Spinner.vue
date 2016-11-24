<template>
  <div class="x-loading-mask" v-show="show">
    <div class="x-loading-spinner">
      <svg viewBox="25 25 50 50" class="circular">
        <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
      </svg>
      <div class="x-loading-text" v-if="!!text">{{ text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Spinner',

  props: {
    // 是否显示
    show: {
      type: Boolean,
      default: true
    },

    // 加载中文案
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="stylus">
@import '../../../assets/stylus/common'

@keyframes rotate {
  to {
    transform rotate(1turn)
  }
}

@keyframes dash {
  0% {
    stroke-dasharray 1, 150
    stroke-dashoffset 0
  }

  50% {
    stroke-dasharray 90, 150
    stroke-dashoffset -35
  }

  to {
    stroke-dasharray 90, 150
    stroke-dashoffset -124
  }
}

.x-loading-mask
  absolute top right bottom left
  z-index 10000
  background rgba(255, 255, 255, .75)

.x-loading-spinner
    absolute top 50%
    width 100%
    margin-top -21px
    text-align center

  .circular
    width 42px
    animation rotate 2s linear infinite

  .path
    animation dash 1.5s ease-in-out infinite
    stroke-dasharray 1, 100
    stroke-dashoffset 0
    stroke-width 2
    stroke red
    stroke-linecap round
</style>
