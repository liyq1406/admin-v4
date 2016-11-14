<template>
  <div class="main">
    <div class="main-title">
      <h2>设备上下线记录</h2>
    </div>
    <breadcrumb :nav="breadcrumbNav"></breadcrumb>
    <div class="panel mt15">
      <div class="panel-bd">
        <x-table :headers="columns" :tables="recordList" :page="page" :loading="loadingData" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage">
          <div class="filter-bar" slot="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <button class="btn btn-ghost btn-sm fa fa-refresh" @click="resetQueryCondition"></button>
              </div>
              <div class="filter-group-item">
                <date-time-range-picker @timechange="timeSelect">
                  <span slot="label">记录时间：</span>
                </date-time-range-picker>
              </div>
              <div class="filter-group-item">
                <search-box class="work-order-search-box" :key.sync="key" :active="searching" :placeholder="'请输入'+ queryType.label" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @press-enter="getRecords(true)" @cancel="getRecords(true)">
                  <x-select width="100px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </x-select>
                  <button slot="search-button" class="btn btn-primary" @click="getRecords(true)">搜索</button>
                </search-box>
              </div>
            </div>
            <div class="filter-group">
              <div class="filter-group-item">
                <x-select width="80px" :label="dateType.label" size="small">
                  <span slot="label">{{ $t('common.display') }}：</span>
                  <select v-model="dateType" @change = "getRecords(true)">
                    <option v-for="option in dateTypeOptions" :value="option">{{ option.label }}</option>
                  </select>
                </x-select>
              </div>
            </div>
          </div>
        </x-table>
    </div>
    </div>
  </div>
</template>

<script>
import * as config from 'consts/config'
import { globalMixins } from 'src/mixins'
import SearchBox from 'components/SearchBox'
import Table from 'components/Table'
import DateTimeRangePicker from 'components/DateTimeRangePicker'
import formatDate from 'filters/format-date'
import api from 'api'

export default {
  name: 'OnlineOfflineRecords',

  mixins: [globalMixins],

  components: {
    SearchBox,
    DateTimeRangePicker,
    'x-table': Table
  },

  data () {
    return {
      breadcrumbNav: [{
        label: '全部',
        link: `/dev/products/${this.$route.params.id}/info`
      }, {
        label: '设备上下线记录'
      }],
      columns: [{
        key: 'device_id',
        title: '设备ID'
      }, {
        key: 'ip',
        title: 'IP地址'
      }, {
        key: 'create_time',
        title: '记录时间'
      }, {
        key: 'status',
        title: '状态'
      }],
      name: '',
      key: '',
      startTime: '',
      endTime: '',
      records: [],
      loadingData: false,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      total: 0,
      searching: false,
      queryTypeOptions: [
        { label: '设备ID', value: 'device_id' },
        { label: 'IP地址', value: 'ip' }
      ],
      dateTypeOptions: [
        { label: '全部', value: 'all' },
        { label: '上线', value: 'online' },
        { label: '下线', value: 'offline' }
      ],
      queryType: {
        label: '设备ID',
        value: 'device_id'
      },
      dateType: {
        label: '全部',
        value: 'all'
      }
    }
  },

  ready () {
    this.getRecords()
  },

  computed: {
    queryCondition () {
      var condition = {
        filter: [],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {},
        query: {
          product_id: this.$route.params.product_id
        }
      }

      if (this.key !== '') {
        condition.query[this.queryType.value] = this.queryType.value === 'device_id' ? Number(this.key) : this.key
      }

      if (this.startTime !== '') {
        condition.query.create_time = condition.query.create_time || {}
        condition.query.create_time['$gte'] = this.startTime
      }
      if (this.endTime !== '') {
        condition.query.create_time = condition.query.create_time || {}
        condition.query.create_time['$lte'] = this.endTime
      }

      if (this.dateType.value === 'all') {
        condition.query.status = undefined
      } else {
        condition.query.status = this.dateType.value === 'online' ? 1 : 0
      }

      return condition
    },

    // 分页信息
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },

    // 上下线记录列表
    recordList () {
      var result = []
      this.records.map((item) => {
        var record = {
          device_id: item.device_id,
          ip: item.ip,
          create_time: formatDate(item.create_time),
          status: item.status ? '<span class="hl-green">上线</span>' : '<span class="hl-gray">下线</span>',
          origin: item
        }
        result.push(record)
      })
      return result
    }
  },

  methods: {
    timeSelect (start, end) {
      this.startTime = start
      this.endTime = end
      this.getRecords(true)
    },
    /**
     * 获取记录
     */
    getRecords (reset) {
      if (reset) {
        this.currentPage = 1
      }

      this.loadingData = true
      api.device.getRecords(this.queryCondition).then((res) => {
        this.total = res.data.count
        this.records = res.data.list
        this.loadingData = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
    },

    /**
     * 当前页码改变
     * @author shengzhi
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getRecords()
    },

    /**
     * 每页显示的数量改变
     * @author shengzhi
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getRecords()
    },

    // 切换搜索
    toggleSearching () {
      this.searching = !this.searching
    },

    // 取消搜索
    cancelSearching () {
      this.getRecords(true)
    },

    /**
     * 重置查询条件
     */
    resetQueryCondition () {
      this.key = ''
      this.queryType = {
        label: '设备ID',
        value: 'device_id'
      }
      this.dateType = {
        label: '全部',
        value: 'all'
      }
      this.startDate = ''
      this.endDate = ''
      this.getRecords()
    }
  }
}
</script>
