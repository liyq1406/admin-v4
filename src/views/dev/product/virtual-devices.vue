<template>
  <div class="main virtual-devices">
    <div class="main-title">
      <h2>虚拟设备</h2>
    </div>
    <div class="container">
      <div class="device-details-box row">
        <div class="panel no-split-line" :class="mainPanelClass">
          <div class="panel-hd bordered row">
            <div class="msg-box fl col-10">
              <div class="title">
                <h2 class="product-title mt5 mb5">智能烤箱</h2>
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
                  <tr v-for="n in 5">
                    <td class="w50">{{n}}</td>
                    <td class="w80">power</td>
                    <td class="value-td">
                      <div class="input-box">
                        <div class="number-box" v-show="n===1">
                          <range :line-width="'95%'"></range>
                        </div>
                        <div class="range-box" v-show="n===2">
                          <label class="mr20">
                            <input type="radio" :name="'value'+$index">on
                          </label>
                          <label class="mr20">
                            <input type="radio" :name="'value'+$index">off
                          </label>
                        </div>
                        <div class="number-box" v-show="n===3">
                          <div class="input-text-wrap">
                            <input type="text" class="input-text input-text-sm">
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
import SearchBox from 'components/SearchBox'
import Pager from 'components/Pager'
import Range from 'components/Range'
import Switch from 'components/Switch'

export default {
  name: 'VirtualDevices',

  mixins: [globalMixins],
  components: {
    'search-box': SearchBox,
    Pager,
    Switch,
    Range
    // 'api': api,
    // 'v-select': Select,
    // 'c-table': Table,
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
      hideDownLoad: false
    }
  },
  computed: {
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
  methods: {
    switchRightPanel () {
      this.hideDownLoad = !this.hideDownLoad
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
        padding-left 14px
        box-sizing border-box
      .app-name
        color #5B9BD1
        font-size 5px
        font-weight 700
</style>
