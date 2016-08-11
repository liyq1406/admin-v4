<template>
  <div class="main">
    <div class="main-title">
      <h2>消息详情</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="row statistic-group">
      <div class="col-6">
        <statistic :total="task.user_num" title="目标用户数" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="task.arrive_num" title="抵达数" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="arrivePercent" total-unit="%" title="抵达率" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="task.read_num" title="阅读数" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="readPercent" total-unit="%" title="阅读率" align="left"></statistic>
      </div>
    </div>
    <div class="panel no-split-line mt20">
      <div class="filter-bar">
        <div class="filter-group fr">
          <!-- <div class="filter-group-item">
            <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
          </div>
          <div class="filter-group-item">
            <date-time-range-picker></date-time-range-picker>
          </div> -->
          <div class="filter-group-item">
            <radio-button-group :items="periods" :value.sync="period" @select="getReadTrend"></radio-button-group>
          </div>
        </div>
        <h3>推送历史</h3>
      </div>
      <time-line :data="trendData" :margin="options.margin"></time-line>
    </div>
    <div class="panel mt10">
      <div class="panel-hd panel-hd-full bordered">
        <h2>详细信息</h2>
      </div>
      <div class="panel-bd">
        <div class="broadcast-info">
          <div class="broadcast-info-item">
            <div class="tit">
              <div class="label">推送人群:</div>
              <div class="cont">
                <p>{{ taskInfo.scope }}</p>
              </div>
            </div>
            <div class="details" v-if="task.scope && task.scope.type === 2">
              <ul>
                <li v-if="taskInfo.apps && taskInfo.apps.length">
                  <div class="label">推送应用</div>
                  <div class="cont"><span class="meta" v-for="app in taskInfo.apps" track-by="$index">{{ app.name }}</span></div>
                </li>
                <li v-if="taskInfo.products && taskInfo.products.length">
                  <div class="label">推送产品</div>
                  <div class="cont"><span class="meta" v-for="product in taskInfo.products" track-by="$index">{{ product.name }}</span></div>
                </li>
                <li>
                  <div class="label">推送人群</div>
                  <div class="cont"><span class="meta">{{ taskInfo.group }}</span></div>
                </li>
                <li>
                  <div class="label">推送地域</div>
                  <div class="cont"><span class="meta" v-for="item in taskInfo.area">{{ item }}</span></div>
                </li>
                <li v-if="taskInfo.tag.type>0">
                  <div class="label">{{ taskInfo.tag.type===1?'推送标签用户':'不推送标签用户' }}</div>
                  <div class="cont"><span class="meta" v-for="item in taskInfo.tag.tag_list">{{ item }}</span></div>
                </li>
              </ul>
            </div>
            <div class="details" v-if="task.scope && task.scope.type === 3">
              <ul>
                <li>
                  <div class="label">用户ID</div>
                  <div class="cont"><span class="meta" v-for="item in taskInfo.users">{{ item }}</span></div>
                </li>
              </ul>
            </div>
          </div>
          <div class="broadcast-info-item">
            <div class="tit">
              <div class="label">推送内容:</div>
            </div>
            <div class="details">
              <ul>
                <li>
                  <div class="label">推送标题</div>
                  <div class="cont">{{ taskInfo.title }}</div>
                </li>
                <li>
                  <div class="label">推送内容</div>
                  <div class="cont">{{ taskInfo.content }}</div>
                </li>
              </ul>
            </div>
          </div>
          <div class="broadcast-info-item">
            <div class="tit">
              <div class="label">推送时间:</div>
              <div class="cont">
                <p>{{ taskInfo.time }}</p>
              </div>
            </div>
          </div>
          <div class="broadcast-info-item">
            <div class="tit">
              <div class="label">打开方式:</div>
              <div class="cont">
                <p>{{ taskInfo.action.label }}</p>
                <p class="hl-gray">{{ taskInfo.action.value }}</p>
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
import Statistic from 'components/Statistic2'
import Breadcrumb from 'components/Breadcrumb'
import RadioButtonGroup from 'components/RadioButtonGroup'
import TimeLine from 'components/g2-charts/TimeLine'
import store from 'store'
import api from 'api'
import { formatDate, uniformDate } from 'src/filters'
import _ from 'lodash'

