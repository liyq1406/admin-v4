<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>支付网关</h2>
        </div>
        <div class="panel-bd">
          <!-- <tab :nav="secondaryNav"></tab> -->
        </div>
      </div>
      <router-view transition="view" transition-mode="out-in" class="view"></router-view>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'Link',
    data () {
      return {
        secondaryNav: []
      }
    },

    route: {
      data () {
        return {
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../../assets/stylus/common'

  .not-found
    background-color #fff
    max-width 500px
    margin 200px auto 0
    padding 50px 0

    .fa
      font-size 120px
      color red
</style>
