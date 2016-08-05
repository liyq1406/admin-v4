<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="filter-bar">
        <div class="filter-group fr">
          <div class="filter-group-item">
            <date-time-multiple-picker :periods="periods" @timechange="onTimeChange"></date-time-multiple-picker>
          </div>
        </div>
        <div class="filter-group">
          <div class="filter-group-item">
            <v-select :label="selectedDatapoint.name" width="110px" size="small">
              <span slot="label">显示</span>
              <select v-model="selectedDatapoint">
                <option v-for="opt in datapoints" :value="opt">{{ opt.name }}</option>
              </select>
            </v-select>
          </div>
        </div>
      </div>
      <div class="device-data-table-box">
        <div class="panel-bd">
          <time-line :data="trends.data"></time-line>
        </div>
      </div>
      <div class="history-list">
        <div class="col-dates">
          <ul>
            <li v-for="snapshot in filteredSnapshots" :class="{'active':currSnapshot._id===snapshot._id}" @click="currSnapshot=snapshot">{{ snapshot.lastUpdate }}</li>
          </ul>
        </div>
        <div class="col-details">
          <c-table :headers="columns" :tables="currSnapshotInfo" :bordered="false"></c-table>
        </div>
      </div>
      <pager v-if="total" :total="total" :current="currentPage" :count-per-page="countPerPage" @page-update="onCurrPageChage" @count-update="onPageCountUpdate"></pager>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import LineChart from 'components/charts/Line'
import Pager from 'components/Pager'
import IntelligentTable from 'components/IntelligentTable'
import api from 'src/api'
import Select from 'components/Select'
import RadioButtonGroup from 'components/RadioButtonGroup'
import DateTimeMultiplePicker from 'components/DateTimeMultiplePicker'
import TimeLine from 'components/g2-charts/TimeLine'
import Table from 'components/Table'
import { formatDate } from 'src/filters'
import Mock from 'mockjs'

export default {
  name: 'History',

  mixins: [globalMixins],

  components: {
    LineChart,
    'pager': Pager,
    'c-table': Table,
    'intelligent-table': IntelligentTable,
    'v-select': Select,
    RadioButtonGroup,
    DateTimeMultiplePicker,
    TimeLine
  },

  data () {
    return {
      period: 1,
      periods: [1, 7, 30],
      startTime: 0,
      endTime: 0,
      total: 0,
      currentPage: 1,
      countPerPage: 10,
      allSnapshots: [],
      currSnapshot: {},
      datapoints: [],
      selectedDatapoint: {},
      // 趋势
      trends: {
        data: [],
        options: {}
      },
      columns: [
        {
          key: 'name',
          title: '数据端点'
        },
        {
          key: 'description',
          title: '描述'
        },
        {
          key: 'value',
          title: '数据值'
        }
      ]
    }
  },
  computed: {
    snapshots () {
      let result = []

      return result
    },

    // 过滤后的的快照列表
    filteredSnapshots () {
      let offset = (this.currentPage - 1) * this.countPerPage
      let result = this.allSnapshots.slice(offset, offset + this.countPerPage)
      if (result.length) {
        this.currSnapshot = result[0]
      }
      return result
    },

    // 当前设备快照
    currSnapshotInfo () {
      var result = []
      this.datapoints.forEach((datapoint) => {
        result.push({
          name: datapoint.name,
          description: datapoint.description,
          value: this.currSnapshot[datapoint.index]
        })
      })
      return result
    },

    // 查询条件
    queryCondition () {
      // 取当前开始到period天前的时间
      var condition = {
        offset: 0,
        limit: 2500,
        date: {
          begin: this.startTime,
          end: this.endTime
        }
      }
      return condition
    }
  },

  route: {
    data () {
      this.getDatapoints()
      // 监听窗口尺寸变化
      // window.onresize = () => {
      //   this.$refs.trendChart.chart.resize()
      // }
      this.trends.data = Mock.mock({
        'list|16': [{
          'date|+1': [
            new Date(2016, 7, 17),
            new Date(2016, 7, 18),
            new Date(2016, 7, 19),
            new Date(2016, 7, 20)
          ],
          'count|+1': [6, 8, 9, 8],
          '产品|+1': ['Power', 'Power', 'Power', 'Power']
        }]
      }).list
    }
  },

  methods: {
    /**
     * 处理时间选择
     * @author shengzhi
     */
    onTimeChange (start, end) {
      this.startTime = start.getTime()
      this.endTime = end.getTime()
    },

    /**
     * 获取设备端点列表
     * @author shengzhi
     */
    getDatapoints () {
      api.product.getDatapoints(this.$route.params.product_id).then((res) => {
        if (res.status === 200) {
          this.datapoints = res.data
          this.selectedDatapoint = res.data[0]
          // 获取设备快照
          this.getSnapshots()
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 当前页码改变
     * @author shengzhi
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      // this.getSnapshots()
    },

    /**
     * 每页显示的数量改变
     * @author shengzhi
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      // this.getSnapshots(true)
    },

    /**
     * 获取快照数据
     */
    getSnapshots () {
      api.snapshot.getSnapshot(this.$route.params.product_id, this.$route.params.device_id, this.queryCondition).then((res) => {
        if (res.status === 200) {
          // 模拟数据开始 ******************************
          // this.total = 2
          // this.allSnapshots = [{
          //   _id: '123456',
          //   deviceId: '1605922391',
          //   cmId: '1605922391',
          //   ip: '119.131.117.58',
          //   online: 1,
          //   lastLogin: formatDate('2016-08-05T14:27:53Z'),
          //   lastLogout: formatDate('2016-08-05T14:42:53Z'),
          //   lastUpdate: formatDate('2016-08-05T14:30:53Z'),
          //   '0': true,
          //   '1': 38,
          //   '2': 47
          // }, {
          //   _id: '234567',
          //   deviceId: '1605922391',
          //   cmId: '1605922391',
          //   ip: '119.131.117.58',
          //   online: 1,
          //   lastLogin: formatDate('2016-08-05T14:27:53Z'),
          //   lastLogout: formatDate('2016-08-05T14:42:53Z'),
          //   lastUpdate: formatDate('2016-08-05T14:40:47Z'),
          //   '0': true,
          //   '1': 42,
          //   '2': 49
          // }]
          // 模拟数据结束 ******************************

          // 获取全部数组数据
          this.total = res.data.count
          this.allSnapshots = res.data.list.map((item) => {
            item.lastUpdate = formatDate(item.lastUpdate)
            return item
          }).sort((a, b) => {
            return new Date(b.lastUpdate) - new Date(a.lastUpdate)
          })
        }
      }).catch((res) => {
        this.handleError(res)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

.history-list
  clearfix()
  background #F2F2F2
  border 1px solid light-border-color

  .col-dates
    float left
    width 180px
    position relative

    li
      height 32px
      line-height 32px
      font-size 12px
      padding-left 15px
      border-bottom 1px solid light-border-color
      cursor pointer

      &:hover
        background #F8F8F8

      &.active
        position relative
        background #FFF
        margin-right -1px

  .col-details
    min-height 269px
    padding 30px
    background #FFF
    margin-left 180px
    border-left 1px solid light-border-color
</style>
