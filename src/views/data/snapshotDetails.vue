<template>
  <section class="main-wrap">
    <div class="main snapshot-details">
      <div class="breadcrumb"><a v-link="{path: '/data/snapshot' }"><i class="fa fa-arrow-circle-left"></i>数据快照</a></div>
      <div class="row">
        <div class="col-24">
          <div class="panel row">
            <div class="panel-hd">
              <h2>{{product.name}}设备快照</h2>
            </div>
            <div class="panel-bd layout-left">
              <div class="device-list-box">
                <div class="action-bar">
                  <search-box :key.sync="query" :active="searching" :placeholder="$t('overview.addForm.search_condi')" @cancel="getDevices(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getDevices(true)">
                    <v-select width="100px" :label="queryType.label">
                      <select v-model="queryType">
                        <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                      </select>
                    </v-select>
                    <button slot="search-button" @click="getDevices(true)" class="btn btn-primary">{{ $t('common.search') }}</button>
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
                <pager v-if="total > pageCount" :total="total" :current.sync="currentPage" :page-count="pageCount" :simple="true" @page-update="getDevices"></pager>
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
                    <div class="operation-box col-12">

                      <div class="check-device">
                        <button class="btn btn-primary" v-link="{path: '/products/' + this.$route.params.product_id + '/devices/' + selectedDeviceData.id}">查看设备</button>
                      </div>
                      <div class="radio-group-box">
                        <radio-group :items="periods" :value.sync="period" @select="getSnapshot"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-group>
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
                    <!-- <table class="table table-stripe table-bordered">
                      <thead>
                        <tr>
                          <th>时间</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="allSnapshot in allSnapshots">
                          <td>{{ allSnapshot.last_update }}</td>
                        </tr>
                        <tr v-if="false">
                          <td colspan="4" class="tac"><i v-if="$loadingRouteData" class="fa fa-refresh fa-spin"></i>
                            <div v-else class="tips-null">暂无数据</div>
                          </td>
                        </tr>
                      </tbody>
                    </table> -->
                    <intelligent-table :headers.sync="snapshotHeader" :tables="snapshotTable | limitBy pageCount (currentPage2-1)*pageCount"></intelligent-table>
                    <pager v-if="snapshotTable.length > pageCount" :total="snapshotTable.length" :current.sync="currentPage2" :page-count="pageCount"></pager>
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
                 <tr v-for="dataPoint in dataPoints">
                   <td>{{dataPoint.index}}</td>
                   <td>{{dataPoint.id}}</td>
                   <td>{{dataPoint.description}}</td>
                   <td><input v-model="dataPoint.selected" type="checkbox"/></td>
                 </tr>
               </tbody>
             </table>
           </div>
           <div class="data-points-footer">
             <!-- <pager v-if="dataPoints.length > pageCount" :total="dataPoints.length" :current.sync="currentPage" :page-count="pageCount" @page-update=""></pager> -->
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
  </section>
</template>

