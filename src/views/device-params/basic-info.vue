<template>
  <div class="panel basic-info">
    <div class="panel-hd">
      <h2 class="title">设备MAC：{{$route.params.mac || $route.params.device_id}}</h2>
      <div class="other-control-button-box">
        <!-- <button @click="updateDevicesInfo" class="other-control-button btn btn-success">获取设备信息</button> -->
        <button @click="showEditModal5" class="other-control-button btn btn-success" :class="{'disabled': !deviceOnline}" :disabled="!deviceOnline">设置控制器时间</button>
      </div>
    </div>
    <div class="panel-bd">
      <table class="table table-stripe table-bordered">
        <tbody>
          <tr>
            <td><span>{{deviceInfos.S101.name}}：</span><a class="button" @click="showEditModalEvent('S101')">{{deviceInfos.S101.valueArr[deviceInfos.S101.valueText]}}{{deviceInfos.S101.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S101.loading"></i></td>
            <td><span>{{deviceInfos.S103.name}}：</span><a class="button" @click="showEditModalEvent('S103')">&nbsp;{{deviceInfos.S103.valueText}}{{deviceInfos.S103.unit}}&nbsp;</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S103.loading"></i></td>
            <td><span>{{deviceInfos.S104.name}}：</span><a class="button" @click="showEditModalEvent('S104')">&nbsp;{{deviceInfos.S104.valueText}}{{deviceInfos.S104.unit}}&nbsp;</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S104.loading"></i></td>
            <td><span>{{deviceInfos.S105.name}}：</span><a class="button" @click="showEditModalEvent('S105')">&nbsp;{{deviceInfos.S105.valueText}}{{deviceInfos.S105.unit}}&nbsp;</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S105.loading"></i></td>
          </tr>
          <tr>
            <td><span>{{deviceInfos.S11.name}}：</span><a class="button" @click="showEditModalEvent('S11')">{{deviceInfos.S11.valueText}}{{deviceInfos.S11.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S11.loading"></i></td>
            <td><span>{{deviceInfos.S12.name}}：</span><a class="button" @click="showEditModalEvent('S12')">{{deviceInfos.S12.valueText}}{{deviceInfos.S12.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S12.loading"></i></td>
            <td><span>{{deviceInfos.S13.name}}：</span><a class="button" @click="showEditModalEvent('S13')">{{deviceInfos.S13.valueText}}{{deviceInfos.S13.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S13.loading"></i></td>
            <td><span>{{deviceInfos.S14.name}}：</span><a class="button" @click="showEditModalEvent('S14')">{{deviceInfos.S14.valueText}}{{deviceInfos.S14.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S14.loading"></i></td>
          </tr>
          <tr>
            <td colspan="4">&nbsp;</td>
          </tr>
          <tr>
            <td><span>{{deviceInfos.S19.name}}：</span><a class="button" @click="showEditModalEvent('S19')">{{deviceInfos.S19.valueText}}{{deviceInfos.S19.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S19.loading"></i></td>
            <td><span>{{deviceInfos.S21.name}}：</span><a class="button" @click="showEditModalEvent('S21')">{{deviceInfos.S21.valueText}}{{deviceInfos.S21.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S21.loading"></i></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td colspan="4">&nbsp;</td>
          </tr>
          <tr>
            <td><span>{{deviceInfos.S31.name}}：</span><a class="button" @click="showEditModalEvent('S31')">{{deviceInfos.S31.valueText}}{{deviceInfos.S31.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S31.loading"></i></td>
            <td><span>{{deviceInfos.S32.name}}：</span><a class="button" @click="showEditModalEvent('S32')">{{deviceInfos.S32.valueText}}{{deviceInfos.S32.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S32.loading"></i></td>
            <td><span>{{deviceInfos.S33.name}}：</span><a class="button" @click="showEditModalEvent('S33')">{{deviceInfos.S33.valueText}}{{deviceInfos.S33.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S33.loading"></i></td>
            <td><span>{{deviceInfos.S34.name}}：</span><a class="button" @click="showEditModalEvent('S34')">{{deviceInfos.S34.valueText}}{{deviceInfos.S34.valueText - 0 >= 0 ? deviceInfos.S34.unit : ''}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S34.loading"></i></td>
          </tr>
          <tr>
            <td><span>{{deviceInfos.S37.name}}：</span><a class="button" @click="showEditModalEvent('S37')">{{deviceInfos.S37.valueArr[deviceInfos.S37.valueText]}}{{deviceInfos.S37.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S37.loading"></i></td>
            <td><span>{{deviceInfos.S40.name}}：</span><a class="button" @click="showEditModalEvent('S40')">{{deviceInfos.S40.valueArr[deviceInfos.S40.valueText]}}{{deviceInfos.S40.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S40.loading"></i></td>
            <td><span>{{deviceInfos.S41.name}}：</span><a class="button" @click="showEditModalEvent('S41')">{{deviceInfos.S41.valueText}}{{deviceInfos.S41.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S41.loading"></i></td>
            <td><span>{{deviceInfos.S42.name}}：</span><a class="button" @click="showEditModalEvent('S42')">{{deviceInfos.S42.valueText}}{{deviceInfos.S42.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S42.loading"></i></td>
          </tr>
          <tr>
            <td colspan="4">&nbsp;</td>
          </tr>
          <tr>
            <td><span>{{deviceInfos.S44.name}}：</span><a class="button" @click="showEditModalEvent('S44')">{{deviceInfos.S44.valueArr[deviceInfos.S44.valueText]}}{{deviceInfos.S44.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S44.loading"></i></td>
            <td><span>{{deviceInfos.S45.name}}：</span><a class="button" @click="showEditModalEvent('S45')">{{deviceInfos.S45.valueText}}{{deviceInfos.S45.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S45.loading"></i></td>
            <td><span>{{deviceInfos.S46.name}}：</span><a class="button" @click="showEditModalEvent('S46')">{{deviceInfos.S46.valueText}}{{deviceInfos.S46.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S46.loading"></i></td>
            <td><span>{{deviceInfos.S47.name}}：</span><a class="button" @click="showEditModalEvent('S47')">{{deviceInfos.S47.valueText}}{{deviceInfos.S47.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S47.loading"></i></td>
          </tr>
          <tr>
            <td colspan="4">&nbsp;</td>
          </tr>
          <tr>
            <td><span>{{deviceInfos.S50.name}}：</span><a class="button" @click="showEditModalEvent('S50')">{{deviceInfos.S50.valueArr[deviceInfos.S50.valueText]}}{{deviceInfos.S50.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S50.loading"></i></td>
            <td><span>{{deviceInfos.S51.name}}：</span><a class="button" @click="showEditModalEvent('S51')">{{deviceInfos.S51.valueText}}{{deviceInfos.S51.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S51.loading"></i></td>
            <td><span>{{deviceInfos.S52.name}}：</span><a class="button" @click="showEditModalEvent('S52')">{{deviceInfos.S52.valueText}}{{deviceInfos.S52.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S52.loading"></i></td>
            <td><span>{{deviceInfos.S54.name}}：</span><a class="button" @click="showEditModalEvent('S54')">{{deviceInfos.S54.valueArr[deviceInfos.S54.valueText]}}{{deviceInfos.S54.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S54.loading"></i></td>
          </tr>
          <tr>
            <td><span>{{deviceInfos.S55.name}}：</span><a class="button" @click="showEditModalEvent('S55')">{{deviceInfos.S55.valueText}}{{deviceInfos.S55.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S55.loading"></i></td>
            <td><span>{{deviceInfos.S56.name}}：</span><a class="button" @click="showEditModalEvent('S56')">{{deviceInfos.S56.valueText}}{{deviceInfos.S56.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S56.loading"></i></td>
            <td><span>{{deviceInfos.S58.name}}：</span><a class="button" @click="showEditModalEvent('S58')">{{deviceInfos.S58.valueText}}{{deviceInfos.S58.valueText - 0 >= 0 ? deviceInfos.S58.unit : ''}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S58.loading"></i></td>
            <td><span>{{deviceInfos.S59.name}}：</span><a class="button" @click="showEditModalEvent('S59')">{{deviceInfos.S59.valueText}}{{deviceInfos.S59.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S59.loading"></i></td>
          </tr>
          <tr>
            <td colspan="4">&nbsp;</td>
          </tr>
          <tr>
            <td><span>{{deviceInfos.S61.name}}：</span><a class="button" @click="showEditModalEvent('S61')">{{deviceInfos.S61.valueArr[deviceInfos.S61.valueText]}}{{deviceInfos.S61.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S61.loading"></i></td>
            <td><span>{{deviceInfos.S63.name}}：</span><a class="button" @click="showEditModalEvent('S63')">{{deviceInfos.S63.valueText}}{{deviceInfos.S63.valueText - 0 >= 0 ? deviceInfos.S63.unit : ''}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S63.loading"></i></td>
            <td><span>通讯波特率：</span><a class="button">2.4</a></td>
            <!-- <td></td> -->
            <td></td>
          </tr>
          <tr>
            <td colspan="4">&nbsp;</td>
          </tr>
          <tr>
            <td><span>{{deviceInfos.S70.name}}：</span><a class="button" @click="showEditModalEvent('S70')">{{deviceInfos.S70.valueText}}{{deviceInfos.S70.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S70.loading"></i></td>
            <td><span>{{deviceInfos.S71.name}}：</span><a class="button" @click="showEditModalEvent('S71')">{{deviceInfos.S71.valueArr[deviceInfos.S71.valueText]}}{{deviceInfos.S71.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S71.loading"></i></td>
            <td><span>{{deviceInfos.S72.name}}：</span><a class="button" @click="showEditModalEvent('S72')">{{deviceInfos.S72.valueText}}{{deviceInfos.S72.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S72.loading"></i></td>
            <td><span>{{deviceInfos.S73.name}}：</span><a class="button" @click="showEditModalEvent('S73')">{{deviceInfos.S73.valueText}}{{deviceInfos.S73.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S73.loading"></i></td>
          </tr>
          <tr>
            <td><span>{{deviceInfos.S75.name}}：</span><a class="button" @click="showEditModalEvent('S75')">{{deviceInfos.S75.valueText}}{{deviceInfos.S75.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S75.loading"></i></td>
            <td><span>{{deviceInfos.S76.name}}：</span><a class="button" @click="showEditModalEvent('S76')">{{deviceInfos.S76.valueText}}{{deviceInfos.S76.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S76.loading"></i></td>
            <td><span>{{deviceInfos.S77.name}}：</span><a class="button" @click="showEditModalEvent('S77')">{{deviceInfos.S77.valueText}}{{deviceInfos.S77.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S77.loading"></i></td>
            <td><span>{{deviceInfos.S78.name}}：</span><a class="button" @click="showEditModalEvent('S78')">{{deviceInfos.S78.valueText}}{{deviceInfos.S78.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S78.loading"></i></td>
          </tr>
          <tr>
            <td><span>{{deviceInfos.S79.name}}：</span><a class="button" @click="showEditModalEvent('S79')">{{deviceInfos.S79.valueText}}{{deviceInfos.S79.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S79.loading"></i></td>
            <td><span>{{deviceInfos.S90.name}}：</span><a class="button" @click="showEditModalEvent('S90')">{{deviceInfos.S90.valueText}}{{deviceInfos.S90.unit}}</a><i class="loading fa fa-refresh fa-spin" v-show="deviceInfos.S90.loading"></i></td>
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
          <div class="content-value">
            <span class="name">{{editModal2.paramsName}}：</span>
            <select name="deviceParams" v-model="editModal2.value" class="deviceParams">
              <option :value="$index + ''" v-for="value in editModal2.valueArr">{{value}}</option>
            </select>
          </div>
          <div class="tips">
            <span>{{editModal2.tips}}</span>
          </div>
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
                <option v-for="canSetParams in [true, false]" :value="canSetParams">{{canSetParams ? 'On' : 'Off'}}</option>
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
  import { globalMixins } from '../../mixins'
  import Modal from '../../components/Modal'
  // import locales from '../../../../consts/locales/index'
  // import io from 'socket.io-client'
  import XJSObject from '../../helpers/jssdk'
  // import decodeData from './datatools/decode'
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
        device_id: this.$route.params.device_id || 452873196,
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
          value: '',
          tips: ''
        },
        // 编辑浮层2
        editModal2: {
          show: false,
          paramsKey: '',
          paramsName: '',
          valueArr: [],
          value: '',
          tips: ''
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
            loading: false,
            name: '上限温度',
            valueText: '55',
            valueArr: [],
            modelType: '3',
            unit: '℃',
            tips: '温度范围-128℃~128℃'
          },
          S12: {
            loading: false,
            name: '下限温度',
            valueText: '45',
            valueArr: [],
            modelType: '3',
            unit: '℃',
            tips: '温度范围-128℃~128℃'
          },
          S13: {
            loading: false,
            name: '最高设定温度',
            valueText: '60',
            valueArr: [],
            modelType: '3',
            unit: '℃',
            tips: '温度范围-128℃~128℃'
          },
          S14: {
            loading: false,
            name: '最低设定温度',
            valueText: '10',
            valueArr: [],
            modelType: '3',
            unit: '℃',
            tips: '温度范围-128℃~128℃'
          },
          S15: {
            loading: false,
            name: '电加热投入环境温度',
            valueText: '7',
            valueArr: [],
            modelType: '3',
            unit: '℃',
            tips: '温度范围-128℃~128℃'
          },
          S19: {
            loading: false,
            name: '水温探头修正',
            valueText: '0',
            valueArr: [],
            modelType: '3',
            unit: '℃',
            tips: '温度范围-128℃~128℃'
          },
          S21: {
            loading: false,
            name: '压缩机启动延时',
            valueText: '3',
            valueArr: [],
            modelType: '3',
            unit: '分钟',
            tips: '0-10'
          },
          S22: {
            loading: false,
            name: '电加热启动压机连续工作时间',
            valueText: '10',
            valueArr: [],
            modelType: '3',
            unit: '小时',
            tips: '1 - 12'
          },
          S23: {
            loading: false,
            name: '压缩机停机温度',
            valueText: '-3',
            valueArr: [],
            modelType: '4',
            unit: '℃',
            tips: '-15-5  OFF'
          },
          S31: {
            loading: false,
            name: '化霜启动温度',
            valueText: '-3',
            valueArr: [],
            modelType: '3',
            unit: '℃',
            tips: '-20 – 20'
          },
          S32: {
            loading: false,
            name: '化霜结束温度',
            valueText: '10',
            valueArr: [],
            modelType: '3',
            unit: '℃',
            tips: '0 – 50'
          },
          S33: {
            loading: false,
            name: '化霜启动时间',
            valueText: '30',
            valueArr: [],
            modelType: '3',
            unit: '分钟',
            tips: '1 – 999'
          },
          S34: {
            loading: false,
            name: '最大化霜时间',
            valueText: '5',
            valueArr: [],
            modelType: '4',
            unit: '分钟',
            tips: 'Off 1 – 99 Off表示无化霜功能'
          },
          S37: {
            loading: false,
            name: '化霜四通阀模式',
            valueText: '0', // 0制热时关，化霜时开 1制热时开，化霜时关
            valueArr: ['制热时关，化霜时开', '制热时开，化霜时关'],
            modelType: '2',
            unit: '',
            tips: '0 – 1'
          },
          S40: {
            loading: false,
            name: '风机模式',
            valueText: '0', // 0单速风 1双速风
            valueArr: ['单速风', '双速风'],
            modelType: '2',
            unit: '',
            tips: '0 – 1'
          },
          S41: {
            loading: false,
            name: '风机关联的环境温度',
            valueText: '27',
            valueArr: [],
            modelType: '3',
            unit: '℃',
            tips: '15-40'
          },
          S42: {
            loading: false,
            name: '风机关联的排气温度',
            valueText: '110',
            valueArr: [],
            modelType: '3',
            unit: '℃',
            tips: '101-120'
          },
          S44: {
            loading: false,
            name: '是否使用过载保护',
            valueText: '0',
            valueArr: ['Yes', 'No'],
            modelType: '2',
            unit: '',
            tips: 'Yes/No'
          },
          S45: {
            loading: false,
            name: '电流显示',
            valueText: '-',
            valueArr: [],
            modelType: '0',
            unit: 'A',
            tips: ''
          },
          S46: {
            loading: false,
            name: '压缩机额定电流',
            valueText: '10',
            valueArr: [],
            modelType: '0',
            unit: 'A',
            tips: '1.0 - 99.9'
          },
          S47: {
            loading: false,
            name: '过载动作时间',
            valueText: '5',
            valueArr: [],
            modelType: '3',
            unit: '秒',
            tips: '1 - 999'
          },
          S48: {
            loading: false,
            name: '电加热判断电流',
            valueText: '6',
            valueArr: [],
            modelType: '3',
            unit: 'A',
            tips: '1 - 20'
          },
          S49: {
            loading: false,
            name: '电加热电流显示',
            valueText: '6',
            valueArr: [],
            modelType: '3',
            unit: 'A',
            tips: '实际读到的电加热电流'
          },
          S50: {
            loading: false,
            name: '低压告警模式',
            valueText: '2', // 0单速风 1双速风
            valueArr: ['无', '常开，闭合则告警', '常闭，断开则告警'],
            modelType: '2',
            unit: '',
            tips: '0 - 2 0-无 1-常开，闭合则告警 2-常闭，断开则告警'
          },
          S51: {
            loading: false,
            name: '低压告警自动恢复次数',
            valueText: '3',
            valueArr: [],
            modelType: '3',
            unit: '次',
            tips: '0 – 10'
          },
          S52: {
            loading: false,
            name: '外部告警自动恢复次数重置时间',
            valueText: '3',
            valueArr: [],
            modelType: '3',
            unit: '次',
            tips: '0 – 10'
          },
          S54: {
            loading: false,
            name: '高压告警模式',
            valueText: '0',
            valueArr: ['无', '常开，闭合则告警', '常闭，断开则告警'],
            modelType: '2',
            unit: '',
            tips: '0 - 2 0-无 1-常开，闭合则告警 2-常闭，断开则告警'
          },
          S55: {
            loading: false,
            name: '高压告警自动恢复次数',
            valueText: '3',
            valueArr: [],
            modelType: '3',
            unit: '次',
            tips: '0 – 10'
          },
          S56: {
            loading: false,
            name: '高压告警自动恢复次数重置时间',
            valueText: '60',
            valueArr: [],
            modelType: '3',
            unit: '分钟',
            tips: '0 – 999'
          },
          S58: {
            loading: false,
            name: '排气保护温度',
            valueText: '115',
            valueArr: [],
            modelType: '4',
            unit: '℃',
            tips: '50 – 125 OFF'
          },
          S59: {
            loading: false,
            name: '排气保护温度回差',
            valueText: '30',
            valueArr: [],
            modelType: '3',
            unit: '℃',
            tips: '1– 50'
          },
          S61: {
            loading: false,
            name: '掉电后是否记忆开关机状态',
            valueText: '0',
            valueArr: ['Yes', 'No'],
            modelType: '2',
            unit: '',
            tips: ''
          },
          S63: {
            loading: false,
            name: '背光延时',
            valueText: '30',
            valueArr: [],
            modelType: '4',
            unit: '秒',
            tips: 'Off 1 – 99 On Off表示不开背光 On表示背光常开 1-99表示按键操作后背光延时关闭'
          },
          S68: {
            loading: false,
            name: '是否使用电子膨胀阀',
            valueText: 'Yes',
            valueArr: ['Yes', 'No'],
            modelType: '2',
            unit: '',
            tips: 'Yes/No Yes:使用  No:不使用'
          },
          S70: {
            loading: false,
            name: '电子膨胀阀开度查询',
            valueText: '-',
            valueArr: [],
            modelType: '0',
            unit: '',
            tips: '0 - 480'
          },
          S71: {
            loading: false,
            name: '电子膨胀阀控制方式',
            valueText: '0',
            valueArr: ['自动', '手动', '环境'],
            modelType: '2',
            unit: '',
            tips: '0 - 2  0：自动 1：手动 2：环境'
          },
          S72: {
            loading: false,
            name: '电子膨胀阀手动设置开度',
            valueText: '350',
            valueArr: [],
            modelType: '3',
            unit: '',
            tips: '100 - 480'
          },
          S73: {
            loading: false,
            name: '过热度设定值',
            valueText: '3',
            valueArr: [],
            modelType: '3',
            unit: '℃',
            tips: '-15 – 15'
          },
          S74: {
            loading: false,
            name: '过热度稳定区',
            valueText: '2',
            valueArr: [],
            modelType: '3',
            unit: '℃',
            tips: '0-5'
          },
          S75: {
            loading: false,
            name: '过热度调节方向阔度',
            valueText: '2',
            valueArr: [],
            modelType: '3',
            unit: '℃',
            tips: '1-8'
          },
          S76: {
            loading: false,
            name: '电子膨胀阀排气设置',
            valueText: '92',
            valueArr: [],
            modelType: '3',
            unit: '℃',
            tips: '85 – 110'
          },
          S77: {
            loading: false,
            name: '电子膨胀阀排气回差',
            valueText: '5',
            valueArr: [],
            modelType: '3',
            unit: '℃',
            tips: '1-30'
          },
          S78: {
            loading: false,
            name: '环境温度显示',
            valueText: '-',
            valueArr: [],
            modelType: '0',
            unit: '℃',
            tips: ''
          },
          S79: {
            loading: false,
            name: '回气温度显示',
            valueText: '-',
            valueArr: [],
            modelType: '0',
            unit: '℃',
            tips: ''
          },
          S90: {
            loading: false,
            name: '显示型号和软件版本号',
            valueText: '-',
            valueArr: [],
            modelType: '0',
            unit: '',
            tips: '显示面板和主板的型号和软件版本号，字符串格式'
          },
          S101: {
            loading: false,
            name: '热水器运行模式',
            valueText: '0',
            valueArr: ['自动模式', '节能模式'],
            modelType: '2',
            unit: '',
            tips: '0：自动模式 1：节能模式'
          },
          S102: {
            loading: false,
            name: '热水器状态',
            valueText: '0',
            valueArr: ['关机', '待机', '制热', '告警', '化霜', '加氟', '测试'],
            modelType: '1',
            unit: '',
            tips: '0：关机 1：待机 2：制热 3：告警 4：化霜 5：加氟 6：测试'
          },
          S103: {
            loading: false,
            name: '时间设置1',
            valueText: '12:00-13:10',
            valueArr: [],
            modelType: '1',
            unit: '',
            tips: '数据格式：HH:MM-HH:MM'
          },
          S104: {
            loading: false,
            name: '时间设置2',
            valueText: '12:00-13:10',
            valueArr: [],
            modelType: '1',
            unit: '',
            tips: '数据格式：HH:MM-HH:MM'
          },
          S105: {
            loading: false,
            name: '时间设置3',
            valueText: '12:00-13:10',
            valueArr: [],
            modelType: '1',
            unit: '',
            tips: '数据格式：HH:MM-HH:MM'
          },
          S106: {
            loading: false,
            name: '热水器上传监控数据',
            valueText: '35.6,24.0,25,26.5',
            valueArr: [],
            modelType: '3',
            unit: '',
            tips: '数据格式：水箱温度，化霜温度，排气温度，环境温度 （备注：时间用服务器收到时间）'
          },
          S107: {
            loading: false,
            name: '故障信息上报',
            valueText: '35.6,24.0,25,26.5',
            valueArr: [],
            modelType: '3',
            unit: '',
            tips: '故障代码，见热水器说明书 （备注：故障代码可以传多个）'
          },
          S108: {
            loading: false,
            name: '一键强制加热',
            valueText: '1',
            valueArr: [],
            modelType: '3',
            unit: '',
            tips: '此命令由服务端发送给热水器，热水器自己判断是否强制加热'
          },
          S109: {
            loading: false,
            name: '当前水温',
            valueText: '1',
            valueArr: [],
            modelType: '0',
            unit: '℃',
            tips: '热水器水温变化时上传'
          },
          S110: {
            loading: false,
            name: '控制器时钟',
            valueText: '11:20',
            valueArr: [],
            modelType: '0',
            unit: '℃',
            tips: '上发：报告给服务器控制器时钟 下发：设置控制器时钟'
          },
          S111: {
            loading: false,
            name: '控制器累计运行时间',
            valueText: '680:20',
            valueArr: [],
            modelType: '0',
            unit: '℃',
            tips: '上发：报告给服务器控制器压缩机累计运行时间 下发：清零控制器累计运行时间 数据格式：小时:分钟'
          },
          test: {
            name: '上限温度',
            valueText: '55',
            valueArr: ['自动模式', '节能模式'],
            modelType: '4',
            unit: '℃',
            tips: '时间格式为 00:00 - 23:59'
          },
          paramsKey00: {
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
          paramsKey11: {
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
        deviceOnline: true
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
          XJSObject.invoke('sendXDeviceData', {data: data}, function (r) {
            console.log('sendXDeviceData结果：' + JSON.stringify(r))
            self.modalCancel()
            self.settingData = false
            if (r.status === 200 && !/S100/.test(data)) {
              self.showNotice({
                type: 'success',
                content: '数据发送成功'
              })
            } else if (r.status === 202) {
              self.deviceOnline = false
              self.showNotice({
                type: 'error',
                content: '设备不在线'
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
            self.decodeData(r.data, self)
          }
        })
        // 设备状态改变
        XJSObject.on('onXDeviceStateChange', function (r) {
          console.log('设备状态改变:' + JSON.stringify(r))
          if (r.deviceid.toString() === self.device_id && r.status === 0) {
            self.deviceOnline = false
          } else if (r.deviceid.toString() === self.device_id && r.status === 1) {
            self.deviceOnline = true
          }
        })
      },
      /**
       * 确定按钮事件
       * @param {object} productInfo 当前正在编辑的对象
       */
      setDataEvent (deviceInfo, num) {
        var self = this
        var paramsKey = deviceInfo.paramsKey
        var value = deviceInfo.value
        if (num === 1) {
          self.editModal1.value = self.editModal1.startHour + ':' + self.editModal1.startMinute + '-' + self.editModal1.endHour + ':' + self.editModal1.endMinute
        }
        if (num === 2) {
          if (deviceInfo.valueArr[0] === 'Yes') {
            value = deviceInfo.valueArr[deviceInfo.value]
          }
        }
        if (num === 4) {
          if (!deviceInfo.canSetParams) {
            value = 'Off'
          }
        }
        if (this['validation' + num].$valid || num === 2) {
          self.settingData = true
          self.deviceInfos[deviceInfo.paramsKey].loading = true
          setTimeout(() => {
            self.deviceInfos[deviceInfo.paramsKey].loading = false
          }, 5000)
          console.log('向设备发送数据：' + '/' + deviceInfo.paramsKey + '/1/' + deviceInfo.value + '\n')
          self.sendDeviceData('/' + paramsKey + '/1/' + value + '\n')
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
        var deviceInfo = {
          paramsKey: 'S110',
          value: self.editModal5.hour + ':' + self.editModal5.minute
        }
        self.setDataEvent(deviceInfo, 5)
      },
      /**
       * 解析设备返回的数据
       * @param  {string} data data
       * @return {[type]}      [description]
       */
      decodeData (data) {
        var self = this
        var key = data.split('/1/')[0].replace('/', '')
        var value = data.split('/1/')[1] && data.split('/1/')[1].split('\r')[0]
        if (value) {
          if (key === 'S100') {
            // console.log('所有数据' + JSON.stringify(data))
            var arr = self._parseData(data)
            arr.forEach((item, index) => {
              if (self.deviceInfos['S' + item.key]) {
                if (item.key === '44' || item.key === '61') {
                  self.deviceInfos['S' + item.key].valueText = (item.value === 'Yes' ? '0' : '1')
                } else {
                  // console.log(self.deviceInfos['S' + item.key].valueText)
                  self.deviceInfos['S' + item.key].valueText = item.value
                }
              }
            })
          } else {
            if (self.deviceInfos[key]) {
              self.deviceInfos[key].loading = false
              self.deviceInfos[key].valueText = value
              if (/yes|no/ig.test(value)) {
                self.deviceInfos[key].valueText = /yes/ig.test(value) ? '0' : '1'
              }
            }
          }
        }
      },
      /**
       * 获取设备信息
       * @return {[type]} [description]
       */
      getDeviceInfos () {
        var self = this
        // console.log('获取产品信息')
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
        // console.log('设置控制器时间')
        if (self.deviceOnline) {
          // 这里需要获取最新的控制器时间
          self.editModal5.hour = self.deviceInfos.S110.valueText.split(':')[0]
          self.editModal5.minute = self.deviceInfos.S110.valueText.split(':')[1]
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
            console.log('连接设备结果：' + JSON.stringify(r))
            if (r.status === 200) {
              self.getDeviceInfos()
              console.log('设备已经连接')
              self.deviceOnline = true
            } else {
              self.deviceOnline = false
            }
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
          if (self.deviceInfos[paramsKey] && (self.deviceInfos[paramsKey].modelType - 0 > 0)) {
            self.settingData = false
            self['showEditModal' + self.deviceInfos[paramsKey].modelType](paramsKey)
          } else {
            self.showNotice({
              type: 'error',
              content: '不可控'
            })
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
        if (self.deviceInfos[paramsKey].valueText.split('-')[1]) {
          self.editModal1.startHour = self.deviceInfos[paramsKey].valueText.split('-')[0].split(':')[0]
          self.editModal1.startMinute = self.deviceInfos[paramsKey].valueText.split('-')[0].split(':')[1]
          self.editModal1.endHour = self.deviceInfos[paramsKey].valueText.split('-')[1].split(':')[0]
          self.editModal1.endMinute = self.deviceInfos[paramsKey].valueText.split('-')[1].split(':')[1]
        } else {
          self.editModal1.startHour = '00'
          self.editModal1.startMinute = '00'
          self.editModal1.endHour = '00'
          self.editModal1.endMinute = '00'
        }
        self.editModal1.paramsName = self.deviceInfos[paramsKey].name
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
        // var a = false
        if (self.deviceInfos[paramsKey].valueArr) {
          // for (var i = 0; i < self.deviceInfos[paramsKey].valueArr.length; i++) {
          //   if (self.deviceInfos[paramsKey].valueText === self.deviceInfos[paramsKey].valueArr[i]) {
          //     a = true
          //   }
          // }
          self.editModal2.paramsName = self.deviceInfos[paramsKey].name
          self.editModal2.value = self.deviceInfos[paramsKey].valueText
          self.editModal2.valueArr = self.deviceInfos[paramsKey].valueArr
          self.editModal2.tips = self.deviceInfos[paramsKey].tips
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
          if (Number(self.deviceInfos[paramsKey].valueText)) {
            self.editModal4.canSetParams = true
            self.editModal4.value = self.deviceInfos[paramsKey].valueText
          } else {
            self.editModal4.value = '0'
          }
          self.editModal4.paramsName = self.deviceInfos[paramsKey].name
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
      },
      /**
       * 解析S100数据
       * @param  {[type]} str [description]
       * @return {[type]}     [description]
       */
      _parseData (str) {
        var arr = str.replace(/\/S100\/1\//, '').split(',')
        var tempStr = ''
        var result = []

        var abc = (a, s) => {
          var arr = s.split('=')
          a.push({
            key: arr[0],
            value: arr[1]
          })
        }

        arr.forEach((item, index) => {
          if (!index) {
            tempStr = item
          } else if (/.+=/.test(item) && tempStr.length) {
            abc(result, tempStr)
            tempStr = item
            if (index === arr.length - 1) {
              abc(result, item)
            }
          } else {
            tempStr += `,${item}`
            return
          }
        })
        return result
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../assets/stylus/common'

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
        .loading
          margin-left 10px
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
        .content-value
          padding-bottom 10px
          .deviceParams
            height 30px
            font-size 14px
        .tips
          font-size 14px
          color #999
          padding 10px 0
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
