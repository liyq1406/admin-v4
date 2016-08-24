<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="filter-bar">
        <div class="filter-group fr">
          <div class="filter-group-item">
            <date-time-multiple-picker :periods="periods" @timechange="getSpecial"></date-time-multiple-picker>
          </div>
        </div>
      </div>
      <div v-if="showHour">
        <time-line :data="trendData" :scale="scale"></time-line>
      </div>
      <div v-else>
        <time-line :data="trendData" :scale="scale"></time-line>
      </div>
    </div>
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <div class="filter-bar">
          <div class="filter-group fr">
            <!-- <div class="filter-group-item">
              <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
            </div> -->
            <div class="filter-group-item">
              <search-box :key.sync="key" :placeholder="$t('ui.overview.addForm.search_condi')" :active="searching" @cancel="getList()" @search="getList()" @press-enter="getList()">
                <button slot="search-button" @click="getList()" class="btn btn-primary"><i class="fa fa-search"></i></button>
              </search-box>
            </div>
          </div>
          <div class="filter-group">
            <x-select width="90px" size="small" :label="visibility.label">
              <span slot="label">明细：</span>
              <select v-model="visibility" @change="getList()">
                <option v-for="option in visibilityOptions" :value="option">{{ option.label }}</option>
              </select>
            </x-select>
          </div>
        </div>
        <table class="table table-stripe table-bordered" :loading="loadingData">
          <thead>
            <tr>
              <th>告警内容</th>
              <th>时间</th>
              <th>持续时长</th>
              <th>告警等级</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="records.length > 0">
              <tr v-for="record in records">
                <td>{{ record.alert_name }}</td>
                <td>{{ record.create_date | formatDate }}</td>
                <td>{{ record.lasting }}h</td>
                <td>
                  <template v-if="record.tags"><span v-for="tag in record.tags | toTags" :class="{'text-label-danger':tag==='严重', 'text-label-info':tag==='轻微'}" class="text-label">{{ record.tags }}</span></template>
                </td>
                <td><span v-if="record.is_read">已处理</span><span v-else>未处理</span></td>
              </tr>
            </template>
            <tr v-if="records.length === 0 && !loadingData">
              <td colspan="6" class="tac">
                <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getList"></pager>
    </div>
  </div>
</template>

<script>
import api from 'api'
import * as config from 'consts/config'
import Pager from 'components/Pager'
import SearchBox from 'components/SearchBox'
import { globalMixins } from 'src/mixins'
import { formatDate, uniformDate } from 'src/filters'
import Select from 'components/Select'
import TimeLine from 'components/g2-charts/TimeLine'
import RadioButtonGroup from 'components/RadioButtonGroup'
import DateTimeMultiplePicker from 'components/DateTimeMultiplePicker'
import dateFormat from 'date-format'
import {getLastYearDate} from 'utils'

