<template>
  <div class="panel basic-info">
    <div class="panel-hd">
      <h2 class="title">设备MAC：{{$route.params.mac || $route.params.device_id}}</h2>
      <div class="other-control-button-box">
        <button @click="updateDevicesInfo" class="other-control-button btn btn-success">获取设备信息</button>
        <button @click="showEditModal5" class="other-control-button btn btn-success" :class="{'disabled': !deviceOnline}" :disabled="!deviceOnline">设置控制器时间</button>
      </div>
    </div>
    <div class="panel-bd">
      <table class="table table-stripe table-bordered">
        <tbody>
          <tr>
            <td><span>运行模式：</span><a class="button" @click="showEditModalEvent('test')">自动模式</a></td>
            <td><span>工作时间段一：</span><a class="button" @click="showEditModalEvent('test')">00:00-00:00</a></td>
            <td><span>工作时间段二：</span><a class="button" @click="showEditModalEvent('test')">00:00-00:00</a></td>
            <td><span>工作时间段三：</span><a class="button" @click="showEditModalEvent('test')">00:00-00:00</a></td>
          </tr>
          <tr>
            <td><span>{{deviceInfos.S11.name}}：</span><a class="button" @click="showEditModalEvent('S11')">{{deviceInfos.S11.valueText}}{{deviceInfos.S11.unit}}</a></td>
            <td><span>下限温度：</span><a class="button" @click="showEditModalEvent('test')">45.0℃</a></td>
            <td><span>最高设定温度：</span><a class="button" @click="showEditModalEvent('test')">70.0℃</a></td>
            <td><span>最低设定温度：</span><a class="button" @click="showEditModalEvent('test')">10.0℃</a></td>
          </tr>
          <tr>
            <td colspan="4">&nbsp;</td>
          </tr>
          <tr>
            <td><span>水温探头修正：</span><a class="button" @click="showEditModalEvent('test')">0.0℃</a></td>
            <td><span>压缩机启动延时：</span><a class="button" @click="showEditModalEvent('test')">3.0分钟</a></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td colspan="4">&nbsp;</td>
          </tr>
          <tr>
            <td><span>化霜启动温度：</span><a class="button" @click="showEditModalEvent('test')">-3℃</a></td>
            <td><span>下化霜结束温度：</span><a class="button" @click="showEditModalEvent('test')">10.0℃</a></td>
            <td><span>工作时间段二：</span><a class="button" @click="showEditModalEvent('test')">00:00-00:00</a></td>
            <td><span>工作时间段三：</span><a class="button" @click="showEditModalEvent('test')">00:00-00:00</a></td>
          </tr>
          <tr>
            <td><span>化霜四通阀模式：</span><a class="button" @click="showEditModalEvent('test')">0</a></td>
            <td><span>风机模式：</span><a class="button" @click="showEditModalEvent('test')">1</a></td>
            <td><span>风机关联的环境温度：</span><a class="button" @click="showEditModalEvent('test')">℃</a></td>
            <td><span>风机关联的排期温度：</span><a class="button" @click="showEditModalEvent('test')">℃</a></td>
          </tr>
          <tr>
            <td colspan="4">&nbsp;</td>
          </tr>
          <tr>
            <td><span>使用过载保护：</span><a class="button" @click="showEditModalEvent('test')">???</a></td>
            <td><span>电流显示：</span><a class="button" @click="showEditModalEvent('test')">A</a></td>
            <td><span>压缩机额定电流：</span><a class="button" @click="showEditModalEvent('test')">A</a></td>
            <td><span>过载动作时间：</span><a class="button" @click="showEditModalEvent('test')">分钟</a></td>
          </tr>
          <tr>
            <td colspan="4">&nbsp;</td>
          </tr>
          <tr>
            <td><span>低压告警模式：</span><a class="button" @click="showEditModalEvent('test')">2</a></td>
            <td><span>低压告警自动恢复次数：</span><a class="button" @click="showEditModalEvent('test')">次</a></td>
            <td><span>外部告警自动恢复次数重置时间：</span><a class="button" @click="showEditModalEvent('test')">分钟</a></td>
            <td><span>高压告警模式：</span><a class="button" @click="showEditModalEvent('test')">1</a></td>
          </tr>
          <tr>
            <td><span>化霜四通阀模式：</span><a class="button" @click="showEditModalEvent('test')">0</a></td>
            <td><span>风机模式：</span><a class="button" @click="showEditModalEvent('test')">1</a></td>
            <td><span>排气保护温度：</span><a class="button" @click="showEditModalEvent('test')">℃</a></td>
            <td><span>排气保护温度回差：</span><a class="button" @click="showEditModalEvent('test')">℃</a></td>
          </tr>
          <tr>
            <td colspan="4">&nbsp;</td>
          </tr>
          <tr>
            <td><span>掉电后记忆开关机状态：</span><a class="button" @click="showEditModalEvent('test')">yes</a></td>
            <td><span>背光延时：</span><a class="button" @click="showEditModalEvent('test')">秒</a></td>
            <td><span>通讯波特率：</span><a class="button" @click="showEditModalEvent('test')">2.4</a></td>
            <td></td>
          </tr>
          <tr>
            <td colspan="4">&nbsp;</td>
          </tr>
          <tr>
            <td><span>电子膨胀阀开度查询：</span><a class="button" @click="showEditModalEvent('test')">???</a></td>
            <td><span>电子膨胀阀控制方式：</span><a class="button" @click="showEditModalEvent('test')">0</a></td>
            <td><span>电子膨胀阀手动设置开度：</span><a class="button" @click="showEditModalEvent('test')">350</a></td>
            <td><span>过热度设定值：</span><a class="button" @click="showEditModalEvent('test')">℃</a></td>
          </tr>
          <tr>
            <td><span>过热度稳定区：</span><a class="button" @click="showEditModalEvent('test')">℃</a></td>
            <td><span>过热度调节方向阔度：</span><a class="button" @click="showEditModalEvent('test')">℃</a></td>
            <td><span>电子膨胀阀排气设置：</span><a class="button" @click="showEditModalEvent('test')">℃</a></td>
            <td><span>环境温度显示：</span><a class="button" @click="showEditModalEvent('test')">℃</a></td>
          </tr>
          <tr>
            <td><span>回气温度显示：</span><a class="button" @click="showEditModalEvent('test')">???</a></td>
            <td><span>软件版本号：</span><a class="button" @click="showEditModalEvent('test')">263 2.1</a></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <!-- <pager v-if="!loadingData" :total="total" :current.sync="currentPage" :page-count="pageCount" @page-update="getUsers"></pager> -->
    </div>
    <!-- 输入时间范围浮层 -->
    <modal :show.sync="editModal1.show" @close="modalCancel">
      <h3 slot="header">设置起止时间</h3>
      <div slot="body" class="form editModal editModal1">
        <form v-form name="validation1" @submit.prevent="setDataEvent(editModal1,1)">
          <div class="content-box">
            <div class="content-value">
              <span class="name">{{editModal1.paramsName}}：</span>
              <input type="text" v-form-ctrl name="startHour" custom-validator="checkHour" required maxlength="2" class="time start-hour" v-model="editModal1.startHour">
              <span> : </span>
              <input type="text" v-form-ctrl name="startMinute" custom-validator="checkMinute" required maxlength="2" class="time start-minute" v-model="editModal1.startMinute">
              <span> - </span>
              <input type="text" v-form-ctrl name="endHour" custom-validator="checkHour" required maxlength="2" class="time end-hour"     v-model="editModal1.endHour">
              <span> : </span>
              <input type="text" v-form-ctrl name="endMinute" custom-validator="checkMinute" required maxlength="2" class="time end-minute"   v-model="editModal1.endMinute">
            </div>
            <div v-show="validation1.startHour.$dirty || validation1.startMinute.$dirty || validation1.endHour.$dirty || validation1.endMinute.$dirty" class="form-tips form-tips-error">
              <span v-show="validation1.startHour.$error.required || validation1.startMinute.$error.required || validation1.endHour.$error.required || validation1.endMinute.$error.required">时间不能留空</span>
            </div>
            <div v-show="validation1.startHour.$dirty || validation1.endHour.$dirty" class="form-tips form-tips-error">
              <span v-show="validation1.startHour.$error.customValidator || validation1.endHour.$error.customValidator">小时值不能超过23</span>
            </div>
            <div v-show="validation1.startMinute.$dirty || validation1.endMinute.$dirty" class="form-tips form-tips-error">
              <span v-show="validation1.startMinute.$error.customValidator || validation1.endMinute.$error.customValidator">分钟值不能超过59</span>
            </div>
            <div class="tips">
              <span>{{editModal1.tips}}</span>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="modalCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="settingData" :class="{'disabled':settingData}" v-text="settingData ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 选择参数浮层 -->
    <modal :show.sync="editModal2.show" @close="modalCancel">
      <h3 slot="header">设置参数</h3>
      <div slot="body" class="form editModal editModal2">
        <div class="content-box">
          <span class="name">{{editModal2.paramsName}}：</span>
          <select name="deviceParams" v-model="editModal2.value" class="deviceParams">
            <option :value="value" v-for="value in editModal2.valueArr">{{value}}</option>
          </select>
        </div>
        <div class="form-actions">
          <button @click.prevent.stop="modalCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          <button type="submit" :disabled="settingData" :class="{'disabled':settingData}" v-text="settingData ? $t('common.handling') : $t('common.ok')" class="btn btn-primary" @click="setDataEvent(editModal2,2)"></button>
        </div>
      </div>
    </modal>
    <!-- 输入参数浮层 -->
    <modal :show.sync="editModal3.show" @close="modalCancel">
      <h3 slot="header">设置参数</h3>
      <div slot="body" class="form editModal editModal3">
        <form v-form name="validation3" @submit.prevent="setDataEvent(editModal3,3)">
          <div class="content-box">
            <div class="content-value">
              <span class="name">{{editModal3.paramsName}}：</span>
              <input type="text" v-form-ctrl name="paramsValue" required class="paramsValue" v-model="editModal3.value">
              <span class="unit">{{editModal3.unit}}</span>
            </div>
            <div v-show="validation3.paramsValue.$dirty" class="form-tips form-tips-error">
              <span v-show="validation3.paramsValue.$error.required">{{editModal3.paramsName}}不能留空</span>
            </div>
            <div class="tips">
              <span>{{editModal3.tips}}</span>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="modalCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="settingData" :class="{'disabled':settingData}" v-text="settingData ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 双维度输入参数浮层 -->
    <modal :show.sync="editModal4.show" @close="modalCancel">
      <h3 slot="header">设置参数</h3>
      <div slot="body" class="form editModal editModal4">
        <form v-form name="validation4" @submit.prevent="setDataEvent(editModal4,4)">
          <div class="content-box">
            <div class="content-value">
              <span class="name">{{editModal4.paramsName}}：</span>
              <select name="deviceParams" v-model="editModal4.canSetParams" class="deviceParams">
                <option v-for="canSetParams in [true, false]" :value="canSetParams">{{canSetParams ? 'YES' : 'NO'}}</option>
              </select>
              <input type="text" class="paramsValue" name="paramsValue" v-form-ctrl :required="editModal4.canSetParams" v-model="editModal4.value" v-show="editModal4.canSetParams">
              <span class="unit" v-show="editModal4.canSetParams">{{editModal4.unit}}</span>
            </div>
            <div v-show="validation4.paramsValue.$error.required" class="form-tips form-tips-error">
              <span>{{editModal4.paramsName}}不能留空</span>
            </div>
            <div class="tips">
              <span>{{editModal4.tips}}</span>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="modalCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="settingData" :class="{'disabled':settingData}" v-text="settingData ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
    <!-- 输入时间浮层 -->
    <modal :show.sync="editModal5.show" @close="modalCancel">
      <h3 slot="header">设置控制器时间</h3>
      <div slot="body" class="form editModal editModal5">
        <form v-form name="validation5" @submit.prevent="setControllerTime()">
          <div class="content-box">
            <div class="content-value">
              <span class="name">{{editModal5.paramsName}}：</span>
              <input type="text" class="time hour" name="hour" v-form-ctrl required custom-validator="checkHour" maxlength="2" v-model="editModal5.hour">
              <span> : </span>
              <input type="text" class="time minute" name="minute" v-form-ctrl required custom-validator="checkMinute" maxlength="2" v-model="editModal5.minute">
            </div>
            <div v-show="validation5.hour.$error.required || validation5.minute.$error.required" class="form-tips form-tips-error">
              <span>{{editModal4.paramsName}}不能留空</span>
            </div>
            <div v-show="validation5.hour.$error.customValidator" class="form-tips form-tips-error">
              <span>小时格式为 00 ~ 23</span>
            </div>
            <div v-show="validation5.minute.$error.customValidator" class="form-tips form-tips-error">
              <span>分钟格式为 00 ~ 59</span>
            </div>
            <div class="tips">
              <span>范围为00:00—24:00。</span>
            </div>
          </div>
          <div class="form-actions">
            <button @click.prevent.stop="modalCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
            <button type="submit" :disabled="settingData" :class="{'disabled':settingData}" v-text="settingData ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
          </div>
        </form>
      </div>
    </modal>
  </div>
