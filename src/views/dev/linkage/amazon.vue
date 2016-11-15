<template>
  <div class="main">
    <div class="main-title bordered">
      <h2>Amazon echo</h2>
    </div>
    <div class="panel">
      <div class="row mt20 mb20">
        <div class="col-24">
          <pic-txt :pic-width="86">
            <img slot="pic" src="../../../assets/images/amazon.png" alt="nest互联">
            <p>通过amazon echo先进的智能语音服务可以让您的产品与echo进行互联，当用户向echo发送一条设备的语音指令时，echo会识别此命令并传递给xlink服务，并最终与您的设备进行智能语音交互。</p>
            <p>如：向echo说：“Hi alexa，turn on all my lights.”</p>
          </pic-txt>
        </div>
        <div class="mt20" style="padding-left: 126px">
          <span class="mr5">开启amazon echo联动服务</span>
          <switch :disabled="plugin.platform_status===1" size="small" :value.sync="plugin.enable" @switch-toggle="toggle" @disabled-click="toggle"></x-switch>
        </div>
      </div>
      <div class="row mt20 mb20" v-show="plugin.enable && plugin.platform_status===2" transition="bottomToTop">
        <div class="config-form mb40">
          <div class="form">
            <form>
              <div class="form-row row">
                <label class="form-control col-6" style="line-height:32px">ID:</label>
                <div class="controls col-18">
                  <div class="input-text-wrap" v-placeholder="'厂商自定义的ID'">
                    <input type="text" v-model="plugin.config.client_id" name="plugin.config.client_id" class="input-text"/>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6" style="line-height:32px">Scope:</label>
                <div class="controls col-18">
                  <div class="input-text-wrap" v-placeholder="'权限列表,最多15个,逗号隔开'">
                    <input type="text" v-model="plugin.config.scope" name="plugin.config.scope" class="input-text"/>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6" style="line-height:32px">Redirect URL:</label>
                <div class="controls col-18">
                  <div class="input-text-wrap" v-placeholder="'Alexa产生的Redirect URL'">
                    <input type="text" v-model="plugin.config.redirect_url" name="plugin.config.redirect_url" class="input-text"/>
                  </div>
                </div>
              </div>
              <div class="form-row row">
                <label class="form-control col-6" style="line-height:32px">Client Secret:</label>
                <div class="controls col-18">
                  <div class="input-text-wrap" v-placeholder="'厂商自定义的secret'">
                    <input type="password" v-model="plugin.config.client_secret" name="plugin.config.client_secret" class="input-text"/>
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

        <div class="panel-hd panel-hd-full bordered">
          <h2>产品列表</h2>
        </div>
        <div class="panel-bd mt15">
          <div class="data-table with-loading">
            <div class="icon-loading" v-show="loadingData">
              <i class="fa fa-refresh fa-spin"></i>
            </div>
            <table class="table table-stripe table-bordered">
              <thead>
                <tr>
                  <th width="6%">序号</th>
                  <th width="16%">产品名称</th>
                  <th>产品ID</th>
                  <th width="10%">权限状态</th>
                  <th width="16%" class="tac">开关联动</th>
                  <th width="16%" class="tac">百分比联动</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="productList.length > 0">
                  <tr v-for="product in productList" :class="{'disabled': !product.status}">
                    <td>{{ product.index }}</td>
                    <td>{{ product.name }}</td>
                    <td>{{ product.id }}</td>
                    <td>{{ product.status ? '已授权' : '无权限' }}</td>
                    <td class="tac">
                      <x-select width="140px" :label="product.onOff" size="small" :disabled="!product.status || !product.enableOnOff || (product.datapoints && product.datapoints.length <= 1)" :placeholder="'暂无数据端点'">
                        <select v-model="product.onOff" :disabled="!product.status" @change="setInterconnectLimit(product)">
                          <option v-for="option in product.datapoints" :value="option.name">{{ option.name || none }}</option>
                        </select>
                      </x-select>
                    </td>
                    <td class="tac">
                      <x-select width="140px" :label="product.percentage" size="small" :disabled="!product.status || !product.enablePercentage || (product.datapoints && product.datapoints.length <= 1)" :placeholder="'暂无数据端点'">
                        <select v-model="product.percentage" :disabled="!product.status" @change="setInterconnectLimit(product)">
                          <option v-for="option in product.datapoints" :value="option.name">{{ option.name || none }}</option>
                        </select>
                      </x-select>
                    </td>
                  </tr>
                </template>
                <tr v-if="productList.length === 0">
                  <td colspan="6" class="tac">
                    <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
import { createPlugin, updatePlugin, removePlugin } from 'store/actions/plugins'
import api from 'api'

