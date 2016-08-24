<template>
  <div class="main">
    <div class="main-title">
      <h2>{{product.name}}设备快照</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="snapshot-details" v-if="!deviceDatas.length && !loadingData">
      <div class="panel">
        <v-alert :cols="7">
          <p>该产品暂无设备</p>
        </v-alert>
      </div>
    </div>
    <div class="snapshot-details with-loading" v-else>
      <div class="icon-loading" v-show="loadingData">
        <i class="fa fa-refresh fa-spin"></i>
      </div>
      <div class="row">
        <div class="col-24">
          <div class="panel row">
            <div class="panel-bd layout-left">
              <div class="device-list-box">
                <div class="action-bar">
                  <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @cancel="getDevices(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getDevices(true)">
                    <v-select width="130px" :label="queryType.label" size="small">
                      <select v-model="queryType">
                        <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                      </select>
                    </v-select>
                    <button slot="search-button" @click="getDevices(true)" class="btn btn-primary"><i class="fa fa-search"></i></button>
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
                      <td>
                        <div class="text-overflow w110">
                          {{ deviceData.mac }}
                        </div>
                      </td>
                    </tr>
                    <tr v-if="deviceDatas.length === 0">
                      <td colspan="2" class="tac"><i v-if="$loadingRouteData" class="fa fa-refresh fa-spin"></i>
                        <div v-else class="tips-null">暂无数据</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" :simple="true" @page-update="getDevices"></pager>
              </div>
            </div>
            <div class="panel-bd layout-right">
              <div class="device-details-box">
                <div class="device-msg-box">
                  <div class="header-box row">
                    <div class="device-base-msg-box col-15 row">
                      <div class="device-picture col-6">
                        <img>
                      </div>
                      <div class="device-base-msg row col-18">
                        <p>
                          <i>设备ID：</i>
                          <span>{{selectedDeviceData.id}}</span>
                        </p>
                        <p>
                          <i>MAC：</i>
                          <span>{{selectedDeviceData.mac}}</span>
                        </p>
                        <p>
                          <i>在线状态：</i>
                          <span v-if="selectedDeviceData.is_online=== true">在线</span>
                          <span v-else>下线</span>
                        </p>
                      </div>
                    </div>
                    <div class="operation-box col-9">
                      <div class="check-device hidden">
                        <button class="btn btn-primary" v-link="{path: '/dev/products/' + this.$route.params.product_id + '/devices/' + selectedDeviceData.id}">查看设备</button>
                      </div>
                      <div class="radio-group-box">
                        <radio-button-group :items="periods" :value.sync="period" @select="getSnapshot"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
                      </div>
                    </div>
                  </div>
                  <button style="margin-left:90px" class="btn btn-ghost btn-sm" @click="showEditModal=true"><i class="fa fa-edit"></i>选择显示的索引数据</button>
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
                    <intelligent-table :headers.sync="snapshotHeader" :tables="snapshots | limitBy countPerPage2 (currentPage2-1)*countPerPage2"></intelligent-table>
                    <pager v-if="snapshots.length > countPerPage2" :total="snapshots.length" :current.sync="currentPage2" :count-per-page="countPerPage2"></pager>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--修改快照数据索引项浮层-->
     <modal :show.sync="showEditModal" width="600px">
       <h3 slot="header">选择快照数据项</h3>
       <div slot="body" class="form">
         <div class="table-wrap" style="overflow-x: hidden">
           <div class="data-table">
             <table class="table table-stripe table-bordered">
               <thead>
                 <tr>
                   <th>索引</th>
                   <th>端点ID</th>
                   <th>描述</th>
                   <th>选择</th>
                   <!-- <th>端点ID</th> -->
                 </tr>
               </thead>
               <tbody>
                 <tr v-for="datapoint in datapoints | limitBy countPerPage3 (currentPage3-1)*countPerPage3">
                   <td>{{datapoint.index}}</td>
                   <td>{{datapoint.name}}</td>
                   <td>{{datapoint.description}}</td>
                   <td><input v-model="datapoint.selected" type="checkbox"/></td>
                 </tr>
               </tbody>
             </table>
           </div>
           <div class="data-points-footer">
             <pager v-if="datapoints.length > countPerPage3" :total="datapoints.length" :current.sync="currentPage3" :count-per-page="countPerPage3" @page-update=""></pager>
           </div>
         </div>
         <div class="form-actions snapshot-select">
           <!-- <button @click="onEditCancel" class="btn btn-default">{{ $t("common.cancel") }}</button> -->
           <button @click="saveDataPoints" type="submit" :disabled="adding" :class="{'disabled':adding}" v-text="adding ? $t('common.handling') : $t('common.ok')" class="btn btn-primary"></button>
         </div>
       </div>
     </modal>
     <!-- 结束添加选择快照数据项浮层-->
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import locales from 'consts/locales/index'
import api from 'api'
import RadioButtonGroup from 'components/RadioButtonGroup'
// import dateFormat from 'date-format'
import LineChart from 'components/charts/Line'
import Pager from 'components/Pager'
import SearchBox from 'components/SearchBox'
import Select from 'components/Select'
import Modal from 'components/Modal'
import IntelligentTable from 'components/IntelligentTable'
import { globalMixins } from 'src/mixins'
import Alert from 'components/Alert'
import Breadcrumb from 'components/Breadcrumb'

