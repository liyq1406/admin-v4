<template>
  <div @click="toogle" :class="classes">
    <div class="switch-block"></div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        twoWay: true
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
        default: 'v-switch'
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

        return result.join(' ')
      }
    },

    methods: {
      toogle () {
        this.$dispatch('switch-toggle')
        this.value = !this.value
      }
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .v-switch
    position relative
    display inline-block
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

  .v-switch-on
    background green
    text-align left

    .switch-block
      left 17px

  .v-switch-sm
    size 36px 22px
    line-height 22px

    .switch-block
      size 20px

    &.v-switch-on
      .switch-block
        left 15px
</style>
