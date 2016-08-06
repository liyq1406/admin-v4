<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="data-table with-loading">
        <div class="filter-bar">
          <div class="filter-group fl">
            <div class="filter-group-item">
              <v-select width="90px" size="small" :label="visibility.label">
                <span slot="label">明细：</span>
                <select v-model="visibility" @change="getAlerts()">
                  <option v-for="option in visibilityOptions" :value="option">{{ option.label }}</option>
                </select>
              </v-select>
            </div>
          </div>
          <div class="filter-group fr">
            <div class="filter-group-item">
              <search-box :key.sync="key" :placeholder="$t('ui.overview.addForm.search_condi')" :active="searching" @cancel="getAlerts" @search-activate="searching=!searching"  @press-enter="getAlerts">
                <v-select width="90px" :label="queryType.label" size="small">
                  <select v-model="queryType">
                    <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                  </select>
                </v-select>
                <button slot="search-button" @click="getAlerts" class="btn btn-primary"><i class="fa fa-search"></i></button>
              </search-box>
            </div>
          </div>
        </div>
        <x-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage"></x-table>
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
    'v-select': Select,
    SearchBox
  },

  data () {
    return {
      loadingData: true,
      searching: false,
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      alerts: [],
      visibilityOptions: [
        { label: '全部等级', value: 'all' },
        { label: '通知', value: '通知' },
        { label: '轻微', value: '轻微' },
        { label: '严重', value: '严重' }
      ],
      visibility: {
        label: '全部等级',
        value: 'all'
      },
      queryTypeOptions: [
        { label: 'MAC', value: 'mac' },
        { label: '设备ID', value: 'from' },
        { label: '告警内容', value: 'alert_name' }
      ],
      queryType: {
        label: 'MAC',
        value: 'mac'
      },
      key: '',
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
        key: 'time',
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
      }]
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
      if (this.key.length > 0) {
        condition.query[this.queryType.value] = this.queryType.value === 'from' ? { $in: [Number(this.key)] } : { $like: this.key }
      }

      // 显示指定告警类型
      if (this.visibility.value !== 'all') {
        condition.query.tags = { $in: [this.visibility.value] }
      }

      return condition
    },

    tables () {
      var result = []
      this.alerts.map((item) => {
        let levelCls = ({
          '通知': 'text-label-warning',
          '严重': 'text-label-danger'
        })[item.tags] || ''

        let alert = {
          content: item.alert_name,
          mac: item.mac,
          time: formatDate(item.create_date),
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
        this.getAlerts()
      }
    }
  },

  ready () {
    if (this.currentProduct.id) {
      this.getAlerts()
    }
  },

  methods: {
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
     * 获取消息列表
     * @author weijie
     */
    getAlerts () {
      this.loadingData = true
      api.alert.getAlerts(this.queryCondition).then((res) => {
        if (res.status === 200) {
          this.total = res.data.count
          this.alerts = res.data.list.map((item) => {
            let beginTime = new Date(formatDate(item.create_date))
            // 默认为未读，时间从当前算起
            let endTime = new Date()
            // 如果为已读，则从已读时间算起
            if (item.is_read) {
              endTime = new Date(formatDate(item.read_time))
            }
            // 持续时间
            item.lasting = endTime.getTime() - beginTime.getTime()
            return item
          })
        }
        this.loadingData = false
      }).catch((res) => {
        this.handleError(res)
        this.loadingData = false
      })
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
      this.getAlerts(true)
    }
  }
}
</script>