<template>
  <section class="main-wrap">
    <div class="main snapshot-details">
      <div class="breadcrumb"><a v-link="{path: '/data/snapshot' }"><i class="fa fa-arrow-circle-left"></i>数据快照</a></div>
      <div class="row">
        <div class="col-24">
          <div class="panel row">
            <div class="panel-hd">
              <h2>净化器设备快照</h2>
            </div>
            <div class="panel-bd layout-left">
              <div class="device-list-box">
                <div class="action-bar">
                  <search-box :key.sync="query" :active="searching" :placeholder="$t('overview.addForm.search_condi')" @cancel="" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="">
                    <v-select width="80px" :label="queryType.label">
                      <select v-model="queryType">
                        <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                      </select>
                    </v-select>
                    <button slot="search-button" @click="" class="btn btn-primary">{{ $t('common.search') }}</button>
                  </search-box>
                </div>
                <table class="table table-stripe table-bordered">
                  <thead>
                    <tr>
                      <th>设备ID</th>
                      <th>设备标识(MAC)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="deviceData in deviceDatas" :class="{'selected': deviceData.selected}" @click="selectedDeviceDataEvent(deviceData)">
                      <td>{{ deviceData.id }}</td>
                      <td>{{ deviceData.mac }}</td>
                    </tr>
                    <tr v-if="deviceDatas.length === 0">
                      <td colspan="2" class="tac"><i v-if="$loadingRouteData" class="fa fa-refresh fa-spin"></i>
                        <div v-else class="tips-null">暂无数据</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <pager v-if="true" :total="total" :current.sync="currentPage" :page-count="pageCount"></pager>
              </div>
            </div>
            <div class="panel-bd layout-right">
              <div class="device-details-box">
                <div class="device-msg-box">
                  <div class="header-box row">
                    <div class="device-base-msg-box col-12 row">
                      <div class="device-picture col-6">
                        <img>
                      </div>
                      <div class="device-base-msg row col-18">
                        <p>
                          <i>设备ID：</i>
                          <span>1999246249</span>
                        </p>
                        <p>
                          <i>MAC：</i>
                          <span>163D18E5B72E</span>
                        </p>
                        <p>
                          <i>在线状态：</i>
                          <span>下线</span>
                        </p>
                      </div>
                    </div>
                    <div class="operation-box col-12">
                      <div class="check-device">
                        <button class="btn btn-primary" v-link="{path: '/products/123/overview'}">查看设备</button>
                      </div>
                      <div class="radio-group-box">
                        <radio-group :items="periods" :value.sync="period" @select=""><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-group>
                      </div>
                    </div>
                  </div>
                  <div class="chart-box">
                    <div class="panel-bd with-loading">
                      <line-chart :series="snapshotSeries" :x-axis-data="snapshotXAxisData" v-ref:trend-chart></line-chart>
                      <div class="icon-loading" v-show="loadingProductTrends">
                        <i class="fa fa-refresh fa-spin"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="device-data-table-box">
                  <div class="title">
                    <span>设备数据明细 : </span>
                  </div>
                  <div class="table-box">
                    <table class="table table-stripe table-bordered">
                      <thead>
                        <tr>
                          <th>索引</th>
                          <th>端点ID</th>
                          <th>描述</th>
                          <th>当前状态</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="n in 10">
                          <td>{{ $index }}</td>
                          <td>设备{{ $index }}</td>
                          <td>{{ '描述' }}</td>
                          <td>{{ '当前状态' }}</td>
                        </tr>
                        <tr v-if="false">
                          <td colspan="4" class="tac"><i v-if="$loadingRouteData" class="fa fa-refresh fa-spin"></i>
                            <div v-else class="tips-null">暂无数据</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import Vue from 'vue'
  import locales from '../../consts/locales/index'
  // import api from '../../api'
  import RadioGroup from '../../components/RadioGroup'
  import dateFormat from 'date-format'
  import LineChart from '../../components/charts/Line'
  import Pager from '../../components/Pager'
  import SearchBox from '../../components/SearchBox'
  import Select from '../../components/Select'
  import Modal from '../../components/Modal'
  import { globalMixins } from '../../mixins'

  export default {
    name: 'TableDetails',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'modal': Modal,
      'radio-group': RadioGroup,
      'line-chart': LineChart,
      'search-box': SearchBox,
      'v-select': Select,
      'pager': Pager
    },

    data () {
      return {
        /** ***图表 按钮 start*********/
        loadingProductTrends: false,
        periods: locales[Vue.config.lang].periods,
        period: 7,
        /* ******图表 按钮 end*************/
        query: '',
        searching: false,
        queryTypeOptions: [
          { label: '设备ID', value: 'id' },
          { label: 'MAC', value: 'mac' }
        ],
        queryType: {
          label: 'MAC',
          value: 'mac'
        },
        total: 100,
        currentPage: 1,
        pageCount: 10,
        deviceDatas: [
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: true
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          },
          {
            id: '1999246249',
            mac: '163D18E5B72E',
            selected: false
          }
        ],
        snapshotSeries: [
          {
            name: '温度',
            type: 'line',
            data: [0, 0, 0, 0, 0, 0, 0]
          }
        ]
      }
    },

    computed: {
      selectedDeviceData () {
        this.deviceDatas.map((deviceData) => {
          if (deviceData.selected) {
            return deviceData
          }
        })
      },
      queryCondition () {
        var condition = {
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount
        }
        return condition
      },

      // 图表横轴数据
      snapshotXAxisData () {
        var today = new Date()
        var result = []
        for (var i = this.period - 1; i >= 0; i--) {
          result[i] = dateFormat('MM-dd', new Date(today - (this.period - i - 1) * 24 * 3600 * 1000))
        }
        return result
      }
    },

    route: {
      data () {
      }
    },

    ready () {
      // 监听窗口尺寸变化
      window.onresize = () => {
        this.$refs.trendChart.chart.resize()
      }
    },
    methods: {
      // 搜索
      handleSearch () {
        console.log('搜索')
      },

      /**
       * 切换搜索
       * @return {[type]} [description]
       */
      toggleSearching () {
        console.log('切换搜索')
      },

      /**
       * 选择数据端点事件
       * @return {[type]} [description]
       */
      selectedDeviceDataEvent (deviceData) {
        this.deviceDatas.map((item) => {
          item.selected = false
        })
        deviceData.selected = true
      }
    }
  }
