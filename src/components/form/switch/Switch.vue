<template>
  <div @click="toogle" :class="classes">
    <div class="switch-block"></div>
  </div>
</template>

<script>
  export default {
    name: 'Switch',

    props: {
      value: {
        type: Boolean
      },

      // 尺寸
      // 可选：['small' | 'normal' | 'large'], 默认为 'normal'
      size: {
        type: String,
        default: 'normal'
      },

      // 类前缀
      classPrefix: {
        type: String,
        default: 'x-switch'
      },

      disabled: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      // 类
      classes () {
        var result = [this.classPrefix]
        var sizeCls = ({
          'small': 'sm'
        })[this.size] || ''

        if (this.value) {
          result.push(`${this.classPrefix}-on`)
        }

        if (sizeCls) {
          result.push(`${this.classPrefix}-${sizeCls}`)
        }

        if (this.disabled) {
          result.push('disabled')
        }

        return result.join(' ')
      }
    },

    methods: {
      toogle () {
        if (this.disabled) {
          this.$emit('disabled-click')
          return
        }
        this.value = !this.value
        this.$emit('switch-toggle', this.value)
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'

  .x-switch
    position relative
    display inline-block
    vertical-align middle
    background #CCC
    size 42px 26px
    line-height 26px
    cursor pointer
    user-select none
    font-size 12px
    border-radius 30px

    .switch-block
      absolute left 1px top 1px
      size 24px
      background #FFF
      border-radius 30px
      transition left .2s ease-in-out
      box-shadow 0 0 2px rgba(0, 0, 0, .2)

  .x-switch-on
    background green
    text-align left

    .switch-block
      left 17px

    &.disabled
      background #CCC

      .switch-block
        left 1px

  .x-switch-sm
    size 36px 22px
    line-height 22px

    .switch-block
      size 20px

    &.x-switch-on
      .switch-block
        left 15px

    &.x-switch-on.disabled
      background #CCC

      .switch-block
        left 1px
</style>
