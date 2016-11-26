<template>
  <div class="main">
    <div class="main-title">
      <h2>{{ $t('operation.snapshot.main_title') }}</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <x-select width="130px" :label="selectedRule.label" size="small">
            <span slot="label">{{ $t('operation.snapshot.rule') }}</span>
            <select v-model="selectedRule" @change="toggleSelectedRule(selectedRule)">
              <option v-for="rule in ruleOptions" :value="rule">{{ rule.label }}</option>
            </select>
          </x-select>
        </div>
        <div class="filter-group-item">
          <radio-button-group :items="dimensions" :value="dimension" @select="setFineness"></radio-button-group>
        </div>
        <div class="filter-group-item ml10">
          <x-select width="130px" :label="selectedDatapoint.label" size="small">
            <span slot="label">{{ $t('operation.snapshot.datapoint') }}</span>
            <select v-model="selectedDatapoint" @change="selectDataPoint">
              <option v-for="dp in datapointOptions" :value="dp">{{ dp.label }}</option>
            </select>
          </x-select>
        </div>
      </div>
    </div>
    <div class="panel snapshot-details">
      <div class="panel-bd layout-left">
        <div class="device-list-box">
          <div class="action-bar">
            <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @cancel="getDevices(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getDevices(true)">
              <x-select width="100px" :label="queryType.label" size="small">
                <select v-model="queryType">
                  <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                </select>
              </x-select>
              <button slot="search-button" @click="getDevices(true)" class="btn"><i class="fa fa-search"></i></button>
            </search-box>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th class="wp44">{{ $t('operation.snapshot.id') }}</th>
                <th>{{ $t('operation.snapshot.mac') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="device in devices" :class="{'selected': device.selected}" @click="selectedDevice(device)">
                <td>{{ device.id }}</td>
                <td>
                  <div class="text-overflow w110">
                    {{ device.mac }}
                  </div>
                </td>
              </tr>
              <tr v-if="devices.length === 0">
                <td colspan="2" class="tac"><i v-if="$loading" class="fa fa-refresh fa-spin"></i>
                  <div v-else class="tips-null">{{ $t('common.no_data') }}</div>
                </td>
              </tr>
            </tbody>
          </table>
          <pagination v-if="total > countPerPage" :total="total" :current="currentPage" :count-per-page="countPerPage" :simple="true" @page-update="onCurrentPageChange"></pagination>
        </div>
      </div>
      <div class="panel-bd layout-right">
        <div class="device-details-box">
          <div class="ml10">
            <info-card :info="deviceSummary" :pic="(currentProduct.pics && currentProduct.pics.length) ? currentProduct.pics[0] : ''"></info-card>
          </div>
          <div class="cl-relative">
            <div class="fr mr30">
              <date-time-range-picker @timechange="timechange" :start-offset="timePickerStartOffset" :show-time="true"></date-time-range-picker>
            </div>
            <div class="col-24 over-flow">
              <chart :options="chartOptions" :loading="loading"></chart>
            </div>
          </div>
          <div class="ml10" v-if="stTable && stTable.length">
            <x-table :headers="stHeader" :rows="stTable" :page="stPage" @current-page-change="onStCurrentPageChange" :simple-page="true"></x-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Chart from 'components/Chart/index'
  import formatDate from 'filters/format-date'
  import api from 'api'
  import toFixed from 'filters/to-fixed'

  // const this.FINENESS_TYPE = {
  //   1: {
  //     label: this.$t('common.unit.time.hour'),
  //     value: 1,
  //     timeOffset: 1
  //   },
  //   2: {
  //     label: this.$t('common.unit.time.day'),
  //     value: 2,
  //     timeOffset: 7
  //   },
  //   3: {
  //     label: this.$t('common.unit.time.week'),
  //     value: 3,
  //     timeOffset: 30
  //   },
  //   4: {
  //     label: this.$t('common.unit.time.month'),
  //     value: 4,
  //     timeOffset: 365
  //   },
  //   5: {
  //     label: this.$t('common.unit.time.year'),
  //     value: 5,
  //     timeOffset: 365
  //   }
  // }

  export default {
    name: 'snapshots',
    vuex: {
      getters: {
        releasedProduct: ({ products }) => products.released
      }
    },

    components: {
      Chart
    },

    data () {
      return {
        FINENESS_TYPE: {
          1: {
            label: this.$t('common.unit.time.hour'),
            value: 1,
            timeOffset: 1
          },
          2: {
            label: this.$t('common.unit.time.day'),
            value: 2,
            timeOffset: 7
          },
          3: {
            label: this.$t('common.unit.time.week'),
            value: 3,
            timeOffset: 30
          },
          4: {
            label: this.$t('common.unit.time.month'),
            value: 4,
            timeOffset: 365
          },
          5: {
            label: this.$t('common.unit.time.year'),
            value: 5,
            timeOffset: 365
          },
          6: {
            label: this.$t('common.all'),
            value: 6,
            timeOffset: 0
          }
        },
        loading: false,
        selectedRule: {
          id: 0,
          label: this.$t('operation.snapshot.placeholder.rule')
        },
        selectedDatapoint: {
          id: -1,
          label: this.$t('operation.snapshot.placeholder.datapoint')
        },
        statisticsRules: [],
        dataPoints: [],
        dimension: 1,
        dimensions: [],
        xAxis: [],
        series: [],
        devices: [],
        // 搜索框
        query: '',
        searching: false,
        queryTypeOptions: [
          { label: this.$t('operation.snapshot.id'), value: 'id' },
          { label: 'MAC', value: 'mac' }
        ],
        queryType: {
          label: 'MAC',
          value: 'mac'
        },
        // 翻页
        total: 0,
        countPerPage: 20,
        currentPage: 1,
        currDevice: {},
        currProductId: '',
        currSnapshotId: '',
        fineness: [],
        dpMode: [],
        startTime: new Date(),
        endTime: new Date(),
        timePickerStartOffset: 7,
        // 统计表格
        stTotal: 0,
        stCountPerPage: 10,
        stCurrentPage: 1,
        stData: [], // 统计数据
        chartX: 30,
        timepickerModified: false,
        stHeader: [
          {
            key: 'date',
            title: this.$t('operation.snapshot.columns.date')
          },
          {
            key: 'max',
            title: this.$t('operation.snapshot.columns.max')
          },
          {
            key: 'min',
            title: this.$t('operation.snapshot.columns.min')
          },
          {
            key: 'avg',
            title: this.$t('operation.snapshot.columns.avg')
          },
          {
            key: 'sum',
            title: this.$t('operation.snapshot.columns.sum')
          }
        ]
      }
    },

    computed: {
      stPage () {
        var result = {
          total: this.stTotal,
          currentPage: this.stCurrentPage,
          countPerPage: this.stCountPerPage
        }
        return result
      },
      stTable () {
        return this.stData.slice((this.stCurrentPage - 1) * this.stCountPerPage, (this.stCurrentPage - 1) * this.stCountPerPage + 10)
      },
      currentProduct () {
        if (this.releasedProduct && this.releasedProduct.length) {
          let cur = _.find(this.releasedProduct, (item) => {
            return item.id === this.currProductId
          })
          return cur || {}
        }
        return {}
      },
      // 设备简介
      deviceSummary () {
        return {
          title: this.currDevice.name || this.currentProduct.name,
          online: this.currDevice.is_online || false,
          time: formatDate(this.currDevice.last_login)
        }
      },
      ruleOptions () {
        let res = []
        res.push({
          id: 0,
          label: this.$t('operation.snapshot.placeholder.rule')
        })
        if (this.statisticsRules && this.statisticsRules.length) {
          this.statisticsRules.forEach((item) => {
            res.push({
              id: item.id,
              label: item.name,
              product_id: item.product_id,
              snapshot_id: item.snapshot_id,
              dp_mode: item.dp_mode,
              fineness: item.fineness
            })
          })
        }
        return res
      },
      datapointOptions () {
        let res = []
        res.push({
          id: -1,
          label: this.$t('operation.snapshot.placeholder.datapoint')
        })
        if (this.dataPoints && this.dataPoints.length) {
          this.dataPoints.forEach((item) => {
            let findDpMode = _.find(this.dpMode, (dp) => {
              return dp.index === item.index
            })
            if (findDpMode) {
              res.push({
                id: item.id,
                label: item.name,
                index: item.index
              })
            }
          })
        }
        return res
      },
      statisticsType () {
        return {
          avg: true,
          sum: true,
          max: false,
          min: false
        }
      },
      // 图例
      legends () {
        return this.series.length > 0 ? _.map(this.series, 'name') : []
      },
      chartOptions () {
        return {
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            x: this.chartX,
            y: 30,
            x2: 30,
            y2: 40
          },
          legend: {
            y: 5,
            data: this.legends
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: this.xAxis
          }],
          yAxis: [{
            type: 'value',
            minInterval: 1
          }],
          series: this.series
        }
      },
      // 快照统计规则的搜索条件
      srQueryCondition () {
        let params = {
          offset: 0,
          limit: 10000, // 取所有规则
          product_id: [],
          type: 1
        }
        if (this.releasedProduct && this.releasedProduct.length) {
          this.releasedProduct.forEach((item) => {
            params.product_id.push(item.id)
          })
        }
        return params
      },
      // 快照数据端点统计搜索条件
      sdQueryCondition () {
        let params = {
          datapoint: [this.selectedDatapoint.index],
          fineness: this.dimension,
          date_start: new Date(this.startTime.getTime() + 3600 * 8 * 1000),
          date_end: new Date(this.endTime.getTime() + 3600 * 8 * 1000)
        }
        return params
      },
      // 设备列表
      deQueryCondition () {
        var condition = {
          filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'last_login', 'name'],
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          query: {}
        }
        if (this.query.length > 0) {
          condition.query[this.queryType.value] = this.queryType.value === 'id' ? { $in: [Number(this.query)] } : { $like: this.query }
        }
        return condition
      }
    },

    route: {
      data () {
      }
    },

    ready () {
      if (this.releasedProduct && this.releasedProduct.length) {
        this.getStatisticsRules()
      }
    },

    watch: {
      releasedProduct () {
        if (this.releasedProduct && this.releasedProduct.length) {
          this.getStatisticsRules()
        }
      }
    },

    methods: {
      setTimeRange (offset) {
        let curTime = new Date()
        if (!offset) {
          // 计算当前距离1970年的天数
          offset = (curTime.getTime() - (+new Date(0))) / (3600 * 24 * 1000)
        }
        this.timePickerStartOffset = offset
        this.startTime = new Date(curTime.getTime() - 3600 * 24 * 1000 * offset)
        this.endTime = curTime
      },
      getDatapoints (productId) {
        api.product.getDatapoints(productId).then((res) => {
          if (res.status === 200 && res.data.length) {
            this.dataPoints = res.data
            this.selectedDatapoint = this.datapointOptions[1]
            this.selectDataPoint()
          } else {
            this.dataPoints = []
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },
      getStatisticsRules () {
        api.snapshot.getAllStatisticRules(this.srQueryCondition).then((res) => {
          if (res.status === 200 && res.data.list && res.data.list.length) {
            this.statisticsRules = res.data.list
            this.selectedRule = this.ruleOptions[1]
            this.toggleSelectedRule(this.selectedRule)
          } else {
            this.statisticsRules = []
          }
        }).catch((res) => {
          this.handleError(res)
        })
      },
      toggleSelectedType (type) {
        console.log(type)
      },
      // 选择规则
      toggleSelectedRule (rule) {
        if (rule.id !== 0) {
          this.clearData()
          this.fineness = rule.fineness
          this.dpMode = rule.dp_mode
          this.currProductId = rule.product_id
          this.currSnapshotId = rule.snapshot_id
          // 获取产品下设备数据
          this.getDevices(true)
          // 获取产品下的数据端点
          this.getDatapoints(rule.product_id)
          // 设置粒度选项和默认搜索时间
          this.setFinenessOption()
        }
      },
      setFinenessOption () {
        let res = []
        if (this.fineness.length) {
          this.fineness.sort()
          this.fineness.forEach((item) => {
            res.push(this.FINENESS_TYPE[item])
          })
          this.dimension = res[0] ? res[0].value : ''
          // 设置默认筛选时间
          if (!this.timepickerModified) {
            this.setTimeRange(res[0].timeOffset)
          }
        }
        this.dimensions = res
      },
      toggleSearching () {
        this.searching = !this.searching
      },
      timechange (startDate, endDate) {
        if (!this.timepickerModified) {
          this.timepickerModified = true
        }
        this.startTime = startDate
        this.endTime = endDate
        this.getSnapshotStatistic(true)
      },
      handleSearch () {
        if (this.query.length === 0) {
          this.getDevices(true)
        }
      },
      // 获取设备列表
      getDevices (reset) {
        if (reset) {
          this.currentPage = 1
        }
        if (!this.currProductId || !this.currProductId) {
          return
        }
        api.device.getList(this.currProductId, this.deQueryCondition).then((res) => {
          if (res.status === 200 && res.data.list && res.data.list.length) {
            res.data.list.map((item) => {
              item.selected = false
            })
            res.data.list[0].selected = true
            this.currDevice = res.data.list[0]
            this.devices = res.data.list
            this.total = res.data.count
            this.getSnapshotStatistic(true)
          } else {
            this.devices = []
            this.currDevice = {}
            this.total = 0
          }
        }).catch((res) => {
          this.devices = []
          this.currDevice = {}
          this.total = 0
          this.handleError(res)
        })
      },
      /**
       * 处理页码更新
       * @author guohao
       * @param {Number} page 页码
       */
      onCurrentPageChange (page) {
        this.currentPage = page
        this.getDevices()
      },
      onStCurrentPageChange (page) {
        this.stCurrentPage = page
      },
      /**
       * 选择设备
       * @return {[type]} [description]
       */
      selectedDevice (device) {
        this.devices.map((item) => {
          item.selected = false
        })
        device.selected = true
        this.currDevice = device
        this.getSnapshotStatistic(true)
      },
      getSnapshotStatistic (reset) {
        if (reset) {
          this.stCurrentPage = 1
        }
        if (this.currDevice.id && this.currSnapshotId && this.selectedRule.id && this.selectedDatapoint.index > -1) {
          api.statistics.getSnapshotStatistic(this.currSnapshotId, this.selectedRule.id, this.currDevice.id, this.sdQueryCondition).then((res) => {
            if (res.status === 200 && res.data.list.length) {
              this.dealSnapshot(res.data.list)
            }
          }).catch((res) => {
            this.handleError(res)
          })
        }
      },
      clearData () {
        this.xAxis = []
        this.series = []
        this.stTotal = 0
        this.stData = []
        this.chartX = 30
        this.currDevice = {}
      },
      dealSnapshot (snapshots) {
        let avg = {}
        let max = {}
        let min = {}
        let sum = {}
        let statistic = []
        this.series = []
        let maxValue = Number.NEGATIVE_INFINITY // 计算所有值的最大值。调整图标左边距
        let finded = null
        let maxDpLength = 0
        snapshots.forEach((item) => {
          if (item.value_list.length > maxDpLength) {
            maxDpLength = item.value_list.length
            finded = item
          }
          switch (item.mode) {
            case 1: // max 最大值
              if (item.value_list.length) {
                item.value_list.forEach((maxItem) => {
                  maxItem.value = toFixed(maxItem.value)
                  max[maxItem.date] = maxItem.value
                  if (maxItem.value > maxValue) {
                    maxValue = maxItem.value
                  }
                })
              }
              break
            case 2: // min 最小值
              if (item.value_list.length) {
                item.value_list.forEach((minItem) => {
                  minItem.value = toFixed(minItem.value)
                  min[minItem.date] = minItem.value
                  if (minItem.value > maxValue) {
                    maxValue = minItem.value
                  }
                })
              }
              break
            case 3: // avg 平均值
              if (item.value_list.length) {
                item.value_list.forEach((avgItem) => {
                  avgItem.value = toFixed(avgItem.value)
                  avg[avgItem.date] = avgItem.value
                  if (avgItem.value > maxValue) {
                    maxValue = avgItem.value
                  }
                })
              }
              break
            case 4: // sum 求和
              if (item.value_list.length) {
                item.value_list.forEach((sumItem) => {
                  sumItem.value = toFixed(sumItem.value)
                  sum[sumItem.date] = sumItem.value
                  if (sumItem.value > maxValue) {
                    maxValue = sumItem.value
                  }
                })
                // this.series.push({
                //   data: data,
                //   type: 'line',
                //   name: '和'
                // })
              }
              break
            default:
              break
          }
        })
        let maxLength = Number(maxValue).toString().length
        this.chartX = maxLength * 10 > 200 ? 200 : maxLength * 10

        let xAxis = []
        let formate = ''
        if (this.dimension >= 1 && this.dimension <= 4) {
          formate = 'MM-dd hh:mm'
        } else {
          formate = 'yyyy-MM-dd'
        }

        if (finded) {
          let maxData = []
          let minData = []
          let avgData = []
          let sumData = []
          finded.value_list.forEach((item) => {
            maxData.push(max[item.date] || NaN)
            minData.push(min[item.date] || NaN)
            avgData.push(avg[item.date] || NaN)
            sumData.push(sum[item.date] || NaN)
            statistic.push({
              date: formatDate(item.date),
              max: typeof max[item.date] === 'number' ? max[item.date] : '--',
              min: typeof min[item.date] === 'number' ? min[item.date] : '--',
              avg: typeof avg[item.date] === 'number' ? avg[item.date] : '--',
              sum: typeof sum[item.date] === 'number' ? sum[item.date] : '--'
            })

            xAxis.push(formatDate(item.date, formate))
          })

          this.series.push({
            data: maxData,
            type: 'line',
            name: this.$t('operation.snapshot.columns.max'),
            connectNulls: true
          })
          this.series.push({
            data: minData,
            type: 'line',
            name: this.$t('operation.snapshot.columns.min'),
            connectNulls: true
          })
          this.series.push({
            data: avgData,
            type: 'line',
            name: this.$t('operation.snapshot.columns.avg'),
            connectNulls: true
          })
          this.series.push({
            data: sumData,
            type: 'line',
            name: this.$t('operation.snapshot.columns.sum'),
            connectNulls: true
          })
        }

        this.xAxis = xAxis
        this.stTotal = statistic.length
        this.stData = statistic
      },
      setFineness (value) {
        this.dimension = value
        if (!this.timepickerModified) {
          this.setTimeRange(this.FINENESS_TYPE[value].timeOffset)
        }
        this.getSnapshotStatistic(true)
      },
      selectDataPoint () {
        this.getSnapshotStatistic(true)
      }
    }
  }
</script>

<style lang="stylus">
.mutiple-select
  line-height 26px
  input, label
    vertical-align middle
  label
    margin-right 10px
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
      width 174px
      overflow hidden
      input
        width 174px
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
    padding-top 20px
    margin 0 0 20px 0px
.x-info-card
  &:after
    clear none !important
.info-card
  &:after
    display block !important
.cl-relative
  position relative
.over-flow
  overflow hidden
</style>
