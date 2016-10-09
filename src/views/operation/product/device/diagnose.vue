<template>
  <div class="panel">
    <div class="panel-bd row">
      <div class="col-16">
        <!-- Start: 数据端点-->
        <div class="data-table">
          <div class="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <button :disabled="!device.is_online || refreshing" :class="{'disabled':!device.is_online || refreshing}" @click="getDatapointValues" class="btn btn-ghost btn-sm"><i :class="{'fa-spin':refreshing}" class="fa fa-refresh"></i></button>
              </div>
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @search-activate="searching=!searching" @search-deactivate="searching=!searching"></search-box>
              </div>
            </div>
            <h3>{{ $t('ui.device.datapoint') }}</h3>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th class="wp5">{{ $t('ui.datapoint.fields.index') }}</th>
                <th class="wp20">{{ $t('ui.datapoint.fields.name') }}</th>
                <th class="wp25">{{ $t('ui.datapoint.fields.description') }}</th>
                <th>{{ $t('ui.device.current_value') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="datapoint in datapointList | orderBy 'index'">
                <td>{{ datapoint.index }}</td>
                <td>{{ datapoint.name }}</td>
                <td>{{ datapoint.description }}</td>
                <td>
                  <div class="control-box">
                    <div class="radio-group" v-if="dataPointType(datapoint.type) === 'boolean'">
                      <label class="radio">
                        <input type="radio" :name="'datapoint' + $index" :value="true" v-model="datapoint.value" @change="setDataEvent(datapoint)">
                        <span>true</span>
                      </label>
                      <label class="radio ml15">
                        <input type="radio" :name="'datapoint' + $index" :value="false" v-model="datapoint.value" @change="setDataEvent(datapoint)">
                        <span>false</span>
                      </label>
                    </div>
                    <div class="range-box" v-if="dataPointType(datapoint.type) === 'number'">
                      <range :min="datapoint.min" :max="datapoint.max" :value="datapoint.value" :expand="datapoint" @changed="onRangeChanged"></range>
                    </div>
                    <div class="string-box" v-if="dataPointType(datapoint.type) === 'string'">
                      <div class="input-text-wrap">
                        <input type="text" class="input-text input-text-sm" v-model="datapoint.value" @change="setDataEvent(datapoint)">
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr v-if="datapointList.length === 0">
                <td colspan="4" class="tac">
                  <i v-if="$loadingRouteData" class="fa fa-refresh fa-spin"></i>
                  <div v-else class="tips-null">{{ $t('ui.device.no_datapoint') }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- End: 数据端点-->
      </div>
      <div class="col-8">
        <!-- Start: 设备日志-->
        <div class="log-panel">
          <div class="log-panel-hd">
            <div class="actions">
              <switch :value.sync="showLog" @switch-toggle="toggleLog" size="small"></switch>
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
              <div><a class="logend" name="logend" href="#logend">&nbsp</a></div>
            </code>
          </div>
        </div>
        <!-- End: 设备日志-->
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
// import v-form from 'vue'
import api from 'api'
import Switch from 'components/Switch'
import io from 'socket.io-client'
import formatDate from 'filters/format-date'
import { globalMixins } from 'src/mixins'
import locales from 'consts/locales/index'
import Range from 'components/Range1'
import Select from 'components/Select'
import SearchBox from 'components/SearchBox'
import _ from 'lodash'

var socket = null

export default {
  name: 'DeviceDetails',

  mixins: [globalMixins],

  components: {
    'x-select': Select,
    Switch,
    Range,
    SearchBox
  },

  data () {
    return {
      query: '',
      searching: false,
      settingData: false,
      device: {},
      datapoints: [],
      showLog: true,
      deviceToken: '',
      datapointValues: {},
      logs: [
        // { time: formatDate(new Date(), 'hh:mm:ss.SSS', true), msg: 'Welcome to xlink', type: 'connected' },
        // { time: formatDate(new Date(), 'hh:mm:ss.SSS', true), msg: 'Welcome to xlink', type: 'disconnected' },
        // { time: formatDate(new Date(), 'hh:mm:ss.SSS', true), msg: [200, 'Welcome to xlink'], type: 'user' }
      ],
      token: '',
      refreshing: false
    }
  },

  computed: {
    datapointList () {
      let result = []
      this.datapoints.forEach((item) => {
        let dp = _.cloneDeep(item)
        if (this.datapointValues.hasOwnProperty(item.index)) {
          dp.value = this.datapointValues[item.index]
        }
        result.push(dp)
      })
      if (this.query.length) {
        result = result.filter((item) => {
          let reg = new RegExp(this.query, 'ig')
          return reg.test(item.name)
        })
      }

      return _.orderBy(result, ['index'], ['asc'])
    }
  },

  route: {
    data () {
      this.getDatapointValues()
      this.getDeviceInfo()
      this.getDatapoints()
    },

    activate () {
      if (this.showLog) {
        this.connect()
      }
    },

    deactivate () {
      if (socket) {
        socket.disconnect()
        socket = null
      }
    }
  },

  methods: {
    dpVal (dp) {
      var result
      switch (dp.type) {
        case 1:
          result = this.datapointValues[dp.index] ? 'true' : 'false'
          break
        case 2:
        case 3:
        case 4:
          result = this.datapointValues[dp.index]
          break
        default:
          result = this.datapointValues[dp.index] || '--'
      }
      return result
    },

    // 获取设备信息
    getDeviceInfo () {
      api.device.getInfo(this.$route.params.product_id, this.$route.params.device_id).then((res) => {
        if (res.status === 200) {
          this.device = res.data
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    // 获取设备端点列表
    getDatapoints () {
      api.product.getDatapoints(this.$route.params.product_id).then((res) => {
        if (res.status === 200) {
          this.datapoints = res.data
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    // 获取设备端点值
    getDatapointValues () {
      this.refreshing = true
      api.device.getDatapointValues(this.$route.params.device_id, { act: 'logs' }).then((res) => {
        window.setTimeout(() => {
          this.refreshing = false
        }, 500)
        if (res.status === 202) {
          console.log('设备离线！')
        } else {
          var datapointsObj = {}
          res.data.datapoint.map(function (item) {
            datapointsObj[item.index] = item.value
          })
          this.datapointValues = datapointsObj
        }
      }).catch((res) => {
        this.refreshing = false
        this.showNotice({
          type: 'error',
          content: locales[Vue.config.lang].errors[res.data.error.code]
        })
      })
    },

    // 连接
    connect () {
      api.diagnosis.getDeviceToken(this.$route.params.device_id).then((res) => {
        var addr = res.data.addr
        if (window.location.protocol === 'https:') {
          addr = addr.replace(/:\d+$/, ':443')
          console.log(addr)
        }
        this.token = res.data.token
        // 使用https协议
        // socket = io.connect(window.location.protocol + '//' + addr, {'force new connection': true, secure: true})
        // 使用http协议
        socket = io.connect('http://' + res.data.addr, {'force new connection': true})

        // 连接 socket
        socket.on('connect', () => {
          this.outputLog('Client has connected to the server!', 'connected')
          window.setTimeout(() => {
            socket.emit('trace.logs', {id: this.$route.params.device_id, token: this.token})
          }, 100)
        })

        // 断开 socket 连接
        socket.on('disconnect', () => {
          this.outputLog('The client has disconnected!', 'disconnected')
        })

        // 输入日志
        socket.on('trace.log', (data) => {
          this.outputLog([data.id, data.log], 'user')
        })

        // 输出状态
        socket.on('trace.status', (data) => {
          this.outputLog([data.status, data.msg], 'status')
        })
      }).catch((res) => {
        // this.handleError(res)
        this.showNotice({
          type: 'error',
          content: locales[Vue.config.lang].errors[res.data.error.code]
        })
      })
    },

    // 收集日志信息并格式化输出
    outputLog (msg, type) {
      let log = document.querySelector('.output-log')
      let isMoved = false
      if (log && log.scrollTop >= 0) {
        if (log.scrollHeight - (log.scrollTop + log.clientHeight) < 100) {
          isMoved = true
        }
      }
      this.logs.push({
        time: formatDate(new Date(), 'hh:mm:ss.SSS', true),
        msg: msg,
        type: type
      })
      if (isMoved) {
        setTimeout(() => {
          let logend = document.querySelector('.logend')
          if (logend) {
            logend.scrollIntoView()
          }
        }, 100)
      }
    },

    // 切换日志显示
    toggleLog () {
      if (this.showLog) {
        this.connect()
      } else {
        if (socket) {
          socket.disconnect()
          socket = null
        }
        this.logs = []
      }
    },

    /**
     * 验证是否为数字
     * @param  {[type]}  value [description]
     * @return {Boolean}       [description]
     */
    isNumber (value) {
      if (value - 0 === value) {
        return true
      } else {
        return false
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
        case 6:
          result = 'string'
          break
        default:
          result = 'number'
      }
      return result
    },

    /**
     * 处理 Range 改变
     * @author shengzhi
     * @param  {Number} val    值
     * @param  {Object} params 参数
     */
    onRangeChanged (val, params) {
      let dp = params.expand
      dp.value = val
      this.setDataEvent(dp)
    },

    /**
     * 数据端点编辑 提交表单
     */
    setDataEvent (dp) {
      if (this.refreshing) return
      var params = {
        datapoint: [
          {
            index: dp.index,
            value: dp.value
          }
        ]
      }
      // if (this.editModal3.show === true) {
      //   params.datapoint[0].value = String(params.datapoint[0].value)
      // }
      // this.settingData = true
      api.diagnosis.setDeviceAttribute(this.$route.params.device_id, params).then((res) => {
        if (res.status === 200) {
          this.getDatapointValues()
          // this.getDatapoints()
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus">
@import '../../../../assets/stylus/common'

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

  /*.log-panel-bd*/

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
.device-details
  .editModal1
    .content-box
      padding-bottom 30px
      .content-value
        padding-bottom 10px
        .deviceParams
          height 30px
          font-size 14px
  .editModal2
  .editModal3
    .content-box
      .content-value
        padding-bottom 10px
        .paramsValue
          height 32px
          width 100%
          line-height 32px
          background none
          border 1px solid default-border-color
          box-sizing border-box
          font-size 14px
          padding 0 15px
  /*.control-box
    .radio-box
      height 26px
      overflow hidden
      label
        display inline-block
        line-height 26px
        margin-right 10px
        input[type="radio"]
          position relative
          top 2px*/

</style>
