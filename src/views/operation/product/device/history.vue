<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="filter-bar">
        <div class="filter-group fr">
          <div class="filter-group-item">
            <radio-button-group :items="periods" :value.sync="period" @select="periodSelect"></radio-button-group>
          </div>
        </div>
        <div class="filter-group">
          <div class="filter-group-item">
            <x-select :label="selectRules.name" width="110px" size="small">
              <span slot="label">{{ $t('operation.product.device.history.photo_rule') }}</span>
              <select v-model="selectRules" @change="ruleSelect">
                <option v-for="opt in rules" :value="opt">{{ opt.name }}</option>
              </select>
            </x-select>
          </div>
          <div class="filter-group-item">
            <x-select :label="selectedDatapoint.name" width="110px" size="small">
              <span slot="label">{{ $t('operation.product.device.history.dp') }}</span>
              <select v-model="selectedDatapoint">
                <option v-for="opt in datapointOptions" :value="opt">{{ opt.name }}</option>
              </select>
            </x-select>
          </div>
        </div>
      </div>
      <div class="device-data-table-box">
        <div class="panel-bd">
          <chart :options="trendOptions" :loading="loadingData"></chart>
        </div>
      </div>
      <div class="history-list mt20" v-if="snapshots.length">
        <div class="col-dates">
          <ul>
            <li v-for="snapshot in filteredSnapshots" :class="{'active':currSnapshot._id===snapshot._id}" @click="currSnapshot=snapshot">{{ snapshot.snapshot_date }}</li>
          </ul>
        </div>
        <div class="col-details">
          <x-table :headers="columns" :tables="currSnapshotInfo" :bordered="false"></x-table>
        </div>
      </div>
      <pagination v-if="total" :total="total" :current="currentPage" :count-per-page="countPerPage" @page-update="onCurrPageChage" @count-update="onPageCountUpdate"></pagination>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import IntelligentTable from 'components/IntelligentTable'
import api from 'src/api'
import Chart from 'components/Chart/index'
import formatDate from 'filters/format-date'
import { patchLostDates } from 'utils'

