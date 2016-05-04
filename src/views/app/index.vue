<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>{{ $t("nav_aside.apps") }}</h2>
        </div>
        <div class="panel-bd">
          <div class="appArea form-row row">
            <div class="col-12">
              <div class="app clearfix">
                <img src="../../assets/images/pic.png" alt="">
                <p class="appName">消息群发</p>
                <p class="appDescribe">让APP具备消息广播，运营通知的特性</p>
                <span class="appStatus"><i class="hl-green" v-if="true">已启用</i><i class="hl-red" v-else>未启用</i></span>
              </div>
            </div>
            <div class="col-12">
              <div class="app clearfix">
                <img src="../../assets/images/pic.png" alt="">
                <p class="appName">消息群发</p>
                <p class="appDescribe">让APP具备消息广播，运营通知的特性</p>
                <span class="appStatus"><i class="hl-green" v-if="false">已启用</i><i class="hl-red" v-else>未启用</i></span>
              </div>
            </div>
          </div>
          <div class="appArea form-row row">
            <div class="col-12">
              <div class="app clearfix">
                <img src="../../assets/images/pic.png" alt="">
                <p class="appName">消息群发</p>
                <p class="appDescribe">让APP具备消息广播，运营通知的特性</p>
                <span class="appStatus"><i class="hl-green" v-if="true">已启用</i><i class="hl-red" v-else>未启用</i></span>
              </div>
            </div>
          </div>
          <tab :nav="secondaryNav"></tab>
        </div>
      </div>
      <router-view transition="view" transition-mode="out-in" class="view"></router-view>
    </div>
  </section>
</template>

<script>
  import Tab from '../../components/Tab'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'Data',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
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
            label: this.$t('sub_nav.application.extend'),
            link: { path: '/apps/extend' }
          },
          {
            label: this.$t('sub_nav.application.user_defined'),
            link: { path: '/apps/user_defined' }
          }
        ]
        }
      }
    }
  }
</script>
<style lang="stylus">
  @import '../../assets/stylus/common'
  .appArea
    padding 20px 0 20px 0
    .app
      border 1px solid #7A7A7A
      margin 0 30px
      padding 10px
      position relative
      img
        float left
        width 60px
        height 60px
  .appName
    font-size 18px
    margin 0 90px
  .appDescribe
    color #696866
    font-size 14px
    margin 0 90px
  .appStatus
    position absolute
    top 5px
    right 10px
</style>
