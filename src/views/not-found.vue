<template>
  <div class="not-found">
    <div style="text-align:center">
      <i class="fa fa-exclamation-circle "></i>
      <p>抱歉，您访问的URL有误</p>
    </div>
  </div>
</template>

<script>
  import { globalMixins } from 'src/mixins'

  export default {
    name: 'Not-found',

    layouts: ['auth'],

    mixins: [globalMixins]
  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .not-found
    background-color #fff
    max-width 500px
    margin 120px auto 0
    padding 50px 0
    border-radius 8px

    .fa
      font-size 90px
      color red
      margin 20px

    p
      font-size 14px
</style>
