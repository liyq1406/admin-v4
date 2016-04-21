<template>
  <div class="not-found-bg">
    <div style="text-align:center">
      <div class="fa wrong-fa fa-exclamation-circle "></div>
      <p style="font-size:16px;">抱歉，您访问的URL有误</p>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from '../mixins'

  export default {
    name: 'Not-found',

    layout: 'auth',

    mixins: [globalMixins]
  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .not-found-bg
    background-color #fff
    max-width 500px
    margin 200px auto 0
    padding 50px 0
  .wrong-fa
    font-size 120px
    color red
</style>
