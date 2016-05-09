<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="extension-list">
        <ul>
          <li>
            <h3>{{extendPlugins['recipe'].name}}</h3>
            <div class="row">
              <div class="col-20">
                <p>{{extendPlugins['recipe'].description}}</p>
              </div>
              <div class="col-4 tar">
                <switch :value.sync="extendPlugins['recipe'].enable" @switch-toggle="pluginToggle('recipe')"></switch>
              </div>
            </div>
          </li>
          <li>
            <h3>{{extendPlugins['nest'].name}}</h3>
            <div class="row">
              <div class="col-20">
                <p>{{extendPlugins['nest'].description}}</p>
              </div>
              <div class="col-4 tar">
                <switch :value.sync="extendPlugins['nest'].enable" @switch-toggle="pluginToggle('nest')"></switch>
              </div>
            </div>
          </li>
          <li>
            <h3>{{extendPlugins['xpay'].name}}</h3>
            <div class="row">
              <div class="col-20">
                <p>{{extendPlugins['xpay'].description}}</p>
              </div>
              <div class="col-4 tar">
                <switch :value.sync="extendPlugins['xpay'].enable" @switch-toggle="pluginToggle('xpay')"></switch>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  // import Vue from 'vue'
  // import locales from '../../consts/locales/index'
  import api from '../../api'
  import Modal from '../../components/Modal'
  import Switch from '../../components/Switch'
  import store from '../../store/index'
  import { createPlugin, updatePlugin, removePlugin } from '../../store/actions/plugins'
  import _ from 'lodash'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'Applications',

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
      'modal': Modal,
      'switch': Switch
    },

    data () {
      return {
        extendPlugins: {
          recipe: {
            created: false,
            enable: false,
            name: '云菜谱',
            description: '为面向厨电领域的产品提供关于菜谱的浏览、上传、智能烹饪的服务场景。让用户在app终端上除使用产品外还可以扩展和产品相关的菜谱信息服务。',
            data: {},
            disabled: true
          },
          nest: {
            created: false,
            enable: false,
            name: 'Google nest互联',
            description: 'nest联动可以帮助您的产品实现和google nest恒温器、烟感器的跨平台设备联动。您可以根据产品需要随时开启或关闭nest设备联动服务。',
            data: {},
            disabled: true
          },
          xpay: {
            created: false,
            enable: false,
            name: '支付网关',
            description: '集成支付宝、微信的第三方支付渠道。',
            data: {},
            disabled: true
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
      }
    },

    ready () {
    },

    filters: {

    },

    methods: {
      pluginToggle (id) {
        switch (id) {
          case 'recipe':
            this.recipe()
            break
          case 'nest':
            this.nest()
            break
          case 'xpay':
            this.xpay()
            break
          default:
            break
        }
      },

      recipe () {
        if (this.extendPlugins['recipe'].created) {
          this.updateModel.enable = this.extendPlugins['recipe'].enable
          this.updateModel.name = this.extendPlugins['recipe'].name
          api.plugin.update(this.extendPlugins['recipe'].data.id, this.updateModel).then((res) => {
            if (res.status === 200) {
              this.updatePlugin(res.data)
            }
          }).catch((res) => {
            this.handleError(res)
          })
        } else {
          this.addModel.name = 'recipe'
          this.addModel.type = 10
          this.addModel.plugin = 'recipe'
          api.plugin.create(this.addModel).then((res) => {
            if (res.status === 200) {
              this.extendPlugins['recipe'].created = true // 设置已被创建成功
              this.createPlugin(res.data) // 更新store
            }
          }).catch((res) => {
            this.extendPlugins['recipe'].enable = !this.extendPlugins['recipe'].enable
            this.handleError(res)
          })
        }
      },

      nest () {
        if (this.extendPlugins['nest'].created) {
          this.updateModel.enable = this.extendPlugins['nest'].enable
          this.updateModel.name = this.extendPlugins['nest'].name
          api.plugin.update(this.extendPlugins['nest'].data.id, this.updateModel).then((res) => {
            if (res.status === 200) {
              this.updatePlugin(res.data)
            }
          }).catch((res) => {
            this.handleError(res)
          })
        } else {
          this.addModel.name = 'nest'
          this.addModel.type = 10
          this.addModel.plugin = 'nest'
          api.plugin.create(this.addModel).then((res) => {
            if (res.status === 200) {
              this.extendPlugins['nest'].created = true // 设置已被创建成功
              this.createPlugin(res.data) // 更新store
            }
          }).catch((res) => {
            this.extendPlugins['nest'].enable = !this.extendPlugins['nest'].enable
            this.handleError(res)
          })
        }
      },

      xpay () {
        if (this.extendPlugins['xpay'].created) {
          this.updateModel.enable = this.extendPlugins['xpay'].enable
          this.updateModel.name = this.extendPlugins['xpay'].name
          api.plugin.update(this.extendPlugins['xpay'].data.id, this.updateModel).then((res) => {
            if (res.status === 200) {
              this.updatePlugin(res.data)
            }
          }).catch((res) => {
            // this.handleError(res)
          })
        } else {
          this.addModel.name = 'xpay'
          this.addModel.type = 10
          this.addModel.plugin = 'xpay'
          api.plugin.create(this.addModel).then((res) => {
            if (res.status === 200) {
              this.extendPlugins['xpay'].created = true // 设置已被创建成功
              this.createPlugin(res.data) // 更新store
            }
          }).catch((res) => {
            this.extendPlugins['xpay'].enable = !this.extendPlugins['xpay'].enable
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

      checkPluginsState () {
        if (this.specialApps.length <= 0) {
          return false
        }

        var specialPlugins = _.filter(this.specialApps, (item) => {
          return item.type === 10
        })

        if (specialPlugins.length < 0) {
          return false
        }

        // 云菜谱
        var recipe = _.filter(specialPlugins, (item) => {
          return item.plugin === 'recipe'
        })

        if (recipe.length > 0) {
          this.extendPlugins['recipe'].data = recipe[0] ? recipe[0] : {}
          if (recipe[0].enable === true) {
            this.extendPlugins['recipe'].created = true
            this.extendPlugins['recipe'].enable = true
          } else {
            this.extendPlugins['recipe'].created = true
          }
        }

        // Google nest互联
        var nest = _.filter(specialPlugins, (item) => {
          return item.plugin === 'nest'
        })

        if (nest.length > 0) {
          this.extendPlugins['nest'].data = nest[0] ? nest[0] : {}
          if (nest[0].enable === true) {
            this.extendPlugins['nest'].created = true
            this.extendPlugins['nest'].enable = true
          } else {
            this.extendPlugins['nest'].created = true
          }
        }

        // 支付网关
        var xpay = _.filter(specialPlugins, (item) => {
          return item.plugin === 'nest'
        })

        if (xpay.length > 0) {
          this.extendPlugins['xpay'].data = xpay[0] ? xpay[0] : {}
          if (nest[0].enable === true) {
            this.extendPlugins['xpay'].created = true
            this.extendPlugins['xpay'].enable = true
          } else {
            this.extendPlugins['xpay'].created = true
          }
        }

        this.extendPlugins['recipe'].disabled = false
        this.extendPlugins['nest'].disabled = false
        this.extendPlugins['xpay'].disabled = false
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../assets/stylus/common'

  .extension-list
    li
      padding 20px 0
      border-bottom 1px solid default-border-color

      &:last-child
        border none

      h3
        font-weight normal
        font-style 16px
        margin 0 0 10px

      p
        margin 0
        color gray
</style>
