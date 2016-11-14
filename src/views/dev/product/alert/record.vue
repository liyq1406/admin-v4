<template>
  <div class="panel">
    <div class="panel-bd">
      <x-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" :selecting="true" @selected-change="selectChange" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage" @theader-create-date="sortBy">
        <div slot="filter-bar" class="filter-bar">
          <div class="filter-group fl">
            <div class="filter-group-item">
              <x-select width="90px" :label="curLevel.label" size="small">
                <span slot="label">告警等级:</span>
                <select v-model="curLevel" name="product" @change="getAlerts(true)">
                  <option v-for="level in warningLevels" :value="level">{{ level.label }}</option>
                </select>
              </x-select>
            </div>
          </div>
          <div class="filter-group fr">
            <div class="filter-group-item">
              <search-box :key.sync="key" :active="searching" :placeholder="$t('common.placeholder.search')" @cancel="getAlerts(true)" @search-activate="toggleSearching" @search-deactivate="toggleSearching" @search="getAlerts(true)" @press-enter="getAlerts(true)">
                <x-select width="100px" :label="queryType.label" size="small">
                  <select v-model="queryType" @change="getAlerts(true)">
                    <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                  </select>
                </x-select>
                <button slot="search-button" @click="" class="btn"><i class="fa fa-search"></i></button>
              </search-box>
            </div>
          </div>
        </div>
        <div slot="left-foot" v-show="showBatchBtn" class="row mt10">
          <label>标记为:</label>
          <button class="btn btn-ghost" @click="setDeal">已处理</button>
          <button class="btn btn-ghost" @click="setUnDeal">未处理</button>
        </div>
      </x-table>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from 'src/api'
  import SearchBox from 'components/SearchBox'
  import locales from 'consts/locales/index'
  import Pager from 'components/Pager'
  import { globalMixins } from 'src/mixins'
  import Table from 'components/Table'
  import formatDate from 'filters/format-date'

  export default {
    name: 'Alert',

    mixins: [globalMixins],

    components: {
      SearchBox,
      Pager,
      'x-table': Table
    },

    props: {
      productID: {
        type: String,
        default: ''
      }
    },

    data () {
      return {
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
        alerts: [],
        total: 0,
        markType: {
          value: 0,
          label: '标记为已处理'
        },
        markTypeOptions: [
          {
            value: 0,
            label: '全部'
          },
          {
            value: 1,
            label: '已选中'
          }
        ],
        queryType: {
          value: 'mac',
          label: 'MAC地址'
        },
        queryTypeOptions: [
          {
            value: 'mac',
            label: 'MAC地址'
          },
          {
            value: 'from',
            label: '设备ID'
          },
          {
            value: 'content',
            label: '告警内容'
          }
        ],
        ruleTypes: locales[Vue.config.lang].data.RULE_TYPES,
        rules: [], // 规则列表
        key: '',
        curLevel: {
          value: 0,
          label: '全部'
        },
        warningLevels: [
          {
            value: 0,
            label: '全部'
          },
          {
            value: 1,
            label: locales[Vue.config.lang].data.ALERT_LEVELS.orange
          },
          {
            value: 2,
            label: locales[Vue.config.lang].data.ALERT_LEVELS.blue
          },
          {
            value: 3,
            label: locales[Vue.config.lang].data.ALERT_LEVELS.red
          }
        ],
        loadingData: false,
        currentPage: 1,
        countPerPage: 10,
        showBatchBtn: false,
        searching: false,
        dealList: []
      }
    },
    computed: {
      page () {
        var result = {
          total: this.total,
          currentPage: this.currentPage,
          countPerPage: this.countPerPage
        }
        return result
      },
      tables () {
        var result = []
        this.alerts.forEach((item) => {
          var temp = {}
          temp[locales[Vue.config.lang].data.ALERT_LEVELS.red] = 'text-label-danger'
          temp[locales[Vue.config.lang].data.ALERT_LEVELS.orange] = 'text-label-warning'

          let levelCls = temp[item.tags] || ''
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
      },
      queryCondition () {
        let params = {
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          query: {
            product_id: {
              '$in': [this.$route.params.id]
            }
          },
          order: {}
        }

        if (this.curLevel.value !== 0) {
          params.query.tags = {
            '$in': [this.curLevel.label]
          }
        }

        if (this.key !== '') {
          if (this.queryType.value === 'from') {
            // 设备ID
            let temp = parseInt(this.key)
            if (!temp || temp > 2100000000 || this.key.length !== temp.toString().length) {
              temp = 2100000000
            }
            // 设备ID不能用模糊匹配
            params.query.from = {
              '$in': [temp]
            }
          } else {
            params.query[this.queryType.value] = {
              '$like': this.key
            }
          }
        }

        this.headers.forEach((item) => {
          if (item.sortType) {
            params.order[item.key] = (item.sortType === 1 ? 'asc' : 'desc')
          }
        })
        return params
      }
    },
    filters: {
      toTags (value) {
        return value.length ? value.split(',') : []
      }
    },
    ready () {
      this.getAlerts()
    },
    watch: {
      productID () {
        if (this.productID !== '') {
          this.getAlerts()
        }
      }
    },
    methods: {
      getAlerts (reset) {
        if (reset === true) {
          this.currentPage = 1
        }
        this.loadingData = true
        api.alert.getAlerts(this.queryCondition).then((res) => {
          this.loadingData = false
          if (res.status === 200) {
            this.alerts = res.data.list.map((item) => {
              // 计算已读告警持续时间
              let begin = new Date((new Date(item.create_date)).getTime())
              // 默认为未读，时间从当前算起
              let end = new Date(+new Date() + 3600 * 8 * 1000)
              // 如果为已读，则从已读时间算起
              if (item.is_read) {
                end = new Date((new Date(item.read_time)).getTime())
              }
              // 持续时间
              item.lasting = end.getTime() - begin.getTime()
              return item
            })
            this.total = res.data.count
          }
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      },
      selectChange (table) {
        if (table.length > 0) {
          this.showBatchBtn = true
        } else {
          this.showBatchBtn = false
        }
        var result = []
        table.forEach((item) => {
          result.push(item.prototype)
        })
        this.dealList = result
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
        this.getAlerts()
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
       * 按某个属性排序
       * @author shengzhi
       * @param  {Object} header 表头
       * @param  {Number} 索引
       */
      sortBy (header, index) {
        header.sortType = header.sortType * -1
        this.headers.$set(index, header)
        this.getAlerts()
      }
    }
  }
</script>

<style lang='stylus'>
@import '../../../../assets/stylus/common'
.table-limit-width
  display inline-block
  width 450px
  overflow hidden
.mark-style
  padding-top 10px
</style>
