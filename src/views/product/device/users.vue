<template>
  <div>
    <div class="row">
      <div class="col-24">
        <div class="panel">
          <div class="panel-bd row">
            <div class="col-18">
              <ul class="device-details">
                <li>
                  <div class="label">用户ID:</div>
                  <div class="info">{{ '100009728' }}</div>
                </li>
                <li>
                  <div class="label">帐号:</div>
                  <div class="info">{{ 'sam.xlu@gmail.com' }}</div>
                </li>
                <li>
                  <div class="label">昵称:</div>
                  <div class="info">{{ '未激活' }}</div>
                </li>
                <li>
                  <div class="label">手机号码:</div>
                  <div class="info">{{ '13085776747' }}</div>
                </li>
                <li>
                  <div class="label">创建时间:</div>
                  <div class="info"><span>{{ '2016-06-06 12:00:00' }}</span></div>
                </li>
                <li>
                  <div class="label">激活时间:</div>
                  <div class="info"><span>{{ '2016-06-05 08:00:00' }}</span></div>
                </li>
                <li>
                  <div class="label">激活状态:</div>
                  <div class="info"><span>{{ '未激活' }}</span></div>
                </li>
                <li>
                  <div class="label">所在区域ID:</div>
                  <div class="info"><span>{{ '0' }}</span></div>
                </li>
              </ul>
            </div>
            <div class="col-6 device-map with-loading">
              <div class="icon-loading" v-show="false">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
              <div id="device-map" class="mt20" style="height: 192px"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  // import v-form from 'vue'
  import api from 'api'
  import * as config from 'consts/config'
  import Switch from 'components/Switch'
  import io from 'socket.io-client'
  import dateFormat from 'date-format'
  import { globalMixins } from 'src/mixins'
  import locales from 'consts/locales/index'
  import Modal from 'components/Modal'
  import Select from 'components/Select'

  var socket = null

  export default {
    name: 'DeviceDetails',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'switch': Switch,
      'v-select': Select,
      'modal': Modal
    },

    data () {
      return {
        map: {},
        mapCenter: [],
        marker: {},
        editModal1: {
          show: false,
          name: '布尔',
          value: false,
          type: 1
        },
        editModal2: {
          show: false,
          name: '数字',
          value: 0,
          type: 2
        },
        validation2: {},
        editModal3: {
          show: false,
          name: '字符串',
          value: '0',
          type: 6
        },
        settingData: false,
        device: {},
        datapoints: [],
        showLog: true,
        deviceToken: '',
        datapointValues: {},
        logs: [
          // { time: dateFormat('hh:mm:ss.SSS', new Date()), msg: 'Welcome to xlink', type: 'connected' },
          // { time: dateFormat('hh:mm:ss.SSS', new Date()), msg: 'Welcome to xlink', type: 'disconnected' },
          // { time: dateFormat('hh:mm:ss.SSS', new Date()), msg: [200, 'Welcome to xlink'], type: 'user' }
        ],
        token: '',
        refreshing: false
      }
    },

    route: {
      data () {
        // this.getDatapointValues()
        // this.getDeviceInfo()
        // this.getDatapoints()
      },

      activate () {
        // if (this.showLog) {
        //   this.connect()
        // }
      },

      deactivate () {
        // if (socket) {
        //   socket.disconnect()
        //   socket = null
        // }
      }
    },

    ready () {
      // 将回调绑定在全局供高德地图加载后调用
      // window.init = this.initMap
      if (typeof window.AMap === 'undefined') {
        var mapApi = document.createElement('script')
        // alert(`http://webapi.amap.com/maps?v=1.3&key=${config.AMAP_KEY}&callback=init`)
        mapApi.src = `http://webapi.amap.com/maps?v=1.3&key=${config.AMAP_KEY}&callback=init`
        document.getElementsByTagName('body')[0].appendChild(mapApi)
        // this.initMap()
      } else {
        // this.initMap()
      }
      setTimeout(() => {
        this.initMap()
      }, 500)
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

      /**
       * 地图初始化
       */
      initMap () {
        // 地图初始化
        this.map = new AMap.Map('device-map', {
          resizeEnable: true,
          zoom: 15
        })
        this.map.setCenter(this.mapCenter)

        this.marker = new AMap.Marker({
          map: this.map,
          position: this.mapCenter,
          icon: 'static/images/marker.png',
          offset: {x: -11, y: -28}
        })
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
          this.refreshing = false
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
          this.token = res.data.token
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
        this.logs.push({
          time: dateFormat('hh:mm:ss.SSS', new Date()),
          msg: msg,
          type: type
        })
      },

      // 切换日志显示
      toggleLog () {
        if (!this.showLog) {
          this.connect()
        } else {
          if (socket) {
            socket.disconnect()
            socket = null
          }
        }
      },

      /**
       * 编辑数据端点
       * @param  {[type]} dataPoint [description]
       * @return {[type]}           [description]
       */
      showEditDataPointModal (dataPoint) {
        var self = this
        switch (dataPoint.type) {
          // 布尔
          case 1:
            self.editModal1.name = dataPoint.name
            self.editModal1.value = Boolean(self.datapointValues[dataPoint.index] && self.datapointValues[dataPoint.index].value)
            self.editModal1.type = dataPoint.type
            self.editModal1.index = dataPoint.index
            self.editModal1.show = true
            break
          // 数字
          case 2:
          case 3:
          case 4:
          case 5:
            self.editModal2.name = dataPoint.name
            self.editModal2.value = Number(self.datapointValues[dataPoint.index] && self.datapointValues[dataPoint.index].value) || null
            self.editModal2.type = dataPoint.type
            self.editModal2.index = dataPoint.index
            self.editModal2.show = true
            break
          // 字符串
          case 6:
            self.editModal3.name = dataPoint.name
            self.editModal3.value = self.datapointValues[dataPoint.index] && self.datapointValues[dataPoint.index].value || ''
            self.editModal3.type = dataPoint.type
            self.editModal3.index = dataPoint.index
            self.editModal3.show = true
            break
          default:
            console.log('出错')
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
       * 关闭编辑浮层
       * @return {[type]} [description]
       */
      closeEditModal () {
        this.editModal1.show = false
        this.editModal2.show = false
        this.editModal3.show = false
        this.settingData = false
      },
      /**
       * 数据端点编辑 提交表单
       */
      setDataEvent (editModal) {
        if (this.editModal2.show === false || this.validation2.$valid) {
          var params = {
            datapoint: [
              {
                index: editModal.index,
                value: editModal.value
              }
            ]
          }
          if (this.editModal3.show === true) {
            params.datapoint[0].value = String(params.datapoint[0].value)
          }
          this.settingData = true
          api.diagnosis.setDeviceAttribute(this.$route.params.device_id, params).then((res) => {
            this.closeEditModal()
            if (res.status === 200) {
              this.getDatapointValues()
              this.getDatapoints()
            }
          }).catch((res) => {
            this.closeEditModal()
            this.handleError(res)
          })
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../assets/stylus/common'

  ul.device-details
    margin 20px 0

    li
      list-style none
      line-height 32px

      .label
        display inline-block
        width 103px

      .info
        display inline-block

  .output-log
    display block
    height 360px
    overflow auto
    font-size 12px

    .log
      margin 10px 0

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
</style>