<script>
  import Vue from 'vue'
  import locales from '../../consts/locales/index'
  import api from '../../api'
  import RadioGroup from '../../components/RadioGroup'
  // import dateFormat from 'date-format'
  import LineChart from '../../components/charts/Line'
  import Pager from '../../components/Pager'
  import SearchBox from '../../components/SearchBox'
  import Select from '../../components/Select'
  import Modal from '../../components/Modal'
  import IntelligentTable from '../../components/IntelligentTable'
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
      'pager': Pager,
      'intelligent-table': IntelligentTable
    },

    data () {
      return {
        /** ***图表 按钮 start*********/
        loadingProductTrends: false,
        periods: locales[Vue.config.lang].shortperiods,
        period: 1,
        /* ******图表 按钮 end*************/
        selectedDatapoints: [],
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
        total: 100,
        currentPage: 1,
        currentPage2: 1,
        pageCount: 10,
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
        dataPoints: [],
        snapshotSeries: [
          {
            name: '温度',
            type: 'line',
            data: [0, 0, 0, 0, 0, 0, 0]
          }
        ],
        snapshots: [],
        allSnapshots: [],
        snapshotHeader: [
          {
            key: 'snapshot_date', // 与tables的key对应
            title: '时间' // 标题内容
          // },
          // {
          //   key: 'creatTime',
          //   title: 'ID'
          // },
          // {
          //   key: 'updateTime',
          //   title: '更新时间'
          }
        ],
        snapshotTable: [
          {
            snapshot_date: ''
            // creatTime: '123',
            // updateTime: '更新时间',
            // creater: '创建者',
            // operation: '操作'
          // },
          // {
          //   create_time: 'idididid',
          //   creatTime: '创建时间',
          //   updateTime: '更新时间',
          //   creater: '创建者',
          //   operation: '操作'
          }
        ],
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
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount,
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
        var itemToAdd = {}
        var i = 0

        for (let k = this.period * 24 - 1; k >= 0; k--) {
          result.forEach((re) => {
            re.data.push(0)
          })
        }

        this.snapshots.forEach((item, index) => {
          // 去掉经过后台处理的时间的T和Z字符
          var snapshotDate = item.snapshot_date.replace(/T/ig, ' ').replace(/Z/ig, '')
          // 获取经过的小时数的整数部分将同个小时内的数据分为同一组
          var a = Math.floor((now - Date.parse(new Date(snapshotDate)) / 1000) / SECONDS_PER_HOUR) + 1
          // console.log(item.snapshot_date)
          // console.log(a)
          if (index) {
            if (a !== i) {
              // 当商改变说明此数据为下一个小时的数据
              // 将每个小时最后的数据附近图表数据数组\
              console.log(13231312313)
              console.log(itemToAdd)
              result.forEach((r, n) => {
                r.data[this.period * 24 - 1 - a] = Number(itemToAdd[`${r.name}`]) || 0
              })
              itemToAdd = item
              // 将1重置为当前数据的时间
              i = a
            }
          } else {
            // 数组内第一个元素处理
            // 将第一个元素存进暂存对象内
            console.log(121221)
            itemToAdd = item
            // 初始经过0个小时
            i = 0
            //
            if (this.snapshots.length === 1) {
              result.forEach((r, n) => {
                r.data[this.period * 24 - 1 - a] = Number(itemToAdd[`${r.name}`]) || 0
              })
            }
          }
        })

        return result
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
      getSnapshot (offset, limit, begintime, endtime) {
        offset = offset || 0
        limit = limit || 1000
        endtime = Date.parse(new Date())
        // 取当前开始到period天前的时间
        begintime = endtime - this.period * 24 * 60 * 60 * 1000
        // console.log(this.begintime)
        var params = {
          offset: offset,
          limit: limit,
          date: {
            begin: begintime,
            end: endtime
          }
        }
        api.snapshot.getSnapshot(this.$route.params.product_id, this.selectedDeviceData.id, params).then((res) => {
          if (res.status === 200) {
            // 获取全部数组数据
            this.allSnapshots = res.data.list
            console.log(res.data.list)
            // res.data.list.map((li) => {
            //   li.snapshot_date.replace(/T/ig, ' ').replace(/Z/ig, '')
            //   this.snapshotTableli.push(li)
            // })
            this.snapshotTable = res.data.list
            this.snapshotTable.map((li) => {
              li.snapshot_date = li.snapshot_date.replace(/T/ig, ' ').replace(/Z/ig, '')
            })
            // this.snapshotTable = res.data.list
            // console.log(11)
            // console.log(this.snapshotTable)
            this.snapshots = res.data.list.sort((a, b) => {
              return new Date(a.snapshot_date) - new Date(b.snapshot_date)
            })
            // this.buildTable()
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },
      // 获取数据端点列表
      getDatapoints () {
        this.loadingData = true
        api.product.getDatapoints(this.$route.params.id).then((res) => {
          if (res.status === 200) {
            this.datapoints = res.data
            this.loadingData = false
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },
      // 生成表格
      buildTable () {
        this.snapshotHeader = [
          {
            key: 'snapshot_date', // 与tables的key对应
            title: '时间'
          }
        ]
        this.selectedDatapoints.map((item) => {
          var obj = {
            key: item.index,
            title: item.index
          }
          // console.log(222)
          // console.log(item)
          this.snapshotHeader.push(obj)
        })
        // this.tdnames.map((key) => {
        //   var table = {
        //     create_time: '',
        //     '78789' : '',
        //     ....
        //   }
        //   abc[key] =
        // })
        this.snapshots.map((dptd) => {
          this.snapshotTable.push(dptd)
        })
        // this.snapshotTable = this.snapshots
      },
      // 搜索
      handleSearch () {
        if (this.query.length === 0) {
          this.getDevices()
        }
      },
      // currentPageCount () {
      //   if (this.dataPoints.length > 0) {
      //     var index = this.dataPoints.length - (this.currentPage - 1) * this.pageCount
      //     return index >= 10 ? 10 : index
      //   }
      // },
      // 获取当前产品快照规则
      getRule () {
        api.snapshot.getRule(this.$route.params.product_id).then((res) => {
          // this.products = res.data
          // 匹配数据端点信息
          api.product.getDatapoints(this.$route.params.product_id).then((r) => {
            console.log(res.data.list[0].datapoint)
            console.log(r.data)
            if (r.status === 200) {
              res.data.list[0].datapoint.map((item) => {
                r.data.map((l) => {
                  if (l.index === item) {
                    var dp = {
                      index: item,
                      selected: false,
                      description: l.description,
                      id: l.id
                    }
                    this.dataPoints.push(dp)
                    return
                  }
                })
              })
              if (this.dataPoints.length < 3) {
                this.dataPoints.map((item) => {
                  item.selected = true
                })
              } else {
                for (let i = 0; i < 3; i++) {
                  this.dataPoints[i].selected = true
                }
              }
              this.getlist()
            }
          }).catch((res) => {
            this.handleError(res)
          })
          // if (res.data.list[0].datapoint.length !== 0) {
          //   res.data.list[0].datapoint.map((item) => {
          //     var dp = {
          //       index: item,
          //       selected: false
          //     }
          //     this.dataPoints.push(dp)
          //   })
          // } else {
          //   this.dataPoints = []
          // }

          // console.log(this.selectedDatapoints)
        }, (err) => {
          this.handleError(err)
        })
      },
      // 获取selected为true的列表
      getlist () {
        this.selectedDatapoints = []
        this.dataPoints.map((item) => {
          if (item.selected) {
            this.selectedDatapoints.push(item)
          }
          // console.log(2222)
          // this.buildTable()
          // console.log(this.snapshotHeader)
          setTimeout(() => {
            this.getSnapshot()
          }, 500)
          this.buildTable()
        })
      },
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
          // this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
          // this.loadingData = false
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
        this.getlist()
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