</template>

<script>
  // import Vue from 'vue'
  // import api from '../../../../api'
  import { globalMixins } from '../../../../mixins'
  import Modal from '../../../../components/Modal'
  // import locales from '../../../../consts/locales/index'
  // import io from 'socket.io-client'
  import XJSObject from '../../../../helpers/jssdk'
  import decodeData from './datatools/decode'
  // locales = 123
  // var socket

  export default {
    name: 'BasicInfo',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'modal': Modal
    },

    data () {
      return {
        device_id: this.$route.params.device_id,
        // modelType 弹窗类型 1是时间选择 2是小范围选择参数 3是大范围参数输入 4是双维度
        validation1: {},
        validation2: {},
        validation3: {},
        validation4: {},
        validation5: {},
        // 编辑浮层1
        editModal1: {
          show: false,
          paramsKey: '',
          paramsName: '',
          startHour: '',
          startMinute: '',
          endHour: '',
          endMinute: '',
          tips: ''
        },
        // 编辑浮层2
        editModal2: {
          show: false,
          paramsKey: '',
          paramsName: '',
          valueArr: [],
          value: ''
        },
        // 编辑浮层3
        editModal3: {
          show: false,
          paramsKey: '',
          paramsName: '',
          value: '',
          unit: '',
          tips: ''
        },
        // 编辑浮层4
        editModal4: {
          show: false,
          canSetParams: false,
          paramsKey: '',
          paramsName: '',
          value: '',
          unit: '',
          tips: ''
        },
        // 编辑浮层5
        editModal5: {
          show: false,
          paramsName: '控制器时间',
          hour: '00',
          minute: '00'
        },
        // 产品信息
        deviceInfos: {
          S11: {
            feature: 'S11',
            name: '上限温度',
            valueText: '0',
            valueArr: ['自动模式', '手动模式'],
            modelType: '3',
            unit: '℃',
            tips: '温度范围-128℃~128℃'
          },
          test: {
            feature: '00',
            name: '上限温度',
            valueText: '55',
            valueArr: ['自动模式', '手动模式'],
            modelType: '4',
            unit: '℃',
            tips: '时间格式为 00:00 - 23:59'
          },
          paramsKey00: {
            feature: '00',
            name: '运行模式',
            valueText: '自动模式',
            valueArr: ['自动模式', '手动模式'],
            modelType: '2',
            unit: ''
          },
          paramsKey2: {
            feature: '00',
            name: '工作时间段一',
            valueText: '00:00-00:00',
            valueArr: [],
            modelType: '1'
          },
          paramsKey3: {
            feature: '00',
            name: '工作时间段二',
            valueText: '00:00-00:00',
            valueArr: [],
            modelType: '1'
          },
          paramsKey4: {
            feature: '00',
            name: '工作时间段三',
            valueText: '00:00-00:00',
            valueArr: [],
            modelType: '1'
          },
          paramsKey11: {
            feature: '00',
            name: '上限温度',
            valueText: '55.0',
            valueArr: [],
            modelType: '3',
            unit: '℃'
          }
        },
        // 当前正在编辑的参数
        editingProductInfo: {
          paramsKey: '',
          name: '',
          valueText: '',
          modelType: ''
        },
        // 正在设置参数
        settingData: false,
        // 是否更新数据  区分当前是首次获取数据还是更新数据
        updateDate: false,
        // 设备是否在线
        deviceOnline: false
      }
    },
    route: {
      data () {
        // this.getDeviceInfos()
        this.connect() // 连接设备
        this.listenDeviceData() // 监听设备数据
      }
    },
    ready () {
      // onRecvXDeviceData
    },
    methods: {
      /**
       * 向设备发送数据
       * @param  {array} data 数组形式的数据
       * @return {[type]}      [description]
       */
      sendDeviceData (data) {
        var self = this
        if (self.deviceOnline) {
          console.log('发送数据：' + data)
          XJSObject.invoke('sendXDeviceData', {data: data}, function (r) {
            console.log('sendXDeviceData结果：' + JSON.stringify(r))
            self.modalCancel()
            self.settingData = false
            if (r.status === 200) {
              self.showNotice({
                type: 'success',
                content: '数据设置成功'
              })
            }
          })
        } else {
          self.showNotice({
            type: 'error',
            content: '设备不在线 无法进行操作'
          })
        }
      },
      listenDeviceData () {
        var self = this
        // 设备返回数据
        XJSObject.on('onRecvXDeviceData', function (r) {
          if (r.type === 'base64') {
            console.log('设备返回数据:' + JSON.stringify(r))
            decodeData(r.data, self)
          }
        })
        // 设备状态改变
        XJSObject.on('onXDeviceStateChange', function (r) {
          console.log('设备状态改变:' + JSON.stringify(r))
        })
      },
      /**
       * 确定按钮事件
       * @param {object} productInfo 当前正在编辑的对象
       */
      setDataEvent (productInfo, num) {
        if (this['validation' + num].$valid) {
          var self = this
          self.settingData = true
          // console.log(JSON.stringify(productInfo))
          self.sendDeviceData('/' + productInfo.paramsKey + '/1/' + productInfo.value + '\n')
        }
      },

      /**
       * 重新获取设备信息
       * @return {[type]} [description]
       */
      updateDevicesInfo () {
        this.updateDate = true
        this.getDeviceInfos()
      },

      /**
       * 设置控制器时间
       */
      setControllerTime () {
        var self = this
        if (self.validation5.$valid) {
          self.settingData = true
          setTimeout(() => {
            self.editModal5.show = false
            self.showNotice({
              type: 'success',
              content: '控制器时间设置成功'
            })
          }, 1000)
        }
      },

      /**
       * 获取设备信息
       * @return {[type]} [description]
       */
      getDeviceInfos () {
        var self = this
        console.log('获取产品信息')
        var data = '/S100/1'
        this.sendDeviceData(data)
        // 获取成功后调用提示
        if (self.updateDate) {
          self.showNotice({
            type: 'success',
            content: '获取设备信息成功'
          })
          self.updateDate = false
        }
      },
      /**
       * 显示设置控制器时间浮层
       */
      showEditModal5 () {
        var self = this
        console.log('设置控制器时间')
        if (self.deviceOnline) {
          // 这里需要获取最新的控制器时间
          self.settingData = false
          self.editModal5.show = true
        }
      },

      /**
       * 连接设备
       * @return {[type]} [description]
       */
      connect () {
        var self = this
        XJSObject.invoke('loadXJSAPILib', {}, function (r) {
          XJSObject.invoke('connectXDevice', {deviceid: self.device_id, appid: '1144509923', token: '12311223'}, function (r) {
            if (r.status === 200) {
              console.log('设备已经连接')
              self.deviceOnline = true
            }
            console.log(JSON.stringify(r))
          })
        })
      },
      /**
       * 显示编辑浮层
       * @param  {string} paramsKey 当前正在编辑的属性名称
       * @return {[type]}           [description]
       */
      showEditModalEvent (paramsKey) {
        var self = this
        if (self.deviceOnline) {
          if (self.deviceInfos[paramsKey]) {
            self.settingData = false
            self['showEditModal' + self.deviceInfos[paramsKey].modelType](paramsKey)
          }
        } else {
          self.showNotice({
            type: 'error',
            content: '设备不在线 无法进行操作'
          })
        }
      },
      /**
       * 显示时间设置浮层
       * @param  {string} paramsKey 当前正在编辑的属性名称
       * @return {[type]}           [description]
       */
      showEditModal1 (paramsKey) {
        var self = this
        self.editModal1.paramsKey = paramsKey
        self.editModal1.paramsName = self.deviceInfos[paramsKey].name
        self.editModal1.startHour = self.deviceInfos[paramsKey].valueText.split('-')[0].split(':')[0]
        self.editModal1.startMinute = self.deviceInfos[paramsKey].valueText.split('-')[0].split(':')[1]
        self.editModal1.endHour = self.deviceInfos[paramsKey].valueText.split('-')[1].split(':')[0]
        self.editModal1.endMinute = self.deviceInfos[paramsKey].valueText.split('-')[1].split(':')[1]
        self.editModal1.tips = self.deviceInfos[paramsKey].tips
        self.editModal1.show = true
      },
      /**
       * 显示参数设置浮层 小范围
       * @param  {string} paramsKey 当前正在编辑的属性名称
       * @return {[type]}           [description]
       */
      showEditModal2 (paramsKey) {
        var self = this
        self.editModal2.paramsKey = paramsKey
        if (self.deviceInfos[paramsKey].valueArr) {
          self.editModal2.paramsName = self.deviceInfos[paramsKey].name
          self.editModal2.value = self.deviceInfos[paramsKey].valueText
          self.editModal2.valueArr = self.deviceInfos[paramsKey].valueArr
          self.editModal2.show = true
        }
      },
      /**
       * 显示参数设置浮层 大范围
       * @param  {string} paramsKey 当前正在编辑的属性名称
       * @return {[type]}           [description]
       */
      showEditModal3 (paramsKey) {
        var self = this
        self.editModal3.paramsKey = paramsKey
        if (self.deviceInfos[paramsKey].valueArr) {
          self.editModal3.paramsName = self.deviceInfos[paramsKey].name
          self.editModal3.value = self.deviceInfos[paramsKey].valueText
          self.editModal3.unit = self.deviceInfos[paramsKey].unit
          self.editModal3.tips = self.deviceInfos[paramsKey].tips
          self.editModal3.show = true
        }
      },
      /**
       * 显示参数设置浮层 双维度
       * @param  {string} paramsKey 当前正在编辑的属性名称
       * @return {[type]}           [description]
       */
      showEditModal4 (paramsKey) {
        var self = this
        self.editModal4.paramsKey = paramsKey
        if (self.deviceInfos[paramsKey].valueArr) {
          self.editModal4.paramsName = self.deviceInfos[paramsKey].name
          self.editModal4.value = self.deviceInfos[paramsKey].valueText
          self.editModal4.unit = self.deviceInfos[paramsKey].unit
          self.editModal4.tips = self.deviceInfos[paramsKey].tips
          self.editModal4.show = true
        }
      },
      /**
       * 取消按钮事件
       * @return {[type]} [description]
       */
      modalCancel () {
        this.editModal1.show = false
        this.editModal2.show = false
        this.editModal3.show = false
        this.editModal4.show = false
        this.editModal5.show = false
      },
      checkHour (hour) {
        if (hour - 0 > 23) {
          return false
        } else {
          return true
        }
      },
      checkMinute (minute) {
        if (minute - 0 > 59) {
          return false
        } else {
          return true
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../../assets/stylus/common'

  .basic-info
    font-size 13px
    .panel-hd
      .other-control-button-box
        position absolute
        right 0
        top 55%
        transform translate3d(0, -50%, 0)
        .other-control-button
          margin-left 15px
    .panel-bd
      .table
        .button
          color blue
    .editModal
      font-size 16px
    .editModal1
      .content-box
        .content-value
          padding-bottom 10px
          .time
            width 50px
            height 32px
            line-height 32px
            background none
            border 1px solid #d9d9d9
            box-sizing border-box
            font-size 14px
            text-align center
        .tips
          font-size 14px
          color #999
          padding 10px 0
    .editModal2
      .content-box
        padding-bottom 30px
        .deviceParams
          height 30px
          font-size 14px
    .editModal3
      .content-box
        .content-value
          padding-bottom 10px
          .paramsValue
            width 100px
            height 32px
            line-height 32px
            background none
            border 1px solid #d9d9d9
            box-sizing border-box
            font-size 14px
            padding 0 15px
        .tips
          font-size 14px
          color #999
          padding 10px 0
    .editModal4
      .content-box
        .content-value
          padding-bottom 10px
          .deviceParams
            height 32px
            box-sizing border-box
            transform translate(0, 1px, 0)
            font-size 14px
          .paramsValue
            width 100px
            height 32px
            line-height 32px
            background none
            border 1px solid #d9d9d9
            box-sizing border-box
            font-size 12px
            padding 0 15px
        .tips
          font-size 14px
          color #999
          padding 10px 0
    .editModal5
      .content-box
        .content-value
          padding-bottom 10px
          .time
            width 50px
            height 32px
            line-height 32px
            background none
            border 1px solid #d9d9d9
            box-sizing border-box
            font-size 14px
            text-align center
        .tips
          font-size 14px
          color #999
          padding 10px 0
    input.vf-dirty.vf-invalid
      border 1px solid red !important
</style>
