<template>
  <div class="main">
    <div class="main-title">
      <h2>消息详情</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="row statistic-group">
      <div class="col-6">
        <statistic :total="summary.send.total" :title="summary.send.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="summary.arrival.total" :title="summary.arrival.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="summary.percent.total" :total-uint="summary.percent.unit" :title="summary.percent.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="summary.read.total" :title="summary.read.title" align="left"></statistic>
      </div>
      <div class="col-6">
        <statistic :total="summary.readPercent.total" :total-uint="summary.readPercent.unit" :title="summary.readPercent.title" align="left"></statistic>
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
            <radio-button-group :items="locales.data.PERIODS" :value.sync="7"></radio-button-group>
          </div>
        </div>
        <h3>推送历史</h3>
      </div>
      <time-line :data="trends" :margin="options.margin"></time-line>
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
// import api from 'api'
import { formatDate } from 'src/filters'
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
      task: {},
      trends: [],
      options: {
        margin: [20, 30, 30, 50]
      },
      summary: {
        send: {
          total: 1345,
          title: '目标用户数'
        },
        arrival: {
          total: 1135,
          title: '抵达数'
        },
        percent: {
          total: 83,
          unit: '%',
          title: '抵达率'
        },
        read: {
          total: 232,
          title: '阅读数'
        },
        readPercent: {
          total: 43,
          unit: '%',
          title: '阅读率'
        }
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
      if (!scope || scope.type === 1) return result
      result.scope = this._findLabelByValue(SCOPE_TYPES, scope.type)
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
    }
  },

  route: {
    data () {
      this.getTask()
    }
  },

  methods: {
    _findLabelByValue (arr, val) {
      return _.find(arr, (item) => {
        return item.value === val
      }).label
    },

    /**
     * 获取推送任务详情
     */
    getTask () {
      // api.broadcast.getTask(this.$route.params.id).then((res) => {
      //   if (res.status === 200) {
      //
      //   }
      // }).catch((res) => {
      //   this.handleError(res)
      // })

      this.task = {
        id: '111',
        title: '您又被【0元赢iPhone6S】活动砸中！速来抽奖>>',
        content: '呵呵呵哒！还不快来~',
        time: '2016-07-14T22:00:00Z',
        expire: '2016-07-21T22:00:00Z',
        action: {
          type: 1,
          url: 'www.xlink.cn'
        },
        status: 2,
        user_num: 3000,
        arrive_num: 2789,
        read_num: 1366,
        scope: {
          type: 2, // 推送范围,分别为所有用户、定向推送、单个用户
          user: ['123456', '111222', '333444'], // 用户列表
          app_list: ['2e07d2ad3c33aa00', '2e07d2af52638c00'], // 应用列表
          product_list: ['1607d2ad172d52001607d2ad172d5201', '1607d2aee669d4001607d2aee669d401'], // 产品列表
          group: {
            type: 1,
            start_day: '2016-08-06',
            end_day: '2016-08-06'
          },
          area: {
            type: 1,
            province: '广东',
            city: '广州'
          },
          tag: {
            type: 2,
            tag_list: ['大客户', 'VIP客户']
          }
        }
      }
      // this.task = {}
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
