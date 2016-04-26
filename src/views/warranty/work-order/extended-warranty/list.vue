<template>
  <div class="panel">
    <div class="panel-bd">
      <div class="action-bar">
        <search-box class="work-order-search-box" :key.sync="key" :placeholder="'请输入工单编号'" @press-enter="getWarrantyList(true)">
          <button slot="search-button" class="btn btn-primary" @click="getWarrantyList(true)">搜索</button>
          <label></label>
        </search-box>
      </div>

      <div class="status-bar">
        <v-select :label="statusOptions[status.value].label" width="100px" class="work-orders-select" size="small">
          <span slot="label">工单状态</span>
          <select v-model="status" @change="getWarrantyList(true)">
            <option v-for="option in statusOptions" :value="option">{{option.label}}</option>
            <p> {{status}}</p>
          </select>
        </v-select>

        <area-select :province.sync="curProvince" :city.sync="curCity" :district.sync="curDistrict" label="所在地区" select-size="small" @province-change="getWarrantyList(true)" @city-change="getWarrantyList(true)" @district-change="getWarrantyList(true)"></area-select>
      </div>

      <div class="data-table">
        <div class="icon-loading" v-show="loadingData">
          <i class="fa fa-refresh fa-spin"></i>
        </div>
        <table class="table table-stripe table-bordered">
          <thead>
            <tr>
              <th>工单编号</th>
              <th>客户姓名</th>
              <th>产品名称</th>
              <th>产品型号</th>
              <th>创建日期</th>
              <th>工单状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="workOrders.length > 0">
              <tr v-for="order in workOrders">
                <td>{{order._id}}</td>
                <td>{{order.name}}</td>
                <td>{{order.product_name}}</td>
                <td>{{order.product_type}}</td>
                <td>{{order.extended_days}}</td>
                <td v-if="order.status === 0">已过期</td>
                <td v-else class='hl-green'>未过期</td>
                <td><a v-link="{path: '/warranty/work-orders/extended-warranties/' + order._id}" class="hl-red">查看详情</a></td>
              </tr>
            </template>
            <tr v-if="workOrders.length === 0 && !loadingData">
              <td colspan="7" class="tac">
                <div class="tips-null"><span>{{ $t("common.no_records") }}</span></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Start: 分页信息 -->
      <div class="row">
        <div class="col-8">{{{ $t('common.total_results', {count:total}) }}}</div>
        <div class="col-16">
          <pager v-if="total > pageCount" :total="total" :current.sync="currentPage" :page-count="pageCount" @page-update="getWarrantyList"></pager>
        </div>
      </div>
      <!-- End: 分页信息 -->
  </div>
</template>

<script>
  // import api from '../../../../api'
  import { globalMixins } from '../../../../mixins'
  import Select from '../../../../components/Select'
  import AreaSelect from '../../../../components/AreaSelect'
  import SearchBox from '../../../../components/SearchBox'
  import Pager from '../../../../components/Pager'
  import api from '../../../../api'

  export default {
    name: 'OrderList',

    layout: 'admin',

    mixins: [globalMixins],

    components: {
      'v-select': Select,
      'area-select': AreaSelect,
      'search-box': SearchBox,
      'pager': Pager
    },

    data () {
      return {
        name: '',
        status: {
          label: '全部',
          value: 0
        },
        key: '',
        curProvince: {},
        curCity: {},
        curDistrict: {},
        workOrders: [],
        statusOptions: [{
          label: '全部',
          value: 0
        }, {
          label: '未到期',
          value: 1
        }, {
          label: '已到期',
          value: 2}],

        loadingData: false,
        currentPage: 1,
        pageCount: 10,
        total: 0
      }
    },

    route: {
      data () {
        this.getWarrantyList()
      }
    },

    computed: {
      queryCondition () {
        var condition = {
          filter: ['_id', 'name', 'product_name', 'product_type', 'extended_days', 'status'],
          limit: this.pageCount,
          offset: (this.currentPage - 1) * this.pageCount,
          order: {},
          query: {}
        }

        if (this.curProvince.hasOwnProperty('name')) {
          condition.query.province = this.curProvince.name
        }
        if (this.curCity.hasOwnProperty('name')) {
          condition.query.city = this.curCity.name
        }
        if (this.curDistrict.hasOwnProperty('name')) {
          condition.query.district = this.curDistrict.name
        }
        if (this.status.value !== 0) {
          if (this.status.value === 1) { // 未到期
            condition.query.status = 1
          } else if (this.status.value === 2) { // 已到期
            condition.query.status = 0
          }
        }
        if (this.key !== '') {
          condition.query._id = {'$like': {'@string': this.key}}
        }

        return condition
      }
    },

    methods: {
      getWarrantyList (querying) {
        if (typeof querying !== 'undefined') {
          this.currentPage = 1
        }
        this.loadingData = true
        api.warranty.getWarrantyList(this.queryCondition).then((res) => {
          this.total = res.data.count
          this.workOrders = res.data.list
          this.loadingData = false
        }).catch((res) => {
          this.handleError(res)
          this.loadingData = false
        })
      }
    }
  }
</script>

<style lang="stylus">
  @import '../../../../assets/stylus/common'
</style>
