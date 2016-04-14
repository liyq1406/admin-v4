<template>
  <section class="main-wrap">
    <div class="main">
      <div class="breadcrumb"><a v-link="{path: '/products/' + $route.params.product_id + '/devices' }"><i class="fa fa-arrow-circle-left"></i>{{ $t('device.management') }}</a></div>
      <div class="row">
        <div class="col-20">
          <div class="panel">
            <div class="panel-hd">
              <h2>{{ $t('device.details') }}</h2>
            </div>
            <div class="panel-bd">
              <ul class="device-details">
                <li v-if="device.name">
                  <div class="label">设备名称:</div>
                  <div class="info">{{ device.name }}</div>
                </li>
                <li>
                  <div class="label">ID:</div>
                  <div class="info">{{ device.id }}</div>
                </li>
                <li>
                  <div class="label">MAC:</div>
                  <div class="info">{{ device.mac }}</div>
                </li>
                <li>
                  <div class="label">{{ $t('device.is_active') }}:</div>
                  <div class="info">{{ device.is_active ? $t('device.active') : $t('device.not_active') }}</div>
                </li>
                <li>
                  <div class="label">{{ $t('device.active_date') }}:</div>
                  <div class="info">{{ device.active_date | formatDate }}</div>
                </li>
                <li>
                  <div class="label">{{ $t('device.is_online') }}:</div>
                  <div class="info"><span v-if="device.is_online" class="hl-green">{{ $t('common.online') }}</span><span v-else="v-else" class="hl-red">{{ $t('common.offline') }}</span></div>
                </li>
                <li>
                  <div class="label">{{ $t('device.firmware_version') }}:</div>
                  <div class="info"><span>{{ device.firmware_version }}</span></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-13">
          <!-- Start: 数据端点-->
          <div class="panel">
            <div class="panel-hd">
              <div class="actions">
                <button :disabled="!device.is_online || refreshing" :class="{'disabled':!device.is_online || refreshing}" @click="getDatapointValues" class="btn btn-success">{{ $t('common.refresh') }}<i :class="{'fa-spin':refreshing}" class="fa fa-refresh"></i></button>
              </div>
              <h2>{{ $t('device.datapoint') }}</h2>
            </div>
            <div class="panel-bd">
              <table class="table">
                <thead>
                  <tr>
                    <th>{{ $t('datapoint.fields.index') }}</th>
                    <th>{{ $t('datapoint.fields.name') }}</th>
                    <th>{{ $t('datapoint.fields.description') }}</th>
                    <th>{{ $t('device.current_value') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="datapoint in datapoints | orderBy 'index'">
                    <td>{{ datapoint.index }}</td>
                    <td>{{ datapoint.name }}</td>
                    <td>{{ datapoint.description }}</td>
                    <td>{{ datapointValues[$index] ? datapointValues[$index].value : '' }}</td>
                  </tr>
                  <tr v-if="datapoints.length === 0">
                    <td colspan="4" class="tac"><i v-if="$loadingRouteData" class="fa fa-refresh fa-spin"></i>
                      <div v-else="v-else" class="tips-null">{{ $t('device.no_datapoint') }}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- End: 数据端点-->
        </div>
        <div class="col-7">
          <!-- Start: 设备日志-->
          <div class="panel">
            <div class="panel-hd">
              <div class="actions">
                <switch :value.sync="showLog" @switch-toggle="toggleLog"></switch>
              </div>
              <h2>{{ $t('device.log') }}</h2>
            </div>
            <div class="panel-bd">
              <pre class="output-log">
                <div v-for="log in logs" class="log"><span class="time">{{ log.time }}</span>
                  <template v-if="log.type === 'user'"><span class="user">{{ log.msg[0] }}</span><span class="msg">: {{ log.msg[1] }}</span></template>
                  <template v-if="log.type === 'status'"><span :class="{'msg-success':log.msg[0]===200, 'msg-error':log.msg[0]!==200}">{{ log.msg[0] }}</span><span class="msg">: {{ log.msg[1] }}</span></template>
                  <template v-if="log.type === 'connected'"><span class="msg-success">{{ log.msg }}</span></template>
                  <template v-if="log.type === 'disconnected'"><span class="msg-error">{{ log.msg }}</span></template>
                </div></pre>
            </div>
          </div>
          <!-- End: 设备日志-->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Vue from 'vue'
  import api from '../../../api'
  import Switch from '../../../components/Switch'
  import io from 'socket.io-client'
  import dateFormat from 'date-format'
  import { globalMixins } from '../../../mixins'
  import locales from '../../../consts/locales/index'

  var socket = null

  export default {
    name: 'DeviceDetails',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'switch': Switch
    },

    data () {
      return {
        device: {},
        datapoints: [],
        showLog: true,
        deviceToken: '',
        datapointValues: [],
        logs: [],
        token: '',
        refreshing: false
      }
    },

    route: {
      data () {
        this.getDatapointValues()
        this.getDeviceInfo()
        this.getDatapoints()

        /* window.alert(111)
        //百度地图API功能
      	function loadJScript () {
          window.alert("load js")
          var script = document.createElement("script")

      		script.type = "text/javascript"
      		script.src = "http://api.map.baidu.com/api?v=2.0&ak=iqGzDSunIlUeEK1H8rkRfptH&callback=init"
      		document.body.appendChild(script)
      	}
      	window.init = () => {
          window.alert("init")
      		var map = new BMap.Map("diviceMap")            // 创建Map实例
      		var point = new BMap.Point(116.404, 39.915) // 创建点坐标
      		map.centerAndZoom(point,15)
      		map.enableScrollWheelZoom()                 //启用滚轮放大缩小
      	}
      	// document.getElementById('diviceMap').addEventListener('load', loadJScript)  //异步加载地图

        // document.addEventListener('load', loadJScript)
        document.addEventListener('load', (e) => {
          window.alert(1223323)
          // body...
        })
        // window.onload=loadJScript
        window.alert(222)*/
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

    ready () {
      /*
      //百度地图API功能
      function loadJScript () {
        var script = document.createElement("script")
        script.type = "text/javascript"
        script.src = "http://api.map.baidu.com/api?v=2.0&ak=iqGzDSunIlUeEK1H8rkRfptH&callback=init"
        document.body.appendChild(script)
      }
      window.init = () => {
        var map = new BMap.Map("diviceMap")            // 创建Map实例
        var point = new BMap.Point(116.404, 39.915) // 创建点坐标
        map.centerAndZoom(point,15)
        map.enableScrollWheelZoom()                 //启用滚轮放大缩小
      }
      // document.getElementById('diviceMap').addEventListener('load', loadJScript)  //异步加载地图

      // document.addEventListener('load', loadJScript)
      // document.addEventListener('load', (e) => {
        // window.alert(1223323)
        // body...
      // })
      window.onload=loadJScript
      */
    },

    methods: {
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
            this.datapointValues = res.data.datapoint
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
        api.device.getDeviceToken(this.$route.params.device_id).then((res) => {
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
    height 360px
    overflow auto

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
</style>
