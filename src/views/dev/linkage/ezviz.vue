<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>萤石</h2>
    </div>
    <div class="panel">
      <div class="row mt20 mb20">
        <div class="col-24">
          <pic-txt :pic-width="86">
            <img slot="pic" src="../../../assets/images/ezviztit.png" alt="nest互联">
            <p>萤石是基于互联网的民用安防产品，支持无线接入多种类型丰富的无线探测器，如可燃气体、智能门磁等；实现智能探测器与萤石安防产品的智能互联，看家护院神器，全方位安防守护您的监控场所。如：接入探测器与萤石摄像头，一旦家中或者店铺的某个探测器发现异常开始报警，萤石摄像头会立即收到指令，自动将镜头转向报警位置，让千里之外的你，也能第一时间掌握异常情况！</p>
          </pic-txt>
          <div class="tal mt20" style="padding-left: 126px">
            <span class="mr5">开启萤石联动服务</span>
            <!-- <x-switch size="small" :disabled="loading" :value.sync="plugin.enable" @switch-toggle="pluginToggle(plugin)"></x-switch> -->
            <!-- <x-switch size="small" :disabled="loading || true" :value.sync="plugin.enable" @switch-toggle="toggle" @disabled-click="toggle"></x-switch> -->
            <x-switch :disabled="plugin.platform_status===1" size="small" :value.sync="plugin.enable" @switch-toggle="toggle" @disabled-click="toggle"></x-switch>
          </div>
        </div>
      </div>
      <div class="row mt20 mb20" v-show="plugin.enable && plugin.platform_status===2" transition="bottomToTop">
        <div class="col-offset-2 col-10">
          <form>
            <div class="form-row row mb10">
              <label class="form-control col-6" style="line-height:32px">App Key:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="text" v-model="plugin.config.app_key" name="app_key" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-row row">
              <label class="form-control col-6" style="line-height:32px">App Secret:</label>
              <div class="controls col-18">
                <div class="input-text-wrap">
                  <input type="password" v-model="plugin.config.app_secret" name="app_secret" class="input-text"/>
                </div>
              </div>
            </div>
            <div class="form-actions col-offset-6 mt20">
              <!-- <button type="submit" @click.prevent.stop="editNestConfig" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button> -->
              <button @click.prevent.stop="onSubmit" :disabled="editing" :class="{'disabled':editing}" v-text="editing ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 提示开通服务浮层 -->
    <modal :show.sync="isShowAlertModel" @close="isShowAlertModel = false">
      <h3 slot="header">提示</h3>
      <div slot="body" class="form">
        <div class="form-row row">
          {{{alertModel.content}}}
        </div>
        <div class="form-actions">
          <button type="submit" @click.prevent="isShowAlertModel = false" v-text="$t('common.ok')" class="btn btn-primary w100"></button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import Switch from 'components/Switch'
import PicTxt from 'components/PicTxt'
import { createPlugin, updatePlugin, removePlugin } from 'store/actions/plugins'
import api from 'api'

export default {
  name: 'Ezviz',

  components: {
    PicTxt,
    'x-switch': Switch
  },

  mixins: [globalMixins],

  vuex: {
    getters: {
      allPlugins: ({ plugins }) => plugins.all
    },
    actions: {
      createPlugin,
      updatePlugin,
      removePlugin
    }
  },

  data () {
    return {
      isShowAlertModel: false,
      alertModel: {
        type: '',
        content: ''
      },
      loading: false,
      editing: false,
      plugin: {
        id: '',
        name: '萤石联动服务',
        alias: 'ezviz',
        plugin: 'ezviz',
        enable: false,
        type: 10,
        config: {
          app_key: '',
          app_secret: ''
        }
      }
    }
  },
  route: {
    data () {
      // this.getPlugins()
      this.init()
    }
  },

  watch: {
    allPlugins () {
      this.init()
    }
  },

  methods: {
    /**
     * 初始化
     */
    init () {
      if (this.allPlugins.length) {
        let plugin = _.find(this.allPlugins, (item) => {
          return item.plugin === this.plugin.alias
        })

        if (plugin) {
          plugin.alias = 'ezviz'
          this.plugin = _.cloneDeep(plugin)
        }
      }
    },

    /**
     * 切换插件状态
     */
    toggle () {
      let status = this.plugin.platform_status
      if (status && status === 1) {
        this.showAlert('<span>您尚未获得此应用的使用权限，请联系商务或发送邮件到 <span class="hl-red">bd@xlink.cn</span> 申请开通。</span>')
        // setTimeout(() => {
        //   plugin.enable = !plugin.enable
        // }, 500)
        return
      }
      // setTimeout(() => {
      //   this.plugin.enable = !val
      // }, 0)

      this.loading = true
      if (this.plugin.id) {
        this.onUpdate().then((res) => {
          if (res.status === 200) {
            this.loading = false
            this.editing = false
            this.plugin = _.cloneDeep(res.data)
            if (this.plugin.enable) {
              this.updatePlugin(res.data)
              this.showNotice({
                type: 'success',
                content: '萤石联动服务已开启'
              })
            } else {
              this.removePlugin(res.data)
              this.showNotice({
                type: 'info',
                content: '萤石联动服务已关闭'
              })
            }
          }
        }).catch((res) => {
          this.handleError(res)
          this.loading = false
          this.editing = false
        })
      } else {
        api.plugin.create({
          name: this.plugin.name,
          type: 10,
          enable: true,
          plugin: this.plugin.alias
        }).then((res) => {
          this.loading = false
          this.plugin = _.cloneDeep(res.data)
          this.createPlugin(res.data)
          this.showNotice({
            type: 'success',
            content: '萤石联动服务已开启'
          })
        }).catch((res) => {
          this.handleError(res)
          this.loading = false
        })
      }
    },

    /**
     * 更新插件信息
     */
    onUpdate () {
      let config = _.clone(this.plugin.config)
      if (!Object.keys(config).length) {
        config = {
          app_key: '',
          app_secret: ''
        }
      }
      let params = {
        name: this.plugin.name,
        enable: this.plugin.enable,
        config: config
      }
      this.editing = true
      return api.plugin.update(this.plugin.id, params)
    },

    /**
     * 处理表单提交
     */
    onSubmit () {
      this.onUpdate().then((res) => {
        if (res.status === 200) {
          this.editing = false
          this.plugin = _.cloneDeep(res.data)
          this.updatePlugin(res.data)
          this.showNotice({
            type: 'success',
            content: '萤石联动服务配置成功'
          })
        }
      }).catch((res) => {
        this.handleError(res)
        this.editing = false
      })
    },

    /**
     * 弹窗提示
     */
    showAlert (str) {
      this.isShowAlertModel = true
      this.alertModel.type = 'warm'
      this.alertModel.content = str
    }
  }
}
</script>
