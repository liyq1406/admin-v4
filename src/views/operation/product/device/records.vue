<template>
  <section class="main-wrap">
    <div class="main">
      <div class="breadcrumb"><a v-link="{path: '/products/' + this.$route.params.product_id + '/devices'}" class="fa fa-arrow-circle-left">返回设备管理列表</a></div>
      <div class="panel">
        <div class="panel-hd">
          <h2>设备上下线记录</h2>
        </div>
        <div class="panel-bd">
          <div class="action-bar">
            <search-box class="work-order-search-box" :key.sync="key" :active="searching" :placeholder="'请输入'+ queryType.label" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @press-enter="getRecords(true)" @cancel="getRecords(true)">
              <v-select width="100px" :label="queryType.label">
                <select v-model="queryType">
                  <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                </select>
              </v-select>
              <button slot="search-button" class="btn btn-primary" @click="getRecords(true)"><i class="fa fa-search"></i></button>
            </search-box>
          </div>

          <div class="status-bar">
            <v-select width="80px" :label="dateType.label" size="small">
              <select v-model="dateType" @change = "getRecords(true)">
                <option v-for="option in dateTypeOptions" :value="option">{{ option.label }}</option>
              </select>
            </v-select>
            <date-time-range-picker input-size="small" class="mr20" :from.sync="startDate" :to.sync="endDate" :from-time.sync="startTime" :to-time.sync="endTime" input-width="94px" @select-day="getRecords(true)" @select-time="getRecords(true)">
              <span slot="label">记录时间：</span>
            </date-time-range-picker>
            <button class="btn btn-ghost btn-sm fa fa-refresh" @click="resetQueryCondition"></button>
          </div>

          <div class="data-table with-loading">
            <div class="icon-loading" v-show="loadingData">
              <i class="fa fa-refresh fa-spin"></i>
            </div>
            <table class="table table-stripe table-bordered">
              <thead>
                <tr>
                  <th>设备ID</th>
                  <th>IP地址</th>
                  <th>记录时间</th>
                  <th>状态</th>
                  <!-- <th>引起状态变化的原因</th> -->
                </tr>
              </thead>
              <tbody>
                <template v-if="records.length > 0">
                  <tr v-for="record in records">
                    <td>{{ record.device_id }}</td>
                    <td>{{ record.ip }}</td>
                    <td>{{ record.create_time | formatDate}}</td>
                    <td>
                      <span v-if = "record.status === 0" class="hl-gray">下线</span>
                      <span v-else class="hl-green">上线</span>
                    </td>
                    <!-- <td>
                      <span v-if = "record.code === 0" class="hl-green">正常</span>
                      <span v-else class="hl-red">网络异常</span>
                    </td> -->
                  </tr>
                </template>

                <tr v-if="records.length === 0 && !loadingData">
                  <td colspan="6" class="tac">
                    <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Start: 分页信息 -->
          <div class="row">
            <div class="col-8 mb40">{{{ $t('common.total_results', {count:total}) }}}</div>
            <div class="col-16">
              <pager v-if="!loadingData && total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getRecords"></pager>
            </div>
          </div>
          <!-- End: 分页信息 -->
      </div>
      </div>
    </div>
  </section>
</template>

<script>
  import * as config from 'consts/config'
  import { globalMixins } from 'src/mixins'
  import Select from 'components/Select'
  import AreaSelect from 'components/AreaSelect'
  import SearchBox from 'components/SearchBox'
  import Pager from 'components/Pager'
  import DateTimeRangePicker from 'components/DateTimeRangePicker'
  import api from 'api'

  export default {
    name: 'OrderList',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'v-select': Select,
      'area-select': AreaSelect,
      'search-box': SearchBox,
      'pager': Pager,
      'date-time-range-picker': DateTimeRangePicker
    },

    data () {
      return {
        name: '',
        key: '',
        startDate: '',
        startTime: '00:00',
        endDate: '',
        endTime: '23:00',
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

        if (this.startDate !== '') {
          condition.query.create_time = condition.query.create_time || {}
          condition.query.create_time['$gte'] = `${this.startDate}T${this.startTime}:00.000Z`
        }
        if (this.endDate !== '') {
          condition.query.create_time = condition.query.create_time || {}
          condition.query.create_time['$lte'] = `${this.endDate}T${this.endTime}:00.000Z`
        }

        if (this.dateType.value === 'all') {
          condition.query.status = undefined
        } else {
          condition.query.status = this.dateType.value === 'online' ? 1 : 0
        }

        return condition
      }
    },

    methods: {
      /**
       * 获取记录
       */
      getRecords (querying) {
        if (typeof querying !== 'undefined') {
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
