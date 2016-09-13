<template>
  <div class="panel">
    <div class="panel-bd">
      <!-- <pre> {{ dealList | json}}</pre> -->
      <div class="data-table with-loading">
        <div class="filter-bar">
          <div class="filter-group fl">
            <div class="filter-group-item">
              <x-select width="90px" size="small" :label="visibility.label">
                <span slot="label">显示：</span>
                <select v-model="visibility" @change="getAlerts(true)">
                  <option v-for="option in visibilityOptions" :value="option">{{ option.label }}</option>
                </select>
              </x-select>
            </div>
          </div>
          <div class="filter-group fr">
            <div class="filter-group-item">
              <search-box :key.sync="key" :placeholder="$t('ui.overview.addForm.search_condi')" :active="searching" @cancel="getAlerts(true)" @search-activate="searching=!searching"  @press-enter="getAlerts(true)">
                <x-select width="90px" :label="queryType.label" size="small">
                  <select v-model="queryType">
                    <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                  </select>
                </x-select>
                <button slot="search-button" @click="getAlerts(true)" class="btn"><i class="fa fa-search"></i></button>
              </search-box>
            </div>
          </div>
        </div>
        <x-table :headers="headers" :tables="tables" :page="page" :selecting="selecting" :loading="loadingData" @tbody-content="getInfo" @selected-change="selectChange" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage" @theader-create-date="sortBy">
          <div slot="left-foot" v-show="showBatchBtn" class="row mt10">
            <label>标记为:</label>
            <button class="btn btn-ghost" @click="setDeal">已处理</button>
            <button class="btn btn-ghost" @click="setUnDeal">未处理</button>
          </div>
        </x-table>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'api'
import Select from 'components/Select'
import SearchBox from 'components/SearchBox'
import Table from 'components/Table'
import { formatDate } from 'src/filters'
import { globalMixins } from 'src/mixins'
import * as config from 'consts/config'

