<template>
  <div class="main">
    <div class="panel">
      <div class="panel-bd">
        <div class="filter-bar filter-bar-head">
          <div class="filter-group fl">
            <div class="filter-group-item">
              <v-select :label="currentProduct.name" width="110px" size="small">
                <span slot="label">产品</span>
                <select v-model="currentProduct" @change="">
                  <option v-for="product in products" :value="product">{{ product.name }}</option>
                </select>
              </v-select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <pie :data="warningLevel"></pie>
          </div>
          <div class="col-11 col-offset-1 data-table-wrap">
            <div class="data-table">
              <table class="table">
                <thead>
                  <tr>
                    <th>版本号</th>
                    <th>设备数/占比</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="warningLevel.length > 0">
                    <tr v-for="item in warningLevel">
                      <td>{{item.name}}</td>
                      <td>{{ item.value }}</td>
                    </tr>
                  </template>
                  <tr v-if="warningLevel.length === 0">
                    <td colspan="3"  class="tac">
                      <div class="tips-null"><i class="fa fa-exclamation-circle"></i> <span>{{ $t("common.no_records") }}</span></div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </div>
      <div class="panel-bd">
        <div class="data-table with-loading">
          <div class="filter-bar">
            <div class="filter-group fr">
              <div class="filter-group-item">
                <search-box :key.sync="query" :active="searching" :placeholder="$t('ui.overview.addForm.search_condi')" @cancel="" @search-activate="" @search-deactivate="" @search="" @press-enter="">
                  <v-select width="90px" :label="queryType.label" size="small">
                    <select v-model="queryType">
                      <option v-for="option in queryTypeOptions" :value="option">{{ option.label }}</option>
                    </select>
                  </v-select>
                  <button slot="search-button" @click="" class="btn btn-primary"><i class="fa fa-search"></i></button>
                </search-box>
              </div>
            </div>
            <div class="filter-group">
              <h3>明细</h3>
            </div>
          </div>
          <table class="table table-stripe table-bordered">
            <thead>
              <tr>
                <th>固件版本号</th>
                <th>版本说明</th>
                <th class="tac">固件类型</th>
                <th>识别码</th>
                <th>添加日期</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="firmwares.length > 0">
                <tr v-for="firmware in firmwares">
                  <td>{{firmware.version}}</td>
                  <td>{{ firmware.content }}</td>
                  <td class="tac">{{ firmware.type }}</td>
                  <td>{{ firmware.code }}</td>
                  <td>{{ firmware.add_date }}</td>
                  <td class="tac"><a href="##">编辑</a></td>
                </tr>
              </template>
              <tr v-if="firmwares.length === 0 && !loadingData">
                <td colspan="7" class="tac">
                  <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
                </td>
              </tr>
            </tbody>
          </table>
      </div>
      <pager v-if="total > countPerPage" :total="firmwares.length" :current.sync="currentPage" :count-per-page="countPerPage"></pager>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
// import api from 'api'
import * as config from 'consts/config'
import Select from 'components/Select'
import Pager from 'components/Pager'
import Modal from 'components/Modal'
import SearchBox from 'components/SearchBox'
import Table from 'components/Table'
import locales from 'consts/locales/index'
// import _ from 'lodash'
import { formatDate } from 'src/filters'
// import { globalMixins } from 'src/mixins'
// import { productSummaryMixin, setCurrProductMixin } from './mixins'
import Statistic from 'components/Statistic2'
import Pie from 'components/g2-charts/Pie'

