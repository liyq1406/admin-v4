<template>
  <div class="panel">
    <div class="panel-hd">
      <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @cancel="getIssues(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="handleSearch" @press-enter="getIssues(true)">
        <v-select width="100px" :label="queryType.label">
          <select v-model="queryType">
            <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
          </select>
        </v-select>
        <button slot="search-button" @click="getIssues(true)" class="btn btn-primary">{{ $t('common.search') }}</button>
      </search-box>
      <h2>反馈列表</h2>
    </div>
    <div class="panel-bd">
      <div class="status-bar mt20">
        <div class="status">{{{ $t('common.total_results', {count:total}) }}}
        </div>
        <v-select width="90px" size="small" :label="issueType.label">
          <span slot="label">问题类型：</span>
          <select v-model="issueType" @change="getIssues(true)">
            <option v-for="option in issueTypeOptions" :value="option">{{ option.label }}</option>
          </select>
        </v-select>
        <v-select width="110px" size="small" :label="period.label">
          <span slot="label">时间：</span>
          <select v-model="period" @change="getIssues(true)">
            <option v-for="option in periodOptions" :value="option">{{ option.label }}</option>
          </select>
        </v-select>
        <v-select width="80px" size="small" :label="status.label">
          <span slot="label">反馈状态：</span>
          <select v-model="status" @change="getIssues(true)">
            <option v-for="option in statusOptions" :value="option">{{ option.label }}</option>
          </select>
        </v-select>
      </div>
      <div class="data-table with-loading">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>创建日期</th>
              <th>客户姓名</th>
              <th>联系方式</th>
              <th>产品名称</th>
              <th>反馈类别</th>
              <th>状态</th>
              <th class="tac">操作</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="issues.length > 0">
              <tr v-for="issue in issues">
                <td>{{ issue.create_time }}</td>
                <td>{{ issue.creator }}</td>
                <td>{{ issue.contact }}</td>
                <td>{{ issue.product_name }}</td>
                <td>{{ issue.type }}</td>
                <td>
                  <span class="hl-red" v-if="issue.status === 0">未处理</span>
                  <span class="hl-gray" v-if="issue.status === 1">已处理</span>
                </td>
                <td class="tac">
                  <a class="hl-red" v-link="'/plugins/helpdesk/' + $route.params.app_id + '/issues/' + issue.id">查看</a>
                </td>
              </tr>
            </template>
            <tr v-if="issues.length === 0 && !loadingData">
              <td colspan="7" class="tac">
                <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <pager v-if="total > countPerPage" :total="total" :current.sync="currentPage" :count-per-page="countPerPage" @page-update="getIssues"></pager>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import * as config from '../../../consts/config'
  import Select from '../../../components/Select'
  import Pager from '../../../components/Pager'
  import SearchBox from '../../../components/SearchBox'
  import locales from '../../../consts/locales/index'
  // import _ from 'lodash'
  import { globalMixins } from '../../../mixins'
  import { pluginMixins } from '../mixins'

  export default {
    name: 'Issues',

    layout: 'admin',

    mixins: [globalMixins, pluginMixins],

    components: {
      'v-select': Select,
      'search-box': SearchBox,
      'pager': Pager
    },

    data () {
      return {
        query: '',
        searching: false,
        visibility: {
          label: '全部',
          value: 'all'
        },
        visibilityOptions: locales[Vue.config.lang].data.DEVICE_VISIBILITY_OPTIONS,
        issues: [],
        total: 0,
        currentPage: 1,
        countPerPage: config.COUNT_PER_PAGE,
        addValidation: {},
        originAddModel: {},
        // querying: false,
        loadingData: false,
        issueTypeOptions: [
          { label: '全部', value: 'all' },
          { label: '使用疑问', value: 1 },
          { label: '产品咨询', value: 2 },
          { label: '产品故障', value: 3 },
          { label: '投诉建议', value: 4 }
        ],
        issueType: {
          label: '全部',
          value: 'all'
        },
        periodOptions: [
          { label: '不限', value: 'any' },
          { label: '最近24小时', value: 24 },
          { label: '最近3天', value: 72 },
          { label: '最近7天', value: 168 }
        ],
        period: {
          label: '不限',
          value: 'any'
        },
        statusOptions: [
          { label: '不限', value: 'any' },
          { label: '未处理', value: 0 },
          { label: '已处理', value: 1 }
        ],
        status: {
          label: '不限',
          value: 'any'
        },
        queryTypeOptions: [
          { label: '联系方式', value: 'contact' },
          { label: '姓名', value: 'name' }
        ],
        queryType: {
          label: '联系方式',
          value: 'contact'
        }
      }
    },

    computed: {
      queryCondition () {
        var condition = {
          filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'last_login'],
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          query: {}
        }
        const SECONDS_PER_HOUR = 3600

        // 添加问题类型查询条件
        if (this.issueType.value !== 'all') {
          condition.query['type'] = { $in: [this.issueType.value] }
        }

        // 添加开始和结束时间的查询条件
        if (this.period.value !== 'any') {
          let endTime = new Date()
          let startTime = new Date(endTime.getTime() - SECONDS_PER_HOUR * 1000 * this.period.value)
          condition.query.create_time = {
            '$gte': {
              '@date': new Date(startTime)
            },
            '$lte': {
              '@date': new Date(endTime)
            }
          }
        }

        // 添加反馈状态查询条件
        if (this.status.value !== 'any') {
          condition.query['status'] = { $in: [this.status.value] }
        }

        // 添加查询字段内容
        if (this.query.length > 0) {
          condition.query[this.queryType.value] = { $like: this.query }
        }

        return condition
      }
    },

    route: {
      data () {
        this.getIssues()
      }
    },

    methods: {
      // 获取问题列表
      getIssues (querying) {
        if (typeof querying !== 'undefined') {
          this.currentPage = 1
        }

        this.total = 2
        this.issues = [{
          id: 'asd23eadwed23ads',
          create_time: '2016-01-15 10:43',
          creator: '李先生',
          contact: '13800138000',
          product_name: '电炖锅',
          type: 1,
          status: 0
        }, {
          id: 'asd23eadwed23ads',
          create_time: '2016-01-15 10:43',
          creator: '李先生',
          contact: '13800138000',
          product_name: '电炖锅',
          type: 2,
          status: 1
        }, {
          id: 'asd23eadwed23ads',
          create_time: '2016-01-15 10:43',
          creator: '李先生',
          contact: '13800138000',
          product_name: '电炖锅',
          type: 2,
          status: 1
        }, {
          id: 'asd23eadwed23ads',
          create_time: '2016-01-15 10:43',
          creator: '李先生',
          contact: '13800138000',
          product_name: '电炖锅',
          type: 2,
          status: 1
        }, {
          id: 'asd23eadwed23ads',
          create_time: '2016-01-15 10:43',
          creator: '李先生',
          contact: '13800138000',
          product_name: '电炖锅',
          type: 2,
          status: 1
        }]
        // this.loadingData = true
        // api.device.getList(this.$route.params.id, this.queryCondition).then((res) => {
        //   this.issues = res.data.list
        //   this.total = res.data.count
        //   this.loadingData = false
        // }).catch((res) => {
        //   this.handleError(res)
        //   this.loadingData = false
        // })
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

<style lang="stylus">
  .query-type
    height 30px
</style>
