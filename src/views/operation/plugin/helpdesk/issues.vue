<template>
  <div class="main">
    <div class="main-title">
      <h2>反馈列表 </h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item" v-if="products.length">
          <x-select :label="selectedProduct.label" @change="getIssues" width="110px" size="small">
            <span slot="label">显示</span>
            <select v-model="selectedProduct">
              <option :value="opt" v-for="opt in selectOptions">{{ opt.label }}</option>
            </select>
          </x-select>
        </div>
        <div class="filter-group-item" v-if="products.length">
          <x-select :label="issueType.label" width="110px" size="small">
            <select v-model="issueType"  @change="getIssues">
              <option :value="opt" v-for="opt in issueTypeOptions">{{ opt.label }}</option>
            </select>
          </x-select>
        </div>
      </div>
      <div class="filter-group fr">
        <div class="filter-group-item">
          <date-time-range-picker @timechange = "getSpecial"></date-time-range-picker>
        </div>
        <div class="filter-group-item">
          <radio-button-group :items="locales.data.AllPERIODS" :value.sync="period" @select="getIssues()"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
        </div>
      </div>
    </div>
    <div class="row">
      <div v-if="issues.length">
        <div class="col-6 issue-list">
          <ul>
            <li class="issue-list-item" v-for="issue in issues">
              <a v-link="{path: '/operation/plugins/helpdesk/' + $route.params.app_id + '/issues/' + issue._id}">
                <i class="fa fa-check-square-o"></i>
                <span class="info overhid">{{ issue.content }}</span>
                <span class="metas"><span v-if="issue.label">[{{ issue.label[0] }}]</span><span v-else>[暂无分类]</span><span>{{ issue.create_time | formatDate}}</span></span>
              </a>
            </li>
          </ul>
          <!-- <div class="view-more tac"><a href="#">更多内容&gt;&gt;</a></div> -->
          <pager v-if="total > countPerPage" :total="total" :simple="true" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getIssues"></pager>
        </div>
        <div class="col-18" v-if="issues.length > 0">
          <router-view transition="view" transition-mode="out-in" class="view"></router-view>
        </div>
      </div>
      <div v-else style="height:500px;line-height:500px;text-align:center">暂无数据</div>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import * as config from 'consts/config'
import Pager from 'components/Pager'
import RadioButtonGroup from 'components/RadioButtonGroup'
// import locales from 'consts/locales/index'
import { globalMixins } from 'src/mixins'
import { pluginMixins } from '../mixins'
import api from 'api'
import formatDate from 'filters/format-date'