export default {
  name: 'TableDetails',

  mixins: [globalMixins],

  components: {
    Modal,
    RadioButtonGroup,
    LineChart,
    SearchBox,
    Pager,
    IntelligentTable,
    Breadcrumb,
    'v-select': Select,
    'v-alert': Alert
  },

  data () {
    return {
      breadcrumbNav: [{
        label: '数据快照',
        link: '/dev/data/snapshots'
      }, {
        label: '数据快照详情'
      }],
      /** ***图表 按钮 start*********/
      loadingProductTrends: false,
      periods: locales[Vue.config.lang].data.SHORT_PERIODS,
      period: 1,
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
      showEditModal: false,
      total: 0,
      currentPage: 1,
      currentPage2: 1,
      currentPage3: 1,
      countPerPage: 20,
      countPerPage2: 10,
      countPerPage3: 10,
      product: {},
      deviceDatas: [
        // {
        //   id: '1999246249',
        //   mac: '163D18E5B72E',
        //   selected: true
        // },
        // {
        //   id: '1999246249',
        //   mac: '163D18E5B72E',
        //   selected: false
        // }
      ],
      datapoints: [],
      snapshotSeries: [
        {
          name: '温度',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0]
        }
      ],
      snapshots: [],
      allSnapshots: [],
      loadingData: true,
      // snapshotHeader: [
      //   {
      //     key: 'snapshot_date', // 与tables的key对应
      //     title: '时间' // 标题内容
      //   // },
      //   // {
      //   //   key: 'creatTime',
      //   //   title: 'ID'
      //   // },
      //   // {
      //   //   key: 'updateTime',
      //   //   title: '更新时间'
      //   }
      // ],
      // snapshotTable: [
      //   {
      //     snapshot_date: ''
      //     // creatTime: '123',
      //     // updateTime: '更新时间',
      //     // creater: '创建者',
      //     // operation: '操作'
      //   // },
      //   // {
      //   //   create_time: 'idididid',
      //   //   creatTime: '创建时间',
      //   //   updateTime: '更新时间',
      //   //   creater: '创建者',
      //   //   operation: '操作'
      //   }
      // ],
      allDatapoints: []
    }
  },

  computed: {
    tdnames () {
      var result = []
      this.snapshotHeader.map((item) => {
        result.push(item.key + '')
      })
      return result
    },
    selectedDeviceData () {
      var result = {}
      this.deviceDatas.map((deviceData) => {
        if (deviceData.selected) {
          result = deviceData
        }
      })
      return result
    },
    queryCondition () {
      var condition = {
        filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'last_login'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        query: {}
      }
      if (this.query.length > 0) {
        condition.query[this.queryType.value] = this.queryType.value === 'id' ? { $in: [Number(this.query)] } : { $like: this.query }
      }
      return condition
    },

    // 图表横轴数据
    snapshotXAxisData () {
      // var today = new Date()
      var now = Date.parse(new Date())
      var result = []
      for (var i = this.period * 24 - 1; i >= 0; i--) {
        // result[i] = dateFormat('MM-dd', new Date(today - (this.period - i - 1) * 24 * 3600 * 1000))
        var date = new Date(now - i * 3600 * 1000)
        var hour = date.getHours() + 1
        result.push(`${hour > 9 ? hour : `0${hour}`}:00`)
      }
      return result
    },

    selectedDatapoints () {
      return this.datapoints.filter((item) => {
        return item.selected
      })
    },

    snapshotHeader () {
      var result = [
        {
          key: 'snapshot_date', // 与tables的key对应
          title: '时间'
        }
      ]
      this.selectedDatapoints.map((item) => {
        var obj = {
          key: item.index,
          title: `${item.index} (${item.description})`
        }
        result.push(obj)
      })
      return result
    },

    // snapshotTable () {
    //   return this.snapshots.map((item) => {
    //     this.snapshotTable.push(item)
    //   })
    // },

    // 趋势图表数据
    snapshotSeries () {
      var result = []
      this.selectedDatapoints.forEach((item) => {
        result.push({
          name: `${item.index}`,
          type: 'line',
          data: []
        })
      })
      var now = Date.parse(new Date()) / 1000
      // 当前未满一小时默认取满一小时
      now = (Math.floor(now / 3600) + 1) * 3600
      const SECONDS_PER_HOUR = 3600
      // var itemToAdd = {}
      var i = 0

      for (let k = this.period * 24 - 1; k >= 0; k--) {
        result.forEach((re) => {
          re.data.push(0)
        })
      }

      this.snapshots.forEach((item, index) => {
        // 去掉经过后台处理的时间的T和Z字符
        var snapshotDate = item.snapshot_date.replace(/T/ig, ' ').replace(/Z/ig, '').replace(/-/ig, '/').split('.')[0]
        // console.log(new Date(snapshotDate))
        // 获取经过的小时数的整数部分将同个小时内的数据分为同一组
        var a = Math.floor((now - Date.parse(new Date(snapshotDate)) / 1000) / SECONDS_PER_HOUR) - 1
        if (a !== i) {
          result.forEach((r, n) => {
            r.data[this.period * 24 - 2 - a] = Number(item[`${r.name}`]) || 0
          })
          i = a
        }
      })
      return result
    },

    querySnapshotCondition () {
      var endtime = Date.parse(new Date())
      // 取当前开始到period天前的时间
      var begintime = endtime - this.period * 24 * 60 * 60 * 1000 - 60 * 60 * 1000 // 比当前时间往前取多一个小时为了使第一个点获取到数据
      var condition = {
        offset: 0,
        limit: 2500,
        date: {
          begin: begintime,
          end: endtime
        }
      }
      return condition
    }
  },

  route: {
    data () {
      this.getDevices()
      this.getProduct()
      this.getRule()
    }
  },

  ready () {
    // 监听窗口尺寸变化
    window.onresize = () => {
      this.$refs.trendChart.chart.resize()
    }
  },
  methods: {
    /**
     * 获取快照数据
     */
    getSnapshot () {
      api.snapshot.getSnapshot(this.$route.params.product_id, this.selectedDeviceData.id, this.querySnapshotCondition).then((res) => {
        if (res.status === 200) {
          // 获取全部数组数据
          this.allSnapshots = res.data.list
          // res.data.list.map((li) => {
          //   li.snapshot_date.replace(/T/ig, ' ').replace(/Z/ig, '')
          //   this.snapshotTableli.push(li)
          // })
          this.snapshotTable = res.data.list
          this.snapshotTable.map((li) => {
            li.snapshot_date = li.snapshot_date.replace(/T/ig, ' ').replace(/Z/ig, '').replace(/-/ig, '/').split('.')[0]
          })
          // this.snapshotTable = res.data.list
          this.snapshots = res.data.list.sort((a, b) => {
            return new Date(b.snapshot_date) - new Date(a.snapshot_date)
          })
          // this.buildTable()
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 获取数据端点列表
    // getDatapoints () {
    //   this.loadingData = true
    //   api.product.getDatapoints(this.$route.params.id).then((res) => {
    //     if (res.status === 200) {
    //       this.datapoints = res.data
    //       this.loadingData = false
    //     }
    //   }).catch((res) => {
    //     this.handleError(res)
    //     this.loadingData = false
    //   })
    // },
    // 生成表格
    // buildTable () {
    //   this.snapshotHeader = [
    //     {
    //       key: 'snapshot_date', // 与tables的key对应
    //       title: '时间'
    //     }
    //   ]
    //   this.selectedDatapoints.map((item) => {
    //     var obj = {
    //       key: item.index,
    //       title: item.index + '-' + item.description
    //     }
    //     // console.log(222)
    //     // console.log(item)
    //     this.snapshotHeader.push(obj)
    //   })
    //   // this.tdnames.map((key) => {
    //   //   var table = {
    //   //     create_time: '',
    //   //     '78789' : '',
    //   //     ....
    //   //   }
    //   //   abc[key] =
    //   // })
    //   this.snapshots.map((dptd) => {
    //     this.snapshotTable.push(dptd)
    //   })
    //   // this.snapshotTable = this.snapshots
    // },
    // 搜索
    handleSearch () {
      if (this.query.length === 0) {
        this.getDevices()
      }
    },
    // 获取当前产品快照规则
    getRule () {
      api.snapshot.getRules(this.$route.params.product_id).then((res) => {
        // 匹配数据端点信息
        api.product.getDatapoints(this.$route.params.product_id).then((r) => {
          if (r.status === 200) {
            var dps = []
            res.data.list[0].datapoint.map((item, index) => {
              r.data.map((dp) => {
                if (dp.index === item) {
                  var obj = {
                    index: item,
                    selected: index < 3 || false,
                    description: dp.description,
                    name: dp.name
                  }
                  dps.push(obj)
                }
              })
            })
            this.datapoints = dps
          }
        }).catch((res) => {
          this.handleError(res)
        })
      }, (err) => {
        this.handleError(err)
      })
    },
    // 获取selected为true的列表
    // getlist () {
    //   this.selectedDatapoints = []
    //   this.dataPoints.map((item) => {
    //     if (item.selected) {
    //       this.selectedDatapoints.push(item)
    //     }
    //     // console.log(2222)
    //     // this.buildTable()
    //     // console.log(this.snapshotHeader)
    //     setTimeout(() => {
    //       this.getSnapshot()
    //     }, 500)
    //     this.buildTable()
    //   })
    // },
    // 获取设备列表
    getDevices (querying) {
      if (typeof querying !== 'undefined') {
        this.currentPage = 1
      }
      // this.loadingData = true
      api.device.getList(this.$route.params.product_id, this.queryCondition).then((res) => {
        if (res.data.list.length !== 0) {
          res.data.list.map((item) => {
            item.selected = false
          })
          res.data.list[0].selected = true
          this.deviceDatas = []
          this.deviceDatas = res.data.list
          this.total = res.data.count
        } else {
          this.deviceDatas = []
        }
        this.loadingData = false
        this.getSnapshot()
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },
    // 获取当前产品信息
    getProduct () {
      api.product.getProduct(this.$route.params.product_id).then((res) => {
        if (res.status === 200) {
          this.product = res.data
        }
      })
    },
    /**
     * 切换搜索
     * @return {[type]} [description]
     */
    toggleSearching () {
      this.searching = !this.searching
    },
    onEditCancel () {
      this.showEditModal = false
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
      // this.getRule()
      this.getSnapshot()
    },
    saveDataPoints () {
      // this.getlist()
      // console.log(this.selectedDatapoints)
      this.showEditModal = false
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
      width 144px
      overflow hidden

      input
        width 144px
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
      border 1px solid light-border-color
    .header-box
      padding 15px 20px
      box-sizing border-box
      height 90px
      overflow hidden
      .device-picture
        width 65px
        height 65px
        background url('../../../../assets/images/device_thumb.png') center/100%
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
