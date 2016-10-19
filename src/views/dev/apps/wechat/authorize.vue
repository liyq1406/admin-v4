<template>
  <div class="wechat-authorize mt15">
    <div class="action-bar row">
      <div class="col-12">
        <v-select width="200px" :label="currProduct.name" size="small">
          <span slot="label">选择产品:</span>
          <select v-model="currProduct" @change="getAppStatus">
            <option v-for="product in allProducts" :value="product">{{ product.name }}</option>
          </select>
        </v-select>
      </div>
      <div class="col-12">
        <button @click.prevent.stop="stopProductEmpower" v-if="empowering" class="btn btn-ghost fr">{{ $t('common.unempower') }}</button>
        <button @click.prevent.stop="productEmpower" v-else class="btn btn-ghost fr">{{ $t('common.empower') }}</button>
        <button @click.prevent.stop="showAlertModal = true" class="btn btn-ghost mr10 fr">授权设置</button>
        <button @click.prevent.stop="showAddModal = true" class="btn btn-primary mr10 fr"><i class="fa fa-plus"></i>添加测试设备</button>
      </div>
    </div>
    <div class="data-table with-loading">
      <div class="icon-loading" v-show="loadingData">
        <i class="fa fa-refresh fa-spin"></i>
      </div>
      <table class="table table-stripe table-bordered">
        <thead>
          <tr>
            <th>设备ID</th>
            <th>MAC</th>
            <th>微信设备TYPE</th>
            <th>授权状态</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="devices.length > 0">
            <!-- <tr v-for="device in devices | limitBy countPerPage (currentPage-1)*countPerPage"> -->
            <tr v-for="device in devices">
              <td>{{ device.device_id }}</td>
              <td>{{ device.mac }}</td>
              <td>{{ device.w_device_type }}</td>
              <td v-if="device.status -0 === 0">未授权</td>
              <td v-if="device.status -0 === 1">已授权</td>
              <td v-if="device.status -0 === 2">授权中</td>
            </tr>
          </template>
          <tr v-if="devices.length === 0 && !loadingData">
            <td colspan="4" class="tac">
              <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <pager v-if="!loadingData && total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getWechatList"></pager>

    <!-- 授权设置浮层-->
    <modal :show.sync="showSetModal" @close="onSetCancel" width="640px">
      <h3 slot="header">授权设置页面</h3>
      <div slot="body" class="form form-rules">
        <form autocomplete="off" v-form name="setValidation" @submit.prevent="onSetSubmit" hook="setFormHook">
          <p style="display:inline-block;margin-top:0;"><span class="hl-red">具体参数说明: </span><a href="http://iot.weixin.qq.com/wiki/document-2_6.html" target="_blank">http://iot.weixin.qq.com/wiki/index.html</a></p>
          <div class="form-row row">
            <label class="form-control col-7">
              product_id:
              <v-tooltip placement="right" width="300px">
                <p>设备的产品编号（由微信硬件平台分配）。可在公众号设备功能管理页面查询。</p>
                <p>当 op_type 为‘0’，product_id 为‘1’时，不要填写 product_id 字段（会引起不必要错误）；</p>
                <p>当 op_typy 为‘0’，product_id 不为‘1’时，必须填写 product_id 字段；</p>
                <p>当 op_type 为 1 时，不要填写 product_id 字段。</p>
                <i class="fa fa-question-circle hl-orange" slot="trigger"></i>
              </v-tooltip>
            </label>
            <div class="controls col-17">
              <div class="input-text-wrap">
                <input v-model="setModel.product_id" type="text" name="product_id" placeholder="请输入微信产品ID" v-form-ctrl required class="input-text"/>
              </div>
              <div v-if="setValidation.$submitted" class="form-tips form-tips-error"><span v-if="setValidation.product_id.$error.required">{{ $t('ui.validation.required', {field: $t('ui.wechat.product_id')}) }}</span></div>
            </div>
          </div>
          <p class="hl-red">已经授权过的设备不支持更改产品ID</p>
          <div class="form-row row">
            <label class="form-control col-7">
              auth_key:
              <v-tooltip placement="right" width="300px">
                <p>auth及通信的加密key，第三方需要将key烧制在设备上（128bit），格式采用16进制串的方式（长度为32字节），不需要0X前缀，如:1234567890ABCDEF1234567890ABCDEF</p>
                <i class="fa fa-question-circle hl-orange" slot="trigger"></i>
              </v-tooltip>
            </label>
            <div class="controls col-17">
              <div class="input-text-wrap">
                <input v-model="setModel.auth_key" type="text" name="auth_key" placeholder="请输入32位加密key" minlength="2" maxlength="32" required class="input-text"/>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-7">
              close_strategy:
              <v-tooltip placement="right" width="300px">
                <p>断开策略，目前支持：</p>
                <p>1：退出公众号页面时即断开连接</p>
                <p>2：退出公众号之后保持连接不断开</p>
                <i class="fa fa-question-circle hl-orange" slot="trigger"></i>
              </v-tooltip>
            </label>
            <div class="controls col-17">
              <div class="radio-group">
                <label v-for="type in ['1', '2']" class="radio">
                  <input type="radio" v-model="setModel.close_strategy" name="close_strategy" :value="type" number required/>{{ type }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-7">
              conn_strategy:
              <v-tooltip placement="right" width="300px">
                <p>连接策略，32位整型，按bit位置位，目前仅第1bit和第3bit位有效（bit置0为无效，1为有效；第2bit已被废弃），且bit位可以按或置位（如1|4=5），各bit置位含义说明如下：</p>
                <p>1：（第1bit置位）在公众号对话页面，不停的尝试连接设备</p>
                <p>4：（第3bit置位）处于非公众号页面（如主界面等），微信自动连接。当用户切换微信到前台时，可能尝试去连接设备，连上后一定时间会断开</p>
                <i class="fa fa-question-circle hl-orange" slot="trigger"></i>
              </v-tooltip>
            </label>
            <div class="controls col-17">
              <div class="radio-group">
                <label v-for="type in ['1', '4']" class="radio">
                  <input type="radio" v-model="setModel.conn_strategy" name="conn_strategy" :value="type" number required/>{{ type }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-7">
              crypt_method:
              <v-tooltip placement="right" width="300px">
                <p>auth加密方法，目前支持两种取值：</p>
                <p>0：不加密</p>
                <p>1：AES加密（CBC模式，PKCS7填充方式）</p>
                <i class="fa fa-question-circle hl-orange" slot="trigger"></i>
              </v-tooltip>
            </label>
            <div class="controls col-17">
              <div class="radio-group">
                <label v-for="type in ['0', '1']" class="radio">
                  <input type="radio" v-model="setModel.crypt_method" name="crypt_method" :value="type" number required/>{{ type }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-7">
              auth_ver:
              <v-tooltip placement="right" width="300px">
                <p>auth version，设备和微信进行auth时，会根据该版本号来确认auth buf和auth key的格式（各version对应的auth buf及key的具体格式可以参看“客户端蓝牙外设协议”），该字段目前支持取值：</p>
                <p>0：不加密的version</p>
                <p>1：version 1</p>
                <i class="fa fa-question-circle hl-orange" slot="trigger"></i>
              </v-tooltip>
            </label>
            <div class="controls col-17">
              <div class="radio-group">
                <label v-for="type in ['0', '1']" class="radio">
                  <input type="radio" v-model="setModel.auth_ver" name="auth_ver" :value="type" number required/>{{ type }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-7">
              manu_mac_pos:
              <v-tooltip placement="right" width="300px">
                <p>表示mac地址在厂商广播manufature data里含有mac地址的偏移，取值如下：</p>
                <p>-1：在尾部</p>
                <p>-2：表示不包含mac地址</p>
                <p>其他：非法偏</p>
                <i class="fa fa-question-circle hl-orange" slot="trigger"></i>
              </v-tooltip>
            </label>
            <div class="controls col-17">
              <div class="radio-group">
                <label v-for="type in ['-1', '-2']" class="radio">
                  <input type="radio" v-model="setModel.manu_mac_pos" name="manu_mac_pos" :value="type" number required/>{{ type }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-7">
              connect_protocol:
              <v-tooltip placement="right" width="380px">
                <p>支持以下四种连接协议： </p>
                <p>android classic bluetooth – 1</p>
                <p>ios classic bluetooth – 2</p>
                <p>ble – 3</p>
                <p>wifi - 4</p>
                <p>一个设备可以支持多种连接类型，用符号"|"做分割，客户端优先选择靠前的连接方式（优先级按|关系的排序依次降低），举例：</p>
                <p>1：表示设备仅支持andiod classic bluetooth </p>
                <p>1|2：表示设备支持andiod 和ios 两种classic bluetooth，但是客户端优先选择andriod classic bluetooth 协议，如果andriod classic bluetooth协议连接失败，再选择ios classic bluetooth协议进行连接</p>
                <p>（注：安卓平台不同时支持BLE和classic类型）</p>
                <i class="fa fa-question-circle hl-orange" slot="trigger"></i>
              </v-tooltip>
            </label>
            <div class="controls col-17">
              <div class="radio-group">
                <label v-for="type in ['1', '2', '3', '4']" class="radio">
                  <input type="radio" v-model="setModel.connect_protocol" name="connect_protocol" :value="type" number required/>{{ type }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-7">
              ser_mac_pos:
              <v-tooltip placement="right" width="300px">
                <p>表示mac地址在厂商serial number里含有mac地址的偏移，取值如下：</p>
                <p>-1：表示在尾部 </p>
                <p>-2：表示不包含mac地址 </p>
                <p>其他：非法偏移</p>
                <i class="fa fa-question-circle hl-orange" slot="trigger"></i>
              </v-tooltip>
            </label>
            <div class="controls col-17">
              <div class="radio-group">
                <label v-for="type in ['-1', '-2']" class="radio">
                  <input type="radio" v-model="setModel.ser_mac_pos" name="ser_mac_pos" :value="type" number required/>{{ type }}
                </label>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="onSetCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="setting" :class="{'disabled':setting}" v-text="setting ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 新增授权浮层-->
    <modal :show.sync="showAddModal" @close="onAddCancel">
      <h3 slot="header">新增授权页面</h3>
      <div slot="body" class="form form-rules">
        <form autocomplete="off" v-form name="addValidation" @submit.prevent.stop="onAddSubmit" hook="addFormHook">
          <div class="form-row row">
            <label class="form-control col-6">{{ $t("ui.overview.addForm.mac") }}:</label>
            <div class="controls col-18">
              <div v-placeholder="$t('ui.overview.addForm.mac_placeholder')" class="input-text-wrap">
                <input v-model="addModel.mac" type="text" name="mac" required lazy class="input-text"/>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 新增授权警告浮层-->
    <modal :show.sync="showAlertModal" @close="onAlertCancel">
      <h3 slot="header">授权提醒</h3>
      <div slot="body" class="form form-rules">
        <div class="form-row row">
          <p>确定要修改微信授权吗？</p>
        </div>
        <div class="form-actions">
          <button @click.prevent.stop="showAlertModal=false" class="btn btn-default">取消</button>
          <button @click.prevent.stop="showWechat" class="btn btn-primary">确定</button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
// import Vue from 'vue'
import api from 'api'
import * as config from 'consts/config'
import Pager from 'components/Pager'
import Modal from 'components/Modal'
import Select from 'components/Select'
import Tooltip from 'components/Tooltip'
// import locales from 'consts/locales/index'
import _ from 'lodash'
import { globalMixins } from 'src/mixins'

export default {
  name: 'WechatAuthorize',

  mixins: [globalMixins],

  components: {
    'modal': Modal,
    'pager': Pager,
    'v-select': Select,
    'v-tooltip': Tooltip
  },

  vuex: {
    getters: {
      allProducts: ({ products }) => products.all
    }
  },

  props: ['app'],

  data () {
    return {
      firmwares: [],
      apps: [],
      currProduct: {},
      loadingFirmwares: false,
      tables: [],
      checkdatas: [],
      adding: false,
      empowering: false,
      setting: false,
      showSetModal: false,
      showAlertModal: false,
      showAddModal: false,
      addValidation: {},
      alertValidation: {},
      setValidation: {},
      originSetValidation: {},
      originSetModel: {},
      originAddModel: {},
      setModel: {
        auth_key: '',
        close_strategy: '',
        conn_strategy: '',
        crypt_method: '',
        auth_ver: '',
        connect_protocol: '',
        manu_mac_pos: '',
        ser_mac_pos: '',
        product_id: ''
      },
      addModel: {},
      alertModel: {},
      reEmpowers: [],
      devices: [
        // {
        //   device_id: '设备ID',
        //   app_id: '应用ID',
        //   product_id: '产品ID',
        //   mac: 'MAC地址',
        //   w_device_id: '微信设备ID',
        //   w_device_type: '微信设备类型',
        //   status: '授权状态'
        // },
        // {
        //   device_id: '设备ID',
        //   app_id: '应用ID',
        //   product_id: '产品ID',
        //   mac: 'MAC地址',
        //   w_device_id: '微信设备ID',
        //   w_device_type: '微信设备类型',
        //   status: '授权状态'
        // }
      ],
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      total: 0,
      loadingData: false,
      deviceEmpowering: false
    }
  },

  ready () {
    this.init()
  },

  watch: {
    allProducts () {
      this.init()
    }
  },

  methods: {
    /**
     * 初始化
     */
    init () {
      if (this.allProducts.length) {
        this.currProduct = this.allProducts[0]
        this.getAppStatus()
      }
    },

    // 关闭授权浮层并净化表单
    resetSet () {
      this.setting = false
      this.showSetModal = false
      this.setModel = _.clone(this.originSetModel)
      this.$nextTick(() => {
        this.setForm.setPristine()
      })
    },

    // 更改产品后获取列表与状态
    getAppStatus () {
      this.getWechatList()
      this.getEmpowerStatus()
    },

    /**
     * 查询授权设备列表
     */
    getWechatList () {
      this.loadingData = true
      api.app.getWechatList(this.app.id, this.currProduct.id, {
        offset: this.countPerPage * (this.currentPage - 1),
        limit: this.countPerPage
      }).then((res) => {
        if (res.status === 200) {
          this.devices = res.data.list
          this.total = res.data.count
          this.loadingData = false
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    // 取消授权提醒
    onAlertCancel () {
      this.alertModel = false
    },

    // 取消授权
    onSetCancel () {
      this.resetSet()
    },

    // 授权表单钩子
    setFormHook (form) {
      this.setForm = form
    },

    // 关闭添加授权浮层并净化添加表单
    onAddCancel () {
      // var this = this
      this.adding = false
      this.showAddModal = false
      this.addModel = _.clone(this.originAddModel)
    },

    // 添加表单钩子
    addFormHook (form) {
      this.addForm = form
    },

    /**
     * 设置授权
     */
    onSetSubmit () {
      if (this.setValidation.$valid && !this.setting) {
        this.setting = true
        console.log(JSON.stringify(this.setModel))
        api.app.empowerWechat(this.app.id, this.currProduct.id, this.setModel).then((res) => {
          if (res.status === 200) {
            this.resetSet()
            this.setting = false
            window.localStorage.setItem('selectedAppId', this.currProduct.id)
          }
        }).catch((res) => {
          this.handleError(res)
          this.setting = false
        })
      }
    },

    // 微信授权提醒
    showAlert () {
      this.alertModel = true
    },

    // 微信授权
    showWechat () {
      this.showSetModal = true
      this.showAlertModal = false
      api.app.getWechat(this.app.id, this.currProduct.id).then((res) => {
        if (Object.keys(res.data).length === 0) {
          this.setModel = {
            auth_key: '',
            close_strategy: 1,
            conn_strategy: 1,
            crypt_method: 0,
            auth_ver: 0,
            connect_protocol: 1,
            manu_mac_pos: -1,
            ser_mac_pos: -1,
            product_id: ''
          }
        } else {
          this.setModel = res.data.auth_config
          this.setModel.product_id = res.data.product_id
        }
      }).catch((res) => {
        this.handleError(res)
        this.adding = false
      })
    },

    // 提交新增
    onAddSubmit () {
      if (this.addValidation.$valid && !this.adding) {
        api.app.createWechat(this.app.id, this.currProduct.id, this.addModel).then((res) => {
          if (res.status === 200) {
            this.onAddCancel()
            this.getWechatList()
          }
        }).catch((res) => {
          this.handleError(res)
          this.adding = false
        })
      }
    },

    // 获取产品授权状态
    getEmpowerStatus () {
      this.deviceEmpowering = true
      api.app.productEmpowerStatus(this.app.id, this.currProduct.id).then((res) => {
        if (res.data.status === 0) {
          this.empowering = false
          this.deviceEmpowering = false
        } else {
          this.empowering = true
          setTimeout(this.getEmpowerStatus, 3000)
        }
      }).catch((res) => {
        this.handleError(res)
        this.empowering = false
      })
    },

    // 产品授权
    productEmpower () {
      // 授权前先获取配置看是否已配置，如无配置，弹框提示配置
      api.app.getWechat(this.app.id, this.currProduct.id).then((res) => {
        // 已存在配置
        if (Object.keys(res.data).length !== 0) {
          console.log(Object.keys(res.data).length)
          api.app.productEmpower(this.app.id, this.currProduct.id).then((res) => {
            if (res.status === 200) {
              this.getAppStatus()
            }
          }).catch((res) => {
            this.handleError(res)
            this.empowering = false
          })
        } else {
          // 不存在配置
          alert('还未设置授权，请先设置授权！')
        }
      }).catch((res) => {
        this.handleError(res)
      })
      // api.app.productEmpower(this.app.id, this.currProduct.id).then((res) => {
      //   if (res.status === 200) {
      //     this.getAppStatus()
      //   }
      // }).catch((res) => {
      //   this.handleError(res)
      //   this.empowering = false
      // })
    },

    /**
     * 停止产品授权
     */
    stopProductEmpower () {
      api.app.stopProductEmpower(this.app.id, this.currProduct.id).then((res) => {
        if (res.status === 200) {
          this.getAppStatus()
        }
      })
    }
  }
}
</script>

<style lang="stylus">
@import '../../../../assets/stylus/common'

.modal .modal-body
  max-height 600px!important
</style>
