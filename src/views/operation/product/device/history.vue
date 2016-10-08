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
              <span slot="label">快照规则</span>
              <select v-model="selectRules" @change="ruleSelect">
                <option v-for="opt in rules" :value="opt">{{ opt.name }}</option>
              </select>
            </x-select>
          </div>
          <div class="filter-group-item">
            <x-select :label="selectedDatapoint.name" width="110px" size="small">
              <span slot="label">数据端点</span>
              <select v-model="selectedDatapoint">
                <option v-for="opt in datapointOptions" :value="opt">{{ opt.name }}</option>
              </select>
            </x-select>
          </div>
        </div>
      </div>
      <div class="device-data-table-box">
        <div class="panel-bd">
          <time-line :data="trendData" scale="day-hour"></time-line>
        </div>
      </div>
      <div class="history-list mt20" v-if="snapshots.length">
        <div class="col-dates">
          <ul>
            <li v-for="snapshot in snapshots" :class="{'active':currSnapshot._id===snapshot._id}" @click="currSnapshot=snapshot">{{ snapshot.snapshot_date }}</li>
          </ul>
        </div>
        <div class="col-details">
          <x-table :headers="columns" :tables="currSnapshotInfo" :bordered="false"></x-table>
        </div>
      </div>
      <pager v-if="total" :total="total" :current="currentPage" :count-per-page="countPerPage" @page-update="onCurrPageChage" @count-update="onPageCountUpdate"></pager>
    </div>
  </div>
</template>

<script>
import { globalMixins } from 'src/mixins'
import Pager from 'components/Pager'
import IntelligentTable from 'components/IntelligentTable'
import api from 'src/api'
import Select from 'components/Select'
import RadioButtonGroup from 'components/RadioButtonGroup'
import TimeLine from 'components/g2-charts/TimeLine'
import Table from 'components/Table'
import { uniformDate, formatDate } from 'src/filters'
import _ from 'lodash'

export default {
  name: 'History',

  mixins: [globalMixins],

  components: {
    'pager': Pager,
    'x-table': Table,
    'intelligent-table': IntelligentTable,
    'x-select': Select,
    RadioButtonGroup,
    TimeLine
  },

  data () {
    return {
      selectRules: {
        interval: ''
      },
      period: 1,
      periods: [
        { label: '24h', value: 1 },
        { label: '7天', value: 7 },
        { label: '15天', value: 15 }
      ],
      total: 0,
      currentPage: 1,
      countPerPage: 10,
      rules: [],
      snapshots: [],
      trendSnapshots: [],
      currSnapshot: {},
      datapoints: [],
      selectedDatapoint: {},
      // 趋势
      // trends: {
      //   data: [],
      //   options: {}
      // },
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
      if (this.selectedDatapoint.index !== undefined) {
        let snapshotGroup = _.groupBy(this.trendSnapshots, (item) => {
          let hour = item.snapshot_date.split(' ')[1].split(':')[0]
          return `${uniformDate(item.snapshot_date)}-${hour}`
        })

        for (var key in snapshotGroup) {
          let dp = snapshotGroup[key][0]
          result.push({
            date: dp.snapshot_date,
            val: Number(dp[this.selectedDatapoint.index]) || 0,
            name: this.selectedDatapoint.name
          })
        }
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

    // 列表数据查询条件
    queryCondition () {
      // 取当前开始到period天前的时间
      var endtime = Date.parse(new Date())
      // 取当前开始到period天前的时间
      var begintime = endtime - this.period * 24 * 60 * 60 * 1000 - 60 * 60 * 1000 // 比当前时间往前取多一个小时为了使第一个点获取到数据
      var condition = {
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        date: {
          begin: begintime,
          end: endtime
        },
        rule_id: this.selectRules.id
      }
      return condition
    },
    // 图数据查询条件
    trendQueryCondition () {
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

  methods: {
    ruleSelect () {
      this.getSnapshots(true)
      this.getTrendSnapshots()
    },
    periodSelect (period) {
      this.getSnapshots(true)
      this.getTrendSnapshots()
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
          this.getTrendSnapshots()
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
      this.getSnapshots()
    },

    /**
     * 每页显示的数量改变
     * @author shengzhi
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getSnapshots(true)
    },

    /**
     * 获取快照数据
     */
    getSnapshots (reset) {
      if (reset) {
        this.currentPage = 1
      }
      api.snapshot.getSnapshot(this.$route.params.product_id, this.$route.params.device_id, this.queryCondition).then((res) => {
        if (res.status === 200 && res.data.list.length > 0) {
          // 模拟数据开始 ******************************
          // res.data.count = 2
          // res.data.list = [{
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
          this.snapshots = res.data.list.map((item) => {
            item.snapshot_date = formatDate(item.snapshot_date)
            return item
          }).sort((a, b) => {
            return new Date(b.snapshot_date) - new Date(a.snapshot_date)
          })

          this.currSnapshot = this.snapshots[0]
        }
      }).catch((res) => {
        // this.handleError(res)
        if (res.data.error.code === 4001001) {
          this.showNotice({
            type: 'error',
            content: '设备暂无快照数据'
          })
        }
      })
    },
    /**
     * 获取快照数据
     */
    getTrendSnapshots () {
      api.snapshot.getSnapshot(this.$route.params.product_id, this.$route.params.device_id, this.trendQueryCondition).then((res) => {
        if (res.status === 200 && res.data.list.length > 0) {
          this.trendSnapshots = res.data.list.map((item) => {
            item.snapshot_date = formatDate(item.snapshot_date)
            return item
          }).sort((a, b) => {
            return new Date(b.snapshot_date) - new Date(a.snapshot_date)
          })
        }
      }).catch((res) => {
        // this.handleError(res)
        if (res.data.error.code === 4001001) {
          this.showNotice({
            type: 'error',
            content: '设备暂无快照数据'
          })
        }
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
