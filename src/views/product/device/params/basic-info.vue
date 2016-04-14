<template>
  <div class="panel basic-info">
    <div class="panel-hd">
      <h2>设备MAC：001DC9A26536</h2>
    </div>
    <div class="panel-bd">
      <table class="table table-stripe table-bordered">
        <tbody>
          <tr>
            <th><span>运行模式：</span><a class="button" @click="showEditModalEvent('paramsKey')">自动模式</a></th>
            <th><span>工作时间段一：</span><a class="button" @click="showEditModalEvent('paramsKey')">00:00-00:00</a></th>
            <th><span>工作时间段二：</span><a class="button" @click="showEditModalEvent('paramsKey')">00:00-00:00</a></th>
            <th><span>工作时间段三：</span><a class="button" @click="showEditModalEvent('paramsKey')">00:00-00:00</a></th>
          </tr>
          <tr>
            <th><span>上限温度：</span><a class="button" @click="showEditModalEvent('paramsKey')">55.0℃</a></th>
            <th><span>下限温度：</span><a class="button" @click="showEditModalEvent('paramsKey')">45.0℃</a></th>
            <th><span>最高设定温度：</span><a class="button" @click="showEditModalEvent('paramsKey')">70.0℃</a></th>
            <th><span>最低设定温度：</span><a class="button" @click="showEditModalEvent('paramsKey')">10.0℃</a></th>
          </tr>
          <tr>
            <td colspan="4">&nbsp;</td>
          </tr>
          <tr>
            <th><span>水温探头修正：</span><a class="button" @click="showEditModalEvent('paramsKey')">0.0℃</a></th>
            <th><span>压缩机启动延时：</span><a class="button" @click="showEditModalEvent('paramsKey')">3.0分钟</a></th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <td colspan="4">&nbsp;</td>
          </tr>
          <tr>
            <th><span>化霜启动温度：</span><a class="button" @click="showEditModalEvent('paramsKey')">-3℃</a></th>
            <th><span>下化霜结束温度：</span><a class="button" @click="showEditModalEvent('paramsKey')">10.0℃</a></th>
            <th><span>工作时间段二：</span><a class="button" @click="showEditModalEvent('paramsKey')">00:00-00:00</a></th>
            <th><span>工作时间段三：</span><a class="button" @click="showEditModalEvent('paramsKey')">00:00-00:00</a></th>
          </tr>
          <tr>
            <th><span>化霜四通阀模式：</span><a class="button" @click="showEditModalEvent('paramsKey')">0</a></th>
            <th><span>风机模式：</span><a class="button" @click="showEditModalEvent('paramsKey')">1</a></th>
            <th><span>风机关联的环境温度：</span><a class="button" @click="showEditModalEvent('paramsKey')">℃</a></th>
            <th><span>风机关联的排期温度：</span><a class="button" @click="showEditModalEvent('paramsKey')">℃</a></th>
          </tr>
          <tr>
            <td colspan="4">&nbsp;</td>
          </tr>
          <tr>
            <th><span>使用过载保护：</span><a class="button" @click="showEditModalEvent('paramsKey')">???</a></th>
            <th><span>电流显示：</span><a class="button" @click="showEditModalEvent('paramsKey')">A</a></th>
            <th><span>压缩机额定电流：</span><a class="button" @click="showEditModalEvent('paramsKey')">A</a></th>
            <th><span>过载动作时间：</span><a class="button" @click="showEditModalEvent('paramsKey')">分钟</a></th>
          </tr>
          <tr>
            <td colspan="4">&nbsp;</td>
          </tr>
          <tr>
            <th><span>低压告警模式：</span><a class="button" @click="showEditModalEvent('paramsKey')">2</a></th>
            <th><span>低压告警自动恢复次数：</span><a class="button" @click="showEditModalEvent('paramsKey')">次</a></th>
            <th><span>外部告警自动恢复次数重置时间：</span><a class="button" @click="showEditModalEvent('paramsKey')">分钟</a></th>
            <th><span>高压告警模式：</span><a class="button" @click="showEditModalEvent('paramsKey')">1</a></th>
          </tr>
          <tr>
            <th><span>化霜四通阀模式：</span><a class="button" @click="showEditModalEvent('paramsKey')">0</a></th>
            <th><span>风机模式：</span><a class="button" @click="showEditModalEvent('paramsKey')">1</a></th>
            <th><span>排气保护温度：</span><a class="button" @click="showEditModalEvent('paramsKey')">℃</a></th>
            <th><span>排气保护温度回差：</span><a class="button" @click="showEditModalEvent('paramsKey')">℃</a></th>
          </tr>
          <tr>
            <td colspan="4">&nbsp;</td>
          </tr>
          <tr>
            <th><span>掉电后记忆开关机状态：</span><a class="button" @click="showEditModalEvent('paramsKey')">yes</a></th>
            <th><span>背光延时：</span><a class="button" @click="showEditModalEvent('paramsKey')">秒</a></th>
            <th><span>通讯波特率：</span><a class="button" @click="showEditModalEvent('paramsKey')">2.4</a></th>
            <th></th>
          </tr>
          <tr>
            <td colspan="4">&nbsp;</td>
          </tr>
          <tr>
            <th><span>电子膨胀阀开度查询：</span><a class="button" @click="showEditModalEvent('paramsKey')">???</a></th>
            <th><span>电子膨胀阀控制方式：</span><a class="button" @click="showEditModalEvent('paramsKey')">0</a></th>
            <th><span>电子膨胀阀手动设置开度：</span><a class="button" @click="showEditModalEvent('paramsKey')">350</a></th>
            <th><span>过热度设定值：</span><a class="button" @click="showEditModalEvent('paramsKey')">℃</a></th>
          </tr>
          <tr>
            <th><span>过热度稳定区：</span><a class="button" @click="showEditModalEvent('paramsKey')">℃</a></th>
            <th><span>过热度调节方向阔度：</span><a class="button" @click="showEditModalEvent('paramsKey')">℃</a></th>
            <th><span>电子膨胀阀排气设置：</span><a class="button" @click="showEditModalEvent('paramsKey')">℃</a></th>
            <th><span>环境温度显示：</span><a class="button" @click="showEditModalEvent('paramsKey')">℃</a></th>
          </tr>
          <tr>
            <th><span>回气温度显示：</span><a class="button" @click="showEditModalEvent('paramsKey')">???</a></th>
            <th><span>软件版本号：</span><a class="button" @click="showEditModalEvent('paramsKey')">263 2.1</a></th>
            <th></th>
            <th></th>
          </tr>
        </tbody>
      </table>
      <!-- <pager v-if="!loadingData" :total="total" :current.sync="currentPage" :page-count="pageCount" @page-update="getUsers"></pager> -->
    </div>
    <!-- 选择时间模块 -->
    <modal :show.sync="editModal1.show" @close="modalCancel">
      <h3 slot="header">设置起止时间</h3>
      <div slot="body" class="form editModal editModal1">
        <div class="content-box">
          <div class="content-value">
            <span class="name">{{editModal1.paramsName}}：</span>
            <input type="text" class="time start-hour" v-model="editModal1.startHour">
            <span> : </span>
            <input type="text" class="time start-minute" v-model="editModal1.startMinute">
            <span> - </span>
            <input type="text" class="time end-hour" v-model="editModal1.endHour">
            <span> : </span>
            <input type="text" class="time end-minute" v-model="editModal1.endMinute">
          </div>
          <div class="tips">
            <span>请输入起止时间，格式为00:00—12:00。</span>
          </div>
        </div>
        <div class="form-actions">
          <button @click.prevent.stop="modalCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
        </div>
      </div>
    </modal>
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
          <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
        </div>
      </div>
    </modal>
    <modal :show.sync="editModal3.show" @close="modalCancel">
      <h3 slot="header">设置参数</h3>
      <div slot="body" class="form editModal editModal3">
        <div class="content-box">
          <div class="content-value">
            <span class="name">{{editModal3.paramsName}}：</span>
            <input type="text" class="paramsValue" v-model="editModal3.value">
            <span class="unit">{{editModal3.unit}}</span>
          </div>
          <div class="tips">
            <span>{{editModal3.tips}}</span>
          </div>
        </div>
        <div class="form-actions">
          <button @click.prevent.stop="modalCancel" class="btn btn-default">{{ $t("common.cancel") }}</button>
          <button type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
  import { globalMixins } from '../../../../mixins'
  import Modal from '../../../../components/Modal'

  export default {
    name: 'BasicInfo',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'modal': Modal
    },

    data () {
      return {
        // modelType 弹窗类型 1是时间选择 2是小范围选择参数 3是大范围参数输入 4是双维度
        editModal1: {
          show: false,
          paramsKey: '',
          paramsName: '',
          startHour: '',
          startMinute: '',
          endHour: '',
          endMinute: ''
        },
        editModal2: {
          show: false,
          paramsKey: '',
          paramsName: '',
          valueArr: [],
          value: ''
        },
        editModal3: {
          show: false,
          paramsKey: '',
          paramsName: '',
          value: '',
          unit: '',
          tips: ''
        },
        editModal4: {
          show: false,
          paramsKey: ''
        },
        productInfos: {
          paramsKey: {
            name: '上限温度',
            valueText: '55.0',
            valueArr: [],
            modelType: '3',
            unit: '℃',
            tips: '请输入温度数字，范围为0-100。'
          },
          paramsKey1: {
            name: '运行模式',
            valueText: '自动模式',
            valueArr: ['自动模式', '手动模式'],
            modelType: '2',
            unit: ''
          },
          paramsKey2: {
            name: '工作时间段一',
            valueText: '00:00-00:00',
            valueArr: [],
            modelType: '1'
          },
          paramsKey3: {
            name: '工作时间段二',
            valueText: '00:00-00:00',
            valueArr: [],
            modelType: '1'
          },
          paramsKey4: {
            name: '工作时间段三',
            valueText: '00:00-00:00',
            valueArr: [],
            modelType: '1'
          },
          paramsKey5: {
            name: '上限温度',
            valueText: '55.0',
            valueArr: [],
            modelType: '3',
            unit: '℃'
          }
        },
        editingProductInfo: { // 当前正在编辑的参数
          paramsKey: '',
          name: '',
          valueText: '',
          modelType: ''
        }
      }
    },

    methods: {
      showEditModalEvent (paramsKey) {
        var self = this
        if (self.productInfos[paramsKey]) {
          self.showEditModal1
          self['showEditModal' + self.productInfos[paramsKey].modelType](paramsKey)
        }
      },
      showEditModal1 (paramsKey) {
        var self = this
        self.editModal1.paramsKey = paramsKey
        self.editModal1.paramsName = self.productInfos[paramsKey].name
        self.editModal1.startHour = self.productInfos[paramsKey].valueText.split('-')[0].split(':')[0]
        self.editModal1.startMinute = self.productInfos[paramsKey].valueText.split('-')[0].split(':')[1]
        self.editModal1.endHour = self.productInfos[paramsKey].valueText.split('-')[1].split(':')[0]
        self.editModal1.endMinute = self.productInfos[paramsKey].valueText.split('-')[1].split(':')[1]
        self.editModal1.show = true
      },
      showEditModal2 (paramsKey) {
        var self = this
        self.editModal2.paramsKey = paramsKey
        if (self.productInfos[paramsKey].valueArr) {
          self.editModal2.paramsName = self.productInfos[paramsKey].name
          self.editModal2.value = self.productInfos[paramsKey].valueText
          self.editModal2.valueArr = self.productInfos[paramsKey].valueArr
          self.editModal2.show = true
        }
      },
      showEditModal3 (paramsKey) {
        var self = this
        self.editModal3.paramsKey = paramsKey
        if (self.productInfos[paramsKey].valueArr) {
          self.editModal3.paramsName = self.productInfos[paramsKey].name
          self.editModal3.value = self.productInfos[paramsKey].valueText
          self.editModal3.unit = self.productInfos[paramsKey].unit
          self.editModal3.tips = self.productInfos[paramsKey].tips
          self.editModal3.show = true
        }
      },
      modalCancel () {
        this.editModal1.show = false
        this.editModal2.show = false
        this.editModal3.show = false
        this.editModal4.show = false
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../../assets/stylus/common'

  .basic-info
    font-size 13px
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
</style>
