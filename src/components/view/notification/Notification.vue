<template>
  <div class="x-notification">
    <div class="x-notification-box" v-for="message in messages" transition="x-notification-box" transition-mode="out-in">
      <div class="x-notification-msg x-notification-msg-{{message.type}}">
        <i class="fa" :class="{'fa-check':message.type==='success', 'fa-times':message.type==='error', 'fa-info':message.type==='info'}"></i>
        <span>{{ message.content }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Notification',

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
  @import '../../../assets/stylus/common'

  .x-notification
    position absolute
    top 91px
    right 31px
    z-index 10200

  .x-notification-box
    text-align right

  .x-notification-msg
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

  .x-notification-msg-success
  .x-notification-msg-error
  .x-notification-msg-info
    color #FFF

  .x-notification-msg-success
    background green

  .x-notification-msg-error
    background red

  .x-notification-msg-info
    background blue

  // 淡入淡出 动画
  .x-notification-box
    transition transform .3s ease, opacity .3s ease

  .x-notification-box-enter
  .x-notification-box-leave
    opacity 0

  .x-notification-box-enter
    transform translate3d(0, 8px, 0)

  .x-notification-box-leave
    transform translate3d(0, -8px, 0)
</style>
