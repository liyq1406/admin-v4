<template>
  <section class="main-wrap">
    <div class="main device-details">
      <div class="breadcrumb"><a v-link="{path: '/products/' + $route.params.product_id + '/devices' }"><i class="fa fa-arrow-circle-left"></i>{{ $t('ui.device.management') }}</a></div>
      <div class="row">
        <div class="col-24">
          <div class="panel">
            <div class="panel-hd">
              <h2>{{ $t('ui.device.details') }}</h2>
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
                  <div class="label">{{ $t('ui.device.is_active') }}:</div>
                  <div class="info">{{ device.is_active ? $t('ui.device.active') : $t('ui.device.not_active') }}</div>
                </li>
                <li>
                  <div class="label">{{ $t('ui.device.active_date') }}:</div>
                  <div class="info">{{ device.active_date | formatDate }}</div>
                </li>
                <li>
                  <div class="label">{{ $t('ui.device.is_online') }}:</div>
                  <div class="info"><span v-if="device.is_online" class="hl-green">{{ $t('common.online') }}</span><span v-else class="hl-red">{{ $t('common.offline') }}</span></div>
                </li>
                <li>
                  <div class="label">{{ $t('ui.device.firmware_version') }}:</div>
                  <div class="info"><span>{{ device.firmware_version }}</span></div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-16">
          <!-- Start: 数据端点-->
          <div class="panel">
            <div class="panel-hd">
              <div class="actions">
                <button :disabled="!device.is_online || refreshing" :class="{'disabled':!device.is_online || refreshing}" @click="getDatapointValues" class="btn btn-success">{{ $t('common.refresh') }}<i :class="{'fa-spin':refreshing}" class="fa fa-refresh"></i></button>
              </div>
              <h2>{{ $t('ui.device.datapoint') }}</h2>
            </div>
            <div class="panel-bd">
              <table class="table">
                <thead>
                  <tr>
                    <th>{{ $t('ui.datapoint.fields.index') }}</th>
                    <th>{{ $t('ui.datapoint.fields.name') }}</th>
                    <th>{{ $t('ui.datapoint.fields.description') }}</th>
                    <th>{{ $t('ui.device.current_value') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="datapoint in datapoints | orderBy 'index'">
                    <td>{{ datapoint.index }}</td>
                    <td>{{ datapoint.name }}</td>
                    <td>{{ datapoint.description }}</td>
                    <td>
                      <a @click="showEditDataPointModal(datapoint)">
                        {{ datapointValues[datapoint.index] ? datapointValues[datapoint.index].value : '--' }}
                      </a>
                    </td>
                  </tr>
                  <tr v-if="datapoints.length === 0">
                    <td colspan="4" class="tac"><i v-if="$loadingRouteData" class="fa fa-refresh fa-spin"></i>
                      <div v-else class="tips-null">{{ $t('ui.device.no_datapoint') }}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- End: 数据端点-->
        </div>
        <div class="col-8">
          <!-- Start: 设备日志-->
          <div class="panel">
            <div class="panel-hd">
              <div class="actions">
                <switch :value.sync="showLog" @switch-toggle="toggleLog"></switch>
              </div>
              <h2>{{ $t('ui.device.log') }}</h2>
            </div>
            <div class="panel-bd">
              <code class="output-log">
                <div v-for="log in logs" class="log"><span class="time">{{ log.time }}</span>
                  <template v-if="log.type === 'user'"><span class="user">{{ log.msg[0] }}</span><span class="msg">: {{ log.msg[1] }}</span></template>
                  <template v-if="log.type === 'status'"><span :class="{'msg-success':log.msg[0]===200, 'msg-error':log.msg[0]!==200}">{{ log.msg[0] }}</span><span class="msg">: {{ log.msg[1] }}</span></template>
                  <template v-if="log.type === 'connected'"><span class="msg-success">{{ log.msg }}</span></template>
                  <template v-if="log.type === 'disconnected'"><span class="msg-error">{{ log.msg }}</span></template>
                </div>
              </code>
            </div>
          </div>
          <!-- End: 设备日志-->
        </div>
      </div>
      <!-- 布尔值浮层 -->
      <modal :show.sync="editModal1.show" @close="editModal1.show = false" width="360px">
        <h3 slot="header">设置参数</h3>
        <div slot="body" class="form editModal editModal1">
          <form @submit.prevent="setDataEvent(editModal1)">
            <div class="content-box">
              <div class="content-value form-row row">
                <label class="form-control col-6">{{editModal1.name}}：</label>
                <div class="controls col-18">
                  <v-select :label="editModal1.value? 'true' : 'false'" placeholder="请选择" :size="'normal'">
                    <select name="deviceParams" v-model="editModal1.value" class="deviceParams">
                      <option :value="true">true</option>
                      <option :value="false">false</option>
                    </select>
                  </v-select>
                </div>
                <!-- <span class="name">{{editModal1.name}}：</span> -->
              </div>
            </div>
            <div class="form-actions">
              <button @click.prevent.stop="editModal1.show = false" class="btn btn-default">{{ $t("common.cancel") }}</button>
              <button type="submit" :disabled="settingData" :class="{'disabled':settingData}" v-text="settingData ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </div>
      </modal>
      <!-- 数字类型浮层 -->
      <modal :show.sync="editModal2.show" @close="editModal2.show = false" width="360px">
        <h3 slot="header">设置参数</h3>
        <div slot="body" class="form editModal editModal2">
          <form v-form name="validation2" @submit.prevent="setDataEvent(editModal2)">
            <div class="content-box">
              <div class="content-value form-row row">
                <label class="form-control col-6">{{editModal2.name}}：</label>
                <div class="controls col-18">
                  <input type="text" v-form-ctrl name="paramsValue" number custom-validator="isNumber" class="paramsValue" v-model="editModal2.value">
                </div>
              </div>
              <div v-show="validation2.paramsValue.$dirty" class="form-tips form-tips-error">
                <span v-show="validation2.paramsValue.$error.customValidator">{{editModal2.name}}必须是数字</span>
              </div>
            </div>
            <div class="form-actions">
              <button @click.prevent.stop="editModal2.show = false" class="btn btn-default">{{ $t("common.cancel") }}</button>
              <button type="submit" :disabled="settingData" :class="{'disabled':settingData}" v-text="settingData ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </div>
      </modal>
      <!-- 字符串 -->
      <modal :show.sync="editModal3.show" @close="editModal3.show = false" width="360px">
        <h3 slot="header">设置参数</h3>
        <div slot="body" class="form editModal editModal3">
          <form @submit.prevent="setDataEvent(editModal3)">
            <div class="content-box">
              <div class="content-value form-row row">
                <label class="form-control col-6">{{editModal3.name}}：</label>
                <div class="controls col-18">
                  <input type="text" number class="paramsValue" v-model="editModal3.value">
                </div>
              </div>
            </div>
            <div class="form-actions">
              <button @click.prevent.stop="editModal3.show = false" class="btn btn-default">{{ $t("common.cancel") }}</button>
              <button type="submit" :disabled="settingData" :class="{'disabled':settingData}" v-text="settingData ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
            </div>
          </form>
        </div>
      </modal>
    </div>
  </section>
</template>

<script>
  import Vue from 'vue'
  // import v-form from 'vue'
  import api from '../../../api'
  import Switch from '../../../components/Switch'
  import io from 'socket.io-client'
  import dateFormat from 'date-format'
  import { globalMixins } from '../../../mixins'
  import locales from '../../../consts/locales/index'
  import Modal from '../../../components/Modal'
  import Select from '../../../components/Select'

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
        datapointValues: [],
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
        this.getDatapointValues()
        this.getDeviceInfo()
        this.getDatapoints()

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
        document.addEventListener('load', (e) => {
          // body...
        })
        // window.onload=loadJScript
        */
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
            console.log(res.data)
            // 数据端点type https://github.com/xlink-corp/xlink-sdk/blob/master/%E7%89%A9%E8%81%94%E5%B9%B3%E5%8F%B0%E7%AE%A1%E7%90%86%E6%8E%A5%E5%8F%A3%E6%96%87%E6%A1%A3/%E4%BA%A7%E5%93%81%E4%B8%8E%E8%AE%BE%E5%A4%87%E7%AE%A1%E7%90%86%E6%8E%A5%E5%8F%A3.md
            // 1	布尔类型
            // 2	单字节
            // 3	16位短整型
            // 4	32位整型
            // 3	浮点
            // 4	字符串
            // res.data.map((item) => {
            //   item.value = '--'
            // })
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
          console.log(res)
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
        console.log(dataPoint)
        console.log(dataPoint.type)
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
            border 1px solid #d9d9d9
            box-sizing border-box
            font-size 14px
            padding 0 15px
</style>
