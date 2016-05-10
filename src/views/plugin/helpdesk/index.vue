<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>帮助中心</h2>
        </div>
      </div>
      <div class="panel">
        <div class="panel-bd">
          <div class="not-found">
            <div style="text-align:center">
              <i class="fa fa-exclamation-circle "></i>
              <p style="font-size:16px;">抱歉，您访问的URL有误</p>
            </div>
          </div>
        </div>
      </div>
      <router-view transition="view" transition-mode="out-in" class="view"></router-view>
    </div>
  </section>
</template>

<script>
  import Tab from '../../../components/Tab'
  import { globalMixins } from '../../../mixins'

  export default {
    name: 'Link',

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
            label: this.$t('sub_nav.broadcast.add'),
            link: { path: '/plugins/broadcast/add' }
          },
          {
            label: this.$t('sub_nav.broadcast.history'),
            link: { path: '/plugins/broadcast/history' }
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
