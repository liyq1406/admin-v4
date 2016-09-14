<template>
  <div class="toast">
    <div class="toast-box" v-for="message in messages" transition="toast-box" transition-mode="out-in">
      <div class="toast-msg toast-msg-{{message.type}}">
        <i class="fa" :class="{'fa-check':message.type==='success', 'fa-times':message.type==='error', 'fa-info':message.type==='info'}"></i>
        <span>{{ message.content }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Toast',

    props: {
      messages: {
        type: Array,
        default () {
          return []
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .toast
    position absolute
    top 91px
    right 31px
    z-index 10000

  .toast-box
    text-align right

  .toast-msg
    display inline-block
    margin-bottom 10px
    background #FFF
    box-shadow 0 1px 2px rgba(0, 0, 0, .15)
    white-space nowrap
    padding 8px 20px

    span
      display inline-block
      vertical-align middle

    .iconfont
      font-size 18px
      vertical-align middle

  .toast-msg-success
  .toast-msg-error
  .toast-msg-info
    color #FFF

  .toast-msg-success
    background green

  .toast-msg-error
    background red

  .toast-msg-info
    background blue

  // 淡入淡出 动画
  .toast-box
    transition transform .3s ease, opacity .3s ease

  .toast-box-enter
  .toast-box-leave
    opacity 0

  .toast-box-enter
    transform translate3d(0, 8px, 0)

  .toast-box-leave
    transform translate3d(0, -8px, 0)
</style>
