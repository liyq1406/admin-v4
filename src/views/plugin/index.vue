<template>
  <section class="main-wrap">
    <div class="main">
      <div class="panel">
        <div class="panel-hd">
          <h2>{{ $t("nav_aside.plugins") }}</h2>
        </div>
        <div class="panel-bd">
          <div class="plugin-grid row">
            <div class="col-12">
              <div class="plugin-grid-item">
                <div class="inner">
                  <div class="thumb">
                    <img src='../../assets/images/broadcast.png' alt="">
                  </div>
                  <div class="info">
                    <h3>{{pluginGrids[0].name}}</h3>
                    <p>{{pluginGrids[0].description}}</p>
                  </div>
                  <span class="status">
                    <!-- <i class="hl-green" v-if="true">已启用</i> -->
                    <!-- <i class="hl-red" v-else>未启用</i> -->
                    <switch :disabled="pluginGrids[0].disabled" size="small" :value.sync="pluginStatus['broadcast'].enable" @switch-toggle="pluginToggle('broadcast')"></switch>
                  </span>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="plugin-grid-item">
                <div class="inner">
                  <div class="thumb">
                    <img src='../../assets/images/helpdesk.png' alt="">
                  </div>
                  <div class="info">
                    <h3>{{pluginGrids[1].name}}</h3>
                    <p>{{pluginGrids[1].description}}</p>
                  </div>
                  <span class="status">
                    <!-- <i class="hl-green" v-if="true">已启用</i> -->
                    <!-- <i class="hl-red" v-else>未启用</i> -->
                    <switch :disabled="pluginGrids[1].disabled" size="small" :value.sync="pluginStatus['helpdesk'].enable" @switch-toggle="pluginToggle('helpdesk')"></switch>
                  </span>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="plugin-grid-item">
                <div class="inner">
                  <div class="thumb">
                    <img src='../../assets/images/warranty.png' alt="">
                  </div>
                  <div class="info">
                    <h3>{{pluginGrids[2].name}}</h3>
                    <p>{{pluginGrids[2].description}}</p>
                  </div>
                  <span class="status">
                    <!-- <i class="hl-green" v-if="true">已启用</i> -->
                    <!-- <i class="hl-red" v-else>未启用</i> -->
                    <switch :disabled="pluginGrids[2].disabled" size="small" :value.sync="pluginStatus['warranty'].enable" @switch-toggle="pluginToggle('warranty')"></switch>
                  </span>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="plugin-grid-item">
                <div class="inner">
                  <div class="thumb">
                    <img src='../../assets/images/dealer.png' alt="">
                  </div>
                  <div class="info">
                    <h3>{{pluginGrids[3].name}}</h3>
                    <p>{{pluginGrids[3].description}}</p>
                  </div>
                  <span class="status">
                    <!-- <i class="hl-green" v-if="true">已启用</i> -->
                    <!-- <i class="hl-red" v-else>未启用</i> -->
                    <switch :disabled="pluginGrids[3].disabled" size="small" :value.sync="pluginStatus['dealer'].enable" @switch-toggle="pluginToggle('dealer')"></switch>
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
          id: 'broadcast',
          disabled: true
        }, {
          name: 'helpdesk',
          description: '管理经销商，配置商家信息和销售资源',
          id: 'helpdesk',
          disabled: true
        }, {
          name: '在线维保',
          description: '让app具备消息广播，运营通知的特性',
          id: 'warranty',
          disabled: true
        }, {
          name: '经销商管理',
          description: '管理经销商，配置商家信息和销售资源',
          id: 'dealer',
          disabled: true
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
          enable: true,
          plugin: ''
        },
        updateModel: {
          name: '',
          enable: false,
          config: {
            url: ''
          }
        },
        specialApps: []
      }
    },

    route: {
      data () {
        this.getApps()
        return {
          secondaryNav: [{
            label: this.$t('sub_nav.plugins.extensions'),
            link: { path: '/plugins/extensions' }
          },
          {
            label: this.$t('sub_nav.plugins.customize'),
            link: { path: '/plugins/customize' }
          }]
        }
      }
    },

    ready () {
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
          this.updateModel.enable = this.pluginStatus['broadcast'].enable
          api.plugin.update(this.pluginStatus['broadcast'].data.id, this.updateModel).then((res) => {
            if (res.status === 200) {
              this.updatePlugin(res.data)
            }
          }).catch((res) => {
            // this.handleError(res)
          })
        } else {
          this.addModel.name = 'broadcast'
          this.addModel.type = 10
          this.addModel.plugin = 'broadcast'
          api.plugin.create(this.addModel).then((res) => {
            if (res.status === 200) {
              this.pluginStatus['broadcast'].created = true // 设置已被创建成功
              this.createPlugin(res.data) // 更新store
            }
          }).catch((res) => {
            this.pluginStatus['broadcast'].enable = !this.pluginStatus['broadcast'].enable
            // this.handleError(res)
          })
        }
      },

      helpdesk () {
        if (this.pluginStatus['helpdesk'].created) {
          this.updateModel.enable = this.pluginStatus['helpdesk'].enable
          api.plugin.update(this.pluginStatus['helpdesk'].data.id, this.updateModel).then((res) => {
            if (res.status === 200) {
              this.updatePlugin(res.data)
            }
          }).catch((res) => {
            // this.handleError(res)
          })
        } else {
          this.addModel.name = 'helpdesk'
          this.addModel.type = 10
          this.addModel.plugin = 'helpdesk'
          api.plugin.create(this.addModel).then((res) => {
            if (res.status === 200) {
              this.pluginStatus['helpdesk'].created = true // 设置已被创建成功
              this.createPlugin(res.data) // 更新store
            }
          }).catch((res) => {
            this.pluginStatus['helpdesk'].enable = !this.pluginStatus['helpdesk'].enable
            // this.handleError(res)
          })
        }
      },

      warranty () {
        if (this.pluginStatus['warranty'].created) {
          this.updateModel.enable = this.pluginStatus['warranty'].enable
          this.updateModel.name = 'warranty'
          this.updateModel.config.url = ''
          api.plugin.update(this.pluginStatus['warranty'].data.id, this.updateModel).then((res) => {
            if (res.status === 200) {
              this.updatePlugin(res.data)
            }
          }).catch((res) => {
            this.pluginStatus['warranty'].enable = !this.pluginStatus['warranty'].enable
            this.handleError(res)
          })
        } else {
          this.addModel.name = 'warranty'
          this.addModel.type = 10
          this.addModel.plugin = 'warranty'
          api.plugin.create(this.addModel).then((res) => {
            if (res.status === 200) {
              this.pluginStatus['warranty'].created = true // 设置已被创建成功
              this.createPlugin(res.data) // 更新store
            }
          }).catch((res) => {
            this.pluginStatus['warranty'].enable = !this.pluginStatus['warranty'].enable
            this.handleError(res)
          })
        }
      },

      dealer () {
        if (this.pluginStatus['dealer'].created) {
          this.updateModel.enable = this.pluginStatus['dealer'].enable
          api.plugin.update(this.pluginStatus['dealer'].data.id, this.updateModel).then((res) => {
            if (res.status === 200) {
              this.updatePlugin(res.data)
            }
          }).catch((res) => {
            // this.handleError(res)
          })
        } else {
          this.addModel.name = 'dealer'
          this.addModel.type = 10
          this.addModel.plugin = 'dealer'
          api.plugin.create(this.addModel).then((res) => {
            if (res.status === 200) {
              this.pluginStatus['dealer'].created = true // 设置已被创建成功
              this.createPlugin(res.data) // 更新store
            }
          }).catch((res) => {
            this.pluginStatus['dealer'].enable = !this.pluginStatus['dealer'].enable
            // this.handleError(res)
          })
        }
      },

      getApps () {
        var self = this
        api.plugin.all().then((res) => {
          if (res.status === 200) {
            this.specialApps = _.filter(res.data.list, (item) => {
              return item.type > 4
            })
            self.checkPluginsState()
          }
        })
      },

      checkPluginsState () { // 查询各个定制应用是否被创建
        if (this.specialApps.length <= 0) {
          return false
        }

        var specialPlugins = _.filter(this.specialApps, (item) => {
          return item.type === 10
        })

        if (specialPlugins.length > 0) {
          // 消息广播
          var broadcast = _.filter(specialPlugins, (item) => {
            return item.plugin === 'broadcast'
          })

          if (broadcast.length > 0) {
            this.pluginStatus['broadcast'].data = broadcast[0] ? broadcast[0] : {}
            if (broadcast[0].enable === true) {
              this.pluginStatus['broadcast'].enable = true
            } else {
              this.pluginStatus['broadcast'].created = true
            }
          }
          // 帮助中心
          var helpdesk = _.filter(specialPlugins, (item) => {
            return item.plugin === 'helpdesk'
          })

          if (helpdesk > 0) {
            this.pluginStatus['helpdesk'].data = warranty[0] ? warranty[0] : {}
            if (helpdesk[0].enable === true) {
              this.pluginStatus['helpdesk'].created = true
              this.pluginStatus['helpdesk'].enable = true
            } else {
              this.pluginStatus['helpdesk'].created = true
            }
          }

          // 维保程序
          var warranty = _.filter(specialPlugins, (item) => {
            return item.plugin === 'warranty'
          })

          if (warranty.length > 0) {
            this.pluginStatus['warranty'].data = warranty[0] ? warranty[0] : {}
            if (warranty[0].enable === true) {
              this.pluginStatus['warranty'].created = true
              this.pluginStatus['warranty'].enable = true
            } else {
              this.pluginStatus['warranty'].created = true
            }
          }

          // 经销商管理
          var dealer = _.filter(specialPlugins, (item) => {
            return item.plugin === 'dealer'
          })

          if (dealer.length > 0) {
            this.pluginStatus['dealer'].data = dealer[0] ? dealer[0] : {}
            if (dealer[0].enable === true) {
              this.pluginStatus['dealer'].created = true
              this.pluginStatus['dealer'].enable = true
            } else {
              this.pluginStatus['dealer'].created = true
            }
          }
        }

        this.pluginGrids[3].disabled = false
        this.pluginGrids[2].disabled = false
        this.pluginGrids[1].disabled = false
        this.pluginGrids[0].disabled = false
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
