<template>
  <div class="main">
    <div class="main-title">
      <h2>告警分析</h2>
    </div>
    <div class="filter-bar filter-bar-head">
      <div class="filter-group fl">
        <div class="filter-group-item">
          <v-select label="空气净化器" width='110px' size="small">
            <span slot="label">产品</span>
          </v-select>
        </div>
      </div>
      <div class="filter-group fr">
        <div class="filter-group-item">
          <button class="btn btn-ghost btn-sm"><i class="fa fa-share-square-o"></i></button>
        </div>
        <div class="filter-group-item">
          <radio-button-group :items="periods" :value.sync="period"><span slot="label" class="label">{{ $t("common.recent") }}</span></radio-button-group>
        </div>
      </div>
    </div>
    <!-- <div class="panel no-split-line">
      <div class="panel-bd">
        <div class="with-loading">
          <time-line :data="alertTrends" :type="'smooth'"></time-line>
          <div class="icon-loading" v-show="loadingData">
            <i class="fa fa-refresh fa-spin"></i>
          </div>
        </div>
      </div>
    </div> -->

    <div class="panel">
      <!-- <div class="panel-hd panel-hd-full">
        <h2>级别分布</h2>
      </div> -->
      <div class="panel-bd">
        <nav class="tab">
          <ul>
            <li v-for="item in tabItems">
              <a @click="selectLevel($index)" :class="{'active':currIndex===$index}">{{ item }}</a>
            </li>
          </ul>
        </nav>
        <div class="row">
          <div class="col-10">
            <pie :data="warningLevel"></pie>
          </div>
          <div class="col-13 col-offset-1 data-table-wrap">
            <div class="data-table">
              <table class="table">
                <thead>
                  <tr>
                    <th>{{levelTitle}}</th>
                    <th>数量</th>
                    <th>占比</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in warningLevel">
                    <td><a v-if="this.showlink===true" v-link="{ path: '/operation/alerts/analysis/' + item.id }">{{item.name}}</a><i v-else>{{item.name}}</i></td>
                    <td>{{item.value}}</td>
                    <td>14%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash'
// import api from 'api'
import * as config from 'consts/config'
import Pager from 'components/Pager'
import RadioButtonGroup from 'components/RadioButtonGroup'
import Pie from 'components/g2-charts/Pie'
import Select from 'components/Select'
import SearchBox from 'components/SearchBox'
import dateFormat from 'date-format'
import TimeLine from 'components/g2-charts/TimeLine'
import { globalMixins } from 'src/mixins'
import Mock from 'mockjs'

export default {
  name: 'Alerts',

  mixins: [globalMixins],

  components: {
    Pager,
    RadioButtonGroup,
    'v-select': Select,
    SearchBox,
    Pie,
    TimeLine
  },

  data () {
    return {
      tabItems: ['全部', '轻度', '中度', '重度'],
      currIndex: 0,
      levelTitle: '告警',
      key: '',
      statistics: [],
      total: 0,
      countPerPage: config.COUNT_PER_PAGE,
      currentPage: 1,
      alertTrends: [],
      today: dateFormat('yyyy-MM-dd', new Date()),
      loadingData: false,
      period: 7,
      periods: [
        {
          value: 1,
          label: '24h'
        },
        {
          value: 7,
          label: '7天'
        },
        {
          value: 30,
          label: '30天'
        }
      ],
      warningLevel: [
        {
          name: '重度',
          value: 50
        },
        {
          name: '中度',
          value: 30
        },
        {
          name: '轻度',
          value: 20
        }
      ],
      showlink: false
    }
  },

  computed: {
    queryCondition () {
      return {
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage
      }
    },

    past () {
      var past = new Date().getTime() - this.period * 24 * 3600 * 1000
      return dateFormat('yyyy-MM-dd', new Date(past))
    }
  },

  filters: {
    toTags (value) {
      return value.length ? value.split(',') : []
    }
  },

  ready () {
    // TODO
    this.alertTrends = Mock.mock({
      'list|14': [{
        'date|+1': [
          new Date(2016, 7, 15),
          new Date(2016, 7, 16),
          new Date(2016, 7, 17),
          new Date(2016, 7, 18),
          new Date(2016, 7, 19),
          new Date(2016, 7, 20),
          new Date(2016, 7, 21)
        ],
        'count|+1': [6, 8, 9, 3, 9, 3, 9]
      }]
    }).list
  },

  route: {
    data () {
    }
  },

  methods: {
    selectLevel (index) {
      this.currIndex = index
      switch (index) {
        case 0:
          this.warningLevel = [
            {
              name: '重度',
              value: 50
            },
            {
              name: '中度',
              value: 30
            },
            {
              name: '轻度',
              value: 20
            }
          ]
          this.showlink = false
          this.levelTitle = '告警'
          break
        case 1:
          this.warningLevel = [
            {
              id: 123,
              name: '异常下线',
              value: 10
            },
            {
              id: 123,
              name: '温度过高',
              value: 30
            },
            {
              id: 123,
              name: '风机异常',
              value: 20
            }
          ]
          this.showlink = true
          this.levelTitle = '轻度告警'
          break
        case 2:
          this.warningLevel = [
            {
              id: 123,
              name: '湿度超高',
              value: 10
            },
            {
              id: 123,
              name: '风机异常',
              value: 20
            }
          ]
          this.showlink = true
          this.levelTitle = '轻度告警'
          break
        case 3:
          this.warningLevel = [
            {
              id: 123,
              name: '滤芯异常',
              value: 10
            },
            {
              id: 123,
              name: 'PM2.5超过指标',
              value: 30
            },
            {
              id: 123,
              name: 'CO2超过指标',
              value: 20
            },
            {
              id: 123,
              name: '电源异常',
              value: 20
            }
          ]
          this.showlink = true
          this.levelTitle = '重度告警'
          break
        default:

      }
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '../../../assets/stylus/common'
// tab
// 选项卡
.tab
  margin 15px 0
  padding 0 15px
  border-bottom 1px solid default-border-color

  ul
    reset-list()
    font-size 0

  li
    display inline-block
    font-size 13px

    a
      display block
      padding 0 20px
      line-height 28px
      color gray

      &:hover
        text-decoration none
        color gray-darker

      &.active
        height 28px
        background-color #fff
        border 1px solid default-border-color
        border-bottom none!important
        position relative
        bottom -1px
        font-weight bold
</style>
