<template>
  <div class="main device-debug">
    <div class="main-title">
      <h2>设备调试</h2>
    </div>
    <div class="container table">
      <div class="device-list-box table-cell" v-show="!showLog">
        <div class="header-box">
          <div class="title mt10">
            <span>设备列表</span>
          </div>
          <div class="button-group">
            <button class="add-devices btn btn-ghost">添加设备</button>
            <button class="search btn btn-ghost"><i class="fa fa-search"></i></button>
            <div class="search-box" v-show="true">
              <search-box :placeholder="'请输入abc'"></search-box>
            </div>
          </div>
        </div>
        <div class="body-box">
          <div class="devices-box">
            <div class="device" v-for="n in 5" :class="{'selected': n===1}">
              <div class="status-box w30">
                <div class="status">
                  <i class="fa success" v-show="n!==2 && n!==3"></i>
                  <i class="fa fail" v-show="n===2"></i>
                  <i class="fa fa-question-circle" v-show="n===3"></i>
                </div>
              </div>
              <div class="device-msg-box">
                <div class="mac">
                  <span>AE9F8C007A19</span>
                </div>
                <div class="id">
                  <span>ID：P8301831111</span>
                </div>
              </div>
            </div>
          </div>
          <div class="pager-box">
            <pager :simple="true"></pager>
          </div>
        </div>
      </div>

      <div class="device-details-box table-cell">
        <div class="panel">
          <div class="panel-hd bordered row">
            <div class="msg-box fl col-10">
              <div class="title">
                <h2 class="product-title mt5 mb5">智能烤箱</h2>
              </div>
              <div class="type-box">
                <div class="status-box">
                  <span class="status-text"><i class="fa mr5" :class="{'success': true, 'fail': false}"></i>在线</span>
                  <span class="status-date ml10">2016-07-01</span>
                  <span class="status-time ml10">17:32:01</span>
                </div>
              </div>
            </div>
            <div class="filter-bar fr col-14">
              <div class="filter-group fr">
                <div class="filter-group-item mt10">
                  <button class="btn btn-ghost" @click="showLog = !showLog">
                    <i class="fa fa-angle-double fa-angle-double-left" v-show="!showLog"></i>
                    <i class="fa fa-angle-double fa-angle-double-right" v-show="showLog"></i>
                    设备日志
                  </button>
                </div>
                <div class="filter-group-item">
                  <search-box :placeholder="'搜索端点ID'">
                    <button slot="search-button" @click="" class="btn btn-primary"><i class="fa fa-search"></i></button>
                  </search-box>
                </div>
                <div class="filter-group-item mt5">
                  <div class="filter-device-info">
                    <label>ID:</label>
                    <span>P830183111</span>
                  </div>
                  <div class="filter-device-info">
                    <label>MAC:</label>
                    <span>AE9F8C007A19</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="panel-bd row">
            <div class="table-box" :class="{'col-16': showLog, 'col-24': !showLog}">
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
            <div class="log-box" v-show="showLog" :class="'col-8'">
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
  name: 'DeviceDebug',

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
      showLog: true,
      logs: [
        {
          time: '123',
          msg: ['msg']
        }
      ]
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import '../../../assets/stylus/common'

  .device-debug
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
</style>