export default {
  name: 'AlertTable',

  mixins: [globalMixins],

  vuex: {
    getters: {
      currentProduct: ({ products }) => products.curr
    }
  },

  components: {
    'x-table': Table,
    'x-select': Select,
    SearchBox
  },

  data () {
    return {
      selecting: true,
      alerts: [],
      visibilityOptions: [
        { label: '全部等级', value: 'all' },
        { label: '通知', value: '通知' },
        { label: '轻微', value: '轻微' },
        { label: '严重', value: '严重' }
      ],
      visibility: {},
      queryTypeOptions: [
        { label: 'MAC', value: 'mac' },
        { label: '设备ID', value: 'from' },
        { label: '告警内容', value: 'alert_name' }
      ],
      queryType: {},
      key: '',
      loadingData: true,
      searching: false,
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      headers: [{
        key: 'content',
        title: '告警内容'
      }, {
        key: 'mac',
        title: '设备MAC'
      }, {
        key: 'id',
        title: '设备ID'
      }, {
        key: 'create_date',
        title: '时间',
        sortType: -1
      }, {
        key: 'duration',
        title: '持续时长'
      }, {
        key: 'level',
        title: '告警等级'
      }, {
        key: 'state',
        title: '状态'
      }],
      showBatchBtn: false,
      dealList: []
    }
  },

  computed: {
    // 分页信息
    page () {
      return {
        total: this.total,
        currentPage: this.currentPage,
        countPerPage: this.countPerPage
      }
    },

    // 查询条件
    queryCondition () {
      let condition = {
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: {},
        query: {
          product_id: {
            $in: [this.$route.params.id]
          }
        }
      }

      // 关键字搜索
      if (this.key !== '') {
        if (this.queryType.value === 'from') {
          // 设备ID
          let temp = parseInt(this.key)
          if (!temp || temp > 1620000000) {
            temp = 1620000000
          }
          // 设备ID不能用模糊匹配
          condition.query.from = {
            '$in': [temp]
          }
        } else {
          condition.query[this.queryType.value] = {
            '$like': this.key
          }
        }
      }

      // 显示指定告警类型
      if (this.visibility.value !== 'all') {
        condition.query.tags = { $in: [this.visibility.value] }
      }

      this.headers.forEach((item) => {
        if (item.sortType) {
          condition.order[item.key] = (item.sortType === 1 ? 'asc' : 'desc')
        }
      })

      return condition
    },

    tables () {
      var result = []
      this.alerts.map((item) => {
        let levelCls = ({
          '轻微': 'text-label-warning',
          '严重': 'text-label-danger'
        })[item.tags] || ''
        let content = '<span class="table-limit-width">' + item.content + '</span>'
        let alert = {
          content: content,
          mac: item.mac,
          create_date: formatDate(item.create_date),
          duration: this.prettyDuration(item.lasting),
          id: item.from,
          level: `<div class="level level1 text-label ${levelCls}">${item.tags}</div>`,
          state: item.is_read ? '已处理' : '未处理',
          prototype: item
        }
        result.push(alert)
      })
      return result
    }
  },

  watch: {
    currentProduct () {
      if (this.currentProduct.id) {
        this.currentPage = 1
        this.init()
      }
    }
  },

  ready () {
    if (this.currentProduct.id) {
      this.init()
    }
  },

  methods: {
    init () {
      this.visibility = this.visibilityOptions[0]
      this.queryType = this.queryTypeOptions[0]
      this.getAlerts()
    },

    /**
     * 将毫秒数格式化为合适显示的时间段
     */
    prettyDuration (n) {
      let hours = (n / 3600000).toFixed(1)
      if (hours > 1) {
        return `${hours}小时`
      } else {
        return `${Math.floor(n / 60000)}分钟`
      }
    },

    /**
     * 当前页码改变
     * @author weijie
     * @param  {Number} number 页码
     */
    onCurrPageChage (number) {
      this.currentPage = number
      this.getAlerts()
    },

    /**
     * 每页显示的数量改变
     * @author weijie
     * @param  {Number} count 数量
     */
    onPageCountUpdate (count) {
      this.countPerPage = count
      this.getAlerts()
    },

    /**
     * 按某个属性排序
     * @author shengzhi
     * @param  {Object} header 表头
     * @param  {Number} 索引
     */
    sortBy (header, index) {
      header.sortType = header.sortType * -1
      this.headers.$set(index, header)
      this.getAlerts()
    },
    /**
     * 获取消息列表
     * @author weijie
     */
    getAlerts (reset) {
      if (reset) {
        this.currentPage = 1
      }
      this.loadingData = true
      api.alert.getAlerts(this.queryCondition).then((res) => {
        this.loadingData = false
        if (res.status === 200) {
          this.total = res.data.count
          this.alerts = res.data.list.map((item) => {
            // 计算已读告警持续时间
            let begin = new Date(formatDate(item.create_date))
            // 默认为未读，时间从当前算起
            let end = new Date()
            // 如果为已读，则从已读时间算起
            if (item.is_read) {
              end = new Date(formatDate(item.read_time))
            }
            // 持续时间
            item.lasting = end.getTime() - begin.getTime()
            return item
          })
        }
      }).catch((res) => {
        this.loadingData = false
        this.handleError(res)
      })
    },
    selectChange (table) {
      var result = []
      table.forEach((item) => {
        result.push(item.prototype)
      })
      // this.dealList = []
      this.dealList = result
      if (table.length > 0) {
        this.showBatchBtn = true
      } else {
        this.showBatchBtn = false
      }
    },
    // 标记为已处理
    setDeal () {
      var params = []
      this.dealList.forEach((item) => {
        params.push(item.id)
      })
      // var params = [this.$route.params.id]
      api.alert.setAlertRead(params).then((res) => {
        if (res.status === 200) {
          this.getAlerts()
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 标记为未处理
    setUnDeal () {
      var params = []
      this.dealList.forEach((item) => {
        params.push(item.id)
      })
      // var params = [this.$route.params.id]
      api.alert.setAlertUnread(params).then((res) => {
        if (res.status === 200) {
          this.getAlerts()
        }
      }).catch((res) => {
        this.handleError(res)
      })
    },
    // 跳转详情信息
    getInfo (table, header, index) {
      this.$route.router.go('/operation/alerts/detail/' + table.prototype.id)
      // this.$route.router.go('/operation/alerts/record')
    }
  }
}
</script>