</script>

<style lang="stylus">

  .snapshot-details
    .layout-left
      width 328px
      float left
      z-index 1
    .layout-right
      width 100%
      padding-left 328px
      box-sizing border-box
    .device-list-box
      margin 20px 20px 20px 0
      box-sizing border-box
      .action-bar
        padding-top 0
      .search-box-input
        width 163px
        overflow hidden
      .table-stripe tbody tr.selected:nth-child(2n+1) td
      .table-stripe tbody tr.selected td
        background #c0252e
        color #fff
      .table-stripe tbody tr.selected:hover td
        background #c0252e
        cursor pointer
      .table-stripe tbody tr:hover td
        background lighten(#000, 93%)
        cursor pointer
    .device-details-box
      margin 20px 0 20px 0
      .device-msg-box
        border 1px solid #e0e0e0
      .header-box
        padding 15px 20px
        box-sizing border-box
        height 90px
        overflow hidden
        .device-picture
          width 65px
          height 65px
          background url('../../assets/images/device_thumb.png') center/100%
        .device-base-msg
          height 60px
          line-height 23px
          padding-left 10px
          box-sizing border-box
          p
            font-size 12px
            margin 0
            i
              display inline-block
              width 60px
      .chart-box
        width 100%
        padding-right 20px
        box-sizing border-box
      .device-data-table-box
        margin-top 20px
        .title
          font-size 16px
    .operation-box
      position relative
      height 70px
      .check-device
        position absolute
        right 0
        top 0
      .radio-group-box
        position absolute
        right 0
        bottom 0

</style>
