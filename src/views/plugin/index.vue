<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>{{ $t("nav_aside.plugins") }}</h2>
        </div>
        <div class="panel-bd">
          <div class="plugin-grid row">
            <div class="col-12" v-for="n in pluginGrids">
              <div class="plugin-grid-item">
                <div class="inner">
                  <div class="thumb">
                    <img src="../../assets/images/pic.png" alt="">
                  </div>
                  <div class="info">
                    <h3>{{n.name}}</h3>
                    <p>{{n.description}}</p>
                  </div>
                  <span class="status">
                    <!-- <i class="hl-green" v-if="true">已启用</i> -->
                    <!-- <i class="hl-red" v-else>未启用</i> -->
                    <switch size="small"></switch>
                  </span>
                </div>
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
  import Switch from '../../components/Switch'

  export default {
    name: 'Data',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'tab': Tab,
      'switch': Switch
    },

    data () {
      return {
        secondaryNav: [],
        pluginGrids: [{
          name: '消息群发',
          description: '让app具备消息广播，运营通知的特性'
        }, {
          name: 'HelpDesk',
          description: '管理经销商，配置商家信息和销售资源'
        }, {
          name: '在线维保',
          description: '让app具备消息广播，运营通知的特性'
        }, {
          name: '经销商管理',
          description: '管理经销商，配置商家信息和销售资源'
        }]
      }
    },

    route: {
      data () {
        return {
          secondaryNav: [{
            label: this.$t('sub_nav.plugins.extensions'),
            link: { path: '/plugins/extensions' }
          },
          {
            label: this.$t('sub_nav.plugins.customize'),
            link: { path: '/plugins/customize' }
          }
        ]
        }
      }
    }
  }
</script>
<style lang="stylus">
  @import '../../assets/stylus/common'

  .plugin-grid
    .col-12:nth-child(even)
      .plugin-grid-item
        padding-left 10px

    .col-12:nth-child(odd)
      .plugin-grid-item
        padding-right 10px

  .plugin-grid-item
    padding-top 20px

    .inner
      border 1px solid default-border-color
      padding 15px 20px 15px 15px
      position relative
      clearfix()

    .thumb
      float left
      size 80px
      margin-right 20px

      img
        display block
        size 80px

    .info
      h3
        margin 0 0 10px
        font-weight normal
        font-size 16px

      p
        margin 0
        color gray

    .status
      absolute right 20px top 15px
</style>
