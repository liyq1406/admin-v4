<template>
  <div class="v-pic-text">
    <div class="pic" :style="picStyle">
      <slot name="pic"></slot>
    </div>
    <div class="text" :style="textStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Alert',

    props: {
      // 图片宽度
      picWidth: {
        type: Number,
        default: 100
      },

      // 图片与文字的间距
      gap: {
        type: Number,
        default: 20
      }
    },

    data () {
      return {
        // 图片样式
        picStyle: {
          marginLeft: `${this.gap}px`,
          width: `${this.picWidth}px`
        },

        // 文案样式
        textStyle: {
          marginLeft: `${this.picWidth + this.gap * 2}px`
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .v-pic-text
    clearfix()

    .pic
      float left

      img
        display block
        width 100%

    .text
      p
        margin 0 0 10px
        font-size 12px
</style>
