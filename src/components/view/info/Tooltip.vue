<template>
  <div :class="classes">
    <div class="popup" v-show="visible" @mouseenter="onEnterPopup" @mouseleave="onLeavePopup" :transition="transitionName" :style="popupStyle">
      <slot></slot>
    </div>
    <span class="trigger" @mouseenter="onEnterTrigger" @mouseleave="onLeaveTrigger"><slot name="trigger"></slot></span>
  </div>
</template>

<script>
  export default {
    name: 'Tooltip',

    props: {
      // 类型
      type: {
        type: String,
        default: ''
      },

      // 宽度
      width: {
        type: String,
        default: '80px'
      },

      // 放置位置
      placement: {
        type: String,
        default: 'top'
      },

      // 类前缀
      classPrefix: {
        type: String,
        default: 'x-tooltip'
      }
    },

    data () {
      return {
        isInTrigger: false,
        isInPopup: false
      }
    },

    computed: {
      // 类
      classes () {
        var result = [this.classPrefix]

        result.push(`${this.classPrefix}-${this.placement}`)

        if (this.type) {
          result.push(`${this.classPrefix}-${this.type}`)
        }

        return result.join(' ')
      },

      // 可见性
      visible () {
        return this.isInTrigger || this.isInPopup
      },

      transitionName () {
        return `popup-${this.placement}`
      },

      popupStyle () {
        return {
          width: this.width
        }
      }
    },

    methods: {
      /**
       * 鼠标进入弹出层
       */
      onEnterPopup () {
        this.isInPopup = true
      },

      /**
       * 鼠标离开弹出层
       */
      onLeavePopup () {
        window.setTimeout(() => {
          this.isInPopup = false
        }, 200)
      },

      /**
       * 鼠标进入触发器
       */
      onEnterTrigger () {
        this.isInTrigger = true
      },

      /**
       * 鼠标离开触发器
       */
      onLeaveTrigger () {
        window.setTimeout(() => {
          this.isInTrigger = false
        }, 200)
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'

  .x-tooltip
    display inline-block
    position relative

    .popup
      position absolute
      /*white-space nowrap*/
      background rgba(0, 0, 0, .8)
      color #FFF
      padding 6px 10px
      font-size 12px
      border-radius 4px
      z-index 1000

      &:before
        position absolute
        content ""

      p
        margin 0
        line-height 20px

  .x-tooltip-top
    .popup
      left 50%
      bottom 100%
      margin-bottom 6px

      &:before
        left 50%
        top 100%
        margin-left -5px
        triangle rgba(0, 0, 0, .8) 10px down

  .x-tooltip-bottom
    .popup
      left 50%
      top 100%
      margin-top 6px

      &:before
        left 50%
        bottom 100%
        margin-left -5px
        triangle rgba(0, 0, 0, .8) 10px up

  .x-tooltip-right
    .popup
      left 100%
      top 50%
      margin-left 10px

      &:before
        top 50%
        right 100%
        margin-top -5px
        triangle rgba(0, 0, 0, .8) 10px left

  .x-tooltip-left
    .popup
      right 100%
      top 50%
      margin-right 10px

      &:before
        top 50%
        left 100%
        margin-top -5px
        triangle rgba(0, 0, 0, .8) 10px right

  .popup-top-transition
    transition all .2s ease-in-out
    transform translate(-50%, 0)

  .popup-top-enter
  .popup-top-leave
    transform translate(-50%, -5px)
    opacity 0

  .popup-bottom-transition
    transition all .2s ease-in-out
    transform translate(-50%, 0)

  .popup-bottom-enter
  .popup-bottom-leave
    transform translate(-50%, 5px)
    opacity 0

  .popup-right-transition
    transition all .2s ease-in-out
    transform translate(0, -50%)

  .popup-right-enter
  .popup-right-leave
    transform translate(5px, -50%)
    opacity 0

  .popup-left-transition
    transition all .2s ease-in-out
    transform translate(0, -50%)

  .popup-left-enter
  .popup-left-leave
    transform translate(-5px, -50%)
    opacity 0
</style>
