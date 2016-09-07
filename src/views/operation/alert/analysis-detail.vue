<template>
  <div class="main">
    <div class="main-title">
      <h2>告警分析详情</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="left-actions blockdiv clearfix mt10" slot="left-actions">
      <div class="filter-group fl ml20">
        <div class="filter-group-item">
          <!-- <x-select label="空气净化器" width="110px" size="small">
            <span slot="label">产品：空气净化器</span>
          </x-select> -->
          <div class="lh28">
            <span class="text-label" :class="tagStyle(alert.tag)">{{ alert.tag }}</span>
            <span class="ml10">{{alert.name}}</span>
          </div>
        </div>
      </div>
      <div class="filter-group fr mr20">
        <date-time-multiple-picker :periods="periods" @timechange="getSpecial" :default-period="defaultPeriod"></date-time-multiple-picker>
      </div>
    </div>
    <div class="panel mt10">
      <div class="filter-bar filter-bar-head filter-bar-lr">
        <div class="filter-group fr">
          <div class="filter-group-item">
            <search-box :key.sync="key" :placeholder="$t('ui.overview.addForm.search_condi')" :active="searching" @cancel="getList()" @search-deactivate="getList()" @search="getList()" @press-enter="getList()">
              <x-select width="90px" :label="queryType.label" size="small">
                <select v-model="queryType">
                  <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                </select>
              </x-select>
              <button slot="search-button" @click="getList(true)" class="btn btn-primary"><i class="fa fa-search"></i></button>
            </search-box>
          </div>
        </div>
        <h3>告警列表</h3>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <x-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @page-count-update="pageCountUpdate" @current-page-change="currentPageChange" @theader-create-date="sortBySomeKey"></x-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as config from 'consts/config'
import api from 'api'
import Modal from 'components/Modal'
import Select from 'components/Select'
import DateTimeMultiplePicker from 'components/DateTimeMultiplePicker'
import Statistic from 'components/Statistic'
import TimeLine from 'components/g2-charts/TimeLine'
import Breadcrumb from 'components/Breadcrumb'
import SearchBox from 'components/SearchBox'
import Table from 'components/Table'
import { globalMixins } from 'src/mixins'
import { formatDate } from 'src/filters'
import locales from 'consts/locales/index'
import Vue from 'vue'

export default {
  name: 'Overview',

  mixins: [globalMixins],

  components: {
    Modal,
    'x-select': Select,
    DateTimeMultiplePicker,
    'x-table': Table,
    Statistic,
    Breadcrumb,
    TimeLine,
    SearchBox
  },

  data () {
    return {
      alert: {
        tag: '',
        name: ''
      },
      defaultPeriod: 7,
      startTimePick: '',
      endTimePick: '',
      countPerPage: config.COUNT_PER_PAGE,
      currentPage: 1,
      records: [],
      key: '',
      queryTypeOptions: [
        { label: 'MAC', value: 'mac' },
        { label: '设备ID', value: 'from' },
        { label: '告警内容', value: 'content' }
      ],
      queryType: {
        label: 'MAC',
        value: 'mac'
      },
      // 数据是否加载中
      loadingData: false,
      headers: [
        {
          key: 'mac',
          title: '设备MAC'
        },
        {
          key: 'id',
          title: '设备ID'
        },
        {
          key: 'create_date',
          title: '时间',
          sortType: -1
        },
        {
          key: 'duration',
          title: '持续时长'
        },
        {
          key: 'state',
          title: '状态'
        }
      ],
      breadcrumbNav: [{
        label: '告警分析',
        link: '/operation/alerts/analysis'
      }, {
        label: '当前'
      }],
      product: {},
      total: 0,
      periods: [1, 7, 30]
    }
  },

  ready () {
    this.getRules()
  },

  computed: {
    queryCondition () {
      var params = {
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {},
        query: {
          alert_id: {
            $in: [this.$route.params.id]
          },
          product_id: {
            $in: [this.$route.params.product_id]
          },
          create_date: {
            $gte: this.startTimePick,
            $lte: this.endTimePick
          }
        }
      }
      if (this.key !== '') {
        if (this.queryType.value === 'from') {
          // 设备ID不能用模糊匹配
          params.query.from = {
            '$in': [this.key]
          }
        } else {
          params.query[this.queryType.value] = {
            '$like': this.key
          }
        }
      }

      this.headers.map((item) => {
        if (item.sortType) {
          params.order[item.key] = (item.sortType === 1 ? 'asc' : 'desc')
        }
      })

      return params
    },
    tables () {
      var result = []
      this.records.map((item) => {
        var alert = {
          mac: item.mac,
          id: item.from,
          create_date: formatDate(item.create_date),
          duration: item.lasting + 'h',
          state: item.is_read ? '已处理' : '未处理',
          prototype: item
        }
        result.push(alert)
      })
      return result
    }
  },

  methods: {
    /**
     * 按某个属性排序
     * 国辉
     * @param  {[type]} table [description]
     * @return {[type]}       [description]
     */
    sortBySomeKey (header, index) {
      if (header.sortType === 1) {
        header.sortType = -1
      } else {
        header.sortType = 1
      }
      this.headers.$set(index, header)
      this.getList()
    },
    currentPageChange (number) {
      this.currentPage = number
      this.getList()
    },
    pageCountUpdate (count) {
      this.countPerPage = count
      this.getList()
    },
    getSpecial (start, end) {
      this.startTimePick = new Date(start.getTime() + 3600 * 1000 * 8)
      this.endTimePick = new Date(end.getTime() + 3600 * 1000 * 8)
      this.getList(true)
    },
    // 获取告警历史@author weijie
    getList (reset) {
      if (reset) {
        this.currentPage = 1
      }
      this.loadingData = true
      api.alert.getAlerts(this.queryCondition).then((res) => {
        if (res.status === 200) {
          this.total = res.data.count
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
              item.lasting = lasting.toFixed(1)
            }
            return item
          })
          this.loadingData = false
        }
      }).catch((res) => {
        this.loadingData = false
        this.handleError(res)
      })
    },
    getRules () {
      api.alert.getRules(this.$route.params.product_id).then((res) => {
        if (res.status === 200) {
          this.alert = res.data.find((item) => {
            return item.id === this.$route.params.id
          })
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    tagStyle (tag) {
      switch (tag) {
        case locales[Vue.config.lang].data.ALERT_LEVELS.orange:
          return 'text-label-warning'
        case locales[Vue.config.lang].data.ALERT_LEVELS.red:
          return 'text-label-danger'
        default:
          break
      }
      return ''
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../assets/stylus/common'
.filter-bar-lr
  border 1px solid #d9d9d9
.inlinediv
  display inline-block!important
.lh28
  line-height 28px
.nobgnobrt
  background-color none
  border-top none!important
</style>
