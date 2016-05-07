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
                    <switch size="small" :value.sync='pluginStatus[n.id].enable' @switch-toggle="pluginToggle(n.id)"></switch>
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
  import store from '../../store/index'
  import { createPlugin, updatePlugin, removePlugin } from '../../store/actions/plugins'
  import _ from 'lodash'
  import api from '../../api'

  export default {
    name: 'Data',

    layout: 'admin',

    mixins: [globalMixins],

    store,

    vuex: {
      getters: {
        plugins: ({ plugins }) => plugins.all
      },
      actions: {
        createPlugin,
        updatePlugin,
        removePlugin
      }
    },

    components: {
      'tab': Tab,
      'switch': Switch
    },

    data () {
      return {
        secondaryNav: [],
        pluginGrids: [{
          name: '消息群发',
          description: '让app具备消息广播，运营通知的特性',
          id: 'broadcast'
        }, {
          name: 'helpdesk',
          description: '管理经销商，配置商家信息和销售资源',
          id: 'helpdesk'
        }, {
          name: '在线维保',
          description: '让app具备消息广播，运营通知的特性',
          id: 'warranty'
        }, {
          name: '经销商管理',
          description: '管理经销商，配置商家信息和销售资源',
          id: 'dealer'
        }],
        pluginStatus: {
          broadcast: {
            created: false,
            enable: false,
            data: {}
          },
          helpdesk: {
            created: false,
            enable: false,
            data: {}
          },
          warranty: {
            created: false,
            enable: false,
            data: {}
          },
          dealer: {
            created: false,
            enable: false,
            data: {}
          }
        },
        addModel: {
          name: '',
          type: 0,
          plugin: ''
        },
        updateModel: {
          enable: false
        }
      }
    },

    route: {
      data () {
        this.checkPluginsState()
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
    },

    methods: {
      pluginToggle (id) {
        switch (id) {
          case 'broadcast':
            this.broadcast()
            break
          case 'helpdesk':
            this.helpdesk()
            break
          case 'warranty':
            this.warranty()
            break
          case 'dealer':
            this.dealer()
            break
          default:
            break
        }
      },

      broadcast () {
        if (this.pluginStatus['broadcast'].created) {
          this.updateModel.enable === this.pluginStatus['broadcast'].enable
          api.plugin.update(this.pluginStatus['broadcast'].data.id, this.updateModel)
        } else {
          this.addModel.name = 'broadcast'
          this.addModel.type = 10
          this.addModel.plugin = 'broadcast'
          api.plugin.create(this.addModel)
        }
      },

      helpdesk () {

      },

      warranty () {

      },

      dealer () {

      },

      checkPluginsState () { // 查询各个定制应用是否被创建
        var specialPlugins = _.filter(this.plugins, (item) => {
          return item.type > 4
        })

        if (specialPlugins.length > 0) {
          // 消息广播
          var broadcast = _.filter(specialPlugins, (item) => {
            return item.plugin === 'broadcast'
          })

          if (broadcast) {
            this.pluginStatus['broadcast'].data = broadcast
            if (broadcast.enable === true) {
              this.pluginStatus['broadcast'].enable = true
            } else {
              this.pluginStatus['broadcast'].created = true
            }
          }
          // 帮助中心
          var helpdesk = _.filter(specialPlugins, (item) => {
            return item.plugin === 'helpdesk'
          })

          if (helpdesk) {
            this.pluginStatus['helpdesk'].data = helpdesk
            if (helpdesk.enable === true) {
              this.pluginStatus['helpdesk'].enable = true
            } else {
              this.pluginStatus['helpdesk'].created = true
            }
          }

          // 维保程序
          var warranty = _.filter(specialPlugins, (item) => {
            return item.plugin === 'warranty'
          })

          if (warranty) {
            this.pluginStatus['warranty'].data = warranty
            if (helpdesk.enable === true) {
              this.pluginStatus['warranty'].enable = true
            } else {
              this.pluginStatus['warranty'].created = true
            }
          }

          // 经销商管理
          var dealer = _.filter(specialPlugins, (item) => {
            return item.plugin === 'dealer'
          })

          if (dealer) {
            this.pluginStatus['dealer'].data = dealer
            if (helpdesk.enable === true) {
              this.pluginStatus['dealer'].enable = true
            } else {
              this.pluginStatus['dealer'].created = true
            }
          }
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