export default {
  name: 'BroadcastDetails',

  mixins: [globalMixins],

  store,

  vuex: {
    getters: {
      products: ({ products }) => products.all,
      plugins: ({ plugins }) => plugins.all
    }
  },

  components: {
    Breadcrumb,
    Statistic,
    RadioButtonGroup,
    TimeLine
  },

  data () {
    return {
      period: 0,
      periods: [],
      task: {},
      trends: [],
      options: {
        margin: [20, 30, 30, 50]
      }
    }
  },

  computed: {
    // 任务信息
    taskInfo () {
      const SCOPE_TYPES = [{
        label: '所有用户',
        value: 1
      }, {
        label: '定向推送',
        value: 2
      }, {
        label: '单个用户',
        value: 3
      }]
      const ACTION_TYPES = [{
        label: '打开网页',
        value: 1
      }, {
        label: '执行指令',
        value: 2
      }]
      const GROUP_TYPES = [{
        label: '不限',
        value: 0
      }, {
        label: '活跃用户',
        value: 1
      }, {
        label: '沉睡',
        value: 2
      }]

      let result = {
        scope: '',
        title: '',
        content: '',
        action: {
          label: '',
          value: ''
        }
      }

      // 推送内容
      result.title = this.task.title
      result.content = this.task.content

      // 推送时间
      result.time = formatDate(this.task.time)

      // 打开方式
      let action = this.task.action
      if (action && action.type) {
        result.action = {
          label: this._findLabelByValue(ACTION_TYPES, action.type),
          value: action.type === 1 ? action.url : action.command
        }
      }

      // 推送人群
      let scope = this.task.scope

      // 初始化时直接返回
      if (!scope) return result

      result.scope = this._findLabelByValue(SCOPE_TYPES, scope.type)

      // 如果是推送给所有用户，则没下面什么事了
      if (scope.type === 1) return result

      if (scope.group) {
        result.group = this._findLabelByValue(GROUP_TYPES, scope.group.type)
      }

      // 推送应用
      if (scope.app_list && this.plugins.length) {
        let apps = []
        scope.app_list.forEach((id) => {
          let a = _.find(this.plugins, (app) => {
            return app.id === id
          })
          apps.push(a)
        })
        result.apps = apps
      }

      // 推送产品
      if (scope.product_list && this.products.length) {
        let products = []
        scope.product_list.forEach((id) => {
          let p = _.find(this.products, (product) => {
            return product.id === id
          })
          products.push(p)
        })
        result.products = products
      }

      // 推送地域
      if (scope.area) {
        result.area = scope.area.type === 1 ? [scope.area.province, scope.area.city] : ['不限']
      }

      // 标签用户
      if (scope.tag) {
        result.tag = scope.tag
      }

      // 单个用户
      if (scope.user) {
        result.users = scope.user
      }

      return result
    },

    // 抵达率
    arrivePercent () {
      let total = this.task.user_num || 1
      return Math.round(this.task.arrive_num / total * 1000) / 10
    },

    // 抵达率
    readPercent () {
      let total = this.task.arrive_num || 1
      return Math.round(this.task.read_num / total * 1000) / 10
    },

    // 面包屑导航
    breadcrumbNav () {
      let root = `/operation/plugins/broadcast/${this.$route.params.id}`
      let result = [{
        label: '消息历史',
        link: { path: `${root}/list` }
      }]

      if (this.task.title) {
        result.push({
          label: this.task.title
        })
      }

      return result
    },

    // 起始日期
    startDate () {
      return uniformDate(new Date())
    },

    // 结束日期
    endDate () {
      let timestamp = new Date().getTime() - this.period * 24 * 3600 * 1000
      return uniformDate(new Date(timestamp))
    },

    // 趋势图表数据
    trendData () {
      let result = []
      this.trends.forEach((item) => {
        result.push({
          date: item.day,
          val: item.read
        })
      })
      return result
    }
  },

  route: {
    data () {
      this.initPeriods()
      this.getTask()
      this.getReadTrend()
    }
  },

  methods: {
    _findLabelByValue (arr, val) {
      return _.find(arr, (item) => {
        return item.value === val
      }).label
    },

    initPeriods () {
      let res = []
      let periodArr = [7, 30, 90]
      periodArr.forEach((item) => {
        res.push({
          label: this.locales.data.PERIODS_MAP[item],
          value: item
        })
      })
      this.periods = res
      this.period = res[0].value
    },

    /**
     * 获取推送任务阅读数日趋势
     */
    getReadTrend () {
      api.statistics.getReadTrend(this.$route.params.id, this.startDate, this.endDate).then((res) => {
        if (res.status === 200) {
          // 模拟数据开始
          // res.data = [{
          //   day: '2016-08-08',
          //   read: 123
          // }, {
          //   day: '2016-08-09',
          //   read: 150
          // }, {
          //   day: '2016-08-10',
          //   read: 190
          // }, {
          //   day: '2016-08-11',
          //   read: 133
          // }, {
          //   day: '2016-08-12',
          //   read: 67
          // }, {
          //   day: '2016-08-13',
          //   read: 89
          // }, {
          //   day: '2016-08-14',
          //   read: 138
          // }]
          // 模拟数据结束

          this.trends = res.data
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },

    /**
     * 获取推送任务详情
     */
    getTask () {
      api.broadcast.getTask(this.$route.params.id).then((res) => {
        if (res.status === 200) {
          // 模拟数据开始
          // res.data = {
          //   id: '111',
          //   title: '您又被【0元赢iPhone6S】活动砸中！速来抽奖>>',
          //   content: '呵呵呵哒！还不快来~',
          //   time: '2016-07-14T22:00:00Z',
          //   expire: '2016-07-21T22:00:00Z',
          //   action: {
          //     type: 1,
          //     url: 'www.xlink.cn'
          //   },
          //   status: 2,
          //   user_num: 3000,
          //   arrive_num: 2789,
          //   read_num: 1366,
          //   scope: {
          //     type: 2, // 推送范围,分别为所有用户、定向推送、单个用户
          //     user: ['123456', '111222', '333444'], // 用户列表
          //     app_list: ['2e07d2ad3c33aa00', '2e07d2af52638c00'], // 应用列表
          //     product_list: ['1607d2ad172d52001607d2ad172d5201', '1607d2aee669d4001607d2aee669d401'], // 产品列表
          //     group: {
          //       type: 1,
          //       start_day: '2016-08-06',
          //       end_day: '2016-08-06'
          //     },
          //     area: {
          //       type: 1,
          //       province: '广东',
          //       city: '广州'
          //     },
          //     tag: {
          //       type: 2,
          //       tag_list: ['大客户', 'VIP客户']
          //     }
          //   }
          // }
          // 模拟数据结束

          this.task = res.data
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

.statistic-group
  .col-6
    width 20%

.broadcast-info
  .broadcast-info-item
    line-height 24px

    .tit
      padding 10px 0
      border-bottom 1px solid light-border-color
      clearfix()

      & > .label
        float left
        width 64px
        color gray-light

      & > .cont
        margin-left 64px

        p
          margin 0

    .details
      background #F9F9F9
      margin-bottom 15px
      padding 0 20px 0 64px

      li
        clearfix()
        padding 15px 0
        border-bottom 1px dotted light-border-color

        &:last-child
          border-bottom none

        & > .label
          width 110px
          color gray
          float left
          text-align center

        & > .cont
          margin-left 120px
          color #000

          .meta
            margin-right 15px

    &:last-child
      .tit
        border-bottom none
</style>