export default {
  name: 'DeviceList',

  // setCurrProductMixin 保证每个产品相关的页面都能正确访问到当前的产品信息
  // mixins: [globalMixins, productSummaryMixin, setCurrProductMixin],

  components: {
    'v-select': Select,
    'c-table': Table,
    'modal': Modal,
    'search-box': SearchBox,
    'pager': Pager,
    Pie,
    Statistic
  },

  data () {
    var sortOrders = {}
    var descProperties = ['active_date']
    var ascProperties = ['mac']

    descProperties.forEach((key) => {
      sortOrders[key] = 'desc'
    })

    ascProperties.forEach((key) => {
      sortOrders[key] = 'asc'
    })

    return {
      currentProduct: {},
      warningLevel: [
        {
          name: 'v2.0',
          value: 888
        },
        {
          name: 'v1.2',
          value: 82
        },
        {
          name: 'v1.1',
          value: 12
        },
        {
          name: 'v1.0',
          value: 11
        },
        {
          name: 'v1.4',
          value: 10
        },
        {
          name: 'v1.5',
          value: 10
        },
        {
          name: 'v1.3',
          value: 9
        }
      ],
      firmwares: [
        {
          content: '这是描述',
          code: '123',
          version: 'v-1.0',
          type: 'WIFI',
          add_date: '2016-08-16 20:00:00'
        },
        {
          content: '这是描述',
          code: '123',
          version: 'v-1.0',
          type: 'WIFI',
          add_date: '2016-08-16 20:00:00'
        },
        {
          content: '这是描述',
          code: '123',
          version: 'v-1.0',
          type: 'WIFI',
          add_date: '2016-08-16 20:00:00'
        },
        {
          content: '这是描述',
          code: '123',
          version: 'v-1.0',
          type: 'WIFI',
          add_date: '2016-08-16 20:00:00'
        },
        {
          content: '这是描述',
          code: '123',
          version: 'v-1.0',
          type: 'WIFI',
          add_date: '2016-08-16 20:00:00'
        }
      ],
      visibility: {
        label: '全部',
        value: 'all'
      },
      visibilityOptions: locales[Vue.config.lang].data.DEVICE_VISIBILITY_OPTIONS,
      total: 0,
      currentPage: 1,
      countPerPage: config.COUNT_PER_PAGE,
      loadingData: false,
      queryTypeOptions: [
        { label: '固件类型', value: 'type' },
        { label: '识别码', value: 'code' }
      ],
      queryType: {
        label: '固件类型',
        value: 'type'
      }
    }
  },
  vuex: {
    getters: {
      products: ({ products }) => products.all
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
      this.devices.map((item) => {
        var device = {
          id: item.id,
          mac: '<a class="hl-red">' + item.mac + '</a>',
          is_active: item.is_active ? '是' : '否',
          active_date: formatDate(item.active_date),
          is_online: item.is_online ? '<span class="hl-green">在线</span>' : '<span class="hl-gray">下线</span>',
          prototype: item
        }
        result.push(device)
      })
      return result
    },

    // 筛选条件
    queryCondition () {
      var condition = {
        filter: ['id', 'mac', 'is_active', 'active_date', 'is_online', 'last_login'],
        limit: this.countPerPage,
        offset: (this.currentPage - 1) * this.countPerPage,
        order: this.sortOrders,
        query: {}
      }

      if (this.query.length > 0) {
        this.currentPage = 1
        condition.query[this.queryType.value] = this.queryType.value === 'id' ? { $in: [Number(this.query)] } : { $like: this.query }
      }

      switch (this.visibility.value) {
        case 'online':
          condition.query['is_online'] = { $in: [true] }
          break
        case 'offline':
          condition.query['is_online'] = { $in: [false] }
          break
        case 'active':
          condition.query['is_active'] = { $in: [true] }
          break
        case 'inactive':
          condition.query['is_active'] = { $in: [false] }
          break
        default:
      }

      return condition
    }
  },
  // 监听属性变动
  watch: {
    products () {
      this.getFirstProduct()
      if (this.products.length > 0) {
        // this.getTagTrend()
        // this.getAlertList()
      }
    }
  },

  route: {
    data () {
      this.getFirstProduct()
    }
  },

  methods: {
    // 获取第一个产品@author weijie
    getFirstProduct () {
      this.currentProduct = this.products[0] || {}
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../../assets/stylus/common'

.statistic-group
  border-top 1px solid default-border-color
</style>
