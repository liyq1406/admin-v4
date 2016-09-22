<template>
  <div class="main">
    <div class="panel mt20 mb30">
      <div class="panel-hd ml20 mr20">
        <div class="actions">
          <search-box :key.sync="query" :active="searching" placeholder="请输入成员ID" @cancel="getLogs(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @press-enter="getLogs(true)">
            <label>搜索成员</label>
            <button slot="search-button" @click="getLogs(true)" class="btn"><i class="fa fa-search"></i></button>
          </search-box>
        </div>
        <h2>日志列表</h2>
      </div>
      <div class="panel-bd ml20 mr20">
        <x-table :headers="columns" :tables="logList" :page="page" :loading="loadingData" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage"></x-table>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBox from 'components/SearchBox'
import Table from 'components/Table'
import api from 'api'
// import * as config from 'consts/config'
import { globalMixins } from 'src/mixins'
import { formatDate } from 'src/filters'
import _ from 'lodash'

export default {
  name: 'Security',

  mixins: [globalMixins],

  components: {
    'x-table': Table,
    SearchBox
  },

  data () {
    return {
      query: '',
      searching: false,
      loadingData: false,
      currentPage: 1,
      total: 0,
      countPerPage: 10,
      logs: [],
      columns: [{
        key: 'opt',
        title: '成员ID',
        class: 'wp15'
      }, {
        key: 'ip',
        title: '操作者IP',
        class: 'wp15'
      }, {
        key: 'summary',
        title: '日志摘要'
      }, {
        key: 'level',
        title: '日志级别',
        class: 'wp10'
      }, {
        key: 'operate_type',
        title: '操作类型',
        class: 'wp10'
      }, {
        key: 'create_date',
        title: '操作时间',
        class: 'wp15'
      }]
    }
  },

  computed: {
    // 分页信息
    page () {
      var result = {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
      return result
    },

    // 查询条件
    queryCondition () {
      let condition = {
        filter: ['opt', 'ip', 'summary', 'level', 'operate_type', 'create_date'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {
          'create_date': 'desc'
        },
        query: {}
      }

      if (this.query.length > 0) {
        // this.currentPage = 1
        condition.query.opt = { $like: this.query }
      }

      return condition
    },

    // 日志列表
    logList () {
      let levels = {
        '1': {
          label: '通知',
          class: 'text-label'
        },
        '2': {
          label: '警告',
          class: 'text-label-warning'
        },
        '3': {
          label: '错误',
          class: 'text-label-danger'
        }
      }
      return this.logs.map((item) => {
        return {
          opt: item.opt,
          ip: item.ip,
          summary: item.summary,
          level: `<span class='${levels[item.level].class}'>${levels[item.level].label}</span>`,
          operate_type: this.getLabelByValue(this.locales.data.OPERATE_TYPES, item.operate_type),
          create_date: formatDate(item.create_date),
          origin: item
        }
      })
    }
  },

  route: {
    data () {
      this.getLogs()
    }
  },

  methods: {
    /**
     * 根据 value 值返回对应的 label
     */
    getLabelByValue (arr, val) {
      let result = '-'
      let obj = _.find(arr, (item) => {
        return item.value === val
      })
      if (obj) {
        result = obj.label
      }
      return result
    },
    /**
     * 当前页码改变
     * @author weijie
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getLogs()
    },

    /**
     * 每页显示的数量改变
     * @author weijie
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getLogs(true)
    },
    /**
     * 切换搜索
     * @author shengzhi
     */
    toggleSearching () {
      this.searching = !this.searching
    },

    /**
     * 取消搜索
     * @author shengzhi
     */
    cancelSearching () {
      this.getLogs()
    },

    /**
     * 获取日志
     */
    getLogs (reset) {
      if (reset) {
        this.currentPage = 1
      }

      this.loadingData = true
      api.log.memberActions(this.queryCondition).then((res) => {
        this.loadingData = false
        if (res.status === 200) {
          this.total = res.data.count
          this.logs = res.data.list
        }
      }).catch((res) => {
        this.loadingData = false
        this.handleError(res)
      })
      // this.total = 22
      // this.logs = [{
      //   opt: '1234',
      //   ip: '202.96.128.68',
      //   summary: 'asdfaf',
      //   level: 1,
      //   operate_type: 4,
      //   create_date: '2016-05-17T17:30:16.437Z'
      // }]
    }
  }
}
</script>
