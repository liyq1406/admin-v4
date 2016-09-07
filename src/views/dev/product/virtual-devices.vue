<template>
  <div class="main virtual-devices">
    <div class="main-title">
      <h2>虚拟设备</h2>
    </div>
    <div class="container">
      <div class="device-details-box row">
        <div class="panel" :class="mainPanelClass">
          <div class="panel-hd bordered row">
            <div class="msg-box fl col-10">
              <div class="title">
                <h2 class="product-title mt5 mb5">{{ currentProduct.name + ' (Demo)' }}</h2>
              </div>
              <div class="type-box">
                <div class="status-box">
                  <span class="status-text"><i class="fa mr5" :class="{'success': true, 'fail': false}"></i>在线</span>
                  <label class="ml20 filter-device-info">MAC:</label>
                  <span class="filter-device-info">AE9F8C007A19</span>
                </div>
              </div>
            </div>
            <div class="filter-bar fr col-14">
              <div class="filter-group fr">
                <div class="filter-group-item mt15">
                  <button @click="switchRightPanel" class="btn btn-ghost">
                    <i class="fa fa-angle-double fa-angle-double-left" v-show="hideDownLoad"></i>
                    <i class="fa fa-angle-double fa-angle-double-right" v-show="!hideDownLoad"></i>
                    设备日志
                  </button>
                </div>
                <div class="filter-group-item mt15 mr20">
                  <switch :value.sync="connect"></switch>
                </div>
              </div>
            </div>
          </div>
          <div class="panel-bd row">
            <div class="table-box" :class="tableClass">
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
                      <div class="input-box">
                        <div class="number-box" v-if="dataPointType(datapoint.type) === 'number'">
                          <range v-if="dataPointType(datapoint.type) === 'number'" :line-width="'95%'" :min="datapoint.min" :max="datapoint.max" :value="datapoint.value" :expand="datapoint" @changed="setRangeValue"></range>
                        </div>
                        <div class="range-box" v-show="dataPointType(datapoint.type) === 'boolean'">
                          <label class="mr20">
                            <input type="radio" :name="'value'+$index" :value="true" v-model="datapoint.value" @change="setDataEvent(datapoint)"> true
                          </label>
                          <label class="mr20">
                            <input type="radio" :name="'value'+$index" :value="false" v-model="datapoint.value" @change="setDataEvent(datapoint)"> false
                          </label>
                        </div>
                        <div class="number-box" v-show="dataPointType(datapoint.type) === 'string'">
                          <div class="input-text-wrap">
                            <input type="text" class="input-text input-text-sm" v-model="datapoint.value" @change="setDataEvent(datapoint)">
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-show="hideDownLoad" class="col-8">
              <!-- Start: 设备日志-->
              <div class="log-panel">
                <div class="log-panel-hd">
                  <div class="actions">
                    <switch :value.sync="showLog" size="small"></switch>
                  </div>
                  <h2>{{ $t('ui.device.log') }}</h2>
                </div>
                <div class="log-panel-bd">
                  <code class="output-log">
                    <div v-for="log in logs" class="log"><span class="time">{{ log.time }}</span>
                      <!-- <template v-if="log.type === 'user'"><span class="user">{{ log.msg[0] }}</span><span class="msg">: {{ log.msg[1] }}</span></template>
                      <template v-if="log.type === 'status'"><span :class="{'msg-success':log.msg[0]===200, 'msg-error':log.msg[0]!==200}">{{ log.msg[0] }}</span><span class="msg">: {{ log.msg[1] }}</span></template>
                      <template v-if="log.type === 'connected'"><span class="msg-success">{{ log.msg }}</span></template>
                      <template v-if="log.type === 'disconnected'"><span class="msg-error">{{ log.msg }}</span></template> -->
                    </div>
                  </code>
                </div>
              </div>
              <!-- End: 设备日志-->
            </div>
          </div>
        </div>
        <div v-show="!hideDownLoad" class="col-5 download-panel">
          <div class="title">设备二维码</div>
          <div class="qrcode">
            <img src="/static/images/device-qrcode.png"></img>
          </div>
          <div class="tip-qrcode">
            <span>请使用xlink APP扫描二维码</span>
          </div>
          <div class="tip-download">
            <span>提示：请先下载Demo APP后扫描二维码连接虚拟设备。</span>
          </div>
          <div class="ios row">
            <div class="col-8 icon">
              <img src="/static/images/download-ios.png" alt="">
            </div>
            <div class="col-16">
              <div class="app-name">
                <span>Xlink Demo APP</span>
              </div>
              <div class="version">
                <span>v1.2.0</span>
              </div>
              <div class="date">
                <span>2016-07-17</span>
              </div>
            </div>
          </div>
          <div class="android row">
            <div class="col-8 icon">
              <img src="/static/images/download-android.png" alt="">
            </div>
            <div class="col-16">
              <div class="app-name">
                <span>Xlink Demo APP</span>
              </div>
              <div class="version">
                <span>v1.2.0</span>
              </div>
              <div class="date">
                <span>2016-07-17</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import { setCurrProductMixin } from './mixins'
