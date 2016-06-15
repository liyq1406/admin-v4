<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>经销商管理</h2>
        </div>
        <div class="panel-bd">
          <tab :nav="secondaryNav"></tab>
        </div>
      </div>
      <router-view transition="view" transition-mode="out-in" class="view"></router-view>
    </div>
  </section>
</template>

<script>
  import Tab from 'components/Tab'
  import { globalMixins } from 'src/mixins'
  import Alert from 'components/Alert'

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
          secondaryNav: [{
            label: this.$t('ui.sub_nav.dealer.list'),
            link: { path: `/plugins/dealer/${this.$route.params.app_id}/list` }
          }]
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
