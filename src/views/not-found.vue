<template>
  <div class="not-found">
    <div style="text-align:center">
      <i class="fa fa-exclamation-circle "></i>
      <p>{{ $t('errors.not_found') }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Not-found',

    layouts: ['auth']
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
