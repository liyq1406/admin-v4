<template>
  <div class="panel-bd">
    <x-table :headers="headers" :tables="tables" :page="page" :loading="loadingData" :selecting="true" @selected-change="selectChange" @page-count-update="onPageCountUpdate" @current-page-change="onCurrPageChage">
      <div slot="filter-bar" class="filter-bar">
        <div class="filter-group fl">
          <div class="filter-group-item">
            <x-select width="90px" :label="curLevel.label" size="small">
              <span slot="label">告警等级:</span>
              <select v-model="curLevel" name="product">
                <option v-for="level in warningLevels" :value="level">{{ level.label }}</option>
              </select>
            </x-select>
          </div>
        </div>
        <div class="filter-group fr">
          <div class="filter-group-item">
            <search-box :key.sync="key">
              <x-select width="100px" :label="queryType.label" size="small">
                <select v-model="queryType">
                  <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                </select>
              </x-select>
              <button slot="search-button" @click="" class="btn btn-primary"><i class="fa fa-search"></i></button>
            </search-box>
          </div>
        </div>
      </div>
      <div slot="left-foot" v-show="showBatchBtn" class="row mt10">
        <label>标记为:</label>
        <button class="btn btn-ghost">已处理</button>
        <button class="btn btn-ghost">未处理</button>
      </div>
    </x-table>
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from 'src/api'
  import Select from 'components/Select'
  import SearchBox from 'components/SearchBox'
  import locales from 'consts/locales/index'
  import Pager from 'components/Pager'
  import { globalMixins } from 'src/mixins'
  import Table from 'components/Table'
  import {uniformDate, uniformTime} from 'src/filters'

  export default {
    name: 'Alert',

    mixins: [globalMixins],

    components: {
      'x-select': Select,
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
        headers: [
          {
            key: 'content',
            title: '告警内容'
          },
          {
            key: 'mac',
            title: '设备MAC'
          },
          {
            key: 'id',
            title: '设备ID'
          },
          {
            key: 'time',
            title: '时间'
          },
          {
            key: 'duration',
            title: '持续时长'
          },
          {
            key: 'level',
            title: '告警等级'
          },
          {
            key: 'status',
            title: '状态',
            class: 'tac'
          }
        ],
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
          value: 0,
          label: 'MAC地址'
        },
        queryTypeOptions: [
          {
            value: 0,
            label: 'MAC地址'
          },
          {
            value: 1,
            label: '设备ID'
          },
          {
            value: 2,
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
            label: '轻微'
          },
          {
            value: 2,
            label: '中等'
          },
          {
            value: 3,
            label: '重度'
          }
        ],
        loadingData: false,
        currentPage: 1,
        countPerPage: 10,
        showBatchBtn: false
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
        this.alerts.forEach((alert) => {
          var content = '<span class="table-limit-width">' + alert.content + '</span>'
          var table = {
            content: content,
            mac: alert.mac,
            id: '',
            time: uniformDate(alert.create_date) + ' ' + uniformTime(alert.create_date),
            duration: '',
            level: alert.tags,
            status: alert.is_read ? '已处理' : '未处理',
            prototype: alert
          }
          result.push(table)
        })
        return result
      },
      queryCondition () {
        return {
          limit: this.countPerPage,
          offset: (this.currentPage - 1) * this.countPerPage,
          query: {
            product_id: {
              '$in': [this.$route.params.id]
            }
          }
        }
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
      getAlerts () {
        this.loadingData = true
        api.alert.getAlerts(this.queryCondition).then((res) => {
          if (res.status === 200) {
            this.alerts = res.data.list
            this.total = res.data.count
            this.loadingData = false
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

<style lang='stylus'>
@import '../../../../assets/stylus/common'
.table-limit-width
  display inline-block
  width 450px
  overflow hidden
.level-style
  display inline-block
  width 50px
.mark-style
  padding-top 10px
</style>
