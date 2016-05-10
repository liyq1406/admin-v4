<template>
  <section>
    <div class="panel">
      <div class="row mt20 mb20">
        <div class="col-16">
          <pic-txt :pic-width="86">
            <img slot="pic" src="../../assets/images/nest.png" alt="nest互联">
            <p>提示：nest联动可以帮助您的产品实现和google nest恒温器、烟感器的跨平台设备联动。您可以根据产品需要随时开启或关闭nest设备联动服务。</p>
            <p>如当电灯开关打开时，自动设定nest的工作状态。</p>
          </pic-txt>
        </div>
        <div class="col-8 tar">
          <span class="mr5">开启nest服务</span>
          <v-switch size="small" :disabled="loading" :value.sync="plugin.enable" @switch-toggle="pluginToggle(plugin)"></v-switch>
        </div>
      </div>
      <div class="row mt20 mb20" v-show="plugin.enable" transition="bottomToTop">
        <div class="col-offset-2 col-10">
          <form>
            <div class="form-row row mb10">
              <label class="form-control col-6" style="line-height:32px">client_id:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="text"  v-model="plugin.config.client_id" name="client_id" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6" style="line-height:32px">client_secret:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="password" v-model="plugin.config.client_secret" name="client_id" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-actions col-offset-6 mt20">
              <button type="submit" @click.prevent.stop="editNestConfig" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="panel" >
      <div class="linkage-list">
        <linkage-item name="nest thermostat">
          <img slot="thumb" src="../../assets/images/nest-smoke.png"/>
          <div class="row">
            <div class="col-2">
              <span class="label-text">联动服务：</span>
            </div>
            <div class="col-20">
              <v-switch size="small" :value.sync="enableThermostat" :disabled="enableNest"></v-switch>
              <span v-if="!enableThermostat" class="label-text">未开启</span>
              <span v-else class="label-text">已开启</span>
            </div>
          </div>
        </linkage-item>
        <linkage-item name="nest smoke">
          <img slot="thumb" src="../../assets/images/nest-thermostat.png"/>
          <div class="row">
            <div class="col-2">
              <span class="label-text">联动服务：</span>
            </div>
            <div class="col-20">
              <v-switch size="small" :value.sync="enableSmoke" :disabled="enableNest"></v-switch>
              <span v-if="!enableSmoke" class="label-text">未开启</span>
              <span v-else class="label-text">已开启</span>
            </div>
          </div>
        </linkage-item>
      </div>
    </div>
  </section>
</template>

<script>
  import { globalMixins } from '../../mixins'
  import Switch from '../../components/Switch'
  import PicTxt from '../../components/PicTxt'
  import LinkageItem from './components/LinkageItem'
  import { createPlugin, updatePlugin, removePlugin } from '../../store/actions/plugins'
  // import { pluginMixins } from './mixins'
  // import _ from 'lodash'
  import api from '../../api'

  export default {
    name: 'Nest',

    layout: 'admin',

    components: {
      'v-switch': Switch,
      'pic-txt': PicTxt,
      'linkage-item': LinkageItem
    },

    mixins: [globalMixins],

    vuex: {
      actions: {
        createPlugin,
        updatePlugin,
        removePlugin
      }
    },

    data () {
      return {
        editModel: {},
        editValidation: {},
        enableThermostat: false,
        enableSmoke: false,
        enableNest: true,
        loading: false,
        editing: false,
        plugin: {
          id: '2e07d2ae62ffe000',
          name: 'Google nest互联',
          // description: 'nest联动可以帮助您的产品实现和google nest恒温器、烟感器的跨平台设备联动。您可以根据产品需要随时开启或关闭nest设备联动服务。',
          alias: 'nest',
          enable: false,
          type: 10,
          config: {}
        }
      }
    },
    route: {
      data () {
        this.getPlugins()
      }
    },

    methods: {
      /**
       * 获取nest插件
       */
      getPlugins () {
        this.loading = true
        api.plugin.all().then((res) => {
          if (res.status === 200) {
            // var pluginTypes = _.map(this.plugins, 'alias')
            res.data.list.forEach((item) => {
              // var index = _.indexOf(pluginTypes, item.plugin)
              if (item.id === '2e07d2ae62ffe000') {
                this.plugin.id = item.id
                this.plugin.enable = item.enable
                this.plugin.config = item.config
                if (this.plugin.enable) {
                  this.enableNest = false
                } else {
                  this.enableNest = true
                }
              }
            })
            this.loading = false
          }
        }).catch((res) => {
          // this.handleError(res)
          this.loading = false
        })
      },
      // 修改config
      editNestConfig () {
        this.editing = true
        var params = {
          name: this.plugin.name,
          enable: this.plugin.enable,
          config: {
            client_id: this.plugin.config.client_id,
            client_secret: this.plugin.config.client_secret
          }
        }
        if (this.plugin.id) {
          api.plugin.update(this.plugin.id, params).then((res) => {
            if (res.status === 200) {
              this.getPlugins()
            }
            this.editing = false
          }).catch((res) => {
            this.handleError(res)
            this.editing = false
          })
        }
      },
      /**
       * 切换插件状态
       * @param  {Object} plugin 当前插件
       */
      pluginToggle (plugin) {
        this.loading = true
        var params = {
          name: plugin.name,
          enable: plugin.enable,
          config: {
            url: `/plugins/${plugin.alias}`
          }
        }
        var obj = {
          id: plugin.id,
          name: plugin.name,
          plugin: plugin.alias,
          type: plugin.type,
          enable: plugin.enable
        }
        if (plugin.id) {
          api.plugin.update(plugin.id, params).then((res) => {
            if (res.status === 200) {
              this.getPlugins()
              if (plugin.enable) {
                this.createPlugin(obj)
                this.showNotice({
                  type: 'success',
                  content: `${plugin.name}插件已启用`
                })
              } else {
                this.removePlugin(obj)
                this.showNotice({
                  type: 'info',
                  content: `${plugin.name}插件已禁用`
                })
              }
            }
            this.loading = false
          }).catch((res) => {
            this.handleError(res)
            this.loading = false
          })
        } else {
          console.log(111)
          // api.plugin.create({
          //   name: plugin.name,
          //   type: 10,
          //   enable: true,
          //   plugin: plugin.alias
          // }).then((res) => {
          //   this.loading = false
          //   obj.id = res.data.id
          //   obj.enable = true
          //   this.createPlugin(obj)
          //   this.getPlugins()
          //   this.showNotice({
          //     type: 'success',
          //     content: `${plugin.name}插件创建成功`
          //   })
          // }).catch((res) => {
          //   this.handleError(res)
          //   this.loading = false
          // })
        }
      }
    }
  }
</script>