export default {
  name: 'record-history',

  mixins: [globalMixins],

  components: {
    Pager,
    SearchBox,
    TimeLine,
    RadioButtonGroup,
    DateTimeMultiplePicker,
    'x-select': Select
  },

  data () {
    return {
      scale: 'hour',
      loadingData: false,
      records: [],
      deviceID: '',
      productID: '',
      key: '',
      total: 0,
      countPerPage: config.COUNT_PER_PAGE,
      currentPage: 1,
      visibility: {
        label: '全部等级',
        value: 'all'
      },
      visibilityOptions: [
        { label: '全部等级', value: 'all' },
        { label: '通知', value: '通知' },
        { label: '轻微', value: '轻微' },
        { label: '严重', value: '严重' }
      ],
      startTimePick: '',
      endTimePick: '',
      trendData: [],
      period: 1,
      periods: [1, 7, 30],
      serious: {
        name: '严重',
        data: []
      },
      normal: {
        name: '通知',
        data: []
      },
      light: {
        name: '轻微',
        data: []
      },
      recvDataCount: 0,
      tempTrendData: [],
      showHour: true
    }
  },

  filters: {
    toTags (value) {
      return value.length ? value.split(',') : []
    }
  },

  ready () {
    this.getList()
    // this.getTagTrend()
  },

  computed: {

    queryCondition () {
      var condition = {}
      if (this.period === '') {
        condition = {
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          order: {},
          query: {
            id: {
              $in: [this.$route.params.id]
            },
            create_date: {
              $gte: this.startTimePick,
              $lte: this.endTimePick
            }
          }
        }
      } else {
        condition = {
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          order: {},
          query: {
            from: {
              $in: [this.deviceID]
            },
            create_date: {
              $lte: this.endTime + 'T00:00:00.000Z',
              $gte: this.beginTime + 'T00:00:00.000Z'
            }
          }
        }
      }
      if (this.key !== '') {
        condition.query.id = {$in: [this.key]}
      }

      switch (this.visibility.value) {
        case '通知':
          condition.query['tags'] = { $in: ['通知'] }
          break
        case '轻微':
          condition.query['tags'] = { $in: ['轻微'] }
          break
        case '严重':
          condition.query['tags'] = { $in: ['严重'] }
          break
        default:
      }

      return condition
    },

    beginTime () {
      var past = new Date().getTime() - this.period * 24 * 3600 * 1000
      return dateFormat('yyyy-MM-dd', new Date(past))
    },
    endTime () {
      var end = new Date().getTime()
      return dateFormat('yyyy-MM-dd', new Date(end))
    }
  },

  // 监听属性变动
  watch: {
    productID () {
      // this.getTagTrend()
      // if (this.products.length > 0) {
      //   this.getTagTrend()
      //   this.getList(this.queryCondition)
      // }
    }
    // period () {
    //   this.getAlertTrends()
    //   this.getAlertSummary()
    // }
  },

  methods: {
    // 获取告警历史@author weijie
    getList () {
      this.loadingData = true
      var params = {
        offset: 0,
        limit: 30,
        query: {
          // _id: this.$route.params.id
          id: {
            $in: [this.$route.params.id]
          }
        }
      }
      // 先获取当前告警详情设备ID
      api.alert.getAlerts(params).then((res) => {
        if (res.status === 200) {
          this.deviceID = res.data.list[0].from
          this.productID = res.data.list[0].product_id
          this.getTagTrend()
          // 再获取当前设备的告警记录列表
          // var item = {
          //   offset: 0,
          //   limit: 30,
          //   query: {
          //     // _id: this.$route.params.id
          //     from: {
          //       $in: [this.deviceID]
          //     }
          //   }
          // }
          api.alert.getAlerts(this.queryCondition).then((res) => {
            if (res.status === 200) {
              this.total = res.data.count
              // console.log(res.data.list)
              // this.alerts = res.data.list
              this.records = res.data.list.map((item) => {
                // 计算已读告警持续时间
                if (item.is_read) {
                  let beginTime = new Date(formatDate(item.create_date))
                  let endTime = new Date(formatDate(item.read_time))
                  let lasting = (endTime.getTime() - beginTime.getTime()) / 3600000
                  // console.log(lasting.toFixed(1))
                  item.lasting = lasting.toFixed(1)
                } else {
                  // 计算未读告警持续时间
                  let beginTime = new Date(formatDate(item.create_date))
                  let endTime = new Date()
                  let lasting = (endTime.getTime() - beginTime.getTime()) / 3600000
                  // console.log(lasting.toFixed(1))
                  item.lasting = lasting.toFixed(1)
                }
                return item
              })
            }
            this.loadingData = false
          }).catch((res) => {
            this.handleError(res)
            this.loadingData = false
          })
        }
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    // 获取告警趋势图表数据
    getTagTrend () {
      this.recvDataCount = 0
      var begin
      var end
      if (this.period === '') {
        var startTimePick = uniformDate(this.startTimePick)
        var endTimePick = uniformDate(this.endTimePick)
        begin = startTimePick
        end = endTimePick
      } else {
        begin = this.beginTime
        end = this.endTime
      }
      // 获取标签'轻微'的趋势
      api.alert.getTagTrend(this.productID, '轻微', begin, end).then((res) => {
        if (res.status === 200) {
          this.light = res.data
          this.pushArr(this.light)
        }
      }).catch((res) => {
        this.handleError(res)
      })

      // 获取标签'通知'的趋势
      api.alert.getTagTrend(this.productID, '通知', begin, end).then((res) => {
        if (res.status === 200) {
          this.normal = res.data
          this.pushArr(this.normal)
        }
      }).catch((res) => {
        this.handleError(res)
      })

      // 获取标签'严重'的趋势
      api.alert.getTagTrend(this.productID, '严重', begin, end).then((res) => {
        if (res.status === 200) {
          this.serious = res.data
          this.pushArr(this.serious)
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    // 处理标签数据
    pushArr (arr) {
      if (this.recvDataCount === 0) {
        this.tempTrendData = []
      }
      this.recvDataCount++
      var rearr = []
      var name = ''
      if (arr === this.normal) {
        name = '通知'
      } else if (arr === this.serious) {
        name = '严重'
      } else {
        name = '轻微'
      }
      if (this.scale === 'hour') {
        arr.forEach((item) => {
          var i = 0
          while (i < item.hours.length) {
            rearr.push({
              date: item.day + ' ' + item.hours[i].hour + ':00:00',
              val: item.hours[i].message,
              name: name
            })
            i++
          }
        })
      } else {
        arr.forEach((item) => {
          var i = 0
          var sum = 0
          while (i < item.hours.length) {
            sum = sum + item.hours[i].message
            i++
          }
          rearr.push({
            date: item.day,
            val: sum,
            name: name
          })
        })
      }

      if (rearr.length > 0) {
        rearr.forEach((newobj) => {
          this.tempTrendData.push(newobj)
        })
      }
      // 数据接收完毕
      if (this.recvDataCount === 3) {
        if (this.scale === 'hour') {
          this.showHour = true
        } else {
          this.showHour = false
        }
        this.trendData = this.tempTrendData
      }
      // this.trendData = rearr
      // Array.prototype.push.apply(this.trendData, rearr)
      //
      // arr.data.forEach((item) => {
      //   var dayTotal = 0
      //   item.hours.forEach((message) => {
      //     dayTotal = dayTotal + message.message
      //   })
      //   this.trendData.push({
      //     day: item.day,
      //     data: dayTotal,
      //     product: item.name
      //   })
      // })
    },
    getSpecial (start, end) {
      // 过滤选择时间
      // 不能是未来时间
      // 不能超过12个月
      var cur = new Date()
      if (end.getTime() >= cur.getTime()) {
        end = cur
      }

      if (start.getTime() > end.getTime()) {
        return
      }

      let lastYear = getLastYearDate(end)

      if (start.getTime() < lastYear.getTime()) {
        start = lastYear
      }

      // 如果时间小于等于24小时，显示小时数
      if (end.getTime() - start.getTime() <= 3600 * 24 * 1000) {
        this.scale = 'hour'
      } else {
        this.scale = 'day'
      }

      this.period = ''
      this.startTimePick = start
      this.endTimePick = end
      // this.getTagTrend()
      this.getList()
    },
    getAll () {
      this.getTagTrend()
      this.getList()
    }
  }
}
</script>
