<template>
  <h1>404 not found</h1>
  <div class="not-found-bg">
    <div style="text-align:center">
      <div class="fa wrong-fa fa-exclamation-circle "></div>
      <p style="font-size:20px;">访问的URL错误</p>
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
    max-width: 550px;
    margin: 0 auto;
    padding: 50px 0;
  .wrong-fa
    font-size 150px
    color red
</style>