export default {
  name: 'Echo',

  mixins: [globalMixins],

  vuex: {
    getters: {
      allProducts: ({ products }) => products.all,
      allPlugins: ({ plugins }) => plugins.all,
      corp: ({ system }) => system.corp
    },
    actions: {
      createPlugin,
      updatePlugin,
      removePlugin
    }
  },

  data () {
    return {
      none: '无',
      allDatapoints: {},
      interconnectLimit: {},
      isShowAlertModel: false,
      alertModel: {
        type: '',
        content: ''
      },
      loadingData: false,
      loading: false,
      editing: false,
      plugin: {
        id: '',
        name: 'Amazon Echo联动',
        alias: 'avs',
        plugin: 'avs',
        enable: false,
        type: 10,
        config: {
          client_id: '',
          client_secret: '',
          scope: '',
          redirect_url: ''
        }
      }
    }
  },

  computed: {
    // 列表数据
    productList () {
      return _.map(this.allProducts, (product, index) => {
        let datapoints = this.allDatapoints[product.id] || []
        let len = datapoints.length
        let limit = this.interconnectLimit
        let status = false
        let onOff = this.none
        let enableOnOff = false
        let percentage = this.none
        let enablePercentage = false

        if (product.id in limit) {
          status = true
          if ('turn_on_off' in limit[product.id]) {
            onOff = limit[product.id].turn_on_off || this.none
            enableOnOff = true
          }
          if ('percentage' in limit[product.id]) {
            percentage = limit[product.id].percentage || this.none
            enablePercentage = true
          }
        }

        if (len <= 1) {
          onOff = ''
          percentage = ''
        }

        return {
          index: index + 1,
          name: product.name,
          id: product.id,
          status: status,
          onOff: onOff,
          enableOnOff: enableOnOff,
          percentage: percentage,
          enablePercentage: enablePercentage,
          datapoints: datapoints
        }
      })
    }
  },

  route: {
    data () {
      this.init()
      this.getDatapoints()
      this.getInterconnectLimit()
    }
  },

  watch: {
    allPlugins () {
      this.init()
    },

    allProducts () {
      this.getDatapoints()
    },

    corp () {
      this.getInterconnectLimit()
    }
  },

  methods: {
    /**
     * 初始化
     */
    init () {
      if (!this.allPlugins.length) return

      let plugin = _.find(this.allPlugins, (item) => {
        return item.plugin === this.plugin.alias
      })

      if (plugin) {
        plugin.alias = 'avs'
        this.plugin = _.cloneDeep(plugin)
      }
    },

    /**
     * 获取数据端点
     */
    getDatapoints () {
      if (!this.allProducts.length) return

      _.forEach(this.allProducts, (product) => {
        api.product.getDatapoints(product.id).then((res) => {
          if (res.status !== 200) return
          let newObj = {}
          newObj[product.id] = _.map(res.data, (item) => {
            return {
              name: item.name
            }
          })
          newObj[product.id].unshift({
            name: '无'
          })
          this.allDatapoints = _.extend({}, this.allDatapoints, newObj)
        }).catch((res) => {
          this.handleError(res)
        })
      })
    },

    /**
     * 获取设备互联应用限制
     */
    getInterconnectLimit () {
      if (!('id' in this.corp)) return

      api.interconnect.getLimit(this.corp.id, 'avs').then((res) => {
        if (res.status !== 200) return
        this.interconnectLimit = res.data.biz_limit
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 设置设备互联应用限制
     * @author shengzhi
     * @param {Object} product 产品
     */
    setInterconnectLimit (product) {
      let limit = {}
      let noOnOff = _.some(['', '无'], (item) => item === product.onOff)
      let noPercentage = _.some(['', '无'], (item) => item === product.percentage)

      limit[product.id] = {
        turn_on_off: noOnOff ? '' : product.onOff,
        percentage: noPercentage ? '' : product.percentage
      }

      let params = {
        plugin: 'avs',
        biz_limit: limit
      }
      api.interconnect.setLimit(this.corp.id, params).then((res) => {
        if (res.status !== 200) return
        this.getInterconnectLimit()
        this.showNotice({
          type: 'success',
          content: '联动设置成功'
        })
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 切换插件状态
     */
    toggle () {
      let status = this.plugin.platform_status
      if (status && status === 1) {
        this.showAlert('<span>您尚未获得此应用的使用权限，请联系商务或发送邮件到 <span class="hl-red">bd@xlink.cn</span> 申请开通。</span>')
        return
      }

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
                content: 'Amazon Echo联动服务已开启'
              })
            } else {
              this.removePlugin(res.data)
              this.showNotice({
                type: 'info',
                content: 'Amazon Echo联动服务已关闭'
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
            content: 'Amazon Echo联动服务已开启'
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
          client_id: '',
          client_secret: '',
          scope: '',
          redirect_url: ''
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
     * @author shengzhi
     */
    onSubmit () {
      this.onUpdate().then((res) => {
        if (res.status === 200) {
          this.editing = false
          this.plugin = _.cloneDeep(res.data)
          this.updatePlugin(res.data)
          this.showNotice({
            type: 'success',
            content: 'Amazon Echo联动配置成功'
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

<style lang="stylus" scoped>
.config-form
  margin-left 126px

.config-box
  width 100%
  height auto
  .list
    height 100px
    overflow hidden
    display table
    border-bottom 1px solid #ccc
    .msg-box
    .input-box
      display table-cell
      width 50%
      height 100%
      padding 10px
      box-sizing border-box
      position relative
      min-height 50px
      .box
        width 100%
        position absolute
        top 50%
        left 50%
        transform translate(-50%,-50%)
        padding 10px
        box-sizing border-box
</style>
