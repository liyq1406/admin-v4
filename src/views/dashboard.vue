<template>
  <section class="main-wrap">
    <div class="main">
      <div class="row">
        <div class="col-24">
          <!-- Start: 管理台-->
          <div class="panel">
            <div class="panel-hd">
              <div v-text="new Date() | formatDate" class="date"></div>
              <h2>{{ $t("ui.dashboard.platform") }}</h2>
            </div>
            <div class="panel-bd">
              <div class="statistic">
                <div class="statistic-item device-count">
                  <div class="fa fa-link"></div>
                  <div class="num">{{ totalSummary.total }}</div>
                  <div class="label">{{ $t("ui.dashboard.statistic.total") }}</div>
                </div>
                <div class="statistic-item active-count">
                  <div class="fa fa-magic"></div>
                  <div class="num">{{ totalSummary.activated }}</div>
                  <div class="label">{{ $t("ui.dashboard.statistic.activated") }}</div>
                </div>
                <div class="statistic-item online-count">
                  <div class="fa fa-wifi"></div>
                  <div class="num">{{ totalSummary.online }}</div>
                  <div class="label">{{ $t("ui.dashboard.statistic.online") }}</div>
                </div>
                <div class="statistic-item user-count">
                  <div class="fa fa-users"></div>
                  <div class="num">{{ userSummary.user }}</div>
                  <div class="label">{{ $t("ui.dashboard.statistic.user") }}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- Start: 管理台-->
        </div>
      </div>
      <div class="row">
        <div class="col-16">
          <!-- Start: 产品趋势 -->
          <div class="panel" v-if="productsOptions.length">
            <div class="panel-hd">
              <h2>产品趋势</h2>
              <div class="leftbox">
                <v-select size="small" width="160px" placeholder="请选择产品" :label="product.name">
                  <select v-model="product" @change="getProductTrend">
                    <option v-for="option in productsOptions" :value="option">{{ option.name }}</option>
                  </select>
                </v-select>
                <radio-group :items="periods" :value.sync="productPeriod"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-group>
              </div>
            </div>
            <div class="panel-bd with-loading">
              <line-chart :series="productSeries" :x-axis-data="productXAxisData" v-ref:product-chart></line-chart>
              <div class="icon-loading" v-show="loadingProductTrends">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
            </div>
          </div>
          <!-- End: 产品趋势 -->

          <!-- Start: 用户趋势 -->
          <div class="panel">
            <div class="panel-hd">
              <h2>用户趋势</h2>
              <div class="leftbox">
                <radio-group :items="periods" :value.sync="userPeriod"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-group>
              </div>
            </div>
            <div class="panel-bd with-loading">
              <line-chart :series="userSeries" :x-axis-data="userXAxisData" v-ref:user-chart></line-chart>
              <div class="icon-loading" v-show="loadingUserTrends">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
            </div>
          </div>
          <!-- End: 用户趋势 -->

          <!-- Start: 告警信息 -->
          <div class="panel">
            <div class="panel-hd">
              <h2>告警信息</h2>
              <div class="leftbox">
                <radio-group :items="periods" :value.sync="alertPeriod"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-group>
              </div>
            </div>
            <div class="panel-bd with-loading">
              <line-chart :series="alertSeries" :x-axis-data="alertXAxisData" v-ref:alert-chart></line-chart>
              <div class="icon-loading" v-show="loadingAlertTrends">
                <i class="fa fa-refresh fa-spin"></i>
              </div>
            </div>
          </div>
          <!-- End: 告警信息 -->
        </div>
        <div class="col-8">
          <!-- Start: 文档-->
          <div class="panel">
            <div class="panel-hd">
              <h2>{{ $t("ui.dashboard.documents") }}</h2>
            </div>
            <div class="panel-bd">
              <div class="doc-list">
                <div class="doc-list-item"><a href="http://support.xlink.cn/hc/kb/article/85600/" target="_blank" class="fa fa-apple"></a>
                  <div class="info">
                    <h3><a href="https://github.com/xlink-corp/xlink-sdk/blob/master/应用端开发文档/APP%20iOS%20SDK接口文档.md" target="_blank">iOS SDK</a></h3>
                    <p>提供iOS开发文档说明</p>
                  </div>
                </div>
                <div class="doc-list-item"><a href="http://support.xlink.cn/hc/kb/article/85441/" target="_blank" class="fa fa-android"></a>
                  <div class="info">
                    <h3><a href="https://github.com/xlink-corp/xlink-sdk/blob/master/应用端开发文档/APP%20Android%20SDK接口文档.md" target="_blank">Android SDK</a></h3>
                    <p>提供Android开发文档说明</p>
                  </div>
                </div>
                <div class="doc-list-item"><a href="https://github.com/xlink-corp/xlink-sdk" target="_blank" class="fa fa-th-large"></a>
                  <div class="info">
                    <h3><a href="#" target="_blank">平台开发文档</a></h3>
                    <p>云智易平台提供了丰富的接口</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End: 文档-->

          <!-- Start: 快速指南-->
          <div class="panel">
            <div class="panel-hd">
              <h2>{{ $t("ui.dashboard.guide") }}</h2>
            </div>
            <div class="panel-bd">
              <div class="post-list">
                <ul>
                  <li><a href="https://github.com/xlink-corp/xlink-sdk/blob/master/应用端开发文档/APP%20iOS%20SDK接口文档.md" target="_blank">XLINK SDK iOS 集成文档</a></li>
                  <li><a href="https://github.com/xlink-corp/xlink-sdk/blob/master/应用端开发文档/APP%20Android%20SDK接口文档.md" target="_blank">XLINK SDK Android 集成文档</a></li>
                  <li><a href="https://github.com/xlink-corp/xlink-sdk/blob/master/应用端开发文档/应用端RESTful接口文档/设备功能接口.md#device_share" target="_blank">[用户] 设备分享接口</a></li>
                  <li><a href="https://github.com/xlink-corp/xlink-sdk/blob/master/应用端开发文档/应用端RESTful接口文档/设备功能接口.md#device_newest_version" target="_blank">[用户] 设备升级接口</a></li>
                  <li><a href="https://github.com/xlink-corp/xlink-sdk/blob/master/应用端开发文档/微信智能硬件接入指南.md" target="_blank">[企业应用] 微信接入指南</a></li>
                  <li><a href="https://github.com/xlink-corp/xlink-sdk/blob/master/物联平台管理接口文档/授权管理.md" target="_blank">[企业应用] 授权管理</a></li>
                  <li><a href="https://github.com/xlink-corp/xlink-sdk/blob/master/物联平台管理接口文档/数据统计分析接口.md" target="_blank">[企业应用] 统计分析</a></li>
                </ul>
              </div>
            </div>
          </div>
          <!-- End: 快速指南-->
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import api from '../api'
  import Vue from 'vue'
  import RadioGroup from '../components/RadioGroup'
  import Select from '../components/Select'
  import LineChart from '../components/charts/Line'
  import locales from '../consts/locales/index'
  import dateFormat from 'date-format'
  import _ from 'lodash'
  import { globalMixins } from '../mixins'

  export default {
    name: 'Dashboard',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'radio-group': RadioGroup,
      'v-select': Select,
      'line-chart': LineChart
    },

    data () {
      return {
        // 设备统计
        totalSummary: {
          total: 0,
          activated: 0,
          online: 0
        },
        // 用户统计
        userSummary: {
          user: 0
        },
        product: {},
        productsOptions: [],
        productPeriod: 7,
        userPeriod: 7,
        alertPeriod: 7,
        periods: locales[Vue.config.lang].data.PERIODS,
        productTrends: [],
        userTrends: [],
        alertTrends: [],
        loadingProductTrends: false,
        loadingUserTrends: false,
        loadingAlertTrends: false
      }
    },

    computed: {
      // 产品趋势图表横轴数据
      productXAxisData () {
        return this._genXAxis(this.productPeriod)
      },

      // 产品趋势图表数据
      productSeries () {
        var result = [{
          name: this.$t('ui.statistic.products.active'),
          type: 'line',
          data: []
        }, {
          name: this.$t('ui.statistic.products.activated'),
          type: 'line',
          data: []
        }]

        for (var i = 0; i < this.productPeriod; i++) {
          var index = _.findIndex(this.productTrends, (item) => {
            return item.day === this.productXAxisData[i]
          })
          result[0].data[i] = index >= 0 ? this.productTrends[index].active : 0
          result[1].data[i] = index >= 0 ? this.productTrends[index].activated : 0
        }

        return result
      },

      // 用户趋势图表横轴数据
      userXAxisData () {
        return this._genXAxis(this.userPeriod)
      },

      // 用户趋势图表数据
      userSeries () {
        var result = [{
          name: this.$t('ui.statistic.users.active'),
          type: 'line',
          data: []
        }, {
          name: this.$t('ui.statistic.users.newbie'),
          type: 'line',
          data: []
        }]

        for (var i = 0; i < this.userPeriod; i++) {
          var index = _.findIndex(this.userTrends, (item) => {
            return item.day === this.userXAxisData[i]
          })
          result[0].data[i] = index >= 0 ? this.userTrends[index].active : 0
          result[1].data[i] = index >= 0 ? this.userTrends[index].add : 0
        }

        return result
      },

      // 告警趋势图表横轴数据
      alertXAxisData () {
        return this._genXAxis(this.alertPeriod)
      },

      // 告警趋势图表数据
      alertSeries () {
        var result = [{
          name: this.$t('ui.alert.counts'),
          type: 'line',
          data: []
        }]

        for (var i = 0; i < this.alertPeriod; i++) {
          var index = _.findIndex(this.alertTrends, (item) => {
            return item.day === this.alertXAxisData[i]
          })
          result[0].data[i] = index >= 0 ? this.alertTrends[index].message : 0
        }

        return result
      }
    },

    filters: {
      formatDate (date) {
        var year = date.getFullYear()
        var month = date.getMonth()
        var day = date.getDate()
        if (Vue.config.lang === 'en-us') {
          var weekArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
          return year + '-' + (month + 1) + '-' + day + ', ' + weekArr[date.getDay()]
        } else {
          return year + '年' + (month + 1) + '月' + day + '日 星期' + '日一二三四五六'.charAt(date.getDay())
        }
      }
    },

    // 监听属性变动
    watch: {
      productPeriod () {
        this.getProductTrend()
      },

      userPeriod () {
        this.getUserTrend()
      },

      alertPeriod () {
        this.getAlertTrend()
      }
    },

    route: {
      data () {
        api.statistics.getSummary().then((res) => {
          if (res.status === 200) {
            this.totalSummary = res.data.total
            this.userSummary = res.data.user
          }
        }).catch((res) => {
          this.handleError(res)
        })
      }
    },

    ready () {
      api.product.all().then((res) => {
        if (res.status === 200 && res.data.length > 0) {
          this.productsOptions = res.data
          this.product = res.data[0]
          this.getProductTrend()
          this.getUserTrend()
          this.getAlertTrend()
          // 假数据
          // this.productTrends = [{day: '04-26', activated: 10, active: 8}]
          // this.userTrends = [{day: '04-26', add: 10, active: 8}]
        }
      }).catch((res) => {
        this.handleError(res)
      })

      // 监听窗口尺寸变化
      window.onresize = () => {
        this.$refs.productChart.chart.resize()
        this.$refs.userChart.chart.resize()
        this.$refs.alertChart.chart.resize()
      }
    },

    methods: {
      /**
       * 生成横轴点
       * @return {Boolean} [description]
       */
      _genXAxis (period) {
        var today = new Date()
        var result = []

        for (var i = period - 1; i >= 0; i--) {
          result[i] = dateFormat('MM-dd', new Date(today - (period - i - 1) * 24 * 3600 * 1000))
        }
        return result
      },

      /**
       * 获取产品趋势
       */
      getProductTrend () {
        var today = new Date()
        var past = today.getTime() - this.productPeriod * 24 * 3600 * 1000
        var startDay = dateFormat('yyyy-MM-dd', new Date(past))
        var endDay = dateFormat('yyyy-MM-dd', today)

        this.loadingProductTrends = true
        api.statistics.getProductTrend(this.product.id, startDay, endDay).then((res) => {
          if (res.status === 200) {
            this.productTrends = res.data.map((item) => {
              item.day = dateFormat('MM-dd', new Date(item.day))
              return item
            })
            this.loadingProductTrends = false
          }
        }).catch((res) => {
          this.loadingProductTrends = false
          this.handleError(res)
        })
      },

      /**
       * 获取用户趋势
       */
      getUserTrend () {
        var today = new Date()
        var past = today.getTime() - this.userPeriod * 24 * 3600 * 1000
        var startDay = dateFormat('yyyy-MM-dd', new Date(past))
        var endDay = dateFormat('yyyy-MM-dd', today)

        this.loadingUserTrends = true
        api.statistics.getUserTrend(startDay, endDay).then((res) => {
          if (res.status === 200) {
            this.userTrends = res.data.map((item) => {
              item.day = dateFormat('MM-dd', new Date(item.day))
              return item
            })
            this.loadingUserTrends = false
          }
        }).catch((res) => {
          this.loadingUserTrends = false
          this.handleError(res)
        })
      },

      /**
       * 获取告警趋势
       */
      getAlertTrend () {
        var today = new Date()
        var past = today.getTime() - this.alertPeriod * 24 * 3600 * 1000
        var startDay = dateFormat('yyyy-MM-dd', new Date(past))
        var endDay = dateFormat('yyyy-MM-dd', today)

        this.loadingAlertTrends = true
        api.statistics.getAlertTrend(startDay, endDay).then((res) => {
          if (res.status === 200) {
            this.alertTrends = res.data.map((item) => {
              item.day = dateFormat('MM-dd', new Date(item.day))
              return item
            })
            this.loadingAlertTrends = false
          }
        }).catch((res) => {
          this.loadingAlertTrends = false
          this.handleError(res)
        })
      }
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylus/common'

  .statistic
    font-size 0
    margin 0 -25px
    padding 25px 0

    .statistic-item
      display inline-block
      width 25%
      padding 10px 0
      font-size 14px
      box-sizing border-box
      border-right 1px solid #E6E6E6
      text-align right

      .fa
        float left
        size 42px
        margin-left 25px
        border-radius 30px
        text-align center
        line-height 42px
        font-size 24px
        color #FFF

      .num
      .label
        margin-right 25px

      .num
        font-size 36px
        line-height 44px
        height 44px

      .label
        color #999

      &:last-child
        border-right none

    .device-count
      .num
        color #0092D6

      .fa
        background #0092D6

    .active-count
      .num
        color #27A9B0

      .fa
        background #27A9B0

    .online-count
      .num
        color #3A749A

      .fa
        background #3A749A

  .user-count
    .num
      color #FA6659

    .fa
      background #FA6659

  // 文章列表
  .post-list
    padding 5px 0

    ul
      reset-list()

    li
      position relative
      margin 18px 0
      padding-left 20px

      &:before
        absolute left 2px top
        content "\2022"

  // 文档
  .doc-list
    .doc-list-item
      display block
      margin 25px 0
      clearfix()

      .fa
        float left
        size 36px
        border 1px solid #E9E9E9
        text-align center
        line-height 36px
        font-size 24px
        transition color .3s

        &:hover
          text-decoration none

      .fa-apple
        color #B6B6B6

        &:hover
          color darken(@color, 20%)

      .fa-android
        color #74B939

        &:hover
          color darken(@color, 20%)

      .fa-th-large
        color #5899C2

        &:hover
          color darken(@color, 20%)

      .info
        margin-left 56px

      h3
        margin 0
        font-size 14px
        color #666

        a
          transition color .3s

      p
        margin 0
        font-size 12px
        color #999

  // 告警列表
  .alert-list
    li
      padding 10px 0

      .text-label
        font-size 12px
        margin-right 5px

    .alert-time
      font-size 12px
      color gray-light
      text-align right
</style>