export default {
  name: 'History',

  mixins: [globalMixins],

  components: {
    'intelligent-table': IntelligentTable,
    Chart
  },

  data () {
    return {
      loadingData: false,
      selectRules: {
        interval: ''
      },
      period: 1,
      periods: [
        { label: this.$t('data.PERIODS_MAP[1]'), value: 1 },
        { label: this.$t('data.PERIODS_MAP[7]'), value: 7 },
        { label: this.$t('data.PERIODS_MAP[15]'), value: 15 }
      ],
      total: 0,
      currentPage: 1,
      countPerPage: 10,
      rules: [],
      snapshots: [],
      currSnapshot: {},
      datapoints: [],
      selectedDatapoint: {},
      columns: [
        {
          key: 'name',
          title: this.$t('operation.product.device.history.dp')
        },
        {
          key: 'description',
          title: this.$t('operation.product.device.history.dp')
        },
        {
          key: 'value',
          title: this.$t('operation.product.device.history.data_value')
        }
      ]
    }
  },
  computed: {
    // 下拉选项
    datapointOptions () {
      let result = []
      if (Array.isArray(this.selectRules.datapoint)) {
        this.selectRules.datapoint.forEach((index) => {
          // 过滤出非字符串类型和非布尔型的快照端点列表
          let dp = _.find(this.datapoints, (item) => {
            return item.type !== 6 && item.type !== 1 && item.index === index
          })
          if (dp) {
            result.push(dp)
          }
        })
        if (result.length) {
          this.selectedDatapoint = result[0]
        }
      }
      return result
    },

    // 趋势数据
    trendData () {
      let result = []

      if (!('index' in this.selectedDatapoint)) {
        return result
      }

      let snapshotGroup = _.groupBy(this.snapshots, (item) => {
        let hour = item.snapshot_date.split(' ')[1].split(':')[0]
        return `${formatDate(item.snapshot_date, 'yyyy-MM-dd', true)} ${hour}:00`
      })

      for (var key in snapshotGroup) {
        let dp = snapshotGroup[key][0]
        result.push({
          day: key,
          value: Number(dp[this.selectedDatapoint.index]) || 0
        })
      }
      // // 取当前时间的前一个小时
      let now = new Date().getTime() - this.period * 24 * 3600 * 1000
      now = `${formatDate(now, 'yyyy-MM-dd hh', true)}:00`
      result = patchLostDates(result, now, this.period * 24, ['value'], 'hour')
      return result
    },

    // 趋势图表配置
    trendOptions () {
      return {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          x: 50,
          y: 32,
          x2: 15,
          y2: 30
        },
        xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: _.map(this.trendData, 'day')
        }],
        yAxis: [{
          type: 'value',
          minInterval: 1
        }],
        // series: this.trend.series
        series: [{
          name: this.selectedDatapoint.name,
          type: 'line',
          data: _.map(this.trendData, 'value')
        }]
      }
    },

    filteredSnapshots () {
      let end = this.currentPage * this.countPerPage
      let result = this.snapshots.slice(end - this.countPerPage, end)
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

    // 列表数据查询条件
    // queryCondition () {
    //   // 取当前开始到period天前的时间
    //   var endtime = Date.parse(new Date())
    //   // 取当前开始到period天前的时间
    //   var begintime = endtime - this.period * 24 * 60 * 60 * 1000 - 60 * 60 * 1000 // 比当前时间往前取多一个小时为了使第一个点获取到数据
    //   var condition = {
    //     limit: this.countPerPage,
    //     offset: (this.currentPage - 1) * this.countPerPage,
    //     date: {
    //       begin: begintime,
    //       end: endtime
    //     },
    //     rule_id: this.selectRules.id
    //   }
    //   return condition
    // },

    // 图数据查询条件
    queryCondition () {
      // 取当前开始到period天前的时间
      var endtime = Date.parse(new Date())
      // 取当前开始到period天前的时间
      var begintime = endtime - this.period * 24 * 60 * 60 * 1000 - 60 * 60 * 1000 // 比当前时间往前取多一个小时为了使第一个点获取到数据
      var condition = {
        limit: 2500,
        offset: 0,
        date: {
          begin: begintime,
          end: endtime
        },
        rule_id: this.selectRules.id
      }
      return condition
    }
  },

  route: {
    data () {
      this.getDatapoints()
      this.getSnapshotRule()
    }
  },

  watch: {
    filteredSnapshots (val) {
      if (val.length) {
        this.currSnapshot = val[0]
      }
    }
  },

  methods: {
    ruleSelect () {
      this.getSnapshots(true)
    },
    periodSelect (period) {
      this.getSnapshots(true)
    },
    /**
     * 获取设备端点列表
     * @author shengzhi
     */
    getDatapoints () {
      api.product.getDatapoints(this.$route.params.product_id).then((res) => {
        if (res.status === 200) {
          this.datapoints = res.data
          // 获取设备快照
          // this.getSnapshots()
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 获取设备快照规则
     */
    getSnapshotRule () {
      api.snapshot.getRules(this.$route.params.product_id).then((res) => {
        if (res.status === 200) {
          this.rules = res.data.list
          this.selectRules = this.rules[0]
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
    },

    /**
     * 每页显示的数量改变
     * @author shengzhi
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
    },

    /**
     * 获取快照数据
     */
    getSnapshots (reset) {
      if (reset) {
        this.currentPage = 1
      }
      this.loadingData = true
      api.snapshot.getSnapshot(this.$route.params.product_id, this.$route.params.device_id, this.queryCondition).then((res) => {
        this.loadingData = false
        if (res.status !== 200 || !res.data.list.length) {
          return
        }

        // 虚拟数据，勿删
        // 虚拟数据开始
        // res.data.count = 3
        // res.data.list = [{
        //   _id: '123456',
        //   deviceId: '1390638540',
        //   cmId: '1605922391',
        //   ip: '119.131.117.58',
        //   online: 1,
        //   lastLogin: '2016-10-20T10:27:53Z',
        //   lastLogout: '2016-10-20T10:42:53Z',
        //   lastUpdate: '2016-10-20T10:30:53Z',
        //   snapshot_date: '2016-10-20T10:30:53Z',
        //   '10': 100,
        //   '11': 38,
        //   '12': 47
        // }, {
        //   _id: '234567',
        //   deviceId: '1390638540',
        //   cmId: '1605922391',
        //   ip: '119.131.117.58',
        //   online: 1,
        //   lastLogin: '2016-10-20T10:27:53Z',
        //   lastLogout: '2016-10-20T10:42:53Z',
        //   lastUpdate: '2016-10-20T10:40:47Z',
        //   snapshot_date: '2016-10-20T10:40:53Z',
        //   '10': 10,
        //   '11': 42,
        //   '12': 49
        // }, {
        //   _id: '234568',
        //   deviceId: '1390638540',
        //   cmId: '1605922391',
        //   ip: '119.131.117.58',
        //   online: 1,
        //   lastLogin: '2016-10-20T12:27:53Z',
        //   lastLogout: '2016-10-20T12:42:53Z',
        //   lastUpdate: '2016-10-20T12:40:47Z',
        //   snapshot_date: '2016-10-20T12:40:53Z',
        //   '10': 58,
        //   '11': 47,
        //   '12': 60
        // }]
        // 虚拟数据结束

        this.total = res.data.count
        this.snapshots = res.data.list.map((item) => {
          item.snapshot_date = formatDate(item.snapshot_date)
          return item
        }).sort((a, b) => {
          return new Date(b.snapshot_date) - new Date(a.snapshot_date)
        })
      }).catch((res) => {
        // this.handleError(res)
        if (res.data.error.code === 4001001) {
          this.showNotice({
            type: 'error',
            content: this.$t('operation.product.device.history.no_photo')
          })
        }
        this.loadingData = false
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