import SearchBox from 'components/SearchBox'
import Pager from 'components/Pager'
import Range from 'components/Range1'
import Switch from 'components/Switch'
import api from 'api'
import _ from 'lodash'

export default {
  name: 'VirtualDevices',

  mixins: [globalMixins, setCurrProductMixin],

  components: {
    'search-box': SearchBox,
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
      logs: [
        {
          time: '123',
          msg: ['msg']
        }
      ],
      showLog: false,
      connect: false,
      hideDownLoad: false,
      datapoints: [],
      datapointValues: {}
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
      return _.orderBy(result, ['index'], ['asc'])
    },
    tableClass () {
      if (this.hideDownLoad) {
        return 'col-16'
      } else {
        return 'col-24'
      }
    },
    mainPanelClass () {
      if (this.hideDownLoad) {
        return 'col-24'
      } else {
        return 'col-19'
      }
    }
  },

  route: {
    data () {
      this.getDatapoints()
    }
  },
  methods: {
    /**
     * 获取数据端点列表
     * @return {[type]} [description]
     */
    getDatapoints () {
      api.product.getDatapoints(this.$route.params.id).then((res) => {
        if (res.status === 200) {
          this.datapoints = res.data
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    setDataEvent (dp) {
      console.log('设置数据端点值')
      console.log(dp)
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
    switchRightPanel () {
      this.hideDownLoad = !this.hideDownLoad
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
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '../../../assets/stylus/common'

  .virtual-devices
    .table
      display table
    .table-cell
      display table-cell
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
      .device-list-box
        width 230px
        border-right 1px solid #ddd
        min-height 600px
        padding-left 10px
        box-sizing border-box
        .header-box
          padding-left 10px
          padding-bottom 10px
          .button-group
            margin-top 5px
            line-height 35px
            .add-devices
              width 139px
              margin-right 5px
          .search-box
            width 100%
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
          .pager-box
            width 100%
            padding-right 10px
            box-sizing border-box
      .panel-bd
        min-height 400px
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
  .download-panel
    margin-top -10px
    border-left 1px solid #e5e5e5
    box-sizing border-box
    padding 15px
    .title
      margin-top 20px
      font-size 16px
      text-align center
    .qrcode
      margin-top 10px
      text-align center
      img
        size 185px
    .tip-qrcode
      font-size 10px
      color #666666
      text-align center
    .tip-download
      margin-top 15px
      padding-top 15px
      border-top 1px solid #e5e5e5
      font-size 10px
      color #666666
      text-align center
    /*.ios
      margin-top 20px
      .icon
        padding-left 10px
        box-sizing border-box*/
    .android, .ios
      margin-top 20px
      .icon
        text-align center
        box-sizing border-box
      .app-name
        color #5B9BD1
        font-size 13px
        font-weight 700
</style>
