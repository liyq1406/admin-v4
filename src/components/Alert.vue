<template>
  <div class="row">
    <div class="col" :class="containerClass">
      <div :class="classes">
        <div class="fa fa-info-circle"></div>
        <h2>{{ title }}</h2>
        <div class="v-alert-cont">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Alert',

    props: {
      // 占据列宽
      cols: {
        type: Number,
        default: 8
      },

      // 标题
      title: {
        type: String,
        default: '温馨提示'
      },

      // 类型
      type: {
        type: String,
        default: 'info'
      },

      // 类前缀
      classPrefix: {
        type: String,
        default: 'v-alert'
      }
    },

    data () {
      return {
      }
    },

    computed: {
      // 类
      classes () {
        var result = [this.classPrefix]

        if (this.type) {
          result.push(`${this.classPrefix}-${this.type}`)
        }

        return result.join(' ')
      },

      // 容器样式
      containerClass () {
        return `col-${this.cols} col-offset-${Math.round((24 - this.cols) / 2)}`
      }
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .v-alert
    position relative
    padding-left 64px
    margin 100px 0

    .fa
      absolute left top
      size 44px
      font-size 44px
      text-align center

    h2
      font-size 20px
      margin 0 0 10px
      font-weight normal

    p
      margin 0

    .actions
      margin-top 30px

      .btn
        height 36px
        line-height 36px
        font-size 14px
        width 80px
        text-align center

  .v-alert-error
    .fa
      color red

  .v-alert-success
    .fa
      color green

  .v-alert-info
    .fa
      color blue
</style>