export default {
  name: 'Issues',

  mixins: [globalMixins, pluginMixins],

  vuex: {
    getters: {
      products: ({ products }) => products.released
    }
  },

  components: {
    Pager,
    RadioButtonGroup
  },

  data () {
    return {
      startTimePick: '',
      endTimePick: '',
      // 时间间隔
      period: 'all',
      selectedProduct: {},
      productOptions: [],
      // visibility: {
      //   label: '全部',
      //   value: 'all'
      // },
      // visibilityOptions: locales[Vue.config.lang].data.DEVICE_VISIBILITY_OPTIONS,
      issues: [],
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      addValidation: {},
      originAddModel: {},
      // querying: false,
      loadingData: false,
      // summaries: [{
      //   id: 12345,
      //   title: '我的烤箱自动预热有问题，有时预热10分钟还是一点温度都没有！',
      //   type: '故障申报',
      //   create_time: '2016-7-16 17:31:32'
      // },
      // {
      //   id: 23456,
      //   title: '烘烤模式有时不管用，在连续烤3个小时后就不能正常加热了',
      //   type: '故障申报',
      //   create_time: '2016-7-12 12:11:21'
      // },
      // {
      //   id: 34567,
      //   title: '请问怎样使用定时烘烤功能呢，我找了半天没看到在哪里用，能不能重复时间呢？',
      //   type: '使用咨询',
      //   create_time: '2016-7-1 10:29:09'
      // },
      // {
      //   id: 45678,
      //   title: '我每次烤完东西后烤箱总是很长时间一直很烫，一般多久才会冷却下来，能不能拔电？',
      //   type: '使用咨询',
      //   create_time: '2016-6-29 21:21:32'
      // },
      // {
      //   id: 56789,
      //   title: '烤箱照明灯不亮，才买了不到一个星期4个灯就换了1个，太差了',
      //   type: '故障申报',
      //   create_time: '2016-6-24 14:51:10'
      // },
      // {
      //   id: 67890,
      //   title: '每次烤箱启动的时候会听见哒哒的声音，响一小会儿就没了，什么情况？？',
      //   type: '故障申报',
      //   create_time: '2016-6-23 16:29:39'
      // },
      // {
      //   id: 22345,
      //   title: '最近开始烤东西的时候会听见明显哒哒的声音，持续半分钟左右，是不是坏了？',
      //   type: '故障申报',
      //   create_time: '2016-6-22 19:21:32'
      // },
      // {
      //   id: 11234,
      //   title: '一般烤箱烤完东西多久才能拔掉电源，会不会影响散热？',
      //   type: '使用咨询',
      //   create_time: '2016-6-1 19:21:32'
      // }],
      issueTypeOptions: [
        { label: '全部问题', value: 'all' },
        { label: '未处理', value: 0 },
        { label: '已处理', value: 1 }
      ],
      issueType: {
        label: '全部问题',
        value: 'all'
      }
      // periodOptions: [
      //   { label: '不限', value: 'any' },
      //   { label: '最近24小时', value: 24 },
      //   { label: '最近3天', value: 72 },
      //   { label: '最近7天', value: 168 }
      // ],
      // period: {
      //   label: '不限',
      //   value: 'any'
      // },
      // statusOptions: [
      //   { label: '不限', value: 'any' },
      //   { label: '未处理', value: 0 },
      //   { label: '已处理', value: 1 }
      // ],
      // status: {
      //   label: '不限',
      //   value: 'any'
      // },
      // queryTypeOptions: [
      //   { label: '联系方式', value: 'phone' },
      //   { label: '姓名', value: 'user_name' }
      // ],
      // queryType: {
      //   label: '联系方式',
      //   value: 'phone'
      // }
    }
  },

  computed: {
    selectOptions () {
      if (this.products.length > 0) {
        var res = [{
          label: '全部'
        }]
        this.products.forEach((item) => {
          let temp = {
            id: item.id,
            label: item.name
          }
          res.push(temp)
        })
        return res
      } else {
        return []
      }
    },
    // currIssue () {
    //   this.issues [asdsadff]
    //   return {}
    // },
    queryCondition () {
      var condition = {}
      condition = {
        filter: ['_id', 'content', 'create_time', 'label'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        query: {},
        order: {
          create_time: -1
        }
      }
      if (this.period === '') {
        if (this.selectedProduct.label === '全部') {
          condition.query = {
            create_time: {
              $gte: {'@date': this.startTimePick},
              $lte: {'@date': this.endTimePick}
            }
          }
        } else {
          condition.query = {
            product_id: {
              $in: [this.selectedProduct.id]
            },
            create_time: {
              $gte: {'@date': this.startTimePick},
              $lte: {'@date': this.endTimePick}
            }
          }
        }
      } else if (this.period === 'all') {
        if (this.selectedProduct.label === '全部') {

        } else {
          condition.query = {
            product_id: {
              $in: [this.selectedProduct.id]
            }
          }
        }
      } else {
        if (this.selectedProduct.label === '全部') {
          condition.query = {
            create_time: {
              $lte: {'@date': this.endTime + 'T00:00:00.000Z'},
              $gte: {'@date': this.beginTime + 'T00:00:00.000Z'}
            }
          }
        } else {
          condition.query = {
            product_id: {
              $in: [this.selectedProduct.id]
            },
            create_time: {
              $lte: {'@date': this.endTime + 'T00:00:00.000Z'},
              $gte: {'@date': this.beginTime + 'T00:00:00.000Z'}
            }
          }
        }
      }
      switch (this.issueType.label) {
        case '未处理':
          condition.query['status'] = { $in: [0] }
          break
        case '已处理':
          condition.query['status'] = { $in: [1] }
          break
        default:
      }
      // const SECONDS_PER_HOUR = 3600
      //
      // // 添加问题类型查询条件
      // if (this.issueType.value !== 'all') {
      //   condition.query['label'] = { $in: [this.issueType.label] }
      // }
      //
      // // 添加开始和结束时间的查询条件
      // if (this.period.value !== 'any') {
      //   let endTime = new Date()
      //   let startTime = new Date(endTime.getTime() - SECONDS_PER_HOUR * 1000 * this.period.value)
      //   condition.query.create_time = {
      //     '$gte': {
      //       '@date': new Date(startTime)
      //     },
      //     '$lte': {
      //       '@date': new Date(endTime)
      //     }
      //   }
      // }
      //
      // // 添加反馈状态查询条件
      // if (this.status.value !== 'any') {
      //   condition.query['status'] = { $in: [this.status.value] }
      // }
      //
      // // 添加查询字段内容
      // if (this.query.length > 0) {
      //   condition.query[this.queryType.value] = {$regex: this.query, $options: 'i'}
      // }

      return condition
    },
    beginTime () {
      var past = new Date().getTime() - (this.period - 2) * 24 * 3600 * 1000
      return formatDate(past, 'yyyy-MM-dd', true)
    },
    endTime () {
      var end = new Date().getTime() + 24 * 3600 * 1000
      return formatDate(end, 'yyyy-MM-dd', true)
    }
  },

  // TODO 优化初始化获取 vuex 产品的流程
  route: {
    data () {
      // this.init()
      // this.getIssues()
      this.getLabels()
    }
  },

  watch: {
    products () {
      this.init()
      // if (this.issues[0]) {
      //   this.$route.router.replace('/operation/plugins/helpdesk/' + this.$route.params.app_id + '/issues/' + this.issues[0]._id)
      // }
    },
    issues () {
      if (this.issues.length && !this.$route.params.id) {
        // this.init()
        this.$route.router.replace('/operation/plugins/helpdesk/' + this.$route.params.app_id + '/issues/' + this.issues[0]._id)
      }
    }
  },

  ready () {
    this.init()
    // this.$route.router.replace('/operation/plugins/helpdesk/' + this.$route.params.app_id + '/issues/' + this.issues[0]._id)
  },

  methods: {
    init () {
      this.selectedProduct = this.selectOptions[0] || {}
      if (this.products.length > 0) {
        this.getIssues()
      }
    },
    getSpecial (start, end) {
      this.period = ''
      this.startTimePick = start
      this.endTimePick = end
      this.getIssues()
    },
    // 获取问题列表
    getIssues () {
      this.loadingData = true
      if (typeof querying !== 'undefined') {
        this.currentPage = 1
      }
      api.helpdesk.getFeedbackList(this.$route.params.app_id, this.queryCondition).then((res) => {
        if (res.status === 200 && res.data.list.length > 0) {
          this.total = res.data.count
          this.issues = res.data.list
          this.dealTime()
          this.$route.router.replace('/operation/plugins/helpdesk/' + this.$route.params.app_id + '/issues/' + this.issues[0]._id)
        } else {
          this.issues = []
          this.total = 0
        }
        this.loadingData = false
        // if (this.issues[0]._id !== '') {
        //   this.$route.router.replace('/operation/plugins/helpdesk/' + this.$route.params.app_id + '/issues/' + this.issues[0]._id)
        // }
      }).catch((err) => {
        this.handleError(err)
        this.loadingData = false
      })
    },
    // 将后台返回的时间加上8个小时处理
    dealTime () {
      this.issues.forEach((issue) => {
        issue.create_time = formatDate(issue.create_time, true)
      })
    },

    getLabels () {
      var params = {
        limit: 20
      }
      api.helpdesk.getFeedbackLabel(this.$route.params.app_id, params).then((res) => {
        if (res.status === 200 && res.data.list.length > 0) {
          this.issueTypeOptions = this.issueTypeOptions.concat(res.data.list)
        }
      }).catch((err) => {
        this.handleError(err)
      })
    },

    // 搜索
    handleSearch () {
      if (this.query.length === 0) {
        this.getIssues()
      }
    },

    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    },

    // 取消搜索
    cancelSearching () {
      this.getIssues()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'
.overhid
  word-wrap break-word
  display block
  overflow hidden
  white-space nowrap
  text-overflow ellipsis
.issue-list
  position relative
  margin-bottom 40px
  margin-right -1px
  z-index 10

  ul
    border-right 1px solid default-border-color
    margin 10px 0 0 15px

  li
    margin-bottom 5px

    a
      display block
      position relative
      border 1px solid default-border-color
      background-color #F2F2F2
      margin-right -1px
      padding 10px 15px 10px 40px
      font-size 12px
      color gray-dark
      line-height 22px
      transition background-color .2s ease

      .fa
        absolute left 13px top 15px
        font-size 16px

      .metas
        display block
        color gray-light

        span
          margin-right 5px

      &:hover
        text-decoration none
        background-color #FFF
        color #000

    .v-link-active
      border-right-color #FFF
      background-color #FFF

    &.handled
      .fa
        color gray-light

  .view-more
    margin-top 20px

    a
      color red
</style>
