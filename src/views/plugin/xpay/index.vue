<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>支付网关</h2>
        </div>
        <div class="panel-bd">
          <v-alert :cols="7">
            <p>你未获得使用该插件的权限</p>
          </v-alert>
        </div>
      </div>
      <router-view transition="view" transition-mode="out-in" class="view"></router-view>
    </div>
  </section>
</template>

<script>
  import Tab from '../../../components/Tab'
  import { globalMixins } from '../../../mixins'
  import Alert from '../../../components/Alert'

  export default {
    name: 'Link',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'v-alert': Alert,
      'tab': Tab
    },

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
  @import '../../../assets/stylus/common'

  .not-found
    background-color #fff
    max-width 500px
    margin 200px auto 0
    padding 50px 0

    .fa
      font-size 120px
      color red
</style>
