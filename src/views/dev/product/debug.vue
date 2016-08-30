<template>
  <div class="main device-debug">
    <div class="main-title">
      <h2>设备调试</h2>
    </div>
    <div class="container" :class="{'padding': !showLog}">
      <div class="device-list-box" v-show="!showLog">
        <div class="header-box">
          <div class="title mt10">
            <span>设备列表</span>
          </div>
          <div class="button-group">
            <button class="add-devices btn btn-ghost" @click="onShowAddModal">
              <i class="fa fa-plus"></i>
              添加设备
            </button>
            <div class="search-box" v-show="true">
              <search-box :placeholder="'请输入设备mac'" :key.sync="query" @cancel="getDevices" @press-enter="getDevices" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" >
                <button slot="search-button" class="search btn btn-ghost" @click="getDevices"><i class="fa fa-search"></i></button>
              </search-box>
            </div>
          </div>
        </div>
        <div class="body-box">
          <div class="devices-box" v-show="devices.length>0">
            <div class="device" v-for="device in devices" :class="{'selected': device.id===selectedDevice.id}" @click="selectedDeviceId = device.id">
              <div class="status-box w30">
                <div class="status">
                  <i class="fa success" v-show="device.is_active && device.is_online"></i>
                  <i class="fa fail" v-show="device.is_active && !device.is_online"></i>
                  <i class="fa fa-question-circle" v-show="!device.is_active"></i>
                </div>
              </div>
              <div class="device-msg-box">
                <div class="mac">
                  <span>{{device.mac}}</span>
                </div>
                <div class="id">
                  <span>ID：{{device.id}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="no-devices" v-show="devices.length===0">
            <span>
              暂无结果
            </span>
          </div>
          <div class="pager-box">
            <pager :simple="true" :current.sync="currentPage" :count-per-page="countPerPage" :total="total" @page-update="getDevices"></pager>
          </div>
        </div>
      </div>

      <div class="device-details-box">
        <div class="panel">
          <div class="panel-hd bordered row">
            <div class="msg-box fl col-8">
              <div class="title">
                <h2 class="product-title mt5 mb5">{{selectedDevice.name || '--'}}</h2>
              </div>
              <div class="type-box">
                <div class="status-box">
                  <span v-if="selectedDevice.is_active" class="status-text"><i class="fa mr5" :class="selectedDevice.is_online?'success':'fail'"></i>{{selectedDevice.is_online?'在线':'离线'}}</span>
                  <span v-else>
                    <i class="fa fa-question-circle mr5" ></i>未激活
                  </span>
                  <span class="status-date ml10">{{selectedDevice.last_login | uniformDate true}}</span>
                  <span class="status-time ml10">{{selectedDevice.last_login | uniformTime true}}</span>
                </div>
              </div>
            </div>
            <div class="filter-bar fr col-16">
              <div class="filter-group fr">
                <div class="filter-group-item mt10">
                  <button class="btn btn-ghost" @click="showLog = !showLog">
                    <i class="fa fa-angle-double fa-angle-double-left" v-show="!showLog"></i>
                    <i class="fa fa-angle-double fa-angle-double-right" v-show="showLog"></i>
                    设备日志
                  </button>
                </div>
                <div class="filter-group-item mt10">
                  <search-box :placeholder="'搜索端点ID'" :key.sync="query2" :active="searching" @search-activate="searching=!searching" @search-deactivate="searching=!searching">
                  </search-box>
                </div>
                <div class="filter-group-item mt5">
                  <div class="filter-device-info">
                    <span>ID:{{selectedDevice.id}}</span>
                  </div>
                  <div class="filter-device-info">
                    <span v-tooltip="selectedDevice.mac">MAC:{{selectedDevice.mac}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="panel-bd row">
            <div class="table-box with-loading" :class="{'col-16': showLog, 'col-24': !showLog}">
              <div class="icon-loading" v-show="refreshing">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
              <table class="table">
                <thead>
                  <tr>
                    <th>索引</th>
                    <th>端点ID</th>
                    <th>值</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="datapoint in datapointList">
                    <td class="w50">{{ datapoint.index }}</td>
                    <td class="w80">{{ datapoint.name }}</td>
                    <td class="value-td">
                      <div class="input-box" v-if="datapoint.is_write">
                        <div class="number-box" v-if="dataPointType(datapoint.type) === 'number'">
                          <range v-if="dataPointType(datapoint.type) === 'number'" :disabled="!selectedDevice.is_online" :min="datapoint.min" :max="datapoint.max" :value="datapoint.value" :expand="datapoint" @changed="setRangeValue" @ondisable="onDisable"></range>
                        </div>
                        <div class="boolean-box" v-show="dataPointType(datapoint.type) === 'boolean'">
                          <label class="mr20">
                            <input type="radio" :name="'value'+$index" :value="true" v-model="datapoint.value" @change="setDataEvent(datapoint)">true
                          </label>
                          <label class="mr20">
                            <input type="radio" :name="'value'+$index" :value="false" v-model="datapoint.value" @change="setDataEvent(datapoint)">false
                          </label>
                        </div>
                        <div class="string-box" v-show="dataPointType(datapoint.type) === 'string'">
                          <div class="input-text-wrap">
                            <input type="text" class="input-text input-text-sm" v-model="datapoint.value" @change="setDataEvent(datapoint)">
                          </div>
                        </div>
                      </div>
                      <div class="input-box" v-if="!datapoint.is_write">
                        <span>{{datapoint.value}}</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="refresh-box">
                <button class="btn btn-ghost" @click="getDatapointValues">
                  <i class="fa fa-refresh" :class="{'fa-spin': refreshing}"></i>刷新
                </button>
              </div>
            </div>
            <div class="log-box" v-show="showLog" :class="'col-8'">
              <!-- Start: 设备日志-->
              <div class="log-panel">
                <div class="log-panel-hd">
                  <div class="actions">
                    <switch :value.sync="linkSocket" @switch-toggle="changeSocketType" size="small"></switch>
                  </div>
                  <h2>{{ $t('ui.device.log') }}</h2>
                </div>
                <div class="log-panel-bd">
                  <code class="output-log">
                    <div v-for="log in logs" class="log"><span class="time">{{ log.time }}</span>
                      <template v-if="log.type === 'user'"><span class="user">{{ log.msg[0] }}</span><span class="msg">: {{ log.msg[1] }}</span></template>
                      <template v-if="log.type === 'status'"><span :class="{'msg-success':log.msg[0]===200, 'msg-error':log.msg[0]!==200}">{{ log.msg[0] }}</span><span class="msg">: {{ log.msg[1] }}</span></template>
                      <template v-if="log.type === 'connected'"><span class="msg-success">{{ log.msg }}</span></template>
                      <template v-if="log.type === 'disconnected'"><span class="msg-error">{{ log.msg }}</span></template>
                    </div>
                  </code>
                  <div class="clear-btn" @click="logs=[]">
                    <span>清除日志</span>
                  </div>
                </div>
              </div>
              <!-- End: 设备日志-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <Modal  :show.sync="showAddModal">
      <h3 slot="header">添加设备</h3>
      <div slot="body" class="form">
        <form @submit.prevent="onAddSubmit">
          <div class="form-row row">
            <label class="form-control col-6">MAC:</label>
            <div class="controls col-18">
              <div v-placeholder="'请填写设备MAC'" class="input-text-wrap">
                <input v-model="addModel.mac" type="text"class="input-text"/>
              </div>
              <!-- <div v-if="addValidation.$submitted && addValidation.mac.$pristine" class="form-tips form-tips-error"><span v-if="addValidation.mac.$error.required">{{ $t('ui.validation.required', {field: $t('ui.overview.addForm.mac')}) }}</span></div>
              <div v-if="addValidation.mac.$dirty" class="form-tips form-tips-error"><span v-if="addValidation.mac.$error.required">{{ $t('ui.validation.required', {field: $t('ui.overview.addForm.mac')}) }}</span></div> -->
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">序列号:</label>
            <div class="controls col-18">
              <div v-placeholder="'请输入序列号'" class="input-text-wrap">
                <input v-model="addModel.sn" type="text" name="sn" lazy class="input-text"/>
              </div>
            </div>
          </div>
          <div class="form-row row">
            <label class="form-control col-6">名字:</label>
            <div class="controls col-18">
              <div v-placeholder="'请输入名字'" class="input-text-wrap">
                <input v-model="addModel.name" type="text" name="name"  lazy class="input-text"/>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="onAddCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </Modal>
  </div>
</template>

<script>
// import Vue from 'vue'
import io from 'socket.io-client'
import { globalMixins } from 'src/mixins'
import dateFormat from 'date-format'
// import locales from 'consts/locales/index'
// import * as config from 'consts/config'
import SearchBox from 'components/SearchBox'
import Pager from 'components/Pager'
import Range from 'components/Range1'
import Switch from 'components/Switch'
import Modal from 'components/Modal'
import api from 'api'
import _ from 'lodash'

var socket = null

export default {
  name: 'DeviceDebug',

  mixins: [globalMixins],
  components: {
    'search-box': SearchBox,
    Modal,
    Pager,
    Switch,
    Range
    // 'api': api,
    // 'x-select': Select,
    // 'x-table': Table,
    // Statistic
  },
  data () {
    return {
      total: 0,
      token: '',
      // 设备列表搜索条件
      query: '',
      // 端点搜索条件
      query2: '',
      // 显示日志标志位
      showLog: false,
      // 连接socket
      linkSocket: true,
      // 正在加载设备列表标志位
      loadingData: false,
      // 正在添加设备标志位
      adding: false,
      // 显示添加设备浮层
      showAddModal: false,
      currentPage: 1,
      countPerPage: 8,
      queryType: {
        label: 'MAC',
        value: 'mac'
      },
      // 添加设备浮层
      addModel: {
        mac: ''
      },
      // 设备列表
      devices: [],
      selectedDeviceId: '',
      // 设备日志
      logs: [
        // {
        //   time: '123',
        //   msg: ['msg']
        // }
      ],
      datapointValueArr: [],
      datapoints: [],
      settingData: false,
      searching: false,
      refreshing: false
    }
  },

  computed: {
    /**
     * 计算属性 数据端点值
     * @return {[type]} [description]
     */
    datapointValues () {
      var result = {}
      this.datapointValueArr.forEach((item) => {
        result[item.index] = item.value
      })
      return result
    },
    selectedDevice () {
      var result = {}
      this.devices.forEach((item) => {
        if (item.id === this.selectedDeviceId) {
          result = item
        }
      })
      return result
    },
    datapointList () {
      let result = []
      this.datapoints.forEach((item) => {
        let dp = _.cloneDeep(item)
        if (this.datapointValues.hasOwnProperty(item.index)) {
          dp.value = this.datapointValues[item.index]
        }
        result.push(dp)
      })
      if (this.query2) {
        result = result.filter((item) => {
          let reg = new RegExp(this.query2, 'ig')
          return reg.test(item.name)
        })
      }

      return _.orderBy(result, ['index'], ['asc'])
    },
    /**
     * 计算属性-获取设备列表条件
     * @return {[type]} [description]
     */
    queryCondition () {
      var condition = {
        filter: ['id', 'mac', 'name', 'is_active', 'active_date', 'is_online', 'last_login'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        // order: this.sortOrders,
        query: {}
      }

      if (this.query.length > 0) {
        this.currentPage = 1
        condition.query[this.queryType.value] = this.queryType.value === 'id' ? { $in: [Number(this.query)] } : { $like: this.query }
      }

      return condition
    }
  },
  watch: {
    selectedDevice () {
      if (!this.selectedDevice.id) return
      this.connect()
      this.getDatapoints()
      this.getDatapointValues(true)
    }
  },
  route: {
    data () {
      // 获取设备列表
      this.getDevices()
    },
    deactivate () {
      if (socket) {
        socket.disconnect()
        socket = null
      }
    }
  },

  methods: {
    /**
     * socket改变状态
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    changeSocketType (value) {
      if (value) {
        this.connect()
      } else {
        if (socket) {
          socket.disconnect()
        }
        this.logs = []
      }
    },
    // 获取数据端点列表
    getDatapoints () {
      api.product.getDatapoints(this.$route.params.id).then((res) => {
        if (res.status === 200) {
          this.datapoints = res.data
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    /**
     * 连接socket逻辑
     * @return {[type]} [description]
     */
    connect () {
      if (!this.selectedDevice.is_online) {
        this.outputLog([this.selectedDevice.id, 'The client has disconnected!'], 'status')
        // return
      }
      api.diagnosis.getDeviceToken(this.selectedDevice.id).then((res) => {
        this.token = res.data.token
        socket = io.connect('http://' + res.data.addr, {'force new connection': true})

        // 连接 socket
        socket.on('connect', () => {
          this.outputLog('Client has connected to the server!', 'connected')
          window.setTimeout(() => {
            socket.emit('trace.logs', {id: this.selectedDevice.id, token: this.token})
          }, 100)
        })

        // 断开 socket 连接
        socket.on('disconnect', () => {
          this.outputLog('The client has disconnected!', 'disconnected')
        })

        // 输入日志
        socket.on('trace.log', (data) => {
          this.analysis(data) // 解析数据
          this.outputLog([data.id, data.log], 'user')
        })

        // 输出状态
        socket.on('trace.status', (data) => {
          this.outputLog([data.status, data.msg], 'status')
        })
      }).catch((res) => {
        this.handleError(res)
        // this.showNotice({
        //   type: 'error',
        //   content: locales[Vue.config.lang].errors[res.data.error.code]
        // })
      })
    },
    // 获取设备端点值
    getDatapointValues (init) {
      if (init) {
        this.datapointValueArr = []
      }
      if (!this.selectedDevice.is_online) return
      this.refreshing = true
      api.device.getDatapointValues(this.selectedDeviceId, { act: 'logs' }).then((res) => {
        window.setTimeout(() => {
          this.refreshing = false
        }, 500)
        if (res.status === 202) {
          console.log('设备离线！')
        } else {
          this.datapointValueArr = res.data.datapoint
        }
      }).catch((res) => {
        this.refreshing = false
        this.handleError(res)
        // this.showNotice({
        //   type: 'error',
        //   content: locales[Vue.config.lang].errors[res.data.error.code]
        // })
      })
    },

    /**
     * 解析数据
     * @param  {[type]}  data socket返回的数据
     * @return {Boolean}      [description]
     */
    analysis (data) {
      // 判断是不是当前的设备
      if (this.selectedDeviceId === data.id) {
        let log = JSON.parse(data.log)
        if (log && log.state) {
          if (log.state === 'disconnect') {
            this.devices.forEach((item, index) => {
              if (item.id === this.selectedDeviceId) {
                item.is_online = false
                this.devices.$set(index, item)
              }
            })
          }
        }
        if (log.msg && log.msg.device && log.msg.device.datapoint) {
          log.msg.device.datapoint.map((item) => {
            // this.datapointValues[item.index] = item.value
            this.datapointValueArr.forEach((point, index) => {
              if (point.index === item.index) {
                this.datapointValueArr.$set(index, item)
              }
            })
          })
        }
      }
    },
    /**
     * 数据端点编辑 提交表单
     */
    setDataEvent (dp) {
      this.datapointValueArr.forEach((item, index) => {
        if (item.index === dp.index) {
          item.value = dp.value
          item[item.index] = dp.value
          this.datapointValueArr.$set(index, item)
        }
      })
      if (this.refreshing) return
      // if (isNaN(dp.value)) return
      var params = {
        datapoint: [
          {
            index: dp.index,
            value: dp.value || 0
          }
        ]
      }
      // if (this.editModal3.show === true) {
      //   params.datapoint[0].value = String(params.datapoint[0].value)
      // }
      this.refreshing = true
      api.diagnosis.setDeviceAttribute(this.selectedDevice.id, params).then((res) => {
        if (res.status === 200) {
          this.refreshing = false
          this.getDatapointValues()
          // this.getDatapoints()
        }
      }).catch((res) => {
        this.refreshing = false
        this.getDatapointValues()
        this.handleError(res)
      })
    },
    /**
     * range抛出的事件  value改变
     * @param {[type]}  val            [description]
     * @param {[type]}  params         [description]
     * @param {Boolean} isUserBehavior 是否是用户行为
     */
    setRangeValue (val, params, isUserBehavior) {
      if (params.expand.value !== val && isUserBehavior) {
        params.expand.value = val
        this.setDataEvent(params.expand)
      }
    },

    /**
     * 计算当前类型
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    dataPointType (type) {
      var result = ''
      switch (type) {
        case 1:
          result = 'boolean'
          break
        case 2:
        case 3:
        case 4:
          result = 'number'
          break
        case 6:
        case 7:
          result = 'string'
          break
        case 8:
        case 9:
          result = 'number'
          break
        default:
      }
      return result
    },

    // 收集日志信息并格式化输出
    outputLog (msg, type) {
      this.logs.unshift({
        time: dateFormat('hh:mm:ss.SSS', new Date()),
        msg: msg,
        type: type
      })
    },
    /**
     * 获取设备列表
     * @return {[type]} [description]
     */
    getDevices () {
      this.loadingData = true
      api.device.getList(this.$route.params.id, this.queryCondition).then((res) => {
        this.devices = res.data.list
        // this.selectedDevice = this.devices[0] || {}
        this.selectedDeviceId = this.devices[0] && this.devices[0].id
        this.total = res.data.count
        this.loadingData = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    /**
     * 表单提交-添加设备逻辑
     * @return {[type]} [description]
     */
    onAddSubmit () {
      if (!this.adding) {
        this.adding = true
        api.device.add(this.$route.params.id, this.addModel).then((res) => {
          if (res.status === 200) {
            this.resetAdd()
            this.getDevices()
          }
        }).catch((res) => {
          this.handleError(res)
          this.adding = false
        })
      }
    },
    // 搜索
    handleSearch () {
      if (this.query.length === 0) {
        this.getDevices()
      }
    },
    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    },

    // 取消搜索
    cancelSearching () {
      this.getDevices()
    },
    // 关闭添加浮层并净化添加表单
    resetAdd () {
      this.adding = false
      this.showAddModal = false
      this.addModel.mac = ''
    },
    /**
     * 取消按钮
     * @return {[type]} [description]
     */
    onAddCancel () {
      this.resetAdd()
    },
    /**
     * 显示添加设备浮层
     * @return {[type]} [description]
     */
    onShowAddModal () {
      this.showAddModal = true
    },

    /**
     * range不可用时候用户点击回调
     * @return {[type]} [description]
     */
    onDisable () {
      if (this.selectedDevice.is_online) {
        this.showNotice({
          type: 'error',
          content: '当前数据端点不可控！'
        })
      } else {
        this.showNotice({
          type: 'error',
          content: '设备不在线！'
        })
      }
    }
  }
}
</script>
<style lang="stylus">
  @import '../../../assets/stylus/common'

  .refresh-box
    position absolute
    right 0
    top 0
    .btn .fa
      /*height 100%*/
      font-size 14px
      line-height 26px
      color #383838
      margin-right 5px
  .device-debug
  .virtual-devices
    .clear-btn
      text-align center
      height 20px
      line-height 20px
      background #fafafa
      border-top 1px solid #e5e5e5
      cursor pointer
    .fa
      &.fa-angle-double
        font-size 16px
        position relative
        top 1px
        margin-right 5px
      &.success
      &.fail
        width 10px
        height 10px
        border-radius 50px
      &.success
        background green
      &.fail
        background #aaa
    .container
      /*color #b5b5b5*/
      border-top 1px solid #ddd
      position relative
      box-sizing border-box
      &.padding
        padding-left 230px
      .device-list-box
        width 230px
        height 100%
        border-right 1px solid #ddd
        min-height 600px
        padding-left 10px
        box-sizing border-box
        position absolute
        left 0
        top 0
        .header-box
          padding-left 10px
          padding-bottom 10px
          .button-group
            margin-top 5px
            line-height 35px
            .add-devices
              width 191px
          .search-box
            width 100%
            .search-box-input
              width 158px
        .body-box
          width 100%
          .devices-box
            width 100%
            min-height 400px
            .device
              width 100%
              height 50px
              position relative
              border-bottom 1px solid #ddd
              &:first-child
                border-top 1px solid #ddd
              &.selected
                background #f8f8f8
                &:before
                  content ""
                  display block
                  width 15px
                  height 15px
                  background #f8f8f8
                  transform rotate(45deg) translate(-10px, 0)
                  border-right 1px solid #ddd
                  border-top 1px solid #ddd
                  position absolute
                  top 50%
                  left 100%
              .status
                width 25px
                height 100%
                position absolute
                left 0
                top 0
                .fa
                  position absolute
                  left 13px
                  top 12px
              .device-msg-box
                width 100%
                padding-left 35px
                box-sizing border-box
                padding-top 8px
                overflow hidden
                .mac
                  span
                    text-overflow ellipsis
                    overflow hidden
                    display inline-block
                    max-width 110px
          .no-devices
            height 400px
            padding-top 20px
            text-align center
          .pager-box
            width 100%
            padding-right 10px
            box-sizing border-box
      .panel-bd
        min-height 500px
    .device-details-box
      padding 10px
      box-sizing border-box
      .value-td
        height 50px
    .log-panel
      margin-left 30px
      border 1px solid #E5E5E5

      .log-panel-hd
        background #F5F5F5
        border-bottom 1px solid #E5E5E5
        padding 5px 10px

        .actions
          float right
          margin-top 2px

        h2
          margin 0
          font-size 12px
          font-weight normal
          line-height 26px
    .output-log
      display block
      height 360px
      overflow auto
      font-size 12px

      .log
        margin 10px 0
        padding 0 10px

      .time
        margin-right 10px
        color #999

      .user
        color orange

      .msg
        color #333

      .msg-error
        color red

      .msg-success
        color green

  .product-title
    font-size 20px !important
    font-weight normal
  .filter-device-info
    font-size 10px
    color #999999
    text-align center
    span
      max-width 135px
      overflow hidden
      text-overflow ellipsis
      display inline-block
</style>
